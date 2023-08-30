import { PDP, currentProfile } from "@/utils/Common.ts";
import { AllForOne, changeRating, downloadBook, getFromDB } from "@/utils/Fetchers.ts";
import { IBook } from "@/interfaces/IBook.ts";
import { providerEnum } from "@/utils/utils.ts";
import { ArrowBack, ArrowForward, AutoStories, Check, Close, Done, Download, Edit, Favorite, OpenInNew, PlayArrow, QuestionMark, Refresh, YoutubeSearchedFor } from "@mui/icons-material";
import { Avatar, Box, Chip, CircularProgress, Container, IconButton, Paper, Stack, Tooltip, Typography, styled } from "@mui/material";
import Rating from "@mui/material/Rating/Rating";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "./Toaster.tsx";
import DatabaseEditorDialog from "./Dialogs/DatabaseEditorDialog.tsx";
import { API } from "@/API/API.ts";
import Card from "./Card.tsx";
import Book from "@/utils/Book.ts";
import MoreInfoDialog from "./Dialogs/MoreInfoDialog.tsx";
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';


//providerEnum to type
type TProvider = providerEnum.Marvel | providerEnum.Anilist | providerEnum.MANUAL | providerEnum.OL | providerEnum.GBooks;
function ContentViewer({ provider, TheBook, type, handleAddBreadcrumbs }: {
    provider: TProvider;
    TheBook: IBook;
    type: 'series' | 'volume';
    handleAddBreadcrumbs: any;
}) {
    const [rating, setRating] = useState<number | null>(type === "volume" ? (TheBook.note === null ? null : parseInt(TheBook.note)) : null);
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

    console.log("TheBook", TheBook);

    const fetchCharacters = async () => {
        if (type === "volume") {
            if (TheBook.characters !== "null") {
                const NameToFetchList: string[] = [];
                if (provider === providerEnum.Marvel) {
                    JSON.parse(TheBook.characters)["items"].forEach((el: any) => {
                        NameToFetchList.push("'" + el.name + "'");
                    });
                } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                    JSON.parse(TheBook.characters).forEach((el: any) => {
                        NameToFetchList.push("'" + el.name + "'");
                    });
                }
                const NameToFetch = NameToFetchList.join(",");
                await getFromDB("Characters", "* FROM Characters WHERE name IN (" + NameToFetch + ")").then((clres) => {
                    if (!clres) return;
                    const parsedClres = JSON.parse(clres);
                    setCharacters(parsedClres);
                });
            }
        } else {
            const NameToFetchList: string[] = [];
            if (provider === providerEnum.Marvel) {
                JSON.parse(TheBook.characters)["items"].forEach((el: any) => {
                    NameToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
                });
            } else if (provider === providerEnum.Anilist) {
                JSON.parse(TheBook.characters).forEach((el: any) => {
                    NameToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
                });
            } else if (provider === providerEnum.OL) {
                Toaster("OpenLibrary " + t("cannotFetchCharacters"), "error");
            } else if (provider === providerEnum.GBooks) {
                Toaster("Google Books " + t("cannotFetchCharacters"), "error");
            }
            const NameToFetch = NameToFetchList.join(",");
            await getFromDB("Characters", "* FROM Characters WHERE name IN (" + NameToFetch + ")").then((clres) => {
                if (!clres) return;
                const parsedClres = JSON.parse(clres);
                setCharacters(parsedClres);
            });
        }
    };

    const fetchCreators = async () => {
        if (TheBook.creators !== "null" && TheBook.creators !== null && TheBook.creators !== undefined && TheBook.creators !== "") {
            const StaffToFetchList: string[] = [];
            if (provider === providerEnum.Marvel) {
                JSON.parse(TheBook.creators)["items"].forEach((el) => {
                    StaffToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
                });
            } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL) {
                JSON.parse(TheBook.creators).forEach((el) => {
                    StaffToFetchList.push("'" + el.name.replaceAll("'", "''") + "'");
                });
            } else if (provider === providerEnum.GBooks) {
                JSON.parse(TheBook.creators).forEach((el) => {
                    StaffToFetchList.push("'" + el.replaceAll("'", "''") + "'");
                });
            }
            const StaffToFetch = StaffToFetchList.join(",");
            await getFromDB("Creators", "* FROM Creators WHERE name IN (" + StaffToFetch + ")").then((clres) => {
                if (!clres) return;
                const parsedClres = JSON.parse(clres);
                setStaff(parsedClres);
            });
        }
    };
    const fetchRelations = async () => {
        await getFromDB("relations", "* FROM relations WHERE series = '" + TheBook.ID_book + "'").then((clres) => {
            if (!clres) return;
            const parsedClres = JSON.parse(clres);
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
    const { t } = useTranslation();
    useEffect(() => {
        handleAddBreadcrumbs(TheBook.NOM, () => { });
    }, []);
    useLayoutEffect(() => {
        fetchCharacters();
        fetchCreators();
        fetchRelations();
        if (type == "series") {
            if (provider === providerEnum.Marvel) {
                // loadView(path, libraryPath, JSON.parse(res[0].start_date), provider);
            } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                // loadView(path, libraryPath, "", provider);
            }
        }
        const handleAsyncBG = async () => {
            let options;
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
            await fetch(PDP + "/img/getPalette/" + currentProfile.getToken, options).then(function (response) {
                return response.text();
            }).then(function (data) {
                const Blurcolors = data;
                setTimeout(function () {
                    document.getElementsByTagName("body")[0].style.backgroundColor = Blurcolors;
                }, 500);
            });

        };
        handleAsyncBG();
    }, [TheBook.URLCover]);
    function LeftArrow() {
        const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

        return (
            <IconButton disabled={isFirstItemVisible} onClick={() => scrollPrev()}><ArrowBack /></IconButton>
        );
    }

    function RightArrow() {
        const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

        return (
            <IconButton disabled={isLastItemVisible} onClick={() => scrollNext()}><ArrowForward /></IconButton>
        );
    }
    const [openDatabaseEditorDialog, setOpenDatabaseEditorDialog] = useState(false);

    const handleCloseDatabaseEditorDialog = () => {
        setOpenDatabaseEditorDialog(false);
    };
    return (<>
        <DatabaseEditorDialog openModal={openDatabaseEditorDialog} onClose={handleCloseDatabaseEditorDialog} TheBook={TheBook} type={'book'} />
        <MoreInfoDialog openModal={openMoreInfo} onClose={() => { closeMoreInfo(); }} desc={moreInfoContent.desc} name={moreInfoContent.name} hrefURL={moreInfoContent.href} image={moreInfoContent.image} type={moreInfoContent.type} />
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
            <img id="imageBGOV2" src="#" alt="#" style={{ width: "100vw", height: "auto", display: "none" }} />
            <Box sx={{
                width: "90vw",
            }}>

                <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                    <Box
                        sx={
                            {
                                width: "15vw",
                            }
                        }
                    >
                        <img src={
                            type === "series" ? TheBook.URLCover :
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
                                    <h1><a target='_blank' href={((TheBook.URLs === null || TheBook.URLs === "null") ? ("#") : (JSON.parse(TheBook.URLs)[0].url))} style={{ color: 'white' }}>{TheBook.NOM}<OpenInNew /></a></h1>
                                    : (provider === providerEnum.Anilist) ?
                                        <h1><a target='_blank' style={{ color: 'white' }}>{TheBook.NOM}</a></h1> :
                                        <h1><a target='_blank' style={{ color: 'white' }}>{TheBook.NOM}</a></h1>) :
                                (provider === providerEnum.Marvel) ?
                                    <h1><a target='_blank' href={((TheBook.URLs == "null") ? ("#") : (JSON.parse(TheBook.URLs)[0].url))} style={{ color: 'white' }}>{TheBook.NOM}<i style={{ fontSize: '18px', top: '-10px', position: 'relative' }} className='material-icons'>open_in_new</i></a></h1> :
                                    (provider === providerEnum.Anilist) ?
                                        <h1><a target='_blank' href={(TheBook.URLs == "null") ? ("#") : (TheBook.URLs)} style={{ color: 'white' }}>{TheBook.NOM}<OpenInNew /></a></h1> :
                                        <h1><a target='_blank' style={{ color: 'white' }}>{TheBook.NOM}<OpenInNew /></a></h1>
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
                                        TheBook.read === 1 ?
                                            <Chip color="info" sx={
                                                { marginRight: "5px" }
                                            } label={
                                                t('READ')
                                            } icon={<Done />} />
                                            : TheBook.unread === 1 ?
                                                <Chip color="error" sx={
                                                    { marginRight: "5px" }
                                                } label={
                                                    t('UNREAD')
                                                } icon={<Close />} />
                                                : TheBook.reading === 1 ?
                                                    <Chip color="warning" sx={
                                                        { marginRight: "5px" }
                                                    } label={
                                                        t('READING')
                                                    } icon={<AutoStories />} />
                                                    : ""
                                        : (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks ? TheBook.statut === "FINISHED" ?
                                            <Chip color="info" sx={
                                                { marginRight: "5px" }
                                            } label={
                                                t('FINISHED')
                                            } icon={<Done />} />
                                            : TheBook.statut === "RELEASING" ?
                                                <Chip color="warning" sx={
                                                    { marginRight: "5px" }
                                                } label={
                                                    t('RELEASING')
                                                } icon={<AutoStories />} />
                                                : TheBook.statut === "NOT_YET_RELEASED" ?
                                                    <Chip color="error" sx={
                                                        { marginRight: "5px" }
                                                    } label={
                                                        t('NOT_YET_RELEASED')
                                                    } icon={<Close />} />
                                                    : <Chip color="error" sx={
                                                        { marginRight: "5px" }
                                                    } label={
                                                        t('UNKNOWN')
                                                    } icon={<QuestionMark />} /> : provider === providerEnum.Marvel ?
                                            JSON.parse(TheBook.end_date) > new Date().getFullYear() ?
                                                <Chip color="warning" sx={
                                                    { marginRight: "5px" }
                                                } label={
                                                    t('RELEASING')
                                                } icon={<AutoStories />} /> : JSON.parse(TheBook.end_date) < new Date().getFullYear() ?
                                                    <Chip color="info" sx={
                                                        { marginRight: "5px" }
                                                    } label={
                                                        t('FINISHED')
                                                    } icon={<Done />} /> : JSON.parse(TheBook.start_date) > new Date().getFullYear() ?
                                                        <Chip color="error" sx={
                                                            { marginRight: "5px" }
                                                        } label={
                                                            t('NOT_YET_RELEASED')
                                                        } icon={<Close />} /> : JSON.parse(TheBook.start_date) === new Date().getFullYear() ?
                                                            <Chip color="warning" sx={
                                                                { marginRight: "5px" }
                                                            } label={
                                                                t('ENDSOON')
                                                            } icon={<AutoStories />} /> :
                                                            <Chip color="error" sx={
                                                                { marginRight: "5px" }
                                                            } label={
                                                                t('UNKNOWN')
                                                            } icon={<QuestionMark />
                                                            } /> : <></>
                                        )


                                }
                                {
                                    TheBook.favorite === 1 ?
                                        <Chip color="error" label={
                                            t('favoriteParenthesis')
                                        } icon={<Favorite />} />
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
                                    (TheBook.dates !== "null" ? t("dates") + JSON.parse(TheBook.dates).map((date: { type: string; date: string; }, index: number) => {
                                        return <p key={index}>{date.type.replace(/([A-Z])/g, ' $1').trim() + " : " + date.date}</p>;
                                    }) : "?") : ""
                            }
                            {
                                type === "series" ? (!APINOTFOUND) ? ((provider === providerEnum.Marvel) ? (JSON.parse(TheBook.start_date)) + " -" : (JSON.parse(TheBook.start_date).year)) == null ? "? -" : ((provider === providerEnum.Marvel) ? (JSON.parse(TheBook.start_date)) + " -" : (JSON.parse(TheBook.start_date).year)) + " -" : "" : ""
                            }
                            {
                                type === "series" ? (APINOTFOUND) ?
                                    (JSON.parse(TheBook.start_date) == null) ? "? -" : JSON.parse(TheBook.start_date) + " -" : "" : ""
                            }
                            {
                                type === "series" ? (!APINOTFOUND) ? ((provider === providerEnum.Marvel) ? " " + (JSON.parse(TheBook.end_date)) : (JSON.parse(TheBook.end_date).year)) == null || JSON.parse(TheBook.end_date) > new Date().getFullYear() ? " ?" : ((provider === providerEnum.Marvel) ? " " + (JSON.parse(TheBook.end_date)) : " " + (JSON.parse(TheBook.end_date).year)) : " ?" : ""
                            }
                            {
                                type === "series" ? (APINOTFOUND) ?
                                    (JSON.parse(TheBook.end_date) == null || JSON.parse(TheBook.end_date) > new Date().getFullYear()) ? " ?" : " " + JSON.parse(TheBook.end_date) : "" : ""
                            }
                        </div>
                        <Stack spacing={3}>                        <Grid2 container spacing={2} id='btnsActions'>
                            <Tooltip title={t('PLAY')}>

                                <IconButton id="playbutton" onClick={
                                    async () => {
                                        if (type == "volume") {
                                            AllForOne("unread", "read", "reading", TheBook.ID_book);
                                            const encoded = encodeURIComponent(TheBook.PATH.replaceAll("/", "%C3%B9"));
                                            window.location.href = "viewer.html?" + encoded;
                                        } else {
                                            await getFromDB("Books", "PATH FROM Books WHERE unread=1 OR reading=1").then(async (resa) => {
                                                if (!resa) return;
                                                let continueSeriesReading;
                                                const bookList = JSON.parse(resa);
                                                for (let i = 0; i < bookList.length; i++) {
                                                    if (bookList[i].PATH.toLowerCase().includes(TheBook.NOM.toLowerCase().replaceAll('"', ''))) {
                                                        continueSeriesReading = bookList[i].PATH;
                                                        break;
                                                    }
                                                }
                                                const encoded = encodeURIComponent(continueSeriesReading.replaceAll("/", "%C3%B9"));
                                                window.location.href = "viewer.html?" + encoded;
                                            });

                                        }
                                    }
                                }><PlayArrow /></IconButton>
                            </Tooltip>
                            <Tooltip title={t('mkread')}>
                                <IconButton
                                    onClick={
                                        () => {
                                            AllForOne("unread", "reading", "read", TheBook.ID_book);
                                            Toaster(t("mkread"), "success");
                                        }
                                    }
                                ><Check /></IconButton>
                            </Tooltip>
                            <Tooltip title={t('mkreading')}>
                                <IconButton id="readingbtndetails" style={{ display: type === "series" ? "none" : "block" }}
                                    onClick={
                                        () => {
                                            AllForOne("unread", "read", "reading", TheBook.ID_book);
                                            Toaster(t("mkreading"), "success");
                                        }
                                    }
                                > <AutoStories /></IconButton></Tooltip>
                            <Tooltip title={t('mkunread')}>
                                <IconButton id="decheckbtn"
                                    onClick={
                                        () => {
                                            AllForOne("read", "reading", "unread", TheBook.ID_book);
                                            Toaster(t("mkunread"), "success");
                                        }
                                    }
                                ><Close /></IconButton>
                            </Tooltip>
                            <Tooltip title={t('toogle_fav')}>
                                <IconButton id="favoritebtn"
                                    onClick={
                                        async () => {
                                            if (TheBook.favorite === 1) {
                                                TheBook.favorite = 0;
                                                Toaster(t("remove_fav"), "success");
                                                await getFromDB("Books", "* FROM Books WHERE favorite=1").then(async (resa) => {
                                                    if (!resa) return;
                                                    const bookList = JSON.parse(resa);
                                                    for (let i = 0; i < bookList.length; i++) {
                                                        if (bookList[i].PATH.toLowerCase().includes(TheBook.NOM.toLowerCase().replaceAll('"', ''))) {
                                                            const options = {
                                                                method: "POST", headers: {
                                                                    "Content-Type": "application/json"
                                                                }, body: JSON.stringify({
                                                                    "token": currentProfile.getToken,
                                                                    "table": "Books",
                                                                    "column": "favorite",
                                                                    "whereEl": bookList[i].PATH,
                                                                    "value": false,
                                                                    "where": "PATH"
                                                                }, null, 2)
                                                            };
                                                            await fetch(PDP + "/DB/update", options);
                                                        }
                                                    }
                                                });
                                            } else {
                                                TheBook.favorite = 1;
                                                Toaster(t("add_fav"), "success");
                                                await getFromDB("Books", "* FROM Books WHERE favorite=0").then(async (resa) => {
                                                    if (!resa) return;
                                                    const bookList = JSON.parse(resa);
                                                    for (let i = 0; i < bookList.length; i++) {
                                                        if (bookList[i].PATH.toLowerCase().includes(TheBook.NOM.toLowerCase().replaceAll('"', ''))) {
                                                            const options = {
                                                                method: "POST", headers: {
                                                                    "Content-Type": "application/json"
                                                                }, body: JSON.stringify({
                                                                    "token": currentProfile.getToken,
                                                                    "table": "Books",
                                                                    "column": "favorite",
                                                                    "whereEl": bookList[i].PATH,
                                                                    "value": true,
                                                                    "where": "PATH"
                                                                }, null, 2)
                                                            };
                                                            await fetch(PDP + "/DB/update", options);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                > <Favorite /></IconButton>
                            </Tooltip>
                            <Tooltip title={t('EDIT')}>
                                <IconButton onClick={() => { setOpenDatabaseEditorDialog(true); }} id="editmodalBtn"> <Edit /></IconButton>
                            </Tooltip>
                            <Tooltip title={t('downloadBook')}>

                                <IconButton id="DLBOOK" onClick={
                                    () => {
                                        downloadBook(TheBook.PATH);
                                    }
                                }> <Download /></IconButton>
                            </Tooltip>
                            <Tooltip title={t('refreshMetadata')}>
                                <IconButton id="refreshBtn"
                                    onClick={
                                        async () => {
                                            if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL) {
                                                Toaster(t("providerCannotRematch"), "error");
                                            } else {
                                                if (TheBook.lock !== 1) {
                                                    await new API().refreshMeta(TheBook.ID_book, provider, type === "series" ? "series" : "book");
                                                } else {
                                                    Toaster(type === "series" ? t("seriesLocked") : t("bookLocked"), "error");
                                                }
                                            }
                                        }
                                    }
                                > <Refresh /></IconButton>
                            </Tooltip>
                            <Tooltip title={t('rematch')}>
                                <IconButton id="rematchBtn"> <YoutubeSearchedFor /></IconButton>
                            </Tooltip>
                        </Grid2>
                            <div id="ratingContainer" className="rating">
                                <Rating name="no-value" value={rating} onChange={
                                    (event, newValue) => {
                                        setRating(newValue);
                                        if (newValue === null) return;
                                        if (type === 'volume') {
                                            changeRating("Books", TheBook.ID_book, newValue);
                                        } else {
                                            changeRating('Series', TheBook.ID_book, newValue);
                                        }
                                    }
                                } />
                            </div>
                        </Stack>
                        <div id="price">{TheBook.prices === 'null' ? "" : TheBook.prices}{
                            ((TheBook.prices !== "null" && TheBook.prices !== "" && TheBook.prices != null) ?
                                ((provider === providerEnum.Marvel) ?
                                    t("prices") : "") : "")}
                            <br />
                            {
                                ((TheBook.prices !== "null" && TheBook.prices !== "" && TheBook.prices != null) ?
                                    ((provider === providerEnum.Marvel) ?

                                        JSON.parse(TheBook.prices).map((price: { type: string; price: string; }, index: number) => {
                                            return <p key={index}>{price.type.replace(/([A-Z])/g, ' $1').trim() + " : " + price.price}</p>;
                                        }) : "") : "")
                            }
                        </div>

                        <div id="description"
                            style={
                                {
                                    marginBottom: "10px",
                                }
                            }
                        >

                            <div dangerouslySetInnerHTML={{ __html: (TheBook.description != null && TheBook.description !== "null") ? TheBook.description : "" }}
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
                                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                            <CircularProgress variant="determinate" value={TheBook.score} />
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
                                                >{`${Math.round(TheBook.score)}`}</Typography>
                                            </Box>
                                        </Box> : <></> : <></> : <></>
                        }


                        <div id="genres">
                            {
                                (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) ? t("Genres") + ": " : ""
                            }
                            {
                                TheBook.genres !== undefined ?
                                    JSON.parse(TheBook.genres).map((el: any, index: number) => {
                                        return (index !== JSON.parse(TheBook.genres).length - 1) ? el + " / " : el;
                                    }) : ""
                            }
                        </div>
                        <div id="chapters">
                            {
                                type === "volume" ? TheBook.issueNumber === (null || "null" || "") ? "" : t("Numberofthisvolumewithintheseries") + ": " + TheBook.issueNumber : ((provider === providerEnum.Marvel) ? (t("NumberComics")) : (t("NumberChapter"))) + ": " + TheBook.issueNumber
                            }
                        </div>
                        <div id="id">
                            {type === "volume" ?
                                (TheBook.characters !== "null" && providerEnum.Marvel) ?
                                    t("thisisa") + TheBook.format + " " + t("of") + " " + TheBook.pageCount + " " + t("pages") + t("Thisispartofthe") + " '" + JSON.parse(TheBook.series).name + "' " + t("series") : (provider === providerEnum.Anilist) ?
                                        t("Thisispartofthe") + " '" + TheBook.series.split("_")[2].replaceAll("$", " ") + "' " + t("series") : (provider === providerEnum.Marvel) ?
                                            t("Thisispartofthe") + " '" + JSON.parse(TheBook.series).name + "' " + t("series") : (provider === providerEnum.MANUAL) ?
                                                t("Thisispartofthe") + " '" + TheBook.series + "' " + t("series") : (provider === providerEnum.OL) ?
                                                    t("Thisispartofthe") + " '" + TheBook.series + "' " + t("series") : (provider === providerEnum.GBooks) ? t("this is a") + TheBook.format + " " + t("of") + " " + TheBook.pageCount + " " + t("pages") + t("Thisispartofthe") + " '" + TheBook.series + "' " + t("series") : "" : provider === providerEnum.Marvel ? t("ThisseriesIDfromMarvel") + parseInt(TheBook.ID_book) : ""
                            }
                        </div>
                        <div id="colissue">{
                            type === "volume" ?
                                TheBook.collectedIssues === 'null' ? "" : JSON.parse(TheBook.collectedIssues).map((issue: { name: string; }, index: number) => {
                                    return <p key={index}>{issue.name}</p>;
                                })
                                : ""
                        }</div>
                        <div id="col">
                            {
                                type === "volume" ?
                                    TheBook.collections === 'null' ? "" : JSON.parse(TheBook.collections).map((col: { name: string; }, index: number) => {
                                        return <p key={index}>{col.name}</p>;
                                    })
                                    : ""
                            }
                        </div>
                        <div id="Volumes">
                            {
                                (TheBook.volumes != null && TheBook.volumes !== "null" && TheBook.volumes !== undefined) ? t("numberOfVolume") + ": " + TheBook.volumes : ""
                            }
                        </div>
                        <div id="Trending">
                            {
                                (TheBook.trending != null && TheBook.trending !== "null" && TheBook.trending !== undefined) ? t("trending") + ": " + TheBook.trending : ""
                            }
                        </div>
                        {
                            type == "volume" ? (
                                TheBook.characters !== "null" ? <div id="readstat"><input type="number" step="1" min="0" id="readAddInput" value={
                                    TheBook.pageCount
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
                                                Toaster(err, "error");
                                            });
                                        }
                                    }
                                />/ {TheBook.pageCount} {t('pagesRead')}</div> : "") : ""
                        }
                    </Box>
                    <Box
                        sx={
                            {
                                width: "80vw",
                            }
                        }
                    >
                        <div>
                            <h1>{t("volumes")}</h1>
                        </div>
                        <div>
                            <h1>{t("characters")}</h1>
                            {t("Numberofcharacters")}
                            {
                                type === "volume" ?
                                    ((provider === providerEnum.Marvel) ? (JSON.parse(TheBook.characters)["available"]) : ((TheBook.characters !== "null") ? (JSON.parse(TheBook.characters).length) : (0))) : ((provider === providerEnum.Marvel) ? (JSON.parse(TheBook.characters)["available"]) : (JSON.parse(TheBook.characters).length))
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
                                                () => {
                                                    if (provider === providerEnum.Marvel) {
                                                        handleOpenMoreInfo(el.name, el.description, JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension, JSON.parse(el.url)[0].url);
                                                    } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                                                        handleOpenMoreInfo(el.name, el.description, el.image.replaceAll('"', ""), el.url);
                                                    }
                                                }
                                            }
                                        >
                                            {
                                                (provider === providerEnum.Marvel) ? <Box>
                                                    <Avatar sx={{ width: 120, height: 120 }}
                                                        alt='a character' src={JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension} />
                                                    <Typography>{el.name}</Typography></Box> :
                                                    (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) ? <Box sx={{ textAlign: "center" }}>
                                                        <Avatar sx={{ width: 120, height: 120 }}
                                                            alt='a character' src={el.image.replaceAll('"', '')} /><Typography textAlign={"center"}>{el.name}</Typography></Box> : ""
                                            }
                                        </div>;
                                    })
                                }
                            </ScrollMenu>
                        </div>
                        <div>
                            <h1>{t('Staff')}</h1>
                            {t("Numberofpeople")}
                            {
                                ((provider === providerEnum.Marvel) ? (JSON.parse(TheBook["creators"])["available"]) : ((TheBook["creators"] !== "null") ? (JSON.parse(TheBook["creators"]).length) : ("0")))
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
                                                () => {
                                                    if (provider === providerEnum.Marvel) {
                                                        handleOpenMoreInfo(el.name, el.description, JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension, JSON.parse(el.url)[0].url);
                                                    } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                                                        handleOpenMoreInfo(el.name, el.description, el.image.replaceAll('"', ""), el.url);
                                                    }
                                                }
                                            }
                                        >
                                            {
                                                (provider === providerEnum.Marvel) ?
                                                    (el.name === JSON.parse(TheBook.creators)["items"][index].name) ?
                                                        <><Avatar src={JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension}></Avatar><span>{el.name}</span><br /><span style={{ fontSize: "14px", color: "#a8a8a8a8" }}>{JSON.parse(TheBook.creators)["items"][index]["role"]}</span></> : ""
                                                    : (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) ?
                                                        (el.name === JSON.parse(TheBook.creators)[index].name) ?
                                                            <><Avatar sx={{ width: 120, height: 120 }} src={el.image.replaceAll('"', "")}></Avatar><br /><span>{el.name}</span></>
                                                            : <><Avatar sx={{ width: 120, height: 120 }} src={el.image.replaceAll('"', "")}></Avatar><br /><span>{el.name}</span></> : ""
                                            }
                                        </div>;
                                    })}
                            </ScrollMenu>
                        </div>
                        <div id="SiteURL"></div>
                        <div>
                            <h1>  {
                                ((provider === providerEnum.Marvel) ? (t("AFewComics")) : (t("Relations")))
                            }</h1>


                            <div className="cards-list2">

                                {
                                    relations.map((el: any, index: number) => {
                                        return <Card key={index} onClick={
                                            () => {
                                                if (provider === providerEnum.Marvel) {
                                                    handleOpenMoreInfo(el.name, el.description, JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension, JSON.parse(el.url)[0].url, "cover");
                                                } else if (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                                                    handleOpenMoreInfo(el.name, el.description, el.image.replaceAll('"', ""), el.url, "cover");
                                                }
                                            }
                                        }
                                            book={new Book(el.ID_book, el.name, ((provider === providerEnum.Marvel) ? (JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension) : (el.image)), "null", null, null, null, 0, 0, 0, 0, 0, 0, null, "null", "null", null, 0, null, null, null, null, null, null, 0, provider)}
                                            provider={provider}
                                        />;
                                    })}
                            </div>

                        </div>
                        <div>
                            {
                                (TheBook.variants !== "null" && TheBook.variants !== "" && TheBook.variants != null) ? (provider === providerEnum.Marvel) ? t("variantsList") + ' : ' + JSON.parse(TheBook.variants).map((variant: { name: string; }, index: number) => {
                                    return <p key={index}>{variant.name}</p>;
                                }) : "" : ""
                            }
                        </div>
                        <div style={{ textAlign: "center" }}><p id="provider_text">{((provider === providerEnum.Marvel) ? (t("providedBy") + " Marvel. © 2014 Marvel") : ((provider === providerEnum.Anilist) ? (t("providedBy") + " Anilist.") : ((provider === providerEnum.MANUAL) ? (t("notFromAPI")) : ((provider === providerEnum.OL) ? (t("providedBy") + " OpenLibrary.") : ((provider === providerEnum.GBooks) ? (t("providedBy") + " Google Books.") : "")))))}</p></div>
                    </Box>
                </Stack>
            </Box>
        </div>
    </>);
}

export default ContentViewer;