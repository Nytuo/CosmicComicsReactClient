import { ToasterHandler } from "@/components/common/ToasterHandler.tsx";
import logger from "@/logger.ts";
import { currentProfile, PDP } from "@/utils/Common.ts";
import { DetectFolderInLibrary, getFromDB } from "@/utils/Fetchers.ts";

/**
 * Represents an API class that provides methods for refreshing metadata and launching metadata refresh.
 */
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
                for (const element of parsedRes) {
                    const el = element["PATH"];
                    for (const item of parsedData) {
                        if (el === item) {
                            await this.refreshMeta(element["ID_Series"], elElement["API_ID"], "Series");
                            break;
                        }
                    }
                }
            });
        });
    }

    /**
     * Rematch the element of old_id by the new_id
     * @param {string} new_id New id
     * @param {int} provider The API provider
     * @param {string} type The type of the element
     * @param {string} old_id The old id
     * @param {boolean} isSeries Is the element a series
     */
    async rematch(new_id: string, provider: number, type: string, old_id: string, isSeries: boolean = false) {
        logger.info("Rematching " + old_id + " to " + new_id + " from " + provider + " (" + type + ")");
        await fetch(PDP + "/DB/update", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                "token": currentProfile.getToken,
                "table": isSeries ? "Series" : "Books",
                "type": "noedit",
                "column": isSeries ? "ID_Series" : "ID_book",
                "whereEl": old_id,
                "value": `${new_id}`,
                "where": isSeries ? "ID_Series" : "ID_book"
            }, null, 2)
        }).then(() => {
            logger.info("Element rematched");
        }).catch((error) => {
            logger.error(error);
        });
        await this.refreshMeta(new_id, provider, type);
    }

    /**API_ID
     * Launch the metadata refresh
     * @param {*} id The ID in the DB of the element to refresh
     * @param {number} provider The provider of the element to refresh
     * @param {string} type The type of the element to refresh
     */
    async refreshMeta(id: string, provider: number, type: string) {
        ToasterHandler("Refreshing metadata for " + id + " from " + provider + " (" + type + ")", "info");
        fetch(PDP + "/refreshMeta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "id": id,
                "provider": Number(provider),
                "type": type,
                "token": currentProfile.getToken
            })
        }).then(() => {
            ToasterHandler("Metadata refreshed", "success");
        }).catch((error) => {
            ToasterHandler("Error while refreshing metadata", "error");
            logger.error(error);
        });
    }
}

export { API };
