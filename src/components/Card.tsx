import { IBook } from "@/utils/IBook.ts";
import { providerEnum } from "@/utils/utils.ts";
import { AutoStories, Close, Done, Favorite, PlayArrow } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Dispatch, SetStateAction } from "react";

function Card({ book, handleOpenDetails }: { book: IBook; handleOpenDetails: any; }) {

    if (book.URLCover === "null" || book.URLCover === "" || book.URLCover == null) {
        book.URLCover = "Images/fileDefault.png";
    } else if (book.URLCover.includes("public/FirstImagesOfAll")) {
        book.URLCover = book.URLCover.split("public/")[1];
    }

    return (<>
        <div style={{ cursor: "pointer" }} className="cardcusto"
            id={"id_vol" + book.ID_book + "_" + Math.floor(Math.random() * 8000)}
            data-effect="zoom"
            onClick={() => {
                const provider = ((book.series.includes("marvel")) ? (providerEnum.Marvel) : ((book.series.includes("Anilist")) ? (providerEnum.Anilist) : ((book.series.includes("OL")) ? (providerEnum.OL) : ((book.URLs.includes("google")) ? (providerEnum.GBooks) : (providerEnum.MANUAL)))));
                handleOpenDetails(true, book, provider);
            }
            }
        >

            <div className="card__image">
                <img width={"100%"} id={"card_img_id_" + book.ID_book} src={book.URLCover} alt="" />
            </div>
            <div className="card__body">
                <span className="card__play js-play"
                    onClick={() => {
                        //AllForOne("unread", "read", "reading", this._ID);
                        // const encoded = encodeURIComponent(path.replaceAll("/", "%C3%B9"));
                        // window.location.href = "viewer.html?" + encoded;
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
                    <IconButton onClick={() => {
                        //favorite();
                    }}>
                        <Favorite />
                    </IconButton>
                </span>
                <span className={
                    "card__close js-unread"
                }
                    id={"btn_id_unread_" + book.ID_book + "_" + Math.random() * 8000}
                >
                    <IconButton onClick={() => {
                        //markasunread();
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
                        //AllForOne("unread", "read", "reading", this._ID);
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
                        // markasread();
                    }}>
                        <Done />
                    </IconButton>

                </span>
            </Grid2>
            {
                book.unread !== null && book.read !== null && book.reading !== null &&
                <div className={
                    book.unread === 1 ? "pointR" : book.reading === 1 ? "pointY" : ""
                }>
                    {book.favorite === 1 ? <i className="material-icons" style={{ fontSize: "16px", position: "relative", left: "-17px" }}>favorite</i> : ""}
                </div>
            }
        </div>
    </>);
}

export default Card;