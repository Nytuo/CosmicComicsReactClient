import { IBook } from "@/interfaces/IBook";
import { updateBookStatusForOne, getFromDB } from "@/utils/Fetchers.ts";
import { AutoStories, Close, Done, Favorite, PlayArrow } from "@mui/icons-material";
import { Badge, IconButton } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Toaster } from "./Toaster.tsx";
import { PDP, currentProfile } from "@/utils/Common.ts";
import { useTranslation } from "react-i18next";

function Card({ book, provider, handleOpenDetails, onClick, type }: { book: IBook; provider: any; handleOpenDetails?: any; onClick?: () => void; type: "book" | "lite"; }) {

    if (book.URLCover === "null" || book.URLCover === "" || book.URLCover == null) {
        book.URLCover = "Images/fileDefault.png";
    } else if (book.URLCover.includes("public/FirstImagesOfAll")) {
        book.URLCover = PDP + "/" + book.URLCover.split("public/")[1];
        console.log(book.URLCover);
    }

    const { t } = useTranslation();

    return (<>
        <Badge data-effect="zoom" sx={{
            width: "250px",
            height: "380px",
            transition: "all 0.3s ease-in-out",
            margin: "15px",
            "&:hover": {
                transform: "scale(1.1,1.1)",
            },

        }} badgeContent={(book.favorite === 1 || book.favorite === "true") ? <Favorite
            sx={{
                width: "20px",
            }}
        /> : ""} color={(book.read === 1 || book.read === "true") ? "success" : (book.reading === 1 || book.reading === "true") ? "warning" : "error"}
            invisible={(type === "lite") ? true : false}
        >
            <div style={{ cursor: "pointer" }} className="cardcusto"
                id={"id_vol" + book.ID_book + "_" + Math.floor(Math.random() * 8000)}
                data-effect="zoom"
                onClick={() => {
                    if (onClick) {
                        onClick();
                    } else {
                        handleOpenDetails(true, book, provider);
                    }
                }
                }
            >

                <div className="card__image">
                    <img width={"100%"} id={"card_img_id_" + book.ID_book} src={book.URLCover} alt="" />
                </div>
                <div className="card__body">
                    <span className="card__play js-play"
                        onClick={() => {
                            updateBookStatusForOne("reading", book.ID_book);
                            localStorage.setItem("currentBook", book.PATH);
                            window.location.href = "/viewer";
                        }
                        }

                    ><IconButton>
                            <PlayArrow />
                        </IconButton>
                    </span>
                    <p className="card__bio" style={{ textAlign: "center" }}>{book.NOM}</p>
                </div>
                <Grid2 container spacing={5}>
                    <span className={
                        "card__save js-fav"
                    }
                        id={"btn_id_fav_" + book.ID_book + "_" + Math.random() * 8000}
                    >
                        <IconButton onClick={
                            async () => {
                                if (book.favorite === 1) {
                                    book.favorite = 0;
                                    Toaster(t("remove_fav"), "success");
                                    await getFromDB("Books", "* FROM Books WHERE favorite=1").then(async (resa) => {
                                        if (!resa) return;
                                        const bookList = JSON.parse(resa);
                                        for (let i = 0; i < bookList.length; i++) {
                                            if (bookList[i].ID_book === book.ID_book) {
                                                const options = {
                                                    method: "POST", headers: {
                                                        "Content-Type": "application/json"
                                                    }, body: JSON.stringify({
                                                        "token": currentProfile.getToken,
                                                        "table": "Books",
                                                        "column": "favorite",
                                                        "whereEl": bookList[i].ID_book,
                                                        "value": false,
                                                        "where": "ID_book"
                                                    }, null, 2)
                                                };
                                                await fetch(PDP + "/DB/update", options);
                                            }
                                        }
                                    });
                                } else {
                                    book.favorite = 1;
                                    Toaster(t("add_fav"), "success");
                                    await getFromDB("Books", "* FROM Books WHERE favorite=0").then(async (resa) => {
                                        if (!resa) return;
                                        const bookList = JSON.parse(resa);
                                        for (let i = 0; i < bookList.length; i++) {
                                            if (bookList[i].ID_book === book.ID_book) {
                                                const options = {
                                                    method: "POST", headers: {
                                                        "Content-Type": "application/json"
                                                    }, body: JSON.stringify({
                                                        "token": currentProfile.getToken,
                                                        "table": "Books",
                                                        "column": "favorite",
                                                        "whereEl": bookList[i].ID_book,
                                                        "value": true,
                                                        "where": "ID_book"
                                                    }, null, 2)
                                                };
                                                await fetch(PDP + "/DB/update", options);
                                            }
                                        }
                                    });
                                }
                            }
                        }>
                            <Favorite />
                        </IconButton>
                    </span>
                    <span className={
                        "card__close js-unread"
                    }
                        id={"btn_id_unread_" + book.ID_book + "_" + Math.random() * 8000}
                    >
                        <IconButton onClick={() => {
                            updateBookStatusForOne("unread", book.ID_book);
                            Toaster(t("mkunread"), "success");
                        }}>
                            <Close />
                        </IconButton>
                    </span>
                    <span className={
                        "card__reading js-reading"
                    }
                        id={"btn_id_reading_" + book.ID_book + "_" + Math.random() * 8000}
                    >
                        <IconButton onClick={() => {
                            updateBookStatusForOne("reading", book.ID_book);
                            Toaster(t("mkreading"), "success");
                        }}>
                            <AutoStories />
                        </IconButton>
                    </span>
                    <span className={
                        "card__read js-read"
                    }
                        id={"btn_id_read_" + book.ID_book + "_" + Math.random() * 8000}
                    >
                        <IconButton onClick={() => {
                            updateBookStatusForOne("read", book.ID_book);
                            Toaster(t("mkread"), "success");
                        }}>
                            <Done />
                        </IconButton>

                    </span>
                </Grid2>
            </div>
        </Badge >
    </>);
}

export default Card;