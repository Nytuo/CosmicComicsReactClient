import {ToasterHandler} from "@/components/common/ToasterHandler.tsx";
import logger from "@/logger.ts";
import {currentProfile, PDP} from "@/utils/Common.ts";

/**
 * Represents a class that interacts with the Anilist API to search and add manga to the database.
 */
class Anilist {

    /**
     * Inserts a book into Anilist.
     * @param bookName - The real name of the book.
     * @param path - The path of the book.
     */
    async InsertBook(bookName: string, path: string) {
        fetch(PDP + "/insert/anilist/book", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": currentProfile.getToken,
                "path": path,
                "realname": bookName,
            })
        }).then(() => {
            logger.info("Book added to Anilist");
        }).catch((error) => {
            logger.error(error);
        });
    }

    /**
     * Search on ANILIST API by the manga name
     * @param {string} name The name of the manga
     * @return {Promise<*>} The list of mangas
     */
    async GET_SEARCH(name: string): Promise<any> {
        return fetch(PDP + "/api/anilist/searchOnly/" + name).then(function (response) {
            return response.text();
        }).then(function (data) {
            data = JSON.parse(data);
            logger.info("Anilist search result: " + data);
            return data;
        }).catch(function (error) {
            ToasterHandler("Error while searching for manga", "error");
            logger.error(error);
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
            ToasterHandler("Manga added to the database", "success");
        }).catch(() => {
            ToasterHandler("Manga not added to the database", "error");
        });
    }
}

export {Anilist};