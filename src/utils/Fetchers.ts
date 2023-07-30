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

export { getFromDB };