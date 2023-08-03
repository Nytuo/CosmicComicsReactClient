import { Toaster } from "@/components/Toaster.tsx";
import { PDP, currentProfile } from "@/utils/Common.ts";
import { DetectFolderInLibrary, getFromDB } from "@/utils/Fetchers.ts";

class API {
    /**
     * Trigger the metadata refresh for the selected library
     * @param elElement The library to refresh
     */
    refreshMetadata(elElement: any) {
        const path = elElement["PATH"];
        DetectFolderInLibrary(path).then(async (data) => {
            if (!data) return;
            const parsedData = JSON.parse(data);
            await getFromDB("Series", "ID_Series,PATH FROM Series").then(async (res) => {
                if (!res) return;
                const parsedRes = JSON.parse(res) as Array<any>;
                for (let index = 0; index < parsedRes.length; index++) {
                    const el = parsedRes[index]["PATH"];
                    for (let i = 0; i < parsedData.length; i++) {
                        if (el === parsedData[i]) {
                            await this.refreshMeta(parsedRes[index]["ID_Series"], elElement["API_ID"], "Series");
                            break;
                        }
                    }
                }
            });
        })
    }
    /**
     * Rematch the element of old_id by the new_id
     * @param {string} new_id New id
     * @param {int} provider The API provider
     * @param {string} type The type of the element
     * @param {string} old_id The old id
     * @param {boolean} isSeries Is the element a series
     */
    async rematch(new_id: string, provider:number, type:string, old_id:string, isSeries = false) {
        if (isSeries) {
            await fetch(PDP + "/DB/update", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({
                    "token": currentProfile.getToken,
                    "table": "Series",
                    "type": "noedit",
                    "column": "ID_Series",
                    "whereEl": old_id,
                    "value": `'${new_id}'`,
                    "where": "ID_Series"
                }, null, 2)
            })
        } else {
            await fetch(PDP + "/DB/update", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({
                    "token": currentProfile.getToken,
                    "table": "Books",
                    "type": "noedit",
                    "column": "API_ID",
                    "whereEl": old_id,
                    "value": `'${new_id}'`,
                    "where": "ID_book"
                }, null, 2)
            })
        }
        await this.refreshMeta(new_id, provider, type);
    }

    /**API_ID
     * Launch the metadata refresh
     * @param {*} id The ID in the DB of the element to refresh
     * @param {number} provider The provider of the element to refresh
     * @param {string} type The type of the element to refresh
     */
    async refreshMeta(id: string, provider:number, type: string) {
        console.log("Refreshing metadata for " + id + " from " + provider + " (" + type + ")");
        Toaster("Refreshing metadata for " + id + " from " + provider + " (" + type + ")", "info");
        fetch(PDP + "/refreshMeta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": id,
                "provider": provider,
                "type": type,
                "token": currentProfile.getToken
            })
        }).then(() => {
            Toaster("Metadata refreshed", "success");
        })
    }
}

export { API }