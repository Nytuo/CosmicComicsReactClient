import logger from "@/logger.ts";
import { PDP, currentProfile } from "@/utils/Common.ts";

/**
 * A class representing the OpenLibrary API.
 */
class OpenLibrary {
    /**
     * Inserts a book into the Open Library API.
     * @param name The name of the book.
     * @param path The path of the book.
     * @returns A Promise that resolves to the response data from the API.
     */
    async InsertBook(name = "", path: string) {
        return fetch(PDP + "/insert/ol/book/", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "name": name,
                "path": path,
                "token": currentProfile.getToken
            }
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            data = JSON.parse(data);
            logger.info("Book added to Open Library");
            return data;
        }).catch(function (error) {
            logger.error(error);
        });
    }

    async GetComics(name = "") {
        name = encodeURIComponent(name);
        return fetch(PDP + "/api/ol/getComics/" + name).then(function (response) {
            return response.text();
        }).then(function (data) {
            data = JSON.parse(data);
            logger.info("Open Library search result: " + data);
            return data;
        }).catch(function (error) {
            logger.error(error);
        });
    }
}

export { OpenLibrary };