import {ToasterHandler} from "@/components/common/ToasterHandler.tsx";
import logger from "@/logger.ts";
import {currentProfile, PDP} from "@/utils/Common.ts";

/**
 * Marvel class for interacting with the Marvel API.
 */
class Marvel {
    constructor() {

    }

    /**
     * Search for comics by name and date.
     * @param name - The name of the comic to search for.
     * @param date - The date of the comic to search for.
     * @returns A Promise that resolves to the search results.
     */
    async SearchComic(name = "", date = "") {
        return fetch(PDP + "/api/marvel/searchonly/" + name + "/" + date).then(function (response) {
            return response.text();
        }).then(function (data) {
            data = JSON.parse(data);
            logger.debug("Marvel search result: " + data);
            return data;
        }).catch(function (error) {
            logger.error(error);
        });
    }

    /**
     * Get comics by name and date.
     * @param name - The name of the comic to get.
     * @param date - The date of the comic to get.
     * @returns A Promise that resolves to the comic data.
     */
    async GetComics(name = "", date = "") {
        name = encodeURIComponent(name);
        date = encodeURIComponent(date);
        return fetch(PDP + "/api/marvel/getComics/" + name + "/" + date).then(function (response) {
            return response.text();
        }).then(function (data) {
            data = JSON.parse(data);
            logger.debug("Marvel search result: " + data);
            return data;
        }).catch(function (error) {
            logger.error(error);
        });
    }

    /**
     * Insert a book into the Marvel API.
     * @param name - The name of the book to insert.
     * @param date - The date of the book to insert.
     * @param path - The path of the book to insert.
     * @returns A Promise that resolves to the insert result.
     */
    async InsertBook(name = "", date = "", path: string) {
        return fetch(PDP + "/insert/marvel/book/", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "name": name,
                "datea": date,
                "path": path,
                "token": currentProfile.getToken
            }
        }).then(function (response) {
            return response.text();
        }).then(function (data) {
            data = JSON.parse(data);
            logger.info("Book added to Marvel");
            return data;
        }).catch(function (error) {
            logger.error(error);
        });
    }

    /**
     * Insert a series into the Marvel API.
     * @param name - The name of the series to insert.
     * @param path - The path of the series to insert.
     */
    InsertSeries(name = "", path: string) {
        fetch(PDP + '/api/marvel/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": currentProfile.getToken,
                "name": name,
                "path": path,
            })
        }).then(function (response) {
            ToasterHandler("Marvel API : " + response.status, "success");
        }).catch(function (error) {
            ToasterHandler("Marvel API : An error occured", "error");
            logger.error(error);
        });
    }
}

export {Marvel};