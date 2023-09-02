/**
 * Convert a date to a string
 * @param {number|string|Date} inputFormat
 * @return {string} date in string format (dd/mm/yyyy)
 */
function convertDate(inputFormat: number | string | Date) {
    function pad(s: number) {
        return (s < 10) ? '0' + s : s;
    }

    const d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}

/**
 * Resolve the title of a book
 * @param {string} title - The title of the book
 * @returns {string} - The resolved title
 */
function resolveTitle(title: string) {
    try {
        if (JSON.parse(title).english !== undefined) {
            return JSON.parse(title).english;
        } else if (JSON.parse(title).romaji !== undefined) {
            return JSON.parse(title).romaji;
        } else if (JSON.parse(title).native !== undefined) {
            return JSON.parse(title).native;
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
        return (parsedTitle.english + " / " + parsedTitle.romaji + " / " + parsedTitle.native);
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
const ValidatedExtension = ["cbr", "cbz", "pdf", "zip", "7z", "cb7", "tar", "cbt", "rar", 'epub'];
const coolanimations = ["zoomInDown", "rollIn", "zoomIn", "jackInTheBox", "fadeInUp", "fadeInDown", "fadeIn", "bounceInUp", "bounceInDown", "backInDown"];
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

/**
 * Generation of the Book Object for not yet DB inserted items
 * @param NOM The name of the item
 * @param ID The ID of the item
 * @param COVER The cover of the item
 * @param DESCRIPTION The description of the item
 * @param STAFF The staff of the item
 * @param CHARACTERS The characters of the item
 * @param SITEURL The site URL of the item
 * @param NOTE The note of the item
 * @param READ The read status of the item
 * @param READING The reading status of the item
 * @param UNREAD  The unread status of the item
 * @param FAVORITE The favorite status of the item
 * @param LAST_PAGE The last page of the item
 * @param FOLDER The folder of the item
 * @param PATH The path of the item
 * @param ISSUENUMBER The issue number of the item
 * @param FORMAT The format of the item
 * @param PAGECOUNT The page count of the item
 * @param SERIES The series of the item
 * @param PRICES The prices of the item
 * @param DATES The dates of the item
 * @param COLLECTEDISSUES The collected issues of the item
 * @param COLLECTIONS The collections of the item
 * @param VARIANTS The variants of the item
 * @param LOCK The lock status of the item
 * @return {{PATH: null, note: null, unread: null, creators: null, issueNumber: null, description: null, variants: null, characters: null, collections: null, lock: null, id: null, prices: null, collectedIssues: null, pageCount: null, read: null, URLs: null, last_page: null, format: null, reading: null, dates: null, NOM: null, folder: null, series: null, favorite: null, URLCover: null}} The Book Object
 */
function generateBookTemplate(API_ID = "null", ID_book = "null", NOM = null, ID = null, NOTE = null, READ = null, READING = null,
    UNREAD = null, FAVORITE = null, LAST_PAGE = null, FOLDER = null,
    PATH = null, COVER = null, ISSUENUMBER = null, DESCRIPTION = null,
    FORMAT = null, PAGECOUNT = null, SITEURL = null, SERIES = null,
    STAFF = null, CHARACTERS = null, PRICES = null, DATES = null,
    COLLECTEDISSUES = null, COLLECTIONS = null, VARIANTS = null, LOCK = null) {
    return {
        "API_ID": API_ID,
        "ID_book": ID_book,
        "NOM": NOM,
        "id": ID,
        "note": NOTE,
        "read": READ,
        "reading": READING,
        "unread": UNREAD,
        "favorite": FAVORITE,
        "last_page": LAST_PAGE,
        "folder": FOLDER,
        "PATH": PATH,
        "URLCover": COVER,
        "issueNumber": ISSUENUMBER,
        "description": DESCRIPTION,
        "format": FORMAT,
        "pageCount": PAGECOUNT,
        "URLs": SITEURL,
        "series": SERIES,
        "creators": STAFF,
        "characters": CHARACTERS,
        "prices": PRICES,
        "dates": DATES,
        "collectedIssues": COLLECTEDISSUES,
        "collections": COLLECTIONS,
        "variants": VARIANTS,
        "lock": LOCK
    };
}
//Open a book in the bookmarks
function openBOOKM(path: string, page: string) {
    window.location.href = "viewer.html?" + encodeURIComponent(path.replaceAll("/", "%C3%B9")) + "&page=" + page;
}


export { convertDate, providerEnum, resolveTitle, _01toBool, ValidatedExtension, coolanimations, generateBookTemplate, openBOOKM, tryToParse, buildTitleFromProvider, SearchInJSON };