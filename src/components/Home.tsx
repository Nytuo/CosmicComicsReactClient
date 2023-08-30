import { getFromDB } from "@/utils/Fetchers.ts";
import Card from "@/components/Card.tsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IBook } from "@/interfaces/IBook";

function Home({ handleOpenDetails }: { handleOpenDetails: any; }) {
    const [readingBooks, setReadingBooks] = useState([]);
    const [recentlyAdded, setRecentlyAdded] = useState([]);
    const [toRead, setToRead] = useState([]);
    const [myFavorite, setMyFavorite] = useState([]);
    const { t } = useTranslation();
    useEffect(() => {
        getFromDB("Books", "* FROM Books WHERE reading = 1").then(async (resa: string | void) => {
            if (!resa) return;
            if (resa.includes("404")) return;
            const TheBookun = JSON.parse(resa);
            console.log(TheBookun);
            setReadingBooks(TheBookun);
        });
        getFromDB("Books", "* FROM Books ORDER BY ID_book DESC LIMIT 10").then(async (resa) => {
            if (!resa) return;
            if (resa.includes("404")) return;
            const TheBookun = JSON.parse(resa);
            console.log(TheBookun);
            setRecentlyAdded(TheBookun);
        });
        getFromDB("Books", "* FROM Books WHERE unread = 1").then(async (resa) => {
            if (!resa) return;
            if (resa.includes("404")) return;
            const TheBookun = JSON.parse(resa);
            console.log(TheBookun);
            setToRead(TheBookun);
        });
        getFromDB("Books", "* FROM Books WHERE favorite = 1").then(async (resa) => {
            if (!resa) return;
            if (resa.includes("404")) return;
            const TheBookun = JSON.parse(resa);
            console.log(TheBookun);
            setMyFavorite(TheBookun);
        });
    }, []);
    return (<div id="home">
        <p id="continueReading">Continue reading : </p>
        {
            readingBooks.length === 0 ? <p>{t("nothingHere")}</p> :
                readingBooks.map((book: IBook, index) => {
                    return <Card provider={book.API_ID} handleOpenDetails={handleOpenDetails} book={book} key={index} />;
                })
        }
        <p id="myfav">My favorites : </p>

        {myFavorite.length === 0 ? <p>{t("nothingHere")}</p> :
            myFavorite.map((book: IBook, index) => {
                return <Card provider={book.API_ID} handleOpenDetails={handleOpenDetails} book={book} key={index} />;
            })
        }
        <p id="recentlyAddedLabel">Recently added : </p>
        {recentlyAdded.length === 0 ? <p>{t("nothingHere")}</p> :
            recentlyAdded.map((book: IBook, index) => {
                return <Card provider={book.API_ID} handleOpenDetails={handleOpenDetails} book={book} key={index} />;
            })
        }
        <p id="toReadd">To read : </p>
        {toRead.length === 0 ? <p>{t("nothingHere")}</p> :
            toRead.map((book: IBook, index) => {
                return <Card provider={book.API_ID} handleOpenDetails={handleOpenDetails} book={book} key={index} />;
            })
        }
    </div>);
}

export default Home;