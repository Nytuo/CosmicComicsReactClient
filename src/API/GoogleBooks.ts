import logger from "@/logger.ts";
import {currentProfile, PDP} from "@/utils/Common.ts";

/**
 * A class for interacting with the Google Books API.
 */
class GoogleBooks {
    /**
     * Inserts a book into the Google Books API.
     * @param {string} name The name of the book.
     * @param {string} path The path of the book.
     * @returns A Promise that resolves to the book data.
     */
    async InsertBook(name: string, path: string) {
        return fetch(PDP + "/insert/googlebooks/book/", {
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
            logger.info("Book added to Google Books");
            data = JSON.parse(data);
            return data;
        }).catch(function (error) {
            logger.error(error);
        });
    }

    /**
     * Fetches comics from the Google Books API based on the provided name.
     * @param name The name of the comic to search for.
     * @returns A Promise that resolves to the fetched data.
     */
    async GetComics(name = "") {
        name = encodeURIComponent(name);
        return fetch(PDP + "/api/googlebooks/getComics/" + name).then(function (response) {
            return response.text();
        }).then(function (data) {
            data = JSON.parse(data);
            logger.debug("Google Books search result: " + data);
            return data;
        }).catch(function (error) {
            logger.error(error);
        });
    }
}

export {GoogleBooks};