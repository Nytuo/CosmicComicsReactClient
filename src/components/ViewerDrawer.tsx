import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AlignHorizontalCenter, ArrowBack, Bookmark, BookmarkBorder, FirstPage, Fullscreen, FullscreenExit, LastPage, MenuBook, NavigateBefore, NavigateNext, Pageview, RotateLeft, RotateRight, VerticalAlignCenter, ZoomIn, ZoomOut } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MovableImage from './MovableImage.tsx';
import { Toaster } from './Toaster.tsx';
import { PDP, getCookie } from '@/utils/Common.ts';
import { ModifyDB, getFromDB } from '@/utils/Fetchers.ts';
import Logger from '@/logger.ts';
import { useEffectOnce } from '@/utils/UseEffectOnce.tsx';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [imageOne, setImageOne] = React.useState<string | null>(null);
    const [imageTwo, setImageTwo] = React.useState<string | null>(null);
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [bookLoaded, setBookLoaded] = React.useState(false);
    const CosmicComicsTemp = localStorage.getItem("CosmicComicsTemp") || "";
    let CosmicComicsTempI = localStorage.getItem("CosmicComicsTempI") || "";
    const CosmicComicsData = localStorage.getItem("CosmicComicsData") || "";
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [rotation, setRotation] = React.useState(0);
    const [zoomLevel, setZoomLevel] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const connected = getCookie("selectedProfile", document);

    const { t } = useTranslation();

    let isADirectory: boolean = false;
    fetch(PDP + "/view/isDir/" + encodeURIComponent(localStorage.getItem("currentBook"))).then((res) => {
        return res.json();
    }).then((res) => {
        isADirectory = res;
    });

    //preloading images
    const preloadedImages: any[] = [];

    function preloadImage(listImages: any) {
        for (let i = 0; i < listImages.length; i++) {
            preloadedImages[i] = new Image();
            const options = {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "path": localStorage.getItem("currentBook"),
                    "token": connected,
                    "met": isADirectory ? "DL" : "CLASSIC",
                    "page": listImages[i]
                }
            };
            const a = i;
            fetch(PDP + "/view/readImage", options).then(async (response) => {
                preloadedImages[a].src = URL.createObjectURL(await response.blob());
            });
        }
    }
    //Getting the Background Color by the dominant color of image
    async function GettheBGColor(page) {
        return fetch(PDP + "/img/getColor/" + page + "/" + connected).then(function (response) {
            return response.text();
        }).then(function (data) {
            console.log("ColorThief : ", data);
            return data;
        }).catch(function (error) {
            console.log(error);
        });
        //var img = document.getElementById("imgViewer_0");
        //return colorThief.getColor(img);
    }
    async function prepareReader() {
        Toaster(t("loading_cache"), "info");
        Logger.info("Preparing Reader");
        await fetch(PDP + "/viewer/view/current/" + connected).then(
            (response) => {
                response.json().then(async (data) => {
                    const listofImgLoc = data;
                    console.log(listofImgLoc);
                    if (listofImgLoc === false) {
                        Toaster(t("no_book"), "error");
                        return;
                    }
                    listofImgLoc.sort((a: string, b: string) => {
                        const fa = a.substring(a.lastIndexOf(".") + 1);
                        const fb = b.substring(b.lastIndexOf(".") + 1);
                        if (fa < fb) {
                            return 1;
                        }
                        if (fa > fb) {
                            return -1;
                        }
                        return 0;
                    });
                    console.log(listofImgLoc);
                    const currentPage = localStorage.getItem("currentPage");
                    const filepage = currentPage === null ? 0 : parseInt(currentPage);
                    preloadImage(listofImgLoc);
                    console.log(filepage);
                    if (filepage !== 0) {
                        const lastpage = filepage;
                        Reader(listofImgLoc, lastpage);
                    } else {
                        let lastpage = 0;
                        try {
                            await getFromDB("Books", "last_page FROM Books WHERE PATH='" + localStorage.getItem("currentBook") + "'").then(async (res) => {
                                console.log(res);
                                if (res === "[]" || res === undefined || res === null || res === "" || res.length === 0) {
                                    lastpage = 0;
                                } else {
                                    lastpage = JSON.parse(res)[0]["last_page"];
                                }
                                Reader(listofImgLoc, lastpage);
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    Toaster(t("loaded_local"), "success");
                }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        );
    }
    let DPageActu = 1;
    let DoublePageMode = false;
    let BlankFirstPage = false;
    let DPMNoH = false;
    let wasDPM = false;
    let PPwasDPM = false;
    let mangaMode = false;
    let bookID = "NaID_" + Math.random() * 100500;
    let toogleBGC = false;
    let listofImg;
    let currentUser = "";


    fetch(PDP + "/viewer/view/current/" + connected).then(
        (response) => {
            response.json().then((data) => {
                listofImg = data;
                setTotalPages(listofImg.length);
            }
            ).catch(function (error) {
                console.log(error);
            });
        }
    );
    const [bookmarked, setBookmarked] = React.useState(false);

    //Loading the BookMark
    async function LoadBMI(pagec = 0) {
        try {
            await getFromDB("Bookmarks", "* FROM Bookmarks WHERE BOOK_ID='" + bookID + "' AND page=" + pagec + ";").then((res) => {
                res = JSON.parse(res);
                console.log(res);
                if (res.length !== 0) {
                    setBookmarked(true);
                } else {
                    setBookmarked(false);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    //Loading image to render
    function Reader(listOfImg, page) {
        const images: any[] = [];
        const options = {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "path": localStorage.getItem("currentBook"),
                "token": connected,
                "met": isADirectory ? "DL" : "CLASSIC",
                "page": listOfImg[page]
            }
        };
        fetch(PDP + "/view/readImage", options).then(async (response) => {
            images.push(URL.createObjectURL(await response.blob()));
            const options = {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "path": localStorage.getItem("currentBook"),
                    "token": connected,
                    "met": isADirectory ? "DL" : "CLASSIC",
                    "page": listOfImg[page + 1]
                }
            };
            fetch(PDP + "/view/readImage", options).then(async (response) => {
                images.push(URL.createObjectURL(await response.blob()));
                if (DoublePageMode === true && BlankFirstPage === false) {
                    if (mangaMode === true) {
                        setImageOne(images[1]);
                        setImageTwo(images[0]);
                        setCurrentPage(page + 1);
                    } else {
                        setImageOne(images[0]);
                        setImageTwo(images[1]);
                        setCurrentPage(page + 1);
                    }
                    DPageActu = page + 1;
                } else if (DoublePageMode === true && BlankFirstPage === true) {
                    if (page === 0 || page === -1) {
                        if (page === 2) {
                            setImageOne(images[1]);
                        } else {
                            setImageOne(images[0]);
                        }
                        DPageActu = page + 1;
                    } else {
                        if (mangaMode === true) {
                            setImageOne(images[1]);
                            setImageTwo(images[0]);
                            setCurrentPage(page + 1);
                        } else {
                            setImageOne(images[0]);
                            setImageTwo(images[1]);
                            setCurrentPage(page + 1);
                        }
                        DPageActu = page + 1;
                    }
                } else {
                    setImageOne(images[0]);
                    DPageActu = page;
                }
                setTimeout(() => {
                    if (toogleBGC === true) {
                        let pathBG;
                        if (custom) {
                            pathBG = images[0];
                            console.log("ColorThief : Enable");
                            GettheBGColor(listOfImg[page]).then((BGColor) => {
                                BGColor = BGColor.replaceAll("[", "").replaceAll("]", "");
                                BGColor = BGColor.split(',');
                                const R = BGColor[0];
                                const G = BGColor[1];
                                const B = BGColor[2];
                                const val = "rgb(" + R + "," + G + "," + B + ")";
                                document.getElementsByTagName("html")[0].style.backgroundColor = val;
                            });
                        }
                    }
                }
                    ,
                    50
                );
            });
        });
        LoadBMI(page);
        // document.getElementById("sps").value = page + 1;
        // document.getElementById("sps").min = 1;
        // document.getElementById("sps").max = listOfImg.length;
        // if (RZPV === true) {
        //     if (
        //         document.getElementById("imgViewer_0").style.width ===
        //         window.innerWidth - 5 + "px" ||
        //         document.getElementById("imgViewer_0").style.width ===
        //         window.innerWidth - 205 + "px"
        //     ) {
        //         FixWidth();
        //     } else {
        //         FixHeight();
        //     }
        // }
        // document.getElementById("inputonwhat").innerText = " / " + listOfImg.length;
        // document.getElementById("input_text").value = page + 1;
        // try {
        //     for (let i = 0; i < listOfImg.length; i++) {
        //         document.getElementById("id_img_" + i).className = "";
        //     }
        //     document.getElementById("id_img_" + page).className = "SideBar_current";
        //     document.getElementById("SideBar").scrollTop =
        //         document.getElementById("id_img_" + page).offsetTop - 100;
        // } catch (e) {
        //     console.log(e);
        // }
        // if (AlwaysRotateB === false) {
        //     document.getElementById("imgViewer_0").style.transform =
        //         "rotate(" + 0 + "deg)";
        //     document.getElementById("imgViewer_1").style.rotate =
        //         "rotate(" + 0 + "deg)";
        // } else {
        //     document.getElementById("imgViewer_0").style.transform =
        //         "rotate(" + AlwaysRotateV + "deg)";
        //     document.getElementById("imgViewer_1").style.rotate =
        //         "rotate(" + AlwaysRotateV + "deg)";
        // }
        // if (wasDPM === true) {
        //     DoublePageMode = true;
        // }
    }

    function hasNumbers(t) {
        const regex = /\d/g;
        return regex.test(t);
    }
    let scrollindex_next = 1;
    let VIV_On = false;
    let VIV_Count = 0;
    //getting the ID of the book
    function GetTheName(CommonName = "") {
        CommonName = decodeURIComponent(CommonName);
        CommonName = CommonName.replaceAll("-", " ");
        CommonName = CommonName.replaceAll(")", " ");
        CommonName = CommonName.replaceAll("(", " ");
        CommonName = CommonName.replaceAll("[", " ");
        CommonName = CommonName.replaceAll("]", " ");
        /* remove the extension using regex */
        CommonName = CommonName.replace(/\.[^/.]+$/, "");
        let s = CommonName.split(" ");
        let finalName = "";
        console.log(s);
        s.forEach((el) => {
            console.log(parseInt(el));
            if (el !== "") {
                if (hasNumbers(el)) {
                    finalName += el;
                } else if (isNaN(parseInt(el))) {
                    finalName += el[0];
                } else {
                    finalName += el;
                }
            }
        });
        console.log(finalName);
        return finalName;
    }

    const shortname = GetTheName(localStorage.getItem("currentBook")?.split(".")[0]);

    //Going to the next page
    function NextPage(override = false) {
        if (mangaMode === true) {
            if (override === false) {
                PreviousPage(true);
                return false;
            }
        }
        if (VIV_On === true) {
            console.log(scrollindex_next);
            const imgViewer_n0 = document.getElementById("imgViewer_" + (currentPage));
            if (imgViewer_n0 === null) return;
            if (
                imgViewer_n0.style.width ===
                window.innerWidth - 5 + "px"
            ) {
                if (scrollindex_next > 2) {
                    const imgViewer = document.getElementById("imgViewer_" + (currentPage + 1));
                    if (imgViewer === null) return;
                    window.scrollTo(
                        0,
                        imgViewer.offsetTop -
                        document.getElementsByTagName("header")[0].offsetHeight
                    );
                } else {
                    const divImgViewer = document.getElementById("div_imgViewer_" + currentPage);
                    if (divImgViewer === null) return;
                    if (scrollindex_next === 1) {
                        divImgViewer.scrollIntoView({
                            block: "center"
                        });
                    } else if (scrollindex_next === 2) {
                        divImgViewer.scrollIntoView({
                            block: "end"
                        });
                    }
                }
                if (scrollindex_next > 2) {
                    scrollindex_next = 1;
                } else {
                    scrollindex_next += 1;
                }
            } else {
                const imgViewer = document.getElementById("imgViewer_" + (currentPage + 1));
                if (imgViewer === null) return;
                window.scrollTo(
                    0,
                    imgViewer.offsetTop -
                    document.getElementsByTagName("header")[0].offsetHeight
                );
            }
        } else {
            window.scrollTo(0, 0);
            if (DPMNoH === true) {
                const NW = preloadedImages[currentPage + 1].naturalWidth;
                const NH = preloadedImages[currentPage + 1].naturalHeight;
                const NW2 = preloadedImages[currentPage + 2].naturalWidth;
                const NH2 = preloadedImages[currentPage + 2].naturalHeight;
                if (NW > NH || NW2 > NH2) {
                    DoublePageMode = false;
                }
            }
            if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                if (currentPage === totalPages - 1) {
                    ModifyDB(
                        "Books",
                        "reading",
                        "false",
                        shortname
                    ).then(() => {
                        ModifyDB(
                            "Books",
                            "read",
                            "true",
                            shortname
                        );
                    });
                }
                ModifyDB(
                    "Books",
                    "last_page",
                    currentPage.toString(),
                    shortname
                ).then(() => {
                    Reader(listofImg, currentPage + 1);
                });
            }
        }
    }

    //Going to the previous page
    function PreviousPage(override = false) {
        if (mangaMode === true) {
            if (override === false) {
                //NextPage(true);
                return false;
            }
        }
        if (VIV_On === true) {
            if (scrollindex_next === 2 || scrollindex_next === 3) {
                const imgViewer = document.getElementById("imgViewer_" + (currentPage));
                if (imgViewer === null) return;
                window.scrollTo(
                    0,
                    imgViewer.offsetTop -
                    document.getElementsByTagName("header")[0].offsetHeight
                );
                scrollindex_next = 1;
            } else {
                const imgViewer = document.getElementById("imgViewer_" + (currentPage - 1));
                if (imgViewer === null) return;
                window.scrollTo(
                    0,
                    imgViewer.offsetTop -
                    document.getElementsByTagName("header")[0].offsetHeight
                );
                scrollindex_next = 1;
            }
        } else {
            window.scrollTo(0, 0);
            if (DoublePageMode === true && BlankFirstPage === false && DPMNoH === false) {
                if (currentPage > 2) {
                    setCurrentPage(currentPage - 3);
                    Reader(listofImg, currentPage);
                } else {
                    if (currentPage - 1 !== -1) {
                        setCurrentPage(currentPage - 1);
                        Reader(listofImg, currentPage);
                    }
                }
            } else if (
                DoublePageMode === true &&
                BlankFirstPage === false &&
                DPMNoH === true
            ) {
                if (currentPage > 2) {
                    const NW = preloadedImages[currentPage - 1].naturalWidth;
                    const NH = preloadedImages[currentPage - 1].naturalHeight;
                    const NW2 = preloadedImages[currentPage - 2].naturalWidth;
                    const NH2 = preloadedImages[currentPage - 2].naturalHeight;
                    if (NW > NH || NW2 > NH2) {
                        DoublePageMode = false;
                        setCurrentPage(currentPage - 1);
                        Reader(listofImg, currentPage);
                    } else {
                        setCurrentPage(currentPage - 3);
                        Reader(listofImg, currentPage);
                    }
                } else {
                    if (currentPage - 2 !== -1) {
                        setCurrentPage(currentPage - 2);
                        Reader(listofImg, currentPage);
                    }
                }
            } else if (
                DoublePageMode === true &&
                BlankFirstPage === true &&
                DPMNoH === false
            ) {
                if (currentPage !== 0 && currentPage - 3 !== -1) {
                    setCurrentPage(currentPage - 3);
                    Reader(listofImg, currentPage);
                } else if (currentPage - 3 === -1) {
                    setCurrentPage(currentPage - 2);
                    Reader(listofImg, currentPage);
                }
            } else if (
                DoublePageMode === true &&
                BlankFirstPage === true &&
                DPMNoH === true
            ) {
                if (currentPage !== 0 && currentPage - 3 !== -1) {
                    const NW = preloadedImages[currentPage - 2].naturalWidth;
                    const NH = preloadedImages[currentPage - 2].naturalHeight;
                    const NW2 = preloadedImages[currentPage - 3].naturalWidth;
                    const NH2 = preloadedImages[currentPage - 3].naturalHeight;
                    if (NW > NH || NW2 > NH2) {
                        DoublePageMode = false;
                        setCurrentPage(currentPage - 2);
                        Reader(listofImg, currentPage);
                    } else {
                        setCurrentPage(currentPage - 2);
                        Reader(listofImg, currentPage);
                    }
                } else if (currentPage - 3 === -1) {
                    const NW = preloadedImages[currentPage - 1].naturalWidth;
                    const NH = preloadedImages[currentPage - 1].naturalHeight;
                    const NW2 = preloadedImages[currentPage - 2].naturalWidth;
                    const NH2 = preloadedImages[currentPage - 2].naturalHeight;
                    if (NW > NH || NW2 > NH2) {
                        DoublePageMode = false;
                        setCurrentPage(currentPage - 1);
                        Reader(listofImg, currentPage);
                    } else {
                        setCurrentPage(currentPage - 2);
                        Reader(listofImg, currentPage);
                    }
                }
            } else {
                if (currentPage !== 0) {
                    setCurrentPage(currentPage - 1);
                    Reader(listofImg, currentPage - 1);
                }
            }
        }
    }

    useEffectOnce(() => {
        const LaunchViewer = async () => {
            setBookLoaded(true);
            //If the folder doesn't exist then create it and unzip in it
            //Else we check for the path.txt and if it doesn't exist we unzip
            //Else we check if the path.txt is equal to the path if he is not then we unzip
            //Else, the folder is created, as well as the path.txt and already contains the images
            const path = localStorage.getItem("currentBook");
            if (path === null) return;
            Logger.info("CosmicComicsTempI : " + CosmicComicsTempI);
            await fetch(PDP + "/view/isDir/" + window.encodeURIComponent(CosmicComicsTempI)).then((response) => {
                response.json().then(async (isDir) => {
                    Logger.info("isDir CCTI: " + isDir);
                    if (isDir === true) {
                        Logger.info("CCI is a directory");
                        CosmicComicsTempI = path + "/";
                    }
                    await fetch(PDP + "/view/exist/" + window.encodeURIComponent(CosmicComicsTempI)).then((response) => {
                        response.json().then(async (existCCI) => {
                            Logger.info("existCCI : " + existCCI);
                            if (!existCCI) {
                                Logger.info("CCI doesn't exist");
                                //Unzip if the folder doesn't exist
                                fetch(PDP + "/Unzip/" + window.encodeURIComponent(path) + "/" + connected).then((response) => {
                                    Logger.info("Unzip for " + path + " : " + response);
                                    prepareReader();
                                });
                            } else {
                                // TODO MAKE THIS WORK
                                if (false) {
                                    /* Logger.info("Trying to load images from CCI cache");
                                    //If the path is a folder then it contains images
                                    Toaster(t("loading_cache"), "info");
                                    const options = {
                                        method: "GET",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "path": localStorage.getItem("currentBook"),
                                        }
                                    };
                                    await fetch(PDP + "/viewer/view/", options).then(
                                        (response) => {
                                            response.json().then(async (data) => {
                                                console.log("viewer/view", data);
                                                const listofImgLoc = data;
                                                const listofImg = listofImgLoc;
                                                console.log(listofImgLoc);
                                                if (listofImgLoc === false) {
                                                    Toaster(t("no_book"), "error");
                                                    return;
                                                }
                                                listofImgLoc.sort((a, b) => {
                                                    const fa = a.substring(a.lastIndexOf(".") + 1);
                                                    const fb = b.substring(b.lastIndexOf(".") + 1);
                                                    if (fa < fb) {
                                                        return 1;
                                                    }
                                                    if (fa > fb) {
                                                        return -1;
                                                    }
                                                    return 0;
                                                });
                                                console.log(listofImgLoc);
                                                const currentPage = localStorage.getItem("currentPage");
                                                const filepage = currentPage === null ? 0 : parseInt(currentPage);
                                                preloadImage(listofImgLoc);
                                                console.log(filepage);
                                                if (filepage !== 0) {
                                                    const lastpage = filepage;
                                                    Reader(listofImgLoc, lastpage);
                                                } else {
                                                    let lastpage = 0;
                                                    try {
                                                        await getFromDB("Books", "last_page FROM Books WHERE PATH='" + localStorage.getItem("currentBook") + "'").then(async (res) => {
                                                            lastpage = JSON.parse(res)[0]["last_page"];
                                                            console.log(lastpage);
                                                            Reader(listofImgLoc, lastpage);
                                                        });
                                                    } catch (error) {
                                                        console.log(error);
                                                        Reader(listofImgLoc, lastpage);
                                                    }
                                                }
                                                Toaster(t("loaded_local"), "success");
                                            }
                                            ).catch(function (error) {
                                                console.log(error);
                                            });
                                        }
                                    ); */
                                } else {
                                    Logger.info("CCI is a file");
                                    //Else we need to extract it
                                    //We test if the path in the path.txt exists
                                    fetch(PDP + "/view/exist/" + ((CosmicComicsTempI + "/path.txt").replaceAll("/", "ù").replaceAll("\\", "ù"))).then((response) => {
                                        response.json().then((existCCIP) => {
                                            Logger.info("path.txt exist? : " + existCCIP);
                                            if (existCCIP) {
                                                fetch(PDP + "/view/readFile/" + ((CosmicComicsTempI + "path.txt").replaceAll("/", "ù").replaceAll("\\", "ù"))).then((response) => {
                                                    response.json().then((readCCTIP) => {
                                                        if (
                                                            readCCTIP !== decodeURIComponent(path).replaceAll("%C3%B9", "/") ||
                                                            path.includes(".pdf")
                                                        ) {
                                                            Logger.info("path.txt is not equal to path, Unzipping");
                                                            // if it's not the same we need to extract it
                                                            fetch(PDP + "/Unzip/" + window.encodeURIComponent(path) + "/" + connected).then((response) => {
                                                                prepareReader();
                                                            });
                                                        } else {
                                                            Logger.info("path.txt is equal to path, reading");
                                                            prepareReader();
                                                        }
                                                    });
                                                });
                                            } else {
                                                // if don't have a path.txt we extract
                                                Logger.info("path.txt doesn't exist, Unzipping");
                                                fetch(PDP + "/Unzip/" + window.encodeURIComponent(path) + "/" + connected).then((response) => {
                                                    return response.text();
                                                }).then((data) => {
                                                    Logger.info("Unziped");
                                                    prepareReader();
                                                });
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }).catch((error) => {
                        alert("ERROR : " + error);
                    });
                });
            });

        };
        if (!bookLoaded && CosmicComicsTemp !== "" && CosmicComicsTempI !== "") {
            LaunchViewer();
        }
    });

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <Tooltip title="Open Drawer">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                    <img
                        src="Images/Logo.png"
                        alt=""
                        width="auto"
                        height="40px"
                        id="logo_id"
                        className="navbar-brand rotate linear infinite"
                        style={{
                            marginRight: "10px",
                        }}
                    />
                    <Tooltip title={t("go_back")}>
                        <IconButton
                            onClick={
                                () => {
                                    window.location.href = "/collectionner";
                                }
                            }
                            color="inherit"
                            edge="start"
                            sx={{ mr: 2 }}
                        >
                            <ArrowBack />
                        </IconButton></Tooltip>
                    <Tooltip title={t("go_start")}>

                        <IconButton
                            onClick={
                                () => {
                                    setCurrentPage(0);
                                    Reader(listofImg, 0);
                                }
                            }
                            color="inherit"
                            edge="start"
                            sx={{ mr: 2 }}
                        >
                            <FirstPage />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("go_previous")}>

                        <IconButton
                            color="inherit"
                            onClick={() => {
                                PreviousPage();
                            }
                            }
                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <NavigateBefore />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("go_next")}>

                        <IconButton
                            color="inherit"
                            onClick={() => {
                                NextPage();
                            }}
                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <NavigateNext />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("go_end")}>

                        <IconButton
                            color="inherit"
                            onClick={
                                () => {
                                    let max;
                                    if (DoublePageMode === true) {
                                        max = totalPages - 2;
                                    } else {
                                        max = totalPages - 1;
                                    }
                                    setCurrentPage(totalPages);
                                    ModifyDB(
                                        "Books",
                                        "reading",
                                        "false",
                                        shortname
                                    ).then(() => {
                                        ModifyDB(
                                            "Books",
                                            "read",
                                            "true",
                                            shortname
                                        ).then(() => {
                                            Reader(listofImg, max);
                                        });
                                    });
                                }
                            }
                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <LastPage />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("fix_width")}>

                        <IconButton
                            color="inherit"


                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <AlignHorizontalCenter />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("fix_height")}>

                        <IconButton
                            color="inherit"


                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <VerticalAlignCenter />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("magnifier_toggle")}>

                        <IconButton
                            color="inherit"


                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <Pageview />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("zoom_in")}>

                        <IconButton
                            color="inherit"
                            onClick={
                                () => {
                                    const zoom = zoomLevel + 0.5;
                                    setZoomLevel(zoom);
                                }
                            }
                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <ZoomIn />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("zoom_out")}>

                        <IconButton
                            color="inherit"
                            onClick={
                                () => {
                                    const zoom = zoomLevel - 0.5;
                                    setZoomLevel(zoom);
                                }
                            }
                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <ZoomOut />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("Bookmark")}>

                        <IconButton
                            color="inherit"


                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            {
                                bookmarked ? <BookmarkBorder /> : <Bookmark />
                            }
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("book_settings")}>

                        <IconButton
                            color="inherit"


                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <MenuBook />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("rotate_right")}>

                        <IconButton
                            color="inherit"
                            onClick={
                                () => {
                                    let rotate = rotation + 90;
                                    if (rotate === 360) {
                                        rotate = 0;
                                    }
                                    setRotation(rotate);
                                }
                            }
                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <RotateRight />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("rotate_left")}>

                        <IconButton
                            color="inherit"
                            onClick={
                                () => {
                                    let rotate = rotation - 90;
                                    if (rotate === -90) {
                                        rotate = 270;
                                    }
                                    setRotation(rotate);
                                }
                            }
                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            <RotateLeft />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("full_screen")}>

                        <IconButton
                            color="inherit"
                            onClick={
                                () => {
                                    if (document.fullscreenElement) {
                                        document.exitFullscreen();
                                        setIsFullscreen(false);
                                    } else {
                                        document.documentElement.requestFullscreen();
                                        setIsFullscreen(true);
                                    }
                                }
                            }
                            edge="start"
                            sx={{ mr: 2, }}
                        >
                            {
                                isFullscreen ? <FullscreenExit /> : <Fullscreen />
                            }
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>

                </List>
                <Divider />
                <List>

                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                <MovableImage src={imageOne} width={100 + zoomLevel + "%"} height={100 + zoomLevel + "%"} rotation={rotation} alt="Logo" />
                {
                    imageTwo !== null ? <MovableImage src={imageTwo} width={100 + zoomLevel + "%"} height={100 + zoomLevel + "%"} rotation={rotation} alt="Logo" /> : null
                }
                <p style={{
                    color: "white", position: "fixed", backgroundColor: "rgba(0,0,0,0.50)", textAlign: "right", bottom: 0, right: "5px", zIndex: 5
                }}>{currentPage + 1} / {totalPages + 1}</p>
            </Main>
        </Box>
    );
}