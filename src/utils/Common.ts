import Profile from "./Profile";
import {_01toBool, SearchInJSON} from "./utils";

const domain = "localhost";
const port = 4696;
const isHttps = false;
const protocol = isHttps ? "https://" : "http://";

/**
 * The protocol, domain and port using in the app
 * @type {string} The protocol, domain and port using in the app
 */
const PDP: string = protocol + domain + (port ? ":" + port : "");
/**
 * The current profile in use by the user
 */
const currentProfile = new Profile(getCookie("selectedProfile", document));

/**
 * Get the browser cookies
 * @param {string} cName The name of the cookie
 * @param document The document to use
 */
function getCookie(cName: string, document: any) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res: string = "";
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
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
function setCookie(cName: string, cValue: string, expHours: number, document: any) {
    const date = new Date();
    date.setTime(date.getTime() + (expHours * 60 * 60 * 1000));
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
        fetch(PDP + "/profile/logcheck/" + currentProfile.getToken).then(function (response) {
            return response.text();
        }).catch(function (error) {
            console.log(error);
            window.location.href = "/login";
        }).then(async function (data) {
            if (data === "false" || data === "null" || data === "undefined" || data === "" || data === null || data === undefined) {
                window.location.href = "/login";
            } else {
                currentProfile.setName = data;
                fetch(PDP + "/config/getConfig/" + currentProfile.getToken).then(function (response) {
                    return response.text();
                }).then(function (data) {
                    const d = SearchInJSON("display_style", JSON.parse(data));
                    cardMode = _01toBool(d);
                }).catch(function (error) {
                    console.log(error);
                });
                fetch(PDP + "/config/getConfig/" + currentProfile.getToken).then(function (response) {
                    return response.text();
                }).then(function (data) {
                    const currenttheme = SearchInJSON("theme", JSON.parse(data));
                    setTheme(currenttheme);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }).catch(function (error) {
            console.log(error);
            window.location.href = "/login";
        });
    }
}

export {PDP, currentProfile, getCookie, setCookie, checkLogin, cardMode as cardModeEX, setTheme};