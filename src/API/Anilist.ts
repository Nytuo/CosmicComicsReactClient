import { Toaster } from "@/components/Toaster.tsx";
import { PDP, currentProfile } from "@/utils/Common.ts";

class Anilist {

    async InsertBook(realname:string, path:string) {
        fetch(PDP + "/insert/anilist/book", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": currentProfile.getToken,
                "path": path,
                "realname": realname,
            })
        });
    }

    /**
     * Search on ANILIST API by the manga name
     * @param {string} name The name of the manga
     * @return {Promise<*>} The list of mangas
     */
    async GET_SEARCH(name: string) {
        return fetch(PDP + "/api/anilist/searchOnly/" + name).then(function (response) {
            return response.text();
        }).then(function (data) {
            data = JSON.parse(data);
            console.log(data);
            return data;
        }).catch(function (error) {
            console.log(error);
        });
    }

    /**
     * Add the manga and all related information to the database
     * @param {string} name The name of the manga
     * @param {string} path The path to the manga
     */
    POST_SEARCH(name: string, path: string) {
        fetch(PDP + "/api/anilist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "name": name,
                "token": currentProfile.getToken,
                "path": path
            }
        }).then(() => {
            Toaster("Manga added to the database", "success");
        });
    }
}

export { Anilist}