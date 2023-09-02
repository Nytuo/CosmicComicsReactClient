import { getFromDB } from "@/utils/Fetchers.ts";
import Card from "@/components/Card.tsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IBook } from "@/interfaces/IBook";
import { useTheme } from "@mui/material";

function Home({ handleOpenDetails }: { handleOpenDetails: any; }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [readingBooks, setReadingBooks] = useState([]);
    const [recentlyAdded, setRecentlyAdded] = useState([]);
    const [toRead, setToRead] = useState([]);
    const [myFavorite, setMyFavorite] = useState([]);
    useEffect(() => {
        document.getElementsByTagName("body")[0].style.background = theme.palette.background.default;
        getFromDB("Books", "* FROM Books WHERE reading = 1").then(async (resa: string | void) => {
            if (!resa) return;
            if (resa.includes("404")) return;
            const TheBookun = JSON.parse(resa);
            setReadingBooks(TheBookun);
        });
        getFromDB("Books", "* FROM Books ORDER BY ID_book DESC LIMIT 10").then(async (resa) => {
            if (!resa) return;
            if (resa.includes("404")) return;
            const TheBookun = JSON.parse(resa);
            setRecentlyAdded(TheBookun);
        });
        getFromDB("Books", "* FROM Books WHERE unread = 1").then(async (resa) => {
            if (!resa) return;
            if (resa.includes("404")) return;
            const TheBookun = JSON.parse(resa);
            setToRead(TheBookun);
        });
        getFromDB("Books", "* FROM Books WHERE favorite = 1").then(async (resa) => {
            if (!resa) return;
            if (resa.includes("404")) return;
            const TheBookun = JSON.parse(resa);
            setMyFavorite(TheBookun);
        });
    }, []);
    return (<div id="home">
        <h2 id="continueReading">{t("continue_reading")}</h2>
        {
            readingBooks.length === 0 ? <p>{t("nothingHere")}</p> :
                <div className="cards-list">
                    {readingBooks.map((book: IBook, index) => {
                        return <Card provider={book.API_ID} handleOpenDetails={handleOpenDetails} book={book} key={index} />;
                    })}
                </div>
        }
        <h2 id="myfav">{t("myfavorites")}</h2>

        {myFavorite.length === 0 ? <p>{t("nothingHere")}</p> :
            <div className="cards-list">
                {
                    myFavorite.map((book: IBook, index) => {
                        return <Card provider={book.API_ID} handleOpenDetails={handleOpenDetails} book={book} key={index} />;
                    })
                }
            </div>
        }
        <h2 id="recentlyAddedLabel">{t("recentlyAdded")}</h2>
        {recentlyAdded.length === 0 ? <p>{t("nothingHere")}</p> :
            <div className="cards-list">
                {recentlyAdded.map((book: IBook, index) => {
                    return <Card provider={book.API_ID} handleOpenDetails={handleOpenDetails} book={book} key={index} />;
                })}
            </div>
        }
        <h2 id="toReadd">{t("toRead")}</h2>
        {toRead.length === 0 ? <p>{t("nothingHere")}</p> :
            <div className="cards-list">
                {toRead.map((book: IBook, index) => {
                    return <Card provider={book.API_ID} handleOpenDetails={handleOpenDetails} book={book} key={index} />;
                })}
            </div>
        }
    </div>);
}

export default Home;