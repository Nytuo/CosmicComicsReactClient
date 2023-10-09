interface IBook {
    ID_book: string;
    API_ID: string;
    NOM: string;
    note?: any;
    read: number | string;
    reading: number | string;
    unread: number | string;
    favorite: number | string;
    last_page: number;
    folder: number;
    PATH: string;
    URLCover: string;
    issueNumber: string;
    description: string;
    format: string;
    pageCount?: any;
    URLs: string;
    series: string;
    creators: string;
    characters: string;
    prices: string;
    dates: string;
    collectedIssues: string;
    collections: string;
    variants: string;
    lock: number;
}

export type {IBook};