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
export { convertDate, providerEnum, resolveTitle, _01toBool, ValidatedExtension, coolanimations };