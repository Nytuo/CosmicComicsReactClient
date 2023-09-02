import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { providerEnum } from '@/utils/utils.ts';
import { Marvel } from '@/API/Marvel.ts';
import { Toaster } from '@/components/Toaster.tsx';
import { OpenLibrary } from '@/API/OpenLibrary.ts';
import { GoogleBooks } from '@/API/GoogleBooks.ts';
import { API } from '@/API/API.ts';
import Card from '@/components/Card.tsx';
import Book from '@/utils/Book.ts';
import { Anilist } from '@/API/Anilist.ts';
import { Button } from '@mui/material';

/**
 * A component that allows the user to search for a book or a serie in different APIs and rematch it with a different provider.
 * @param provider - The provider to use for the rematch.
 * @param type - The type of the search (book or serie).
 * @returns A React component that renders the search inputs and the results of the search.
 */
export default function RematchSkeleton({ provider, type }: {
    provider: any,
    type: "book" | "serie",
}) {
    const { t } = useTranslation();
    const [rematchResult, setRematchResult] = React.useState<any[]>([]);

    return (
        <div>
            <input type="text" id="rematchSearch" placeholder="Search title in the library's API" />
            <input type="text" id="rematchYearSearch" placeholder="Year (optional)" />
            <Button id="rematchSearchSender"
                onClick={
                    () => {
                        const search = document.getElementById("rematchSearch") as HTMLInputElement;
                        const year = document.getElementById('rematchYearSearch') as HTMLInputElement;
                        if (type == "book") {
                            if (provider === providerEnum.Marvel) {
                                new Marvel().GetComics(search.value, year.value).then((cdata) => {
                                    if (!cdata) return;
                                    const parsedData = JSON.parse(cdata);
                                    if (parsedData["data"]["total"] > 0) {
                                        for (let i = 0; i < parsedData["data"]["total"]; i++) {
                                            const cdataI = parsedData["data"]["results"][i];
                                            const TheBook = new Book(cdataI["id"], cdataI["title"], cdataI["thumbnail"].path + "/detail." + cdataI["thumbnail"].extension, "null", null, null, null, 0, 0, 0, 0, 0, 0, null, "null", "null", null, 0, null, null, null, null, null, null, 0, '0');
                                            setRematchResult((prev) => [...prev, {
                                                book: TheBook.book, onclick:
                                                    () => {
                                                        new API().rematch(cdataI.id + "_" + provider, provider, "book", TheBook.ID_book, false);
                                                    }
                                            }]);
                                        }
                                    }
                                });
                            } else if (provider === providerEnum.Anilist) {
                                Toaster(t("providerCannotRematch"), "error");
                            } else if (provider === providerEnum.MANUAL) {
                                Toaster(t("providerCannotRematch"), "error");
                            } else if (provider === providerEnum.OL) {
                                new OpenLibrary().GetComics(search.value).then((cdata) => {
                                    if (!cdata) return;
                                    const parsedData = JSON.parse(cdata);
                                    if (Object.prototype.hasOwnProperty.call(parsedData, "num_found")) {
                                        for (let i = 0; i < parsedData["num_found"]; i++) {
                                            const cdataI = parsedData["docs"][i];
                                            const TheBook = new Book(cdataI["seed"][0].split("/")[2], cdataI["title"], cdataI["cover_i"] !== undefined ? "https://covers.openlibrary.org/b/id/" + cdataI["cover_i"] + "-L.jpg" : null, "null", null, null, null, 0, 0, 0, 0, 0, 0, null, "null", "null", null, 0, null, null, null, null, null, null, 0, '0');
                                            setRematchResult((prev) => [...prev, { book: TheBook.book, onclick: () => { new API().rematch(cdataI.seed[0].split("/")[2] + "_" + provider, provider, "book", TheBook.ID_book, false); } }]);
                                        }
                                    }


                                });
                            } else if (provider === providerEnum.GBooks) {
                                new GoogleBooks().GetComics(search.value).then((cdata) => {
                                    if (!cdata) return;
                                    const parsedData = JSON.parse(cdata);
                                    if (parsedData["totalItems"] > 0) {
                                        for (let i = 0; i < parsedData["totalItems"]; i++) {
                                            const parsedDataI = parsedData["items"][i];
                                            let cover;
                                            if (parsedDataI["volumeInfo"]["imageLinks"] !== undefined) {

                                                cover = parsedDataI["volumeInfo"]["imageLinks"];
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
                                            const TheBook = new Book(parsedDataI["id"], parsedDataI["title"], cover, "null", null, null, null, 0, 0, 0, 0, 0, 0, null, "null", "null", null, 0, null, null, null, null, null, null, 0, '0');
                                            setRematchResult((prev) => [...prev, {
                                                book: TheBook.book, onclick: () => {
                                                    new API().rematch(parsedDataI.id + "_" + provider, provider, "book", TheBook.ID_book, false);
                                                }
                                            }]);
                                        }
                                    }
                                });
                            }
                        } else if (type == "serie") {
                            if (provider === providerEnum.Marvel) {
                                new Marvel().SearchComic(search.value, year.value).then((cdata) => {
                                    if (!cdata) return;
                                    const parsedData = JSON.parse(cdata);
                                    if (parsedData["data"]["total"] > 0) {
                                        for (let i = 0; i < parsedData["data"]["total"]; i++) {
                                            const cdataI = parsedData["data"]["results"][i];
                                            const TheBook = new Book(cdataI["id"], cdataI["title"], cdataI["thumbnail"].path + "/detail." + cdataI["thumbnail"].extension, "null", null, null, null, 0, 0, 0, 0, 0, 0, null, "null", "null", null, 0, null, null, null, null, null, null, 0, '0');
                                            setRematchResult((prev) => [...prev, {
                                                book: TheBook.book, onclick:
                                                    () => {
                                                        new API().rematch(cdataI.id + "_" + provider, provider, "Series", TheBook.ID_book, true);
                                                    }
                                            }]);
                                        }
                                    }
                                });
                            } else if (provider === providerEnum.Anilist) {
                                new Anilist().GET_SEARCH(search.value).then((el: any) => {
                                    if (el != null) {
                                        el = el.base;
                                        for (let o = 0; o < el.length; o++) {
                                            const TheBook = new Book(el[o].id, el[o].title.english + " / " + el[o].title.romaji + " / " + el[o].title.native, el[o].coverImage.large, "null", null, null, null, 0, 0, 0, 0, 0, 0, null, "null", "null", null, 0, null, null, null, null, null, null, 0, '0');
                                            setRematchResult((prev) => [...prev, { book: TheBook.book, onclick: () => { new API().rematch(el[o].id + "_" + provider, provider, "Series", TheBook.ID_book, true); } }]);
                                        }
                                    }
                                });
                            } else if (provider === providerEnum.MANUAL) {
                                Toaster(t("providerCannotRematch"), "error");
                            } else if (provider === providerEnum.OL) {
                                Toaster(t("providerCannotRematch"), "error");
                            } else if (provider === providerEnum.GBooks) {
                                Toaster(t("providerCannotRematch"), "error");
                            } else {
                                Toaster(t("providerCannotRematch"), "error");
                            }
                        }

                    }
                }
            >Search</Button>
            <div id="resultRematch">
                {
                    rematchResult.map(({ book, onclick }, index) => { return <Card provider={provider} key={index} book={book} onClick={onclick} />; })
                }
            </div>
        </div>
    );
}