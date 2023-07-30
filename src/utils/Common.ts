import Profile from "./Profile";

const domain = "localhost";
const port = 4696;
const isHttps = false;
const protocol = isHttps ? "https://" : "http://";

/**
 * The protocol, domain and port using in the app
 * @type {string} The protocol, domain and port using in the app
 */
const PDP = protocol + domain + (port ? ":" + port : "");
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

function setCookie(cName: string, cValue: string, expHours: number, document: any) {
	const date = new Date();
	date.setTime(date.getTime() + (expHours * 60 * 60 * 1000));
	const expires = "expires=" + date.toUTCString();
	document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

export { PDP, currentProfile, getCookie, setCookie };