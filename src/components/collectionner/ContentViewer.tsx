import {currentProfile, InsertIntoTarget, PDP} from "@/utils/Common.ts";
import {
    changeRating,
    downloadBook,
    getFromDB,
    updateBookStatusForAll,
    updateBookStatusForOne
} from "@/utils/Fetchers.ts";
import {IBook} from "@/interfaces/IBook.ts";
import {providerEnum, resolveTitle, tryToParse} from "@/utils/utils.ts";
import {
    ArrowBack,
    ArrowForward,
    AutoStories,
    Check,
    Close,
    Done,
    Download,
    Edit,
    Favorite,
    OpenInNew,
    PlayArrow,
    QuestionMark,
    Refresh,
    YoutubeSearchedFor
} from "@mui/icons-material";
import {Avatar, Box, Chip, CircularProgress, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import Rating from "@mui/material/Rating/Rating";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {useContext, useLayoutEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ToasterHandler} from "../common/ToasterHandler.tsx";
import DatabaseEditorDialog from "./dialogs/DatabaseEditorDialog.tsx";
import {API} from "@/API/API.ts";
import Card from "./Card.tsx";
import Book from "@/utils/Book.ts";
import MoreInfoDialog from "./dialogs/MoreInfoDialog.tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {ScrollMenu, VisibilityContext} from "react-horizontal-scrolling-menu";
import ContainerExplorer from "./ContainerExplorer.tsx";
import RematchDialog from "./dialogs/RematchDialog.tsx";

//providerEnum to type
type TProvider = 0 | 1 | 2 | 3 | 4;

function ContentViewer({provider, TheBook, type, handleAddBreadcrumbs, handleChangeToDetails}: {
    provider: number;
    TheBook: any;
    type: 'series' | 'volume';
    handleAddBreadcrumbs: any;
    handleChangeToDetails?: (open: boolean, book: IBook, provider: any) => void;
}) {
    provider = provider as TProvider;
    const [rating, setRating] = useState<number | null>((TheBook.note === null ? null : parseInt(TheBook.note)));
    const [characters, setCharacters] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [relations, setRelations] = useState<any[]>([]);
    const [openMoreInfo, setOpenMoreInfo] = useState(false);
    const [moreInfoContent, setMoreInfoContent] = useState<any>({});
    const handleOpenMoreInfo = (name: string, desc: string, image: string, href: string, type: "avatar" | "cover" = "avatar") => {
        setMoreInfoContent({
            "name": name,
            "desc": desc,
            "image": image,
            "href": href,
            "type": type
        });
        setOpenMoreInfo(true);
    };
    const closeMoreInfo = () => {
        setOpenMoreInfo(false);
    };
    const APINOTFOUND = /[a-zA-Z]/g.test(TheBook.ID_book);


    const [readStatSeries, setReadStatSeries] = useState("0 / 0 volumes read");

    const [openExplorer, setOpenExplorer] = useState<{
        open: boolean,
        explorer: IBook[],
        provider: any,
        booksNumber: number;
        type: "series" | "books";
    }>(({open: false, explorer: [], provider: null, booksNumber: 0, type: "series"}));

    /**
     * Load the content of the element
     * @param {string} FolderRes The folder path
     * @param {string} libraryPath The library path
     * @param {*} date The date of the element
     * @param {number} provider The provider of the element
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function loadView(FolderRes: string, libraryPath: string, date: any = "", provider: number = providerEnum.MANUAL) {
        FolderRes = FolderRes.replaceAll("\\", "/");
        FolderRes = FolderRes.replaceAll("//", "/");
        FolderRes = FolderRes.replaceAll("/", "ù");
        fetch(PDP + "/getListOfFilesAndFolders/" + FolderRes).then((response) => {
            return response.text();
        }).then(async (data) => {
            data = JSON.parse(data);
            let OSBook = openExplorer.explorer;
            for (const element of data) {
                const path = element;
                const name = path.replaceAll(libraryPath.replaceAll("\\", "/"), "");
                const realnameREG = /[^\\/]+(?=\.\w+$)|[^\\/]+$/.exec(name);
                if (realnameREG === null) continue;
                const realname = realnameREG[0];
                const readBookNB = await getFromDB("Books", "COUNT(*) FROM Books WHERE READ = 1 AND PATH = '" + path + "'");
                setReadStatSeries(readBookNB ? JSON.parse(readBookNB)[0]["COUNT(*)"] + " / " + data.length + " volumes read" : "0 / 0 volumes read");
                OSBook = await getFromDB("Books", "* FROM Books WHERE PATH = '" + path + "'").then(resa => {
                    return InsertIntoTarget(resa, realname, date, path, OSBook, provider)
                });
            }
            setOpenExplorer({open: true, explorer: OSBook, provider: provider, booksNumber: 0, type: "books"});
        });
    }

    const {t} = useTranslation();
    useLayoutEffect(() => {
        const fetchCharacters = async () => {
            if (type === "volume") {
                if (TheBook.characters !== "null") {
                    const NameToFetchList: string[] = [];
                    if (provider === providerEnum.Marvel) {
                        tryToParse(TheBook.characters)["items"].forEach((el: any) => {
                            NameToFetchList.push("'" + el.name + "'");
                        });
                    } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                        tryToParse(TheBook.characters).forEach((el: any) => {
                            NameToFetchList.push("'" + el.name + "'");
                        });
                    }
                    const NameToFetch = NameToFetchList.join(",");
                    await getFromDB("Characters", "* FROM Characters WHERE name IN (" + NameToFetch + ")").then((clres) => {
                        if (!clres) return;
                        const parsedClres = tryToParse(clres);
                        setCharacters(parsedClres);
                    });
                }
            } else {
                const NameToFetchList: string[] = [];
                if (provider === providerEnum.Marvel) {
                    tryToParse(TheBook.characters)["items"].forEach((el: any) => {
                        NameToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
                    });
                } else if (provider === providerEnum.Anilist) {
                    tryToParse(TheBook.characters).forEach((el: any) => {
                        NameToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
                    });
                } else if (provider === providerEnum.OL) {
                    ToasterHandler("OpenLibrary " + t("cannotFetchCharacters"), "error");
                } else if (provider === providerEnum.GBooks) {
                    ToasterHandler("Google Books " + t("cannotFetchCharacters"), "error");
                }
                const NameToFetch = NameToFetchList.join(",");
                await getFromDB("Characters", "* FROM Characters WHERE name IN (" + NameToFetch + ")").then((clres) => {
                    if (!clres) return;
                    const parsedClres = tryToParse(clres);
                    setCharacters(parsedClres);
                });
            }
        };

        const fetchCreators = async () => {
            if (TheBook.creators !== "null" && TheBook.creators !== null && TheBook.creators !== undefined && TheBook.creators !== "") {
                const StaffToFetchList: string[] = [];
                if (provider === providerEnum.Marvel) {
                    tryToParse(TheBook.creators)["items"].forEach((el: { name: string; }) => {
                        StaffToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
                    });
                } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL) {
                    tryToParse(TheBook.creators).forEach((el: { name: string; }) => {
                        StaffToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
                    });
                } else if (provider === providerEnum.GBooks) {
                    tryToParse(TheBook.creators).forEach((el: string) => {
                        StaffToFetchList.push("'" + el.replaceAll("'", "''") + "'");
                    });
                }
                const StaffToFetch = StaffToFetchList.join(",");
                await getFromDB("Creators", "* FROM Creators WHERE name IN (" + StaffToFetch + ")").then((clres) => {
                    if (!clres) return;
                    const parsedClres = tryToParse(clres);
                    setStaff(parsedClres);
                });
            }
        };
        const fetchRelations = async () => {
            await getFromDB("relations", "* FROM relations WHERE series = '" + TheBook.ID_book + "'").then((clres) => {
                if (!clres) return;
                const parsedClres = tryToParse(clres);
                parsedClres.sort(function (a: any, b: any) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                });
                setRelations(parsedClres);
            });
        };
        // noinspection JSIgnoredPromiseFromCall
        fetchCharacters();
        // noinspection JSIgnoredPromiseFromCall
        fetchCreators();
        // noinspection JSIgnoredPromiseFromCall
        fetchRelations();
        if (type == "series") {
            let libraryPath = TheBook.PATH.replaceAll("\\", "/");
            libraryPath = libraryPath.replace(/\/[^/]+$/, "");
            libraryPath = libraryPath.replaceAll("/", "\\");
            if (provider === providerEnum.Marvel) {
                loadView(TheBook.PATH, libraryPath, tryToParse(TheBook.start_date), provider);
            } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                loadView(TheBook.PATH, libraryPath, "", provider);
            }
        }
        const handleAsyncBG = async () => {
            let options;
            if (provider !== providerEnum.Marvel) {
                if (TheBook.BG_cover != null && TheBook.BG_cover !== "null") {
                    options = {
                        method: "GET", headers: {
                            "Content-Type": "application/json", "img": TheBook.BG_cover
                        }
                    };
                } else if (TheBook.URLCover != null && TheBook.URLCover !== "null") {
                    options = {
                        method: "GET", headers: {
                            "Content-Type": "application/json", "img": TheBook.URLCover
                        }
                    };
                } else {
                    return "#000000";
                }
            } else if (TheBook.BG_cover === null || TheBook.BG_cover === "null") {
                return "#000000";
            } else if (TheBook.BG_cover && (TheBook.BG_cover["path"] != null && TheBook.BG_cover["path"] !== "null")) {
                options = {
                    method: "GET", headers: {
                        "Content-Type": "application/json", "img": TheBook.BG_cover["path"]
                    }
                };
            } else if (TheBook.URLCover != null && TheBook.URLCover !== "null") {
                options = {
                    method: "GET", headers: {
                        "Content-Type": "application/json", "img": TheBook.URLCover
                    }
                };
            } else {
                return "#000000";
            }


            await fetch(PDP + "/img/getPalette/" + currentProfile.getToken, options).then(function (response) {
                return response.json();
            }).then(function (data) {
                const Blurcolors = data[0];
                const BlurColorDarker = data[1];
                setTimeout(function () {
                    document.getElementsByTagName("body")[0].style.transition = "background 0.5s ease-in-out 0.5s";
                    document.getElementsByTagName("body")[0].style.background = "linear-gradient(to left top, " + Blurcolors + ", " + BlurColorDarker + ") no-repeat fixed";
                }, 500);
            });

        };
        // noinspection JSIgnoredPromiseFromCall
        handleAsyncBG();
    }, [TheBook, provider, t, type]);

    function LeftArrow() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const {isFirstItemVisible, scrollPrev} = useContext(VisibilityContext);

        return (
            <IconButton disabled={isFirstItemVisible} onClick={() => scrollPrev()}><ArrowBack/></IconButton>
        );
    }

    function RightArrow() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const {isLastItemVisible, scrollNext} = useContext(VisibilityContext);

        return (
            <IconButton disabled={isLastItemVisible} onClick={() => scrollNext()}><ArrowForward/></IconButton>
        );
    }

    const [openDatabaseEditorDialog, setOpenDatabaseEditorDialog] = useState(false);

    const handleCloseDatabaseEditorDialog = () => {
        setOpenDatabaseEditorDialog(false);
    };

    const [openRematchDialog, setOpenRematchDialog] = useState(false);
    const handleCloseRematchDialog = () => {
        setOpenRematchDialog(false);
    };
    const handleOpenRematchDialog = () => {
        setOpenRematchDialog(true);
    };

    function onClickHandleOpenMoreInfo(el: any) {
        if (provider === providerEnum.Marvel) {
            handleOpenMoreInfo(el.name, el.description, tryToParse(el.image).path + "/detail." + tryToParse(el.image)["extension"], tryToParse(el.url)[0].url);
        } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
            handleOpenMoreInfo(el.name, el.description, el.image.replaceAll('"', ""), el.url);
        }
    }

    return (<>
        <DatabaseEditorDialog openModal={openDatabaseEditorDialog} onClose={handleCloseDatabaseEditorDialog}
                              TheBook={TheBook} type={type === "volume" ? "book" : "series"}/>
        <MoreInfoDialog openModal={openMoreInfo} onClose={() => {
            closeMoreInfo();
        }} desc={moreInfoContent.desc} name={moreInfoContent.name} hrefURL={moreInfoContent.href}
                        image={moreInfoContent.image} type={moreInfoContent.type}/>
        <RematchDialog openModal={openRematchDialog} onClose={handleCloseRematchDialog} provider={provider}
                       type={type === "volume" ? "book" : "serie"} oldID={TheBook.ID_book}/>
        <div
            style={
                {
                    width: "80vw",
                    marginTop: "10px",
                    marginBottom: "10px",
                    marginLeft: "auto",
                    marginRight: "auto",
                }
            }
        >
            <img id="imageBGOV2" src="#" alt="#" style={{width: "100vw", height: "auto", display: "none"}}/>
            <Box sx={{
                width: "90vw",
            }}>

                <Stack spacing={{xs: 1, sm: 2}} direction="row" useFlexGap flexWrap="wrap">
                    <Box
                        sx={
                            {
                                width: provider === providerEnum.Marvel ? "20vw" : "15vw",
                            }
                        }
                    >
                        <img src={
                            type === "series" ? TheBook.URLCover === null || TheBook.URLCover === "null" ? "Images/fileDefault.png" : TheBook.URLCover : TheBook.URLCover === null || TheBook.URLCover === "null" ? "Images/fileDefault.png" :
                                TheBook.URLCover.includes("public/FirstImagesOfAll") ? TheBook.URLCover.split("public/")[1] : TheBook.URLCover
                        } id="ImgColCover" alt="#"
                             style={
                                 {
                                     height: "20vw",
                                 }
                             }
                        />
                    </Box>
                    <Box
                        sx={
                            {
                                width: "50vw",
                            }
                        }
                    >

                        {
                            type === "volume" ? (
                                    (provider === providerEnum.Marvel) ?
                                        <h1><a target='_blank'
                                               href={((TheBook.URLs === null || TheBook.URLs === "null") ? ("#") : (tryToParse(TheBook.URLs)[0].url))}>{TheBook.NOM}<OpenInNew/></a>
                                        </h1>
                                        : (provider === providerEnum.Anilist) ?
                                            <h1><a target='_blank'>{TheBook.NOM}</a></h1> :
                                            <h1><a target='_blank'>{TheBook.NOM}</a></h1>) :
                                (provider === providerEnum.Marvel) ?
                                    <h1>{TheBook.NOM}</h1> :
                                    (provider === providerEnum.Anilist) ?
                                        <h1><a target='_blank'
                                               href={(TheBook.URLs == "null") ? ("#") : tryToParse(TheBook.URLs)}>{TheBook.NOM}<OpenInNew/></a>
                                        </h1> :
                                        <h1><a target='_blank'>{TheBook.NOM}<OpenInNew/></a></h1>
                        }
                        <Grid2 container sx={
                            {
                                marginTop: "10px",
                                marginBottom: "10px",
                            }
                        } spacing={2}>
                            <Grid2>
                                {
                                    type === "volume" ?
                                        (TheBook.read === 1 || TheBook.read === "true") ?
                                            <Chip color="info" sx={
                                                {marginRight: "5px"}
                                            } label={
                                                t('READ')
                                            } icon={<Done/>}/>
                                            : TheBook.unread === 1 || TheBook.unread === "true" ?
                                                <Chip color="error" sx={
                                                    {marginRight: "5px"}
                                                } label={
                                                    t('UNREAD')
                                                } icon={<Close/>}/>
                                                : TheBook.reading === 1 || TheBook.reading === "true" ?
                                                    <Chip color="warning" sx={
                                                        {marginRight: "5px"}
                                                    } label={
                                                        t('READING')
                                                    } icon={<AutoStories/>}/>
                                                    : ""
                                        : (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks ? TheBook.statut === "FINISHED" ?
                                                <Chip color="info" sx={
                                                    {marginRight: "5px"}
                                                } label={
                                                    t('FINISHED')
                                                } icon={<Done/>}/>
                                                : TheBook.statut === "RELEASING" ?
                                                    <Chip color="warning" sx={
                                                        {marginRight: "5px"}
                                                    } label={
                                                        t('RELEASING')
                                                    } icon={<AutoStories/>}/>
                                                    : TheBook.statut === "NOT_YET_RELEASED" ?
                                                        <Chip color="error" sx={
                                                            {marginRight: "5px"}
                                                        } label={
                                                            t('NOT_YET_RELEASED')
                                                        } icon={<Close/>}/>
                                                        : <Chip color="error" sx={
                                                            {marginRight: "5px"}
                                                        } label={
                                                            t('UNKNOWN')
                                                        } icon={<QuestionMark/>}/> : provider === providerEnum.Marvel ?
                                                tryToParse(TheBook.end_date) > new Date().getFullYear() ?
                                                    <Chip color="warning" sx={
                                                        {marginRight: "5px"}
                                                    } label={
                                                        t('RELEASING')
                                                    } icon={
                                                        <AutoStories/>}/> : tryToParse(TheBook.end_date) < new Date().getFullYear() ?
                                                        <Chip color="info" sx={
                                                            {marginRight: "5px"}
                                                        } label={
                                                            t('FINISHED')
                                                        } icon={
                                                            <Done/>}/> : tryToParse(TheBook.start_date) > new Date().getFullYear() ?
                                                            <Chip color="error" sx={
                                                                {marginRight: "5px"}
                                                            } label={
                                                                t('NOT_YET_RELEASED')
                                                            } icon={
                                                                <Close/>}/> : tryToParse(TheBook.start_date) === new Date().getFullYear() ?
                                                                <Chip color="warning" sx={
                                                                    {marginRight: "5px"}
                                                                } label={
                                                                    t('ENDSOON')
                                                                } icon={<AutoStories/>}/> :
                                                                <Chip color="error" sx={
                                                                    {marginRight: "5px"}
                                                                } label={
                                                                    t('UNKNOWN')
                                                                } icon={<QuestionMark/>
                                                                }/> : <></>
                                        )
                                }
                                {
                                    TheBook.favorite === 1 ?
                                        <Chip color="error" label={
                                            t('favoriteParenthesis')
                                        } icon={<Favorite/>}/>
                                        : ""
                                }
                            </Grid2>
                        </Grid2>
                        <div id="startDate"
                             style={
                                 {
                                     marginBottom: "10px",
                                 }
                             }
                        >
                            {
                                type === "volume" ?
                                    provider === providerEnum.Marvel ? (
                                        TheBook.dates !== "null" ? typeof tryToParse(TheBook.dates) === "object" ? t("releaseDates") + ": " + new Date(tryToParse(TheBook.dates)[0]["date"]).toLocaleDateString() : "?" : "?") : (TheBook.dates !== "null" ? typeof tryToParse(TheBook.dates) === "object" ? t("dates") + tryToParse(TheBook.dates).map((date: {
                                        type: string;
                                        date: string;
                                    }, index: number) => {
                                        return <p
                                            key={index}>{date.type.replace(/([A-Z])/g, ' $1').trim() + " : " + date.date}</p>;
                                    }) : "?" : "?") : ""
                            }
                            {
                                type === "series" ? (!APINOTFOUND) ? ((provider === providerEnum.Marvel) ? (tryToParse(TheBook.start_date)) + " -" : (tryToParse(TheBook.start_date).year)) == null ? "? -" : ((provider === providerEnum.Marvel) ? (tryToParse(TheBook.start_date)) + " -" : (tryToParse(TheBook.start_date).year)) + " -" : "" : ""
                            }
                            {
                                type === "series" ? (APINOTFOUND) ?
                                    (tryToParse(TheBook.start_date) == null) ? "? -" : tryToParse(TheBook.start_date) + " -" : "" : ""
                            }
                            {
                                type === "series" ? (!APINOTFOUND) ? ((provider === providerEnum.Marvel) ? " " + (tryToParse(TheBook.end_date)) : (tryToParse(TheBook.end_date).year)) == null || tryToParse(TheBook.end_date) > new Date().getFullYear() ? " ?" : ((provider === providerEnum.Marvel) ? " " + (tryToParse(TheBook.end_date)) : " " + (tryToParse(TheBook.end_date).year)) : " ?" : ""
                            }
                            {
                                type === "series" ? (APINOTFOUND) ?
                                    (tryToParse(TheBook.end_date) == null || tryToParse(TheBook.end_date) > new Date().getFullYear()) ? " ?" : " " + tryToParse(TheBook.end_date) : "" : ""
                            }
                        </div>
                        <Stack spacing={3}> <Grid2 container spacing={2} id='btnsActions'>
                            <Tooltip title={t('PLAY')}>

                                <IconButton id="playbutton" onClick={
                                    async () => {
                                        if (type == "volume") {
                                            updateBookStatusForOne("reading", TheBook.ID_book);
                                            localStorage.setItem("currentBook", TheBook.PATH);
                                            window.location.href = "/viewer";

                                        } else {
                                            await getFromDB("Books", "PATH FROM Books WHERE unread=1 OR reading=1").then(async (resa) => {
                                                if (!resa) return;
                                                let continueSeriesReading = "";
                                                const bookList = tryToParse(resa);
                                                console.log(bookList);
                                                for (const element of bookList) {
                                                    if (element.PATH.toLowerCase().includes(resolveTitle(TheBook.raw_title).toLowerCase().replaceAll('"', ''))) {
                                                        continueSeriesReading = element.PATH;
                                                        break;
                                                    }
                                                }
                                                localStorage.setItem("currentBook", continueSeriesReading);
                                                window.location.href = "/viewer";

                                            });

                                        }
                                    }
                                }><PlayArrow/></IconButton>
                            </Tooltip>
                            <Tooltip title={t('mkread')}>
                                <IconButton
                                    onClick={
                                        () => {
                                            if (type == "volume") {
                                                updateBookStatusForOne("read", TheBook.ID_book);
                                            } else {
                                                updateBookStatusForAll("read", TheBook.raw_title);
                                            }
                                            ToasterHandler(t("mkread"), "success");
                                        }
                                    }
                                ><Check/></IconButton>
                            </Tooltip>
                            <Tooltip title={t('mkreading')}>
                                <IconButton id="readingbtndetails"
                                            style={{display: type === "series" ? "none" : "block"}}
                                            onClick={
                                                () => {
                                                    if (type == "volume") {
                                                        updateBookStatusForOne("reading", TheBook.ID_book);
                                                    } else {
                                                        updateBookStatusForAll("reading", TheBook.raw_title);
                                                    }
                                                    ToasterHandler(t("mkreading"), "success");
                                                }
                                            }
                                > <AutoStories/></IconButton></Tooltip>
                            <Tooltip title={t('mkunread')}>
                                <IconButton id="decheckbtn"
                                            onClick={
                                                () => {
                                                    if (type == "volume") {
                                                        updateBookStatusForOne("unread", TheBook.ID_book);
                                                    } else {
                                                        updateBookStatusForAll("unread", TheBook.raw_title);
                                                    }
                                                    ToasterHandler(t("mkunread"), "success");
                                                }
                                            }
                                ><Close/></IconButton>
                            </Tooltip>
                            <Tooltip title={t('toogle_fav')}>
                                <IconButton id="favoritebtn"
                                            onClick={
                                                async () => {
                                                    if (type === "volume") {
                                                        if (TheBook.favorite === 1) {
                                                            TheBook.favorite = 0;
                                                            ToasterHandler(t("remove_fav"), "success");
                                                            await getFromDB("Books", "* FROM Books WHERE favorite=1").then(async (resa) => {
                                                                if (!resa) return;
                                                                const bookList = tryToParse(resa);
                                                                for (const element of bookList) {
                                                                    if (element.ID_book === TheBook.ID_book) {
                                                                        const options = {
                                                                            method: "POST", headers: {
                                                                                "Content-Type": "application/json"
                                                                            }, body: JSON.stringify({
                                                                                "token": currentProfile.getToken,
                                                                                "table": "Books",
                                                                                "column": "favorite",
                                                                                "whereEl": element.ID_book,
                                                                                "value": false,
                                                                                "where": "ID_book"
                                                                            }, null, 2)
                                                                        };
                                                                        await fetch(PDP + "/DB/update", options);
                                                                    }
                                                                }
                                                            });
                                                        } else {
                                                            TheBook.favorite = 1;
                                                            ToasterHandler(t("add_fav"), "success");
                                                            await getFromDB("Books", "* FROM Books WHERE favorite=0").then(async (resa) => {
                                                                if (!resa) return;
                                                                const bookList = tryToParse(resa);
                                                                for (const element of bookList) {
                                                                    if (element.ID_book === TheBook.ID_book) {
                                                                        const options = {
                                                                            method: "POST", headers: {
                                                                                "Content-Type": "application/json"
                                                                            }, body: JSON.stringify({
                                                                                "token": currentProfile.getToken,
                                                                                "table": "Books",
                                                                                "column": "favorite",
                                                                                "whereEl": element.ID_book,
                                                                                "value": true,
                                                                                "where": "ID_book"
                                                                            }, null, 2)
                                                                        };
                                                                        await fetch(PDP + "/DB/update", options);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    } else if (TheBook.favorite === 1) {
                                                        TheBook.favorite = 0;
                                                        ToasterHandler(t("remove_fav"), "success");
                                                        await getFromDB("Series", "* FROM Series WHERE favorite=1").then(async (resa) => {
                                                            if (!resa) return;
                                                            const bookList = tryToParse(resa);
                                                            for (const element of bookList) {
                                                                if (TheBook.raw_title === element.title) {
                                                                    const options = {
                                                                        method: "POST", headers: {
                                                                            "Content-Type": "application/json"
                                                                        }, body: JSON.stringify({
                                                                            "token": currentProfile.getToken,
                                                                            "table": "Series",
                                                                            "column": "favorite",
                                                                            "whereEl": element["ID_Series"],
                                                                            "value": false,
                                                                            "where": "ID_Series"
                                                                        }, null, 2)
                                                                    };
                                                                    await fetch(PDP + "/DB/update", options);
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        TheBook.favorite = 1;
                                                        ToasterHandler(t("add_fav"), "success");
                                                        await getFromDB("Series", "* FROM Series WHERE favorite=0").then(async (resa) => {
                                                            if (!resa) return;
                                                            const bookList = tryToParse(resa);
                                                            for (const element of bookList) {
                                                                console.log(TheBook.raw_title);
                                                                console.log(element.title);
                                                                if (TheBook.raw_title === element.title) {
                                                                    console.log("found");
                                                                    const options = {
                                                                        method: "POST", headers: {
                                                                            "Content-Type": "application/json"
                                                                        }, body: JSON.stringify({
                                                                            "token": currentProfile.getToken,
                                                                            "table": "Series",
                                                                            "column": "favorite",
                                                                            "whereEl": element["ID_Series"],
                                                                            "value": true,
                                                                            "where": "ID_Series"
                                                                        }, null, 2)
                                                                    };
                                                                    await fetch(PDP + "/DB/update", options);
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                > <Favorite/></IconButton>
                            </Tooltip>
                            <Tooltip title={t('EDIT')}>
                                <IconButton onClick={() => {
                                    setOpenDatabaseEditorDialog(true);
                                }} id="editmodalBtn"> <Edit/></IconButton>
                            </Tooltip>
                            <Tooltip title={t('downloadBook')}>

                                <IconButton id="DLBOOK" onClick={
                                    () => {
                                        // noinspection JSIgnoredPromiseFromCall
                                        downloadBook(TheBook.PATH);
                                    }
                                }> <Download/></IconButton>
                            </Tooltip>
                            <Tooltip title={t('refreshMetadata')}>
                                <IconButton id="refreshBtn"
                                            onClick={
                                                async () => {
                                                    if (type === "volume") {
                                                        if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL) {
                                                            ToasterHandler(t("providerCannotRematch"), "error");
                                                        } else if (TheBook.lock !== 1) {
                                                            await new API().refreshMeta(TheBook.ID_book, provider, "book");
                                                        } else {
                                                            ToasterHandler(t("bookLocked"), "error");
                                                        }
                                                    } else if (provider === providerEnum.MANUAL) {
                                                        ToasterHandler(t("providerCannotRematch"), "error");
                                                    } else if (TheBook.lock !== 1) {
                                                        await new API().refreshMeta(TheBook.ID_book, provider, "series");
                                                    } else {
                                                        ToasterHandler(t("seriesLocked"), "error");
                                                    }

                                                }
                                            }
                                > <Refresh/></IconButton>
                            </Tooltip>
                            <Tooltip title={t('rematch')}>
                                <IconButton id="rematchBtn"
                                            onClick={
                                                () => handleOpenRematchDialog()
                                            }
                                > <YoutubeSearchedFor/></IconButton>
                            </Tooltip>
                        </Grid2>
                            <div id="ratingContainer" className="rating">
                                <Rating name="no-value" value={rating} onChange={
                                    (_event, newValue) => {
                                        setRating(newValue);
                                        if (newValue === null) return;
                                        if (type === 'volume') {
                                            changeRating("Books", TheBook.ID_book, newValue);
                                        } else {
                                            changeRating('Series', TheBook.ID_book, newValue);
                                        }
                                    }
                                }/>
                            </div>
                        </Stack>
                        <div id="price" style={{marginTop: "15px"}}>{
                            ((TheBook.prices !== "null" && TheBook.prices !== "" && TheBook.prices != null) ?
                                ((provider === providerEnum.Marvel) ?
                                    t("prices") + ":" : "") : "")}
                            <br/>
                            {
                                ((TheBook.prices !== "null" && TheBook.prices !== "" && TheBook.prices != null) ?
                                    ((provider === providerEnum.Marvel) ?

                                        tryToParse(TheBook.prices).map((price: {
                                            type: string;
                                            price: string;
                                        }, index: number) => {
                                            return <p
                                                key={index}>{price.type.replace(/([A-Z])/g, ' $1').trim() + " : " + price.price + "$"}</p>;
                                        }) : "") : "")
                            }
                        </div>

                        <div id="description"
                             style={
                                 {
                                     marginBottom: "10px",
                                     marginTop: "10px"
                                 }
                             }
                        >

                            <div
                                dangerouslySetInnerHTML={{__html: (TheBook.description != null && TheBook.description !== "null") ? TheBook.description : ""}}
                                style={
                                    {
                                        textAlign: "justify",
                                    }
                                }
                            ></div>
                        </div>
                        {
                            type === 'series' ?
                                provider !== providerEnum.Marvel ?
                                    (TheBook.score != null && TheBook.score !== "null" && TheBook.score !== 0) ?
                                        <Box sx={{position: 'relative', display: 'inline-flex'}}>
                                            <CircularProgress variant="determinate"
                                                              value={parseInt(TheBook.score.toString())}/>
                                            <Box
                                                sx={{
                                                    top: 0,
                                                    left: 0,
                                                    bottom: 0,
                                                    right: 0,
                                                    position: 'absolute',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    component="div"
                                                    color="text.secondary"
                                                >{`${Math.round(TheBook.score as number)}`}</Typography>
                                            </Box>
                                        </Box> : <></> : <></> : <></>
                        }


                        <div id="genres">
                            {
                                (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) ? t("Genres") + ": " : ""
                            }
                            {
                                TheBook.genres !== undefined && TheBook.genres !== null ?
                                    tryToParse(TheBook.genres).map((el: any, index: number) => {
                                        return (index !== tryToParse(TheBook.genres).length - 1) ? el + " / " : el;
                                    }) : ""
                            }
                        </div>
                        <div id="chapters">
                            {
                                type === "volume" ? (TheBook.issueNumber === "null" || TheBook.issueNumber === "") ? "" : t("Numberofthisvolumewithintheseries") + TheBook.issueNumber : ((provider === providerEnum.Marvel) ? (t("NumberComics")) : (t("NumberChapter"))) + TheBook.issueNumber
                            }
                        </div>
                        <div id="id">
                            {type === "volume" ?
                                (TheBook.characters !== "null" && providerEnum.Marvel) ?
                                    t("thisisa") + " " + TheBook.format + " " + t("of") + " " + TheBook.pageCount + " " + t("pages") + ". " + t("Thisispartofthe") + " '" + tryToParse(TheBook.series).name + "' " + t("series") + "." : (provider === providerEnum.Anilist) ?
                                    t("Thisispartofthe") + " '" + TheBook.series.split("_")[2].replaceAll("$", " ") + "' " + t("series") + "." : (provider === providerEnum.Marvel) ?
                                        t("Thisispartofthe") + " '" + ((tryToParse(TheBook.series) !== null) ? tryToParse(TheBook.series).name : t("Unknown")) + "' " + t("series") + "." : (provider === providerEnum.MANUAL) ?
                                            t("Thisispartofthe") + " '" + TheBook.series + "' " + t("series") + "." : (provider === providerEnum.OL) ?
                                                t("Thisispartofthe") + " '" + TheBook.series + "' " + t("series") + "." : (provider === providerEnum.GBooks) ? t("this is a") + " " + TheBook.format + " " + t("of") + " " + TheBook.pageCount + " " + t("pages") + ". " + t("Thisispartofthe") + " '" + TheBook.series + "' " + t("series") + "." : "" : provider === providerEnum.Marvel ? t("ThisseriesIDfromMarvel") + ": " + parseInt(TheBook.ID_book) : ""
                            }
                        </div>
                        <div id="colissue">{
                            type === "volume" ?
                                TheBook.collectedIssues === 'null' ? "" : tryToParse(TheBook.collectedIssues).map((issue: {
                                    name: string;
                                }, index: number) => {
                                    return <p key={index}>{issue.name}</p>;
                                })
                                : ""
                        }</div>
                        <div id="col">
                            {
                                type === "volume" ?
                                    TheBook.collections === 'null' ? "" : tryToParse(TheBook.collections).map((col: {
                                        name: string;
                                    }, index: number) => {
                                        return <p key={index}>{col.name}</p>;
                                    })
                                    : ""
                            }
                        </div>
                        <div id="Volumes">
                            {
                                (provider === providerEnum.Marvel) ? ((TheBook.volumes != null && TheBook.volumes !== "null" && TheBook.volumes !== undefined) ? t("numberOfVolume") + ": " + tryToParse(TheBook.volumes).length : "") : ((TheBook.volumes != null && TheBook.volumes !== "null" && TheBook.volumes !== undefined) ? t("numberOfVolume") + ": " + TheBook.volumes : "")
                            }
                        </div>
                        <div id="Trending">
                            {
                                (TheBook.trending != null && TheBook.trending !== "null" && TheBook.trending !== undefined) ? t("trending") + ": " + TheBook.trending : ""
                            }
                        </div>
                        {
                            type == "volume" ? (
                                TheBook.characters !== "null" ?
                                    <div id="readstat"><input type="number" step="1" min="0" id="readAddInput" value={
                                        TheBook.last_page
                                    } max={
                                        TheBook.pageCount
                                    }
                                                              onBlur={
                                                                  async (e) => {
                                                                      const options = {
                                                                          method: "POST", headers: {
                                                                              "Content-Type": "application/json"
                                                                          }, body: JSON.stringify({
                                                                              "token": currentProfile.getToken,
                                                                              "table": "Books",
                                                                              "column": "last_page",
                                                                              "whereEl": TheBook.ID_book,
                                                                              "value": e.target.value,
                                                                              "where": "ID_book"
                                                                          }, null, 2)
                                                                      };
                                                                      await fetch(PDP + "/DB/update", options).catch((err) => {
                                                                          ToasterHandler(err, "error");
                                                                      });
                                                                  }
                                                              }
                                    />/ {TheBook.pageCount} {t('pagesRead')}</div> : "") : readStatSeries
                        }
                    </Box>
                    <Box
                        sx={
                            {
                                width: "80vw",
                            }
                        }
                    >
                        {
                            type === "series" && openExplorer.explorer.length > 0
                            && <div>
                                <h1>{t("volumes")}</h1>
                                <ContainerExplorer type="book" stateExplorer={openExplorer}
                                                   handleAddBreadcrumbs={handleAddBreadcrumbs}
                                                   handleOpenDetails={handleChangeToDetails}/>
                            </div>
                        }
                        {
                            ((provider === providerEnum.Marvel) ? (((TheBook["creators"] !== "null" && TheBook["creators"] !== null) ? (tryToParse(TheBook["creators"])["available"]) : 0)) : ((TheBook["creators"] !== "null" && TheBook["creators"] !== null) ? (tryToParse(TheBook["creators"]).length) : ("0"))) > 0 &&
                            <div>
                                <h1>{t("characters")}</h1>
                                {t("Numberofcharacters")}: {" "}
                                {
                                    type === "volume" ?
                                        ((provider === providerEnum.Marvel) ? ((TheBook.characters !== "null" && TheBook.characters !== null) ? tryToParse(TheBook.characters)["available"] : 0) : ((TheBook.characters !== "null" && TheBook.characters !== null) ? (tryToParse(TheBook.characters).length) : (0))) : ((provider === providerEnum.Marvel) ? ((TheBook.characters !== "null" && TheBook.characters !== null) ? tryToParse(TheBook.characters)["available"] : 0) : (tryToParse(TheBook.characters).length))
                                }
                                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                                    {
                                        characters.map((el: any, index: number) => {
                                            return <div key={index}
                                                        style={{
                                                            marginLeft: "20px",
                                                            textAlign: "center",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={
                                                            () => onClickHandleOpenMoreInfo(el)
                                                        }
                                            >
                                                {
                                                    (provider === providerEnum.Marvel) ? <Box>
                                                            <Avatar sx={{width: 120, height: 120}}
                                                                    alt={t('aCharacter')}
                                                                    src={tryToParse(el.image).path + "/detail." + tryToParse(el.image)["extension"]}/>
                                                            <Typography>{el.name}</Typography></Box> :
                                                        (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) ?
                                                            <Box sx={{textAlign: "center"}}>
                                                                <Avatar sx={{width: 120, height: 120}}
                                                                        alt={t('aCharacter')}
                                                                        src={el.image.replaceAll('"', '')}/><Typography
                                                                textAlign={"center"}>{el.name}</Typography></Box> : ""
                                                }
                                            </div>;


                                        })
                                    }
                                </ScrollMenu>
                            </div>
                        }
                        {
                            ((provider === providerEnum.Marvel) ? ((TheBook["creators"] !== "null" &&TheBook["creators"] !== null ) ? tryToParse(TheBook["creators"])["available"] : 0) : ((TheBook["creators"] !== "null" &&TheBook["creators"] !== null) ? (tryToParse(TheBook["creators"]).length) : ("0"))) > 0 &&
                            <div>
                                <h1>{t('Staff')}</h1>
                                {t("Numberofpeople")}: {" "}
                                {
                                    ((provider === providerEnum.Marvel) ? ((TheBook["creators"] !== "null"&&TheBook["creators"] !== null) ? tryToParse(TheBook["creators"])["available"] : 0) : ((TheBook["creators"] !== "null"&&TheBook["creators"] !== null) ? (tryToParse(TheBook["creators"]).length) : ("0")))

                                }
                                <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                                    {
                                        staff.map((el: any, index: number) => {
                                            return <div key={index}
                                                        style={{
                                                            marginLeft: "20px",
                                                            textAlign: "center",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={
                                                            () => onClickHandleOpenMoreInfo(el)
                                                        }
                                            >
                                                {
                                                    (provider === providerEnum.Marvel) ?
                                                        (el.name === tryToParse(TheBook.creators)["items"][index].name) ?
                                                            <><Avatar sx={{width: 120, height: 120}}
                                                                      src={tryToParse(el.image).path + "/detail." + tryToParse(el.image)["extension"]}></Avatar><span>{el.name}</span><br/><span>{tryToParse(TheBook.creators)["items"][index]["role"]}</span></> : ""
                                                        : (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) ?
                                                            (tryToParse(TheBook.creators)[index] !== undefined && el.name === tryToParse(TheBook.creators)[index].name) ?
                                                                <><Avatar sx={{width: 120, height: 120}}
                                                                          src={el.image.replaceAll('"', "")}></Avatar><br/><span>{el.name}</span></>
                                                                : <><Avatar sx={{width: 120, height: 120}}
                                                                            src={el.image.replaceAll('"', "")}></Avatar><br/><span>{el.name}</span></> : ""
                                                }
                                            </div>;
                                        })}
                                </ScrollMenu></div>
                        }

                        <div id="SiteURL"></div>
                        {
                            relations.length > 0 && <div>
                                <h1>  {
                                    ((provider === providerEnum.Marvel) ? (t("AFewComics")) : (t("Relations")))
                                }</h1>


                                <div className="cards-list2">

                                    {
                                        relations.map((el: any, index: number) => {
                                            return <Card key={index} type="lite" onClick={
                                                () => {
                                                    if (provider === providerEnum.Marvel) {
                                                        handleOpenMoreInfo(el.name, el.description, tryToParse(el.image).path + "/detail." + tryToParse(el.image)["extension"], tryToParse(el.url)[0].url, "cover");
                                                    } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                                                        handleOpenMoreInfo(el.name, el.description, el.image.replaceAll('"', ""), el.url, "cover");
                                                    }
                                                }
                                            }
                                                         book={new Book(el.ID_book, el.name, ((provider === providerEnum.Marvel) ? (tryToParse(el.image).path + "/detail." + tryToParse(el.image)["extension"]) : (el.image)), "null", null, null, null, 0, 0, 0, 0, 0, 0, null, "null", "null", null, 0, null, null, null, null, null, null, 0, provider.toString())}
                                                         provider={provider}
                                            />;
                                        })}
                                </div>

                            </div>
                        }

                        <div>
                            {
                                (TheBook.variants !== "null" && TheBook.variants !== "" && TheBook.variants != null) ? (provider === providerEnum.Marvel) ? t("variantsList") + ' : ' + tryToParse(TheBook.variants).map((variant: {
                                    name: string;
                                }) => {
                                    return variant.name;
                                }) : "" : ""
                            }
                        </div>
                        <div style={{textAlign: "center"}}><p
                            id="provider_text">{((provider === providerEnum.Marvel) ? (t("providedBy") + " Marvel. © 2014 Marvel") : ((provider === providerEnum.Anilist) ? (t("providedBy") + " Anilist.") : ((provider === providerEnum.MANUAL) ? (t("notFromAPI")) : ((provider === providerEnum.OL) ? (t("providedBy") + " OpenLibrary.") : ((provider === providerEnum.GBooks) ? (t("providedBy") + " Google Books.") : t("notFromAPI"))))))}</p>
                        </div>
                    </Box>
                </Stack>
            </Box>
        </div>
    </>);
}

export default ContentViewer;