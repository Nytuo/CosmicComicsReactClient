import {IBook} from "@/interfaces/IBook.ts";

export type ISeriesOfBook = IBook & {
    statut: string,
    start_date: string,
    end_date: string,
    Score: number,
    genres: string,
    cover: string,
    BG_cover: string,
    trending: number | null | string,
    SOURCE: string,
    volumes: number | null | string,
    chapters: number,
    raw_title: string,
    score: number | null | string,
}