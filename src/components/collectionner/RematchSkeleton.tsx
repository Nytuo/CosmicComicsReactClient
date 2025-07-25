import * as React from "react";
import { useTranslation } from "react-i18next";
import { providerEnum, tryToParse } from "@/utils/utils.ts";
import { Marvel } from "@/API/Marvel.ts";
import { ToasterHandler } from "@/components/common/ToasterHandler.tsx";
import { OpenLibrary } from "@/API/OpenLibrary.ts";
import { GoogleBooks } from "@/API/GoogleBooks.ts";
import { API } from "@/API/API.ts";
import Card from "@/components/collectionner/Card.tsx";
import Book from "@/utils/Book.ts";
import { Anilist } from "@/API/Anilist.ts";
import { Button, Stack, TextField } from "@mui/material";

/**
 * A component that allows the user to search for a book or a serie in different APIs and rematch it with a different provider.
 * @param provider - The provider to use for the rematch.
 * @param type - The type of the search (book or serie).
 * @param oldID
 * @returns A React component that renders the search inputs and the results of the search.
 */
export default function RematchSkeleton({
  provider,
  type,
  oldID,
}: {
  provider: any;
  type: "book" | "serie";
  oldID: string;
}) {
  const { t } = useTranslation();
  const [rematchResult, setRematchResult] = React.useState<any[]>([]);

  return (
    <Stack
      spacing={1}
      sx={{
        marginTop: "20px",
      }}
    >
      <TextField
        id="rematchSearch"
        label={t("searchTitleInTheLibrarysApi")}
        variant="outlined"
      />
      <TextField
        id="rematchYearSearch"
        label={t("yearOptional")}
        variant="outlined"
      />
      <Button
        id="rematchSearchSender"
        onClick={() => {
          console.log(provider);
          const search = document.getElementById(
            "rematchSearch",
          ) as HTMLInputElement;
          const year = document.getElementById(
            "rematchYearSearch",
          ) as HTMLInputElement;
          if (type == "book") {
            if (provider == providerEnum.Marvel) {
              new Marvel().GetComics(search.value, year.value).then((cdata) => {
                if (!cdata) return;
                const parsedData = tryToParse(cdata);
                if (parsedData["data"]["total"] > 0) {
                  for (let i = 0; i < parsedData["data"]["total"]; i++) {
                    const cdataI = parsedData["data"]["results"][i];
                    const TheBook = new Book(
                      cdataI["id"],
                      cdataI["title"],
                      cdataI["thumbnail"].path +
                        "/detail." +
                        cdataI["thumbnail"]["extension"],
                      "null",
                      null,
                      null,
                      null,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      null,
                      "null",
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
                      "0",
                    );
                    setRematchResult((prev) => [
                      ...prev,
                      {
                        book: TheBook.book,
                        onclick: () => {
                          // noinspection JSIgnoredPromiseFromCall
                          new API().rematch(
                            cdataI.id + "_" + provider,
                            provider,
                            "book",
                            oldID,
                            false,
                          );
                        },
                      },
                    ]);
                  }
                }
              });
            } else if (provider == providerEnum.Anilist) {
              ToasterHandler(t("providerCannotRematch"), "error");
            } else if (provider == providerEnum.MANUAL) {
              ToasterHandler(t("providerCannotRematch"), "error");
            } else if (provider == providerEnum.OL) {
              new OpenLibrary().GetComics(search.value).then((cdata) => {
                if (!cdata) return;
                const parsedData = tryToParse(cdata);
                if (
                  Object.prototype.hasOwnProperty.call(parsedData, "num_found")
                ) {
                  for (let i = 0; i < parsedData["num_found"]; i++) {
                    const cdataI = parsedData["docs"][i];
                    const TheBook = new Book(
                      cdataI["seed"][0].split("/")[2],
                      cdataI["title"],
                      cdataI["cover_i"] !== undefined
                        ? "https://covers.openlibrary.org/b/id/" +
                          cdataI["cover_i"] +
                          "-L.jpg"
                        : null,
                      "null",
                      null,
                      null,
                      null,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      null,
                      "null",
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
                      "0",
                    );
                    setRematchResult((prev) => [
                      ...prev,
                      {
                        book: TheBook.book,
                        onclick: () => {
                          // noinspection JSIgnoredPromiseFromCall
                          new API().rematch(
                            cdataI.seed[0].split("/")[2] + "_" + provider,
                            provider,
                            "book",
                            oldID,
                            false,
                          );
                        },
                      },
                    ]);
                  }
                }
              });
            } else if (provider == providerEnum.GBooks) {
              new GoogleBooks().GetComics(search.value).then((cdata) => {
                if (!cdata) return;
                const parsedData = tryToParse(cdata);
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
                    const TheBook = new Book(
                      parsedDataI["id"],
                      parsedDataI["title"],
                      cover,
                      "null",
                      null,
                      null,
                      null,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      null,
                      "null",
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
                      "0",
                    );
                    setRematchResult((prev) => [
                      ...prev,
                      {
                        book: TheBook.book,
                        onclick: () => {
                          // noinspection JSIgnoredPromiseFromCall
                          new API().rematch(
                            parsedDataI.id + "_" + provider,
                            provider,
                            "book",
                            oldID,
                            false,
                          );
                        },
                      },
                    ]);
                  }
                }
              });
            }
          } else if (type == "serie") {
            if (provider == providerEnum.Marvel) {
              new Marvel()
                .SearchComic(search.value, year.value)
                .then((cdata) => {
                  if (!cdata) return;
                  const parsedData = tryToParse(cdata);
                  if (parsedData["data"]["total"] > 0) {
                    for (let i = 0; i < parsedData["data"]["total"]; i++) {
                      const cdataI = parsedData["data"]["results"][i];
                      const TheBook = new Book(
                        cdataI["id"],
                        cdataI["title"],
                        cdataI["thumbnail"]["path"] +
                          "/detail." +
                          cdataI["thumbnail"]["extension"],
                        "null",
                        null,
                        null,
                        null,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        null,
                        "null",
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
                        "0",
                      );
                      setRematchResult((prev) => [
                        ...prev,
                        {
                          book: TheBook.book,
                          onclick: () => {
                            // noinspection JSIgnoredPromiseFromCall
                            new API().rematch(
                              cdataI.id + "_" + provider,
                              provider,
                              "Series",
                              oldID,
                              true,
                            );
                          },
                        },
                      ]);
                    }
                  }
                });
            } else if (provider == providerEnum.Anilist) {
              new Anilist().GET_SEARCH(search.value).then((el: any) => {
                if (el != null) {
                  el = el.base;
                  for (const element of el) {
                    const TheBook = new Book(
                      element.id,
                      element.title["english"] +
                        " / " +
                        element.title["romaji"] +
                        " / " +
                        element.title["native"],
                      element["coverImage"]["large"],
                      "null",
                      null,
                      null,
                      null,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      null,
                      "null",
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
                      "0",
                    );
                    setRematchResult((prev) => [
                      ...prev,
                      {
                        book: TheBook.book,
                        onclick: () => {
                          // noinspection JSIgnoredPromiseFromCall
                          new API().rematch(
                            element.id + "_" + provider,
                            provider,
                            "Series",
                            oldID,
                            true,
                          );
                        },
                      },
                    ]);
                  }
                }
              });
            } else if (provider == providerEnum.MANUAL) {
              ToasterHandler(t("providerCannotRematch"), "error");
            } else if (provider == providerEnum.OL) {
              ToasterHandler(t("providerCannotRematch"), "error");
            } else if (provider == providerEnum.GBooks) {
              ToasterHandler(t("providerCannotRematch"), "error");
            } else {
              ToasterHandler(t("providerCannotRematch"), "error");
            }
          }
        }}
      >
        {t("search")}
      </Button>
      <div id="resultRematch">
        {rematchResult.map(({ book, onclick }, index) => {
          return (
            <Card
              provider={provider}
              key={index}
              book={book}
              onClick={onclick}
              type="lite"
            />
          );
        })}
      </div>
    </Stack>
  );
}
