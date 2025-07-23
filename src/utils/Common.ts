// noinspection HttpUrlsUsage

import Profile from "./Profile";
import { _01toBool, providerEnum, SearchInJSON } from "./utils";
import { IBook } from "@/interfaces/IBook.ts";
import { Marvel } from "@/API/Marvel.ts";
import Book from "@/utils/Book.ts";
import { Anilist } from "@/API/Anilist.ts";
import { InsertIntoDB } from "@/utils/Fetchers.ts";
import { OpenLibrary } from "@/API/OpenLibrary.ts";
import { GoogleBooks } from "@/API/GoogleBooks.ts";

let domain = localStorage.getItem("hostname");
let port = localStorage.getItem("port");
let isHttps = localStorage.getItem("isHTTPS") === "true";
if (domain === null) domain = "localhost";
if (port === null) port = "4696";
if (isHttps === null) isHttps = false;
let protocol = isHttps ? "https://" : "http://";

function changeDomainAndAddr(
  newAddr: string,
  newPort: string,
  isHTTPS: boolean,
) {
  localStorage.setItem("hostname", newAddr);
  localStorage.setItem("port", String(newPort));
  localStorage.setItem("isHTTPS", String(isHTTPS));
  domain = newAddr;
  port = String(newPort);
  isHttps = isHTTPS;
  protocol = isHttps ? "https://" : "http://";
}

/**
 * The protocol, domain and port using in the app
 * @type {string} The protocol, domain and port using in the app
 */
const PDP: string = protocol + domain + (port ? ":" + port : "");
/**
 * The current profile in use by the user
 */
const currentProfile = new Profile(getCookie("selectedProfile", document), PDP);

/**
 * Get the browser cookies
 * @param {string} cName The name of the cookie
 * @param document The document to use
 */
function getCookie(cName: string, document: any) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split("; ");
  let res: string = "";
  cArr.forEach((val) => {
    if (val.startsWith(name)) res = val.substring(name.length);
  });
  return res;
}

/**
 * Sets a cookie with the given name, value, and expiration time.
 * @param cName - The name of the cookie.
 * @param cValue - The value of the cookie.
 * @param expHours - The number of hours until the cookie expires.
 * @param document - The document object to use for setting the cookie.
 */
function setCookie(
  cName: string,
  cValue: string,
  expHours: number,
  document: any,
) {
  const date = new Date();
  date.setTime(date.getTime() + expHours * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

/**
 * Set the theme on the page
 * @param {string} theme The selected theme
 */
function setTheme(theme: string) {
  document.head.getElementsByTagName("link")[5].href = PDP + "/themes/" + theme;
}

let cardMode = false;

/**
 * Checks if the user is logged in by verifying the token stored in the currentProfile object.
 * If the token is invalid or missing, the user is redirected to the login page.
 * If the token is valid, the user's name is retrieved and stored in the currentProfile object.
 * Additionally, the user's display style and theme preferences are retrieved and applied to the app.
 */
function checkLogin() {
  if (currentProfile.getToken === null) {
    window.location.href = "/login";
  } else {
    fetch(PDP + "/profile/logcheck/" + currentProfile.getToken)
      .then(function (response) {
        return response.text();
      })
      .catch(function (error) {
        console.log(error);
        window.location.href = "/login";
      })
      .then(async function (data) {
        if (
          data === "false" ||
          data === "null" ||
          data === "undefined" ||
          data === "" ||
          data === null ||
          data === undefined ||
          data === "Invalid token"
        ) {
          window.location.href = "/login";
        } else {
          currentProfile.setName = data.replaceAll('"', "");
          fetch(PDP + "/config/getConfig/" + currentProfile.getToken)
            .then(function (response) {
              return response.text();
            })
            .then(function (data) {
              const d = SearchInJSON("display_style", JSON.parse(data));
              cardMode = _01toBool(d);
            })
            .catch(function (error) {
              console.log(error);
            });
          fetch(PDP + "/config/getConfig/" + currentProfile.getToken)
            .then(function (response) {
              return response.text();
            })
            .then(function (data) {
              const currenttheme = SearchInJSON("theme", JSON.parse(data));
              setTheme(currenttheme);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
        window.location.href = "/login";
      });
  }
}

async function InsertIntoTarget(
  resa: string | void,
  realname: string,
  date: any,
  path: string,
  OSBook: IBook[],
  provider: number,
): Promise<IBook[]> {
  if (!resa) return OSBook;
  const bookList = JSON.parse(resa);
  let TheBook;
  if (bookList.length === 0) {
    if (provider == providerEnum.Marvel) {
      await new Marvel()
        .InsertBook(realname, date, path)
        .then(async (cdata: any) => {
          if (cdata === undefined) {
            throw new Error("no data");
          }
          if (cdata["data"]["total"] > 0) {
            cdata = cdata["data"]["results"][0];
            TheBook = new Book(
              cdata["id"],
              realname,
              cdata["thumbnail"].path +
                "/detail." +
                cdata["thumbnail"]["extension"],
              cdata["description"],
              cdata["creators"],
              cdata["characters"],
              cdata["urls"],
              null,
              0,
              0,
              1,
              0,
              0,
              0,
              path,
              cdata["issueNumber"],
              cdata["format"],
              cdata["pageCount"],
              cdata["series"],
              cdata["prices"],
              cdata["dates"],
              cdata["collectedIssues"],
              cdata["collections"],
              cdata["variants"],
              0,
              provider.toString(),
            );
          } else {
            TheBook = new Book(
              "null",
              realname,
              null,
              "null",
              null,
              null,
              null,
              null,
              0,
              0,
              1,
              0,
              0,
              0,
              path,
              "null",
              null,
              0,
              null,
              null,
              null,
              null,
              null,
              null,
              0,
              provider.toString(),
            );
          }
        });
    } else if (provider == providerEnum.Anilist) {
      await new Anilist().InsertBook(realname, path);
      TheBook = new Book(
        "null",
        realname,
        null,
        "null",
        null,
        null,
        null,
        null,
        0,
        0,
        1,
        0,
        0,
        0,
        path,
        "null",
        null,
        0,
        null,
        null,
        null,
        null,
        null,
        null,
        0,
        provider.toString(),
      );
    } else if (provider == providerEnum.MANUAL) {
      console.log("manual");
      // noinspection ES6MissingAwait
      InsertIntoDB(
        "Books",
        "",
        `(${Math.floor(Math.random() * 100000)},'${null}','${realname}',null,${0},${0},${1},${0},${0},${0},'${path}','${null}','${null}','${null}','${null}',${null},'${null}','${null}','${null}','${null}','${null}','${null}','${null}','${null}','${null}',false)`,
      );
      TheBook = new Book(
        "null",
        realname,
        null,
        "null",
        null,
        null,
        null,
        null,
        0,
        0,
        1,
        0,
        0,
        0,
        path,
        "null",
        null,
        0,
        null,
        null,
        null,
        null,
        null,
        null,
        0,
        provider.toString(),
      );
    } else if (provider == providerEnum.OL) {
      await new OpenLibrary()
        .InsertBook(realname, path)
        .then(async (cdata: any) => {
          console.log(cdata);
          if (cdata === undefined) {
            throw new Error("no data");
          }
          if (Object.prototype.hasOwnProperty.call(cdata, "num_found")) {
            TheBook = new Book(
              "null",
              realname,
              null,
              "null",
              null,
              null,
              null,
              null,
              0,
              0,
              1,
              0,
              0,
              0,
              path,
              "null",
              null,
              0,
              null,
              null,
              null,
              null,
              null,
              null,
              0,
              provider.toString(),
            );
          } else {
            const cdataD = cdata["details"];
            TheBook = new Book(
              cdata["bib_key"],
              realname,
              cdata["thumbnail_url"],
              cdataD["description"],
              cdataD["authors"],
              null,
              cdataD["info_url"],
              null,
              0,
              0,
              1,
              0,
              0,
              0,
              path,
              "null",
              cdataD["physical_format"],
              cdataD["number_of_pages"],
              null,
              null,
              cdata["publish_date"],
              null,
              null,
              null,
              0,
              provider.toString(),
            );
          }
        });
    } else if (provider == providerEnum.GBooks) {
      await new GoogleBooks()
        .InsertBook(realname, path)
        .then(async (cdata: any) => {
          console.log(cdata);
          if (cdata === undefined) {
            throw new Error("no data");
          }
          if (cdata["totalItems"] > 0) {
            cdata = cdata["items"][0];
            let cover;
            if (cdata["volumeInfo"]["imageLinks"] !== undefined) {
              cover = cdata["volumeInfo"]["imageLinks"];
              if (cover["large"] !== undefined) {
                cover = cover["large"];
              } else if (cover["thumbnail"] !== undefined) {
                cover = cover["thumbnail"];
              } else {
                cover = null;
              }
            } else {
              cover = null;
            }
            let price;
            if (cdata["saleInfo"]["retailPrice"] !== undefined) {
              price = cdata["saleInfo"]["retailPrice"]["amount"];
            } else {
              price = null;
            }
            TheBook = new Book(
              cdata["id"],
              realname,
              cover,
              cdata["volumeInfo"]["description"],
              cdata["volumeInfo"]["authors"],
              null,
              cdata["volumeInfo"]["infoLink"],
              null,
              0,
              0,
              1,
              0,
              0,
              0,
              path,
              "null",
              cdata["volumeInfo"]["printType"],
              cdata["volumeInfo"]["pageCount"],
              null,
              price,
              cdata["volumeInfo"]["publishedDate"],
              null,
              null,
              null,
              0,
              provider.toString(),
            );
          } else {
            TheBook = new Book(
              "null",
              realname,
              null,
              "null",
              null,
              null,
              null,
              null,
              0,
              0,
              1,
              0,
              0,
              0,
              path,
              "null",
              null,
              0,
              null,
              null,
              null,
              null,
              null,
              null,
              0,
              provider.toString(),
            );
          }
        });
    }
  } else {
    const bookFromDB = bookList[0];
    TheBook = new Book(
      bookFromDB["ID_book"],
      bookFromDB["NOM"],
      bookFromDB["URLCover"],
      bookFromDB["description"],
      bookFromDB["creators"],
      bookFromDB["characters"],
      bookFromDB["URLs"],
      bookFromDB["note"],
      bookFromDB["read"],
      bookFromDB["reading"],
      bookFromDB["unread"],
      bookFromDB["favorite"],
      bookFromDB["last_page"],
      bookFromDB["folder"],
      bookFromDB["PATH"],
      bookFromDB["issueNumber"],
      bookFromDB["format"],
      bookFromDB["pageCount"],
      bookFromDB["series"],
      bookFromDB["prices"],
      bookFromDB["dates"],
      bookFromDB["collectedIssues"],
      bookFromDB["collections"],
      bookFromDB["variants"],
      bookFromDB["lock"],
      provider.toString(),
    );
  }
  if (TheBook !== undefined) {
    OSBook.push(TheBook);
  }
  return OSBook;
}

export {
  PDP,
  currentProfile,
  getCookie,
  setCookie,
  checkLogin,
  cardMode as cardModeEX,
  setTheme,
  changeDomainAndAddr,
  InsertIntoTarget,
};
