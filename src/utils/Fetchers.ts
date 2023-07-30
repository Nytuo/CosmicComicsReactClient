import { PDP, currentProfile } from "@/utils/Common.ts";

/**
 * Make a request to the DB and get the data
 * @param dbname The name of the DB to get the data
 * @param request The SQL(ite) request
 * @returns {Promise<string>} The data returned by the DB
 */
async function getFromDB(dbname: string, request: string) {
    const option = {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            "request": request
        }, null, 2)
    };
    console.log(PDP + '/DB/get/' + currentProfile.getToken + "/" + dbname);
    return fetch(PDP + '/DB/get/' + currentProfile.getToken + "/" + dbname, option).then(function (response) {
        return response.text();
    }).then(function (data) {
        return data;
    }).catch(function (error) {
        console.log(error);
    });
}
/**
 * Insert values in a specific table of the DB
 * @param {string} dbname The name of the DB
 * @param {string} dbinfo The attributes of the table
 * @param {string} values The values to insert
 */
async function InsertIntoDB(dbname: string, dbinfo: string, values: string) {
    const option = {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            "into": dbinfo, "val": values
        }, null, 2)
    };
    return fetch(PDP + '/DB/insert/' + currentProfile.getToken + "/" + dbname, option);
}
/**
 * Scan for folders in the library
 * @param {string} result The path to the library
 * @returns {Promise<string[]>} The list of folders
 */
async function DetectFolderInLibrary(result: string) {
    result = result.replaceAll("\\", "/");
    result = result.replaceAll("//", "/");
    result = result.replaceAll("/", "ù");
    return fetch(PDP + "/getListOfFolder/" + result).then(function (response) {
        return response.text();
    }).then(function (data) {
        return data;
    }).catch(function (error) {
        console.log(error);
    });
}
/**
 * Add a new library
 * @param {{form: HTMLElement[]}} forma The form to get the data (The HTML element)
 */
async function addLibrary(forma: HTMLFormElement) {
    await InsertIntoDB("Libraries", "(NAME,PATH,API_ID)", `('${forma.form[0].value}','${forma.form[1].value}','${forma.form[2].value}')`).then(() => {
        window.location.href = window.location.href.split("?")[0];
    });
}

/**
 * Update the library
 * @param {{form: HTMLElement}} forma The form to get the data (The HTML element)
 * @param {string} id The id of the library
 */
async function updateLibrary(forma: HTMLFormElement, id: string) {
    const option = {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            "name": forma.form[0].value, "path": forma.form[1].value, "api_id": forma.form[2].value
        }, null, 2)
    };
    await fetch(PDP + '/DB/lib/update/' + currentProfile.getToken + "/" + id, option).then(() => {
        window.location.href = window.location.href.split("?")[0];
    });
}
function OneForAll(W1: string, W2: string, A: string, title: string) {
    fetch(PDP + "/DB/update/OneForAll", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "W1": W1,
            "W2": W2,
            "A": A,
            "title": title,
            "token": currentProfile.getToken,
        })
    });
}

/**
 *
 * @param W1
 * @param W2
 * @param A
 * @param ID
 * @constructor
 */
function AllForOne(W1: string, W2: string, A: string, ID: string) {
    const asso: { [key: string]: any; } = {};
    asso[A] = true;
    asso[W1] = false;
    asso[W2] = false;
    const columns = [];
    const values = [];
    for (const key in asso) {
        columns.push(key);
        values.push(asso[key]);
    }
    const options = {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            "token": currentProfile.getToken,
            "table": "Books",
            "type": "edit",
            "column": columns,
            "whereEl": ID,
            "value": values,
            "where": "ID_book"
        }, null, 2)
    };
    fetch(PDP + "/DB/update", options);
}

async function TrueDeleteFromDB(dbName: string, id: string) {
    return fetch(PDP + '/DB/truedelete/' + currentProfile.getToken + "/" + dbName + "/" + id);
}

/**
 * Download a book from the server
 * @param path the path of the book
 * @return {Promise<void>} the promise
 */
async function downloadBook(path: string) {
    const option = {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
            path: path
        }, null, 2)
    };
    console.log(option);
    await fetch(PDP + '/DL', option).then(() => {
        window.open(PDP + "/getDLBook", "_blank");
    });
}

/**
 * Logout the user
 * @return {Promise<void>}
 */
async function logout() {
    const option = {
        method: 'POST', headers: { 'Content-Type': 'application/json' }
    };
    await fetch(PDP + '/profile/logout/' + currentProfile.getToken, option).then(() => {
        window.location.href = 'login';
    });
}

/**
 * Change the element rating
 * @param table the table to update
 * @param where the where clause
 * @param value the new value
 */
function changeRating(table: string, where: string, value: string) {
    if (table === "Books") {
        console.log(table, value + " from Book");
        const options = {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                "token": currentProfile.getToken,
                "table": table,
                "column": "note",
                "whereEl": where,
                "value": value,
                "where": "ID_book"
            }, null, 2)
        };
        fetch(PDP + "/DB/update", options);
    } else if (table === "Series") {
        console.log(table, value);
        const options = {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                "token": currentProfile.getToken,
                "table": table,
                "column": "note",
                "where": "ID_Series",
                "whereEl": where,
                "value": value
            }, null, 2)
        };
        fetch(PDP + "/DB/update", options);
    }
}
export { getFromDB, InsertIntoDB, DetectFolderInLibrary, addLibrary, updateLibrary, OneForAll, AllForOne, TrueDeleteFromDB, downloadBook, logout, changeRating };