import { PDP, currentProfile } from "@/utils/Common.ts";
import { AllForOne, changeRating, downloadBook, getFromDB } from "@/utils/Fetchers.ts";
import { IBook } from "@/interfaces/IBook.ts";
import { providerEnum } from "@/utils/utils.ts";
import { AutoStories, Check, Close, Done, Download, Edit, Favorite, PlayArrow, Refresh, YoutubeSearchedFor } from "@mui/icons-material";
import { Chip, IconButton, Stack, Tooltip } from "@mui/material";
import Rating from "@mui/material/Rating/Rating";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "./Toaster.tsx";
import DatabaseEditorDialog from "./Dialogs/DatabaseEditorDialog.tsx";
import { API } from "@/API/API.ts";
//providerEnum to type
type TProvider = providerEnum.Marvel | providerEnum.Anilist | providerEnum.MANUAL | providerEnum.OL | providerEnum.GBooks;
function ContentViewer({ provider, TheBook, type, handleAddBreadcrumbs }: {
    provider: TProvider;
    TheBook: IBook;
    type: 'series' | 'volume';
    handleAddBreadcrumbs: any;
}) {
    const [rating, setRating] = useState<number | null>(TheBook.note === null ? null : parseInt(TheBook.note));
    const [characters, setCharacters] = useState<any[]>([]);
    const handleOpenMoreInfo = (name: string, desc: string, image: string, href: string) => {
    };
    const fetchCharacters = async () => {
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
    };
    const { t } = useTranslation();
    useEffect(() => {
        handleAddBreadcrumbs(TheBook.NOM, () => { });
    }, []);
    useLayoutEffect(() => {
        fetchCharacters();
        const handleAsyncBG = async () => {
            if (TheBook.URLCover != null && TheBook.URLCover !== "null") {
                console.log("TheBook.URLCover", TheBook.URLCover);
                const options = {
                    method: "GET", headers: {
                        "Content-Type": "application/json", "img": TheBook.URLCover
                    }
                };
                await fetch(PDP + "/img/getPalette/" + currentProfile.getToken, options).then(function (response) {
                    return response.text();
                }).then(function (data) {
                    const Blurcolors = data;
                    setTimeout(function () {
                        document.documentElement.style.setProperty("--background", Blurcolors.toString());
                    }, 500);
                });
            }
        };
        handleAsyncBG();
    }, [TheBook.URLCover]);
    console.log("TheBook", TheBook);

    const [openDatabaseEditorDialog, setOpenDatabaseEditorDialog] = useState(false);

    const handleCloseDatabaseEditorDialog = () => {
        setOpenDatabaseEditorDialog(false);
    };
    return (<>
        <DatabaseEditorDialog openModal={openDatabaseEditorDialog} onClose={handleCloseDatabaseEditorDialog} TheBook={TheBook} type={'book'} />
        <div className="contentViewer contentFade" id="contentViewer">
            <img id="imageBGOV2" src="#" alt="#" style={{ width: "100vw", height: "auto" }} />
            <div className="onContentViewer">
                <div id="ColCover">
                    <img src={
                        TheBook.URLCover.includes("public/FirstImagesOfAll") ? TheBook.URLCover.split("public/")[1] : TheBook.URLCover
                    } id="ImgColCover" alt="#" />
                </div>
                <div id="ColTitle">{
                    (provider === providerEnum.Marvel) ?
                        <a target='_blank' href={((TheBook.URLs == null) ? ("#") : (JSON.parse(TheBook.URLs)[0].url))} style={{ color: 'white' }}>{TheBook.NOM}<i style={{ fontSize: '18px', top: '-10px', position: 'relative' }} className='material-icons'>open_in_new</i></a>
                        : (provider === providerEnum.Anilist) ?
                            <a target='_blank' style={{ color: 'white' }}>{TheBook.NOM}</a> :
                            <a target='_blank' style={{ color: 'white' }}>{TheBook.NOM}</a>
                }</div>
                <div id="ColContent">
                    <Grid2 container sx={
                        { display: "flex", justifyContent: "center" }
                    } spacing={2}>
                        <Grid2>
                            {
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
                    <div id="startDate">
                        {
                            TheBook.dates !== "null" ? t("dates") + JSON.parse(TheBook.dates).map((date: { type: string; date: string; }, index: number) => {
                                return <p key={index}>{date.type.replace(/([A-Z])/g, ' $1').trim() + " : " + date.date}</p>;
                            }) : ""
                        }
                    </div>
                    <Stack spacing={5}>                        <Grid2 container spacing={2} id='btnsActions'>
                        <Tooltip title={t('PLAY')}>

                            <IconButton id="playbutton" onClick={
                                () => {
                                    AllForOne("unread", "read", "reading", TheBook.ID_book);
                                    const encoded = encodeURIComponent(TheBook.PATH.replaceAll("/", "%C3%B9"));
                                    window.location.href = "viewer.html?" + encoded;
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
                            <IconButton id="readingbtndetails"
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
                                                await new API().refreshMeta(TheBook.ID_book, provider, "book");
                                            } else {
                                                Toaster(t("bookLocked"), "error");
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
                                        // changeRating('Series', newValue);
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

                    <div id="description">
                        {
                            (TheBook.description != null && TheBook.description !== "null") ? TheBook.description : ""
                        }
                    </div>
                    {
                        type === 'series' ? <div id="averageProgress">

                            <div className="circle-small">
                                <div className="text">
                                    <div id="averageScore"></div>
                                </div>
                                <svg>
                                    <circle className="bg" cx="40" cy="40" r="37"></circle>
                                    <circle className="progress one" cx="40" cy="40" r="37"></circle>
                                </svg>
                            </div>

                        </div> : <></>
                    }


                    <div id="genres"></div>
                    <div id="chapters">
                        {
                            TheBook.issueNumber === (null || "null" || "") ? "" : t("Numberofthisvolumewithintheseries") + TheBook.issueNumber
                        }
                    </div>
                    <div id="id">
                        {
                            (TheBook.characters !== "null" && providerEnum.Marvel) ?
                                t("thisisa") + TheBook.format + " " + t("of") + " " + TheBook.pageCount + " " + t("pages") + t("Thisispartofthe") + " '" + JSON.parse(TheBook.series).name + "' " + t("series") : (provider === providerEnum.Anilist) ?
                                    t("Thisispartofthe") + " '" + TheBook.series.split("_")[2].replaceAll("$", " ") + "' " + t("series") : (provider === providerEnum.Marvel) ?
                                        t("Thisispartofthe") + " '" + JSON.parse(TheBook.series).name + "' " + t("series") : (provider === providerEnum.MANUAL) ?
                                            t("Thisispartofthe") + " '" + TheBook.series + "' " + t("series") : (provider === providerEnum.OL) ?
                                                t("Thisispartofthe") + " '" + TheBook.series + "' " + t("series") : (provider === providerEnum.GBooks) ? t("this is a") + TheBook.format + " " + t("of") + " " + TheBook.pageCount + " " + t("pages") + t("Thisispartofthe") + " '" + TheBook.series + "' " + t("series") : ""
                        }
                    </div>
                    <div id="colissue">{
                        TheBook.collectedIssues === 'null' ? "" : JSON.parse(TheBook.collectedIssues).map((issue: { name: string; }, index: number) => {
                            return <p key={index}>{issue.name}</p>;
                        })
                    }</div>
                    <div id="col">
                        {
                            TheBook.collections === 'null' ? "" : JSON.parse(TheBook.collections).map((col: { name: string; }, index: number) => {
                                return <p key={index}>{col.name}</p>;
                            })
                        }
                    </div>
                    <div id="Volumes"></div>
                    <div id="Trending"></div>
                    {
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
                        />/ {TheBook.pageCount} {t('pagesRead')}</div> : ""
                    }

                    <div id="detailSeparator" style={{ marginTop: "30vh" }}></div>
                    <div id="ContentView">
                        <h2 id="volumesLabel">Volumes : </h2>
                    </div>
                    <div id="characters">
                        <h1>{t("characters")}</h1>
                        {t("Numberofcharacters")}
                        {((provider === providerEnum.Marvel) ? (JSON.parse(TheBook.characters)["available"]) : ((TheBook.characters !== "null") ? (JSON.parse(TheBook.characters).length) : (0)))
                        }
                        {
                            <div className="item-list">
                                <div>

                                    {
                                        characters.map((el: any) => {
                                            return <div id="characters_div2"
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
                                                    (provider === providerEnum.Marvel) ? <>
                                                        <img alt='a character' src={JSON.parse(el.image).path + "/detail." + JSON.parse(el.image).extension} className='img-charac' /><br /><span>{el.name}</span></> :
                                                        (provider === providerEnum.Anilist || provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) ? <>
                                                            <img alt='a character' src={el.image.replaceAll('"', '')} className='img-charac' /><br /><span>{el.name}</span></> : ""
                                                }
                                            </div>;
                                        })
                                    }

                                </div>
                            </div>
                        }
                    </div>
                    <div id="Staff"></div>
                    <div id="SiteURL"></div>
                    <div id="OtherTitles"></div>
                    <div id="relations" className="relationsDiv">
                        {
                            (TheBook.variants !== "null" && TheBook.variants !== "" && TheBook.variants != null) ? (provider === providerEnum.Marvel) ? t("variantsList") + ' : ' + JSON.parse(TheBook.variants).map((variant: { name: string; }, index: number) => {
                                return <p key={index}>{variant.name}</p>;
                            }) : "" : ""
                        }
                    </div>
                    <div style={{ textAlign: "center" }}><p id="provider_text">{((provider === providerEnum.Marvel) ? (t("providedBy") + " Marvel. © 2014 Marvel") : ((provider === providerEnum.Anilist) ? (t("providedBy") + " Anilist.") : ((provider === providerEnum.MANUAL) ? (t("notFromAPI")) : ((provider === providerEnum.OL) ? (t("providedBy") + " OpenLibrary.") : ((provider === providerEnum.GBooks) ? (t("providedBy") + " Google Books.") : "")))))}</p></div>
                </div>

            </div>
        </div >
    </>);
};

export default ContentViewer;