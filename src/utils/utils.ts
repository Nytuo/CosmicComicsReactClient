/**
 * Resolve the title of a book
 * @param {string} title - The title of the book
 * @returns {string} - The resolved title
 */
function resolveTitle(title: string): string {
    try {
        if (JSON.parse(title)["english"] !== undefined) {
            return JSON.parse(title)["english"];
        } else if (JSON.parse(title)["romaji"] !== undefined) {
            return JSON.parse(title)["romaji"];
        } else if (JSON.parse(title)["native"] !== undefined) {
            return JSON.parse(title)["native"];
        } else if (typeof JSON.parse(title) !== 'object') {
            return JSON.parse(title);
        } else {
            return title;
        }
    } catch (e) {
        return title;
    }
}

/**
 * Attempts to parse a JSON string and returns the parsed object. If the string cannot be parsed, the original string is returned.
 * @param str - The string to parse.
 * @returns The parsed object or the original string.
 */
const tryToParse = (str: string) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
};

/**
 * Builds a title string based on the given provider and title.
 * @param title - The title string to parse.
 * @param provider - The provider enum value to determine how to format the title.
 * @returns The formatted title string.
 */
const buildTitleFromProvider = (title: string, provider: number) => {
    const parsedTitle = tryToParse(title);
    if (provider === providerEnum.Marvel) {
        return parsedTitle;
    } else if (provider === providerEnum.Anilist) {
        return (`${parsedTitle["english"]} / ${parsedTitle["romaji"]} / ${parsedTitle["native"]}`);
    } else if (provider === providerEnum.MANUAL) {
        return parsedTitle;
    } else if (provider === providerEnum.GBooks) {
        return parsedTitle;
    } else if (provider === providerEnum.OL) {
        return parsedTitle;
    } else {
        return parsedTitle;
    }
};

/**
 * Converts a number to a boolean value.
 * @param number The number to convert.
 * @returns `true` if the number is not zero, `false` otherwise.
 */
function _01toBool(number: number) {
    return number === 0;
}

const providerEnum = {
    "Marvel": 1,
    "Anilist": 2,
    "MANUAL": 0,
    "GBooks": 4,
    "OL": 3
};

//Search element on the JSON
function SearchInJSON(search: string, info: any) {
    for (const i in info) {
        if (i === search) {
            return info[i];
        }
    }
    return null;
}
//Open a book in the bookmarks
function openBOOKM(path: string, page: string) {
    localStorage.setItem("currentBook", path);
    localStorage.setItem("currentPage", page);
    window.location.href = "/viewer";

}

function hasNumbers(t: string) {
    const regex = /\d/g;
    return regex.test(t);
}

function GetTheName(CommonName = "") {
    CommonName = decodeURIComponent(CommonName);
    CommonName = CommonName.replaceAll("-", " ");
    CommonName = CommonName.replaceAll(")", " ");
    CommonName = CommonName.replaceAll("(", " ");
    CommonName = CommonName.replaceAll("[", " ");
    CommonName = CommonName.replaceAll("]", " ");
    /* remove the extension using regex */
    CommonName = CommonName.replace(/\.[^/.]+$/, "");
    const s = CommonName.split(" ");
    let finalName = "";
    s.forEach((el) => {
        if (el !== "") {
            if (hasNumbers(el)) {
                finalName += el;
            } else if (isNaN(parseInt(el))) {
                finalName += el[0];
            } else {
                finalName += el;
            }
        }
    });
    return finalName;
}

//Detect if the image is Horizontal or Vertical
export {
    providerEnum,
    resolveTitle,
    _01toBool,
    openBOOKM,
    tryToParse,
    buildTitleFromProvider,
    SearchInJSON,
    GetTheName,
    hasNumbers
};