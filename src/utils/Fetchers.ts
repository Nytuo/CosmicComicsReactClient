import { translateString } from "@/i18n.ts";
import Logger from "@/logger.ts";
import { currentProfile, PDP } from "@/utils/Common.ts";
import { ToasterHandler } from "@/components/common/ToasterHandler.tsx";
import { t } from "i18next";
import { IBook } from "@/interfaces/IBook.ts";

/**
 * Make a request to the DB and get the data
 * @param dbname The name of the DB to get the data
 * @param request The SQL(ite) request
 * @returns {Promise<string>} The data returned by the DB
 */
async function getFromDB(
  dbname: string,
  request: string,
): Promise<string | void> {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      {
        request: request,
      },
      null,
      2,
    ),
  };
  Logger.debug(
    "Fetching data from DB: " + dbname + " with request: " + request,
  );
  return fetch(
    PDP + "/DB/get/" + currentProfile.getToken + "/" + dbname,
    option,
  )
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      Logger.debug(
        "Data fetched from DB: " + dbname + " with request: " + request,
      );
      return data;
    })
    .catch(function (error) {
      Logger.error(error);
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
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      {
        into: dbinfo,
        val: values,
      },
      null,
      2,
    ),
  };
  return fetch(
    PDP + "/DB/insert/" + currentProfile.getToken + "/" + dbname,
    option,
  );
}

/**
 * Scan for folders in the library
 * @param {string} result The path to the library
 * @returns {Promise<string[]>} The list of folders
 */
async function DetectFolderInLibrary(result: string): Promise<string | void> {
  result = result.replaceAll("\\", "/");
  result = result.replaceAll("//", "/");
  result = result.replaceAll("/", "ù");
  return fetch(PDP + "/getListOfFolder/" + result)
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      return data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

/**
 * Add a new library
 * @param {{form: HTMLElement[]}} forma The form to get the data (The HTML element)
 */
async function addLibrary(forma: any) {
  Logger.debug(forma);
  await InsertIntoDB(
    "Libraries",
    "(NAME,PATH,API_ID)",
    `('${forma.form[0]}','${forma.form[1]}','${forma.form[2]}')`,
  ).then(() => {
    window.location.href = window.location.href.split("?")[0];
  });
}

/**
 * Update the library
 * @param {{form: HTMLElement}} forma The form to get the data (The HTML element)
 * @param {string} id The id of the library
 */
async function updateLibrary(forma: { form: any[] }, id: string) {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      {
        name: forma.form[0],
        path: forma.form[1],
        api_id: forma.form[2],
      },
      null,
      2,
    ),
  };
  await fetch(
    PDP + "/DB/lib/update/" + currentProfile.getToken + "/" + id,
    option,
  ).then(() => {
    window.location.href = window.location.href.split("?")[0];
  });
}

/**
 * Updates the status of all the books for the values (unread, read, reading) in the database.
 * @param setTo - The new status to set the book to (unread, read, or reading).
 * @param title - The title of the book to update.
 */
function updateBookStatusForAll(
  setTo: "unread" | "read" | "reading",
  title: string,
) {
  let W1;
  let W2;
  switch (setTo) {
    case "unread":
      W1 = "read";
      W2 = "reading";
      break;
    case "read":
      W1 = "unread";
      W2 = "reading";
      break;
    case "reading":
      W1 = "unread";
      W2 = "read";
      break;
  }
  // noinspection JSIgnoredPromiseFromCall
  fetch(PDP + "/DB/update/OneForAll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      W1: W1,
      W2: W2,
      A: setTo,
      title: title,
      token: currentProfile.getToken,
    }),
  });
}

/**
 * Updates the status of a book in the database.
 * @param setTo - The new status of the book. Must be one of "unread", "read", or "reading".
 * @param ID - The ID of the book to update.
 */
function updateBookStatusForOne(
  setTo: "unread" | "read" | "reading",
  ID: string,
) {
  const asso: { [key: string]: any } = {};
  const allPosibleValues = ["unread", "reading", "read"];
  for (const element of allPosibleValues) {
    asso[element] = false;
  }
  asso[setTo] = true;
  const columns = [];
  const values = [];
  for (const key in asso) {
    columns.push(key);
    values.push(asso[key]);
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        token: currentProfile.getToken,
        table: "Books",
        type: "edit",
        column: columns,
        whereEl: ID,
        value: values,
        where: "ID_book",
      },
      null,
      2,
    ),
  };
  // noinspection JSIgnoredPromiseFromCall
  fetch(PDP + "/DB/update", options);
}

/**
 * Deletes a record from the specified database using a true delete operation.
 * @param dbName The name of the database to delete the record from.
 * @param id The ID of the record to delete.
 * @returns A Promise that resolves with the result of the fetch operation.
 */
async function TrueDeleteFromDB(dbName: string, id: string) {
  return fetch(
    PDP + "/DB/truedelete/" + currentProfile.getToken + "/" + dbName + "/" + id,
  );
}

async function ModifyDB(
  dbName: string,
  ColName: string,
  value: string,
  id: string,
) {
  const connected = currentProfile.getToken;
  return fetch(
    PDP +
      "/DB/update/" +
      connected +
      "/" +
      dbName +
      "/" +
      ColName +
      "/" +
      value +
      "/" +
      id,
  );
}

async function DeleteFromDB(dbName: string, id: string, option: string) {
  const connected = currentProfile.getToken;
  return fetch(
    PDP + "/DB/delete/" + connected + "/" + dbName + "/" + id + "/" + option,
  );
}

/**
 * Download a book from the server
 * @param path the path of the book
 * @return {Promise<void>} the promise
 */
async function downloadBook(path: string): Promise<void> {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      {
        path: path,
      },
      null,
      2,
    ),
  };
  await fetch(PDP + "/DL", option).then(() => {
    window.open(PDP + "/getDLBook", "_blank");
  });
}

/**
 * Logout the user
 * @return {Promise<void>}
 */
async function logout(): Promise<void> {
  const option = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  await fetch(PDP + "/profile/logout/" + currentProfile.getToken, option).then(
    () => {
      window.location.href = "login";
    },
  );
}

/**
 * Change the element rating
 * @param table the table to update
 * @param where the where clause
 * @param value the new value
 */
function changeRating(table: string, where: string, value: number) {
  if (table === "Books") {
    Logger.debug(table + " " + value + " from Books");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          token: currentProfile.getToken,
          table: table,
          column: "note",
          whereEl: where,
          value: value.toString(),
          where: "ID_book",
        },
        null,
        2,
      ),
    };
    // noinspection JSIgnoredPromiseFromCall
    fetch(PDP + "/DB/update", options);
  } else if (table === "Series") {
    Logger.debug(table + " " + value + " from Series");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          token: currentProfile.getToken,
          table: table,
          column: "note",
          where: "ID_Series",
          whereEl: where,
          value: value.toString(),
        },
        null,
        2,
      ),
    };
    // noinspection JSIgnoredPromiseFromCall
    fetch(PDP + "/DB/update", options);
  }
}

/**
 * Modify user's profile configuration JSON file
 * @param {string|number} tomod The key to modify
 * @param {*} mod the new value
 */
function modifyConfigJson(tomod: string | number, mod: any) {
  //check si obj exist pour remplacer valeur
  fetch(PDP + "/config/getConfig/" + currentProfile.getToken)
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      const config = JSON.parse(data);
      const keys = Object.keys(config);
      for (const element of keys) {
        if (element === tomod) {
          config[tomod] = mod;
          break;
        }
      }
      const option = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config, null, 2),
      };
      // noinspection JSIgnoredPromiseFromCall
      fetch(PDP + "/config/writeConfig/" + currentProfile.getToken, option);
    })
    .catch(function (error) {
      Logger.error(error);
    });
}

/**
 * Delete the library
 * @param elElement The element to delete
 * @returns {Promise<void>} The response
 */
async function deleteLib(elElement: any): Promise<void> {
  const confirmDelete = confirm(
    translateString("deleteaccount") + elElement["NAME"] + " ?",
  );
  if (confirmDelete) {
    await fetch(
      PDP +
        "/DB/lib/delete/" +
        currentProfile.getToken +
        "/" +
        elElement["ID_LIBRARY"],
    ).then(() => {
      Logger.info("Library deleted");
      alert(translateString("libraryDeleted"));
      location.reload();
    });
  }
}

/**
 * Fetch all books from the DB
 * @param filters The optional filters
 * @return {Promise<null|any>} The books
 */
async function AllBooks(filters = ""): Promise<any> {
  Logger.info("fetching books from DB with filters: " + filters);
  let request;
  if (filters === "") {
    request = "* FROM Books";
  } else {
    request = "* FROM Books WHERE " + filters;
  }
  return await getFromDB("Books", request).then(async (res) => {
    if (res === "" || res === null || res === undefined) return null;
    return JSON.parse(res);
  });
}

async function makeFavorite(book: IBook) {
  if (book.favorite === 1) {
    book.favorite = 0;
    ToasterHandler(t("remove_fav"), "success");
    await getFromDB("Books", "* FROM Books WHERE favorite=1").then(
      async (resa) => {
        if (!resa) return;
        const bookList = JSON.parse(resa);
        for (const element of bookList) {
          if (element.ID_book === book.ID_book) {
            const options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(
                {
                  token: currentProfile.getToken,
                  table: "Books",
                  column: "favorite",
                  whereEl: element.ID_book,
                  value: false,
                  where: "ID_book",
                },
                null,
                2,
              ),
            };
            await fetch(PDP + "/DB/update", options);
          }
        }
      },
    );
  } else {
    book.favorite = 1;
    ToasterHandler(t("add_fav"), "success");
    await getFromDB("Books", "* FROM Books WHERE favorite=0").then(
      async (resa) => {
        if (!resa) return;
        const bookList = JSON.parse(resa);
        for (const element of bookList) {
          if (element.ID_book === book.ID_book) {
            const options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(
                {
                  token: currentProfile.getToken,
                  table: "Books",
                  column: "favorite",
                  whereEl: element.ID_book,
                  value: true,
                  where: "ID_book",
                },
                null,
                2,
              ),
            };
            await fetch(PDP + "/DB/update", options);
          }
        }
      },
    );
  }
}

export {
  getFromDB,
  InsertIntoDB,
  DetectFolderInLibrary,
  addLibrary,
  updateLibrary,
  updateBookStatusForAll,
  updateBookStatusForOne,
  TrueDeleteFromDB,
  downloadBook,
  logout,
  changeRating,
  modifyConfigJson,
  deleteLib,
  AllBooks,
  ModifyDB,
  DeleteFromDB,
  makeFavorite,
};
