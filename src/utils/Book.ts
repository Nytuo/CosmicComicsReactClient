import {PDP} from "../utils/Common.ts";
import {IBook} from "../interfaces/IBook.ts";

/**
 * Class representing a book
 */

class Book implements IBook {
    constructor(ID_book: string, NOM: string, URLCover: any, description: string, creators: any, characters: any, URLs: any, note: number | null, read: number, reading: number, unread: number, favorite: number, last_page: number, folder: any, PATH: string, issueNumber: string, format: any, pageCount: number, series: any, prices: any, dates: any, collectedIssues: any, collections: any, variants: any, lock: number, API_ID: string) {
        this._ID_book = ID_book;
        this._NOM = NOM;
        this._URLCover = URLCover;
        this._description = description;
        this._creators = creators;
        this._characters = characters;
        this._URLs = URLs;
        this._note = note;
        this._read = read;
        this._reading = reading;
        this._unread = unread;
        this._favorite = favorite;
        this._last_page = last_page;
        this._folder = folder;
        this._PATH = PATH;
        this._issueNumber = issueNumber;
        this._format = format;
        this._pageCount = pageCount;
        this._series = series;
        this._prices = prices;
        this._dates = dates;
        this._collectedIssues = collectedIssues;
        this._collections = collections;
        this._variants = variants;
        this._lock = lock;
        this._API_ID = API_ID;
    }

    private _ID_book: string;

    get ID_book() {
        return this._ID_book;
    }

    set ID_book(value) {
        this._ID_book = value;
    }

    private _NOM: string;

    get NOM() {
        return this._NOM;
    }

    set NOM(value) {
        this._NOM = value;
    }

    private _URLCover: any;

    get URLCover() {
        return this._URLCover;
    }

    set URLCover(value) {
        this._URLCover = value;
    }

    private _description: string;

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    private _creators: any;

    get creators() {
        return this._creators;
    }

    set creators(value) {
        this._creators = value;
    }

    private _characters: any;

    get characters() {
        return this._characters;
    }

    set characters(value) {
        this._characters = value;
    }

    private _URLs: any;

    get URLs() {
        return this._URLs;
    }

    set URLs(value) {
        this._URLs = value;
    }

    private _note: number | null;

    get note() {
        return this._note;
    }

    set note(value) {
        this._note = value;
    }

    private _read: number;

    get read() {
        return this._read;
    }

    set read(value) {
        this._read = value;
    }

    private _reading: number;

    get reading() {
        return this._reading;
    }

    set reading(value) {
        this._reading = value;
    }

    private _unread: number;

    get unread() {
        return this._unread;
    }

    set unread(value) {
        this._unread = value;
    }

    private _favorite: number;

    get favorite() {
        return this._favorite;
    }

    set favorite(value) {
        this._favorite = value;
    }

    private _last_page: number;

    get last_page() {
        return this._last_page;
    }

    set last_page(value) {
        this._last_page = value;
    }

    private _folder: any;

    get folder() {
        return this._folder;
    }

    set folder(value) {
        this._folder = value;
    }

    private _PATH: string;

    get PATH() {
        return this._PATH;
    }

    set PATH(value) {
        this._PATH = value;
    }

    private _issueNumber: string;

    get issueNumber() {
        return this._issueNumber;
    }

    set issueNumber(value) {
        this._issueNumber = value;
    }

    private _format: any;

    get format() {
        return this._format;
    }

    set format(value) {
        this._format = value;
    }

    private _pageCount: number;

    get pageCount() {
        return this._pageCount;
    }

    set pageCount(value) {
        this._pageCount = value;
    }

    private _series: any;

    get series() {
        return this._series;
    }

    set series(value) {
        this._series = value;
    }

    private _prices: any;

    get prices() {
        return this._prices;
    }

    set prices(value) {
        this._prices = value;
    }

    private _dates: any;

    get dates() {
        return this._dates;
    }

    set dates(value) {
        this._dates = value;
    }

    private _collectedIssues: any;

    get collectedIssues() {
        return this._collectedIssues;
    }

    set collectedIssues(value) {
        this._collectedIssues = value;
    }

    private _collections: any;

    get collections() {
        return this._collections;
    }

    set collections(value) {
        this._collections = value;
    }

    private _variants: any;

    get variants() {
        return this._variants;
    }

    set variants(value) {
        this._variants = value;
    }

    private _lock: number;

    get lock() {
        return this._lock;
    }

    set lock(value) {
        this._lock = value;
    }

    private _API_ID: string;

    get API_ID() {
        return this._API_ID;
    }

    set API_ID(value) {
        this._API_ID = value;
    }

    get book() {
        return {
            ID_book: this._ID_book,
            NOM: this._NOM,
            URLCover: this._URLCover,
            description: this._description,
            creators: this._creators,
            characters: this._characters,
            URLs: this._URLs,
            note: this._note,
            read: this._read,
            reading: this._reading,
            unread: this._unread,
            favorite: this._favorite,
            last_page: this._last_page,
            folder: this._folder,
            PATH: this._PATH,
            issueNumber: this._issueNumber,
            format: this._format,
            pageCount: this._pageCount,
            series: this._series,
            prices: this._prices,
            dates: this._dates,
            collectedIssues: this._collectedIssues,
            collections: this._collections,
            variants: this._variants,
            lock: this._lock,
            API_ID: this._API_ID
        };
    }

    /**
     * Download a book from the server
     * @param PATH the PATH of the book
     * @return {Promise<void>} the promise
     */
    async downloadBook(PATH: any): Promise<void> {
        const option = {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                PATH: PATH
            }, null, 2)
        };
        console.log(option);
        await fetch(PDP + '/DL', option).then(() => {
            window.open(PDP + "/getDLBook", "_blank");
        });
    }
}

export default Book;