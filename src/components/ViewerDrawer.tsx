import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AlignHorizontalCenter, ArrowBack, FirstPage, Fullscreen, FullscreenExit, LastPage, NavigateBefore, NavigateNext, Tune, VerticalAlignCenter } from '@mui/icons-material';
import { Stack, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MovableImage from './MovableImage.tsx';
import { Toaster } from './Toaster.tsx';
import { PDP, getCookie } from '@/utils/Common.ts';
import { DeleteFromDB, InsertIntoDB, ModifyDB, getFromDB, modifyConfigJson } from '@/utils/Fetchers.ts';
import Logger from '@/logger.ts';
import { useEffectOnce } from '@/utils/UseEffectOnce.tsx';
import SubMenu from './SubMenu.tsx';
import BookSettingsDialog from './Dialogs/BookSettingsDialog.tsx';
import Magnifier from './Magnifier.tsx';

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

const preloadedImages: string[] = [];
let listofImg: any[] = [];



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
    const [baseHeight, setBaseHeight] = React.useState<number | string>(window.innerHeight - 100);
    const [baseWidth, setBaseWidth] = React.useState<number | string>("auto");
    const [actionbarON, setActionbarON] = React.useState(true);
    const [sidebarON, setSidebarON] = React.useState(false);
    const [origins, setOrigins] = React.useState<any[][]>([[0, 0]]);
    const [originsKept, setOriginsKept] = React.useState<any[][]>([[0, 0]]);
    const [DoublePageMode, setDoublePageMode] = React.useState(false);
    const [innerWidth, setInnerWidth] = React.useState(window.innerWidth);

    React.useLayoutEffect(() => {
        window.addEventListener("resize", () => {
            setInnerWidth(window.innerWidth);
        });
        return () => {
            window.removeEventListener("resize", () => {
                setInnerWidth(window.innerWidth);
            });
        };
    }, []);

    React.useLayoutEffect(() => {
        if (DoublePageMode) {
            const origins = [[innerWidth / 4 + innerWidth / 3.6, document.getElementsByTagName("header")[0].offsetHeight + 20], [innerWidth / 5.5, document.getElementsByTagName("header")[0].offsetHeight + 20]];
            setOrigins(origins);
            setOriginsKept(origins);
        } else {
            setOrigins([[innerWidth / 3, document.getElementsByTagName("header")[0].offsetHeight + 20], [innerWidth / 3, document.getElementsByTagName("header")[0].offsetHeight + 20]]);
            setOriginsKept([[innerWidth / 3, document.getElementsByTagName("header")[0].offsetHeight + 20], [innerWidth / 3, document.getElementsByTagName("header")[0].offsetHeight + 20]]);
        }
    }, [DoublePageMode, innerWidth]);

    React.useEffect(() => {
        if (!DoublePageMode) {
            imageTwo && setImageTwo(null);
        }
    }, [DoublePageMode, imageTwo]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const connected = getCookie("selectedProfile", document);
    const { t } = useTranslation();
    let isADirectory: boolean = false;


    async function preloadImage(listImages: any) {
        await Promise.all(listImages.map(async (_: any, index: number) => {
            const options: any = {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "path": localStorage.getItem("currentBook"),
                    "token": connected,
                    "met": isADirectory ? "DL" : "CLASSIC",
                    "page": listImages[index]
                }
            };
            await fetch(PDP + "/view/readImage", options).then((response) => {
                response.blob().then((blob) => {
                    const urlCreator = window.URL || window.webkitURL;
                    const imageUrl = urlCreator.createObjectURL(blob);
                    preloadedImages[index] = imageUrl;
                });
            });
        }));
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
        if (listofImg.length === 0) {
            Toaster(t("no_book"), "error");
            return;
        }
        const currentPage = localStorage.getItem("currentPage");
        const filepage = currentPage === null ? 0 : parseInt(currentPage);
        await preloadImage(listofImg);
        console.log(filepage);
        if (filepage !== 0) {
            const lastpage = filepage;
            Reader(listofImg, lastpage);
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
                    Reader(listofImg, lastpage);
                });
            } catch (error) {
                console.log(error);
            }
        }
        Toaster(t("loaded_local"), "success");
    }
    let DPageActu = 1;
    const [BlankFirstPage, setBlankFirstPage] = React.useState(false);
    const [DPMNoH, setDPMNoH] = React.useState(false);
    let PPwasDPM = false;
    let mangaMode = false;
    let bookID = "NaID_" + Math.random() * 100500;
    let toogleBGC = false;
    const [listofImgState, setListofImgState] = React.useState([]);

    React.useEffect(() => {
        const LaunchViewer = async () => {
            await fetch(PDP + "/viewer/view/current/" + connected).then(
                (response) => {
                    response.json().then((data) => {
                        listofImg = data === false ? [] : data;
                        setListofImgState(data);
                        setTotalPages(listofImg.length - 1);
                    }
                    ).catch(function (error) {
                        console.log(error);
                    });
                }
            );
        };
        LaunchViewer();
    }, []);

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
    async function Reader(listOfImg, page) {
        const images: any[] = [];
        console.log(preloadedImages);
        images.push(preloadedImages[page]);
        images.push(preloadedImages[page - 1]);
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
                    setImageTwo(null);
                } else {
                    setImageOne(images[0]);
                    setImageTwo(null);
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
                        document.body.style.background = val;
                    });
                }
            }
        }
            ,
            50
        );
        LoadBMI(page);
        /*  
            if (RZPV === true) {
                if (
                    document.getElementById("imgViewer_0").style.width ===
                    window.innerWidth - 5 + "px" ||
                    document.getElementById("imgViewer_0").style.width ===
                    window.innerWidth - 205 + "px"
                ) {
                    FixWidth();
                } else {
                    FixHeight();
                }
            }
            if (AlwaysRotateB === false) {
                document.getElementById("imgViewer_0").style.transform =
                    "rotate(" + 0 + "deg)";
                document.getElementById("imgViewer_1").style.rotate =
                    "rotate(" + 0 + "deg)";
            } else {
                document.getElementById("imgViewer_0").style.transform =
                    "rotate(" + AlwaysRotateV + "deg)";
                document.getElementById("imgViewer_1").style.rotate =
                    "rotate(" + AlwaysRotateV + "deg)";
            } */
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
        const s = CommonName.split(" ");
        let finalName = "";
        s.forEach((el) => {
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
                const PLI1: HTMLImageElement = new Image();
                PLI1.src = preloadedImages[currentPage + 1];
                const PLI2: HTMLImageElement = new Image();
                PLI2.src = preloadedImages[currentPage + 2];
                const NW = PLI1.naturalWidth;
                const NH = PLI1.naturalHeight;
                const NW2 = PLI2.naturalWidth;
                const NH2 = PLI2.naturalHeight;
                if (NW > NH || NW2 > NH2) {
                    setDoublePageMode(false);
                } else {
                    setDoublePageMode(true);
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
                    Reader(listofImgState, currentPage + 1);
                });
            }
        }
    }

    //Toogle mark as Bookmarks
    function TBM() {
        //check if bookmark is already bookmarked
        getFromDB("Bookmarks", "PATH,page FROM Bookmarks WHERE BOOK_ID='" + bookID + "' AND PATH='" + CosmicComicsTempI + "' AND page=" + currentPage + ";").then((res1) => {
            if (!res1) return;
            const jres = JSON.parse(res1);
            if (jres.length !== 0) {
                console.log(jres);
                if (jres[0]["page"] === currentPage) {
                    DeleteFromDB(
                        "Bookmarks",
                        bookID,
                        "AND page=" + currentPage
                    ).then(() => {
                        Toaster(t("bookmark_removed"), "info");
                    });
                    setBookmarked(false);
                }
            } else {
                console.log("Bookmarks doesn't exist yet!");
                InsertIntoDB(
                    "bookmarks",
                    "(BOOK_ID,PATH,page)",
                    "('" + bookID + "','" + CosmicComicsTempI + "','" + currentPage + "')"
                ).then(() => {
                    Toaster(t("bookmark_added"), "success");
                });
                setBookmarked(true);
            }
        });
    }

    //Going to the previous page
    function PreviousPage(override = false) {
        if (mangaMode === true) {
            if (override === false) {
                NextPage(true);
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
                    Reader(listofImgState, currentPage - 3);
                } else {
                    if (currentPage - 1 !== -1) {
                        setCurrentPage(currentPage - 1);
                        Reader(listofImgState, currentPage - 1);
                    }
                }
            } else if (
                DoublePageMode === true &&
                BlankFirstPage === false &&
                DPMNoH === true
            ) {
                if (currentPage > 2) {
                    const PLI1: HTMLImageElement = new Image();
                    PLI1.src = preloadedImages[currentPage - 1];
                    const PLI2: HTMLImageElement = new Image();
                    PLI2.src = preloadedImages[currentPage - 2];
                    const NW = PLI1.naturalWidth;
                    const NH = PLI1.naturalHeight;
                    const NW2 = PLI2.naturalWidth;
                    const NH2 = PLI2.naturalHeight;
                    if (NW > NH || NW2 > NH2) {
                        setDoublePageMode(false);
                        setCurrentPage(currentPage - 1);
                        Reader(listofImgState, currentPage - 1);
                    } else {
                        setDoublePageMode(true);
                        setCurrentPage(currentPage - 3);
                        Reader(listofImgState, currentPage - 3);
                    }
                } else {
                    if (currentPage - 2 !== -1) {
                        setCurrentPage(currentPage - 2);
                        Reader(listofImgState, currentPage - 2);
                    }
                }
            } else if (
                DoublePageMode === true &&
                BlankFirstPage === true &&
                DPMNoH === false
            ) {
                if (currentPage !== 0 && currentPage - 3 !== -1) {
                    setCurrentPage(currentPage - 3);
                    Reader(listofImgState, currentPage - 3);
                } else if (currentPage - 3 === -1) {
                    setCurrentPage(currentPage - 2);
                    Reader(listofImgState, currentPage - 2);
                }
            } else if (
                DoublePageMode === true &&
                BlankFirstPage === true &&
                DPMNoH === true
            ) {
                if (currentPage !== 0 && currentPage - 3 !== -1) {
                    const PLI1: HTMLImageElement = new Image();
                    PLI1.src = preloadedImages[currentPage - 2];
                    const PLI2: HTMLImageElement = new Image();
                    PLI2.src = preloadedImages[currentPage - 3];
                    const NW = PLI1.naturalWidth;
                    const NH = PLI1.naturalHeight;
                    const NW2 = PLI2.naturalWidth;
                    const NH2 = PLI2.naturalHeight;
                    if (NW > NH || NW2 > NH2) {
                        setDoublePageMode(false);
                        setCurrentPage(currentPage - 2);
                        Reader(listofImgState, currentPage - 2);
                    } else {
                        setDoublePageMode(true);
                        setCurrentPage(currentPage - 2);
                        Reader(listofImgState, currentPage - 2);
                    }
                } else if (currentPage - 3 === -1) {
                    const PLI1: HTMLImageElement = new Image();
                    PLI1.src = preloadedImages[currentPage - 1];
                    const PLI2: HTMLImageElement = new Image();
                    PLI2.src = preloadedImages[currentPage - 2];
                    const NW = PLI1.naturalWidth;
                    const NH = PLI1.naturalHeight;
                    const NW2 = PLI2.naturalWidth;
                    const NH2 = PLI2.naturalHeight;
                    if (NW > NH || NW2 > NH2) {
                        setDoublePageMode(false);
                        setCurrentPage(currentPage - 1);
                        Reader(listofImgState, currentPage - 1);
                    } else {
                        setDoublePageMode(true);
                        setCurrentPage(currentPage - 2);
                        Reader(listofImgState, currentPage - 2);
                    }
                }
            } else {
                if (currentPage !== 0) {
                    setCurrentPage(currentPage - 1);
                    Reader(listofImgState, currentPage - 1);
                }
            }
        }
    }
    React.useLayoutEffect(() => {
        function keyListener(e) {
            if (!e.ctrlKey && !e.shiftKey && e.key === "ArrowLeft") {
                PreviousPage();
            } else if (!e.ctrlKey && !e.shiftKey && e.key === "ArrowRight") {
                NextPage();
            } else if (e.key === "Escape") {
                document.exitFullscreen();
            } else if (e.key === "f") {
                document.documentElement.requestFullscreen();
            } else if (!e.ctrlKey && !e.shiftKey && e.key === "ArrowUp") {
                PreviousPage();
            } else if (!e.ctrlKey && !e.shiftKey && e.key === "ArrowDown") {
                NextPage();
            } else if (!e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
                setCurrentPage(0);
                Reader(listofImgState, 0);
            } else if (!e.ctrlKey && e.shiftKey && e.key === "ArrowDown") {
                setCurrentPage(listofImgState.length - 1);
                Reader(listofImgState, listofImgState.length - 1);
            } else if (!e.ctrlKey && e.shiftKey && e.key === "ArrowLeft") {
                setCurrentPage(0);
                Reader(listofImgState, 0);
            } else if (!e.ctrlKey && e.shiftKey && e.key === "ArrowRight") {
                setCurrentPage(listofImgState.length - 1);
                Reader(listofImgState, listofImgState.length - 1);
            } else if (e.ctrlKey && !e.shiftKey && e.key === "ArrowLeft") {
                setRotation(rotation - 90);
            } else if (e.ctrlKey && !e.shiftKey && e.key === "ArrowRight") {
                setRotation(rotation + 90);
            }

        }
        document.addEventListener("keyup", keyListener);
        //make a zoom with the mouse wheel
        const zoom = (e) => {
            if (e.shiftKey) {
                if (e.deltaY < 0) {
                    setZoomLevel(zoomLevel + 20);
                } else {
                    setZoomLevel(zoomLevel - 20);
                }
            }
        };

        document.addEventListener("wheel", zoom);
        return () => {
            document.removeEventListener("keyup", keyListener);
        };

    });
    useEffectOnce(() => {
        const LaunchViewer = async () => {
            fetch(PDP + "/view/isDir/" + encodeURIComponent(localStorage.getItem("currentBook"))).then((res) => {
                return res.json();
            }).then((res) => {
                isADirectory = res;
            });
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
                    //If the path is a directory then it contains images, we use it right away
                    Logger.info("isDir CCTI: " + isDir);
                    if (isDir) {
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
                                if (isDir) {
                                    Logger.info("Trying to load images from CCI cache");
                                    //If the path is a folder then it contains images
                                    Toaster(t("loading_cache"), "info");
                                    prepareReader();
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

    const [opacityForNavigation, setOpacityForNavigation] = React.useState("0.1");

    const [openBookSettings, setOpenBookSettings] = React.useState(false);
    const [isMagnifierOn, setIsMagnifierOn] = React.useState(false);

    const handleOpenBookSettings = () => {
        setOpenBookSettings(true);
    };

    const handleCloseBookSettings = () => {
        setOpenBookSettings(false);
    };

    function isMouseAtTheTop(e) {
        if (e.clientY < 50) {
            setActionbarON(true);
        }
    }

    React.useLayoutEffect(() => {
        if (actionbarON) {
            document.querySelectorAll("header").forEach((el) => {
                el.style.display = "inherit";
            });
            document.removeEventListener("mousemove", isMouseAtTheTop);
        } else {
            document.querySelectorAll("header").forEach((el) => {
                el.style.display = "none";
            });
            document.addEventListener("mousemove", isMouseAtTheTop);
        }
        modifyConfigJson("NoBar", actionbarON);
    }, [actionbarON]);

    const [isSlideShowOn, setIsSlideShowOn] = React.useState(false);
    const [slideShowInterval, setSlideShowInterval] = React.useState(5000);

    React.useEffect(() => {
        modifyConfigJson("SlideShow", isSlideShowOn);
        if (isSlideShowOn) {
            const interval = setInterval(() => {
                NextPage();
            }, slideShowInterval);
            return () => clearInterval(interval);
        }
    }, [NextPage, isSlideShowOn, slideShowInterval]);


    return (
        <>
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
                        <div
                            style={{
                                position: "absolute",
                                left: "50%",
                                transform: "translate(-50%, 0)",
                                width: "auto",
                                height: "auto",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Tooltip title={t("fix_width")}>
                                <IconButton
                                    color="inherit"
                                    onClick={
                                        () => {
                                            setBaseWidth(window.innerWidth - 5);
                                            setBaseHeight("auto");
                                            setZoomLevel(0);
                                            setOrigins([[0, 0], [0, 0]]);
                                            if (DoublePageMode === true) {
                                                setBaseWidth((window.innerWidth - 5) / 2);
                                            }
                                            if (sidebarON === true) {
                                                setBaseWidth(window.innerWidth - 205);
                                            }
                                            if (VIV_On === true) {
                                                for (let i = 0; i < VIV_Count; i++) {
                                                    if (sidebarON === true) {
                                                        setBaseWidth(window.innerWidth - 205);
                                                    } else {
                                                        setBaseWidth(window.innerWidth - 5);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    edge="start"
                                    sx={{ mr: 2, }}
                                >
                                    <AlignHorizontalCenter />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={t("fix_height")}>
                                <IconButton
                                    color="inherit"
                                    onClick={
                                        () => {
                                            const navbar = document.getElementById("navbar");
                                            if (navbar === null) return;
                                            if (VIV_On === true) {
                                                for (let i = 0; i < VIV_Count; i++) {
                                                    setBaseHeight(window.innerHeight - navbar.offsetHeight - 15);
                                                    setZoomLevel(0);
                                                    setBaseWidth("auto");
                                                }
                                            }
                                            if (!actionbarON) {
                                                setBaseHeight(window.innerHeight);
                                                setZoomLevel(0);
                                                setBaseWidth("auto");
                                            } else {
                                                setBaseHeight(window.innerHeight - navbar.offsetHeight - 15);
                                                setZoomLevel(0);
                                                setBaseWidth("auto");
                                                const tempOrigin = origins;
                                                if (origins[0][0] !== 0 || origins[1][0] !== 0) {
                                                    setOrigins([[0, 0], [0, 0]]);
                                                    setTimeout(() => {
                                                        setOrigins(tempOrigin);
                                                    }, 50);
                                                } else {
                                                    setOrigins(originsKept);
                                                }
                                            }
                                        }
                                    }
                                    edge="start"
                                    sx={{ mr: 2, }}
                                >
                                    <VerticalAlignCenter />
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
                            <Tooltip title={t("book_settings")}>
                                <IconButton
                                    color="inherit"
                                    onClick={
                                        () => {
                                            handleOpenBookSettings();
                                        }
                                    }
                                    edge="start"
                                    sx={{ mr: 2, }}
                                >
                                    <Tune />
                                </IconButton>
                            </Tooltip>
                            <SubMenu
                                TBM={TBM}
                                bookmarked={bookmarked}
                                rotation={rotation}
                                setRotation={setRotation}
                                zoomLevel={zoomLevel}
                                setZoomLevel={setZoomLevel}
                                isMagnifierOn={isMagnifierOn}
                                setIsMagnifierOn={setIsMagnifierOn}
                            />
                        </div>
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
                    {
                        preloadedImages.map((el: string, i: number) => {
                            return <Stack spacing={2} divider={<Divider orientation="horizontal" flexItem />} key={i}
                            ><div
                                key={i}
                                id={"id_img_" + i}
                                className="SideBar_img"
                                onClick={() => {
                                    setCurrentPage(i);
                                    Reader(listofImg, i);
                                }}
                                style={{
                                    cursor: "pointer",
                                    textAlign: "center",
                                }}
                            >
                                    <img
                                        height={120}
                                        id={"imgSideBar_" + i}
                                        className="SideBar_img"
                                        src={el}
                                        alt={i + 1 + "th page"}
                                    />
                                    <p className="SideBar_img_text">{i + 1}</p>
                                </div></Stack>;
                        })
                    }
                </Drawer>
                <Main open={open}>
                    <DrawerHeader />
                    {isMagnifierOn ? <Magnifier zoomFactor={2}>
                        <MovableImage disableMove={true} src={imageOne} origin={origins[0]} width={typeof baseWidth === "number" ? (baseWidth + zoomLevel + "px") : "auto"} height={typeof baseHeight === "number" ? baseHeight + zoomLevel + "px" : "auto"} rotation={rotation} alt="Logo" />
                        {
                            imageTwo !== null ? <MovableImage disableMove={true} src={imageTwo} origin={origins[1]} width={typeof baseWidth === "number" ? (baseWidth + zoomLevel + "px") : "auto"} height={typeof baseHeight === "number" ? baseHeight + zoomLevel + "px" : "auto"} rotation={rotation} alt="Logo" /> : null
                        }
                    </Magnifier> : <><MovableImage src={imageOne} origin={origins[0]} width={typeof baseWidth === "number" ? (baseWidth + zoomLevel + "px") : "auto"} height={typeof baseHeight === "number" ? baseHeight + zoomLevel + "px" : "auto"} rotation={rotation} alt="Logo" />
                        {
                            imageTwo !== null ? <MovableImage src={imageTwo} origin={origins[1]} width={typeof baseWidth === "number" ? (baseWidth + zoomLevel + "px") : "auto"} height={typeof baseHeight === "number" ? baseHeight + zoomLevel + "px" : "auto"} rotation={rotation} alt="Logo" /> : null
                        }</>}
                    <p style={{
                        color: "white", position: "fixed", backgroundColor: "rgba(0,0,0,0.50)", textAlign: "right", bottom: 0, right: "5px", zIndex: 5
                    }} id="pagecount">{currentPage + 1} / {totalPages + 1}</p>
                    <div style={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        opacity: opacityForNavigation, position: "fixed", bottom: "50px", left: "50%", transform: "translateX(-50%)", zIndex: 5,
                        transition: "opacity 0.2s ease-in-out", borderRadius: "10px", padding: "5px"
                    }}
                        onMouseEnter={() => {
                            setOpacityForNavigation("1");
                        }
                        }
                        onMouseLeave={() => {
                            setOpacityForNavigation("0.1");
                        }
                        }
                    >
                        <Tooltip title={t("go_start")}>
                            <IconButton
                                onClick={
                                    () => {
                                        setCurrentPage(0);
                                        Reader(listofImgState, 0);
                                    }
                                }
                                color="inherit"
                                edge="start"
                                sx={{ mr: 2, ml: 2 }}
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
                                            max = totalPages - 1;
                                        } else {
                                            max = totalPages;
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
                                                Reader(listofImgState, max);
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
                    </div>
                    <div style={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        opacity: opacityForNavigation, position: "fixed", bottom: "50%", right: "0px", transform: "translateX(-50%)", zIndex: 5,
                        transition: "opacity 0.2s ease-in-out", borderRadius: "10px", padding: "5px"
                    }}
                        onMouseEnter={() => {
                            setOpacityForNavigation("1");
                        }
                        }
                        onMouseLeave={() => {
                            setOpacityForNavigation("0.1");
                        }
                        }
                    >
                        <Tooltip title={t("go_next")}>

                            <IconButton
                                color="inherit"
                                onClick={() => {
                                    NextPage();
                                }}
                                edge="start"
                                sx={{ ml: 1, mr: 1 }}
                            >
                                <NavigateNext />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div style={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        opacity: opacityForNavigation, position: "fixed", bottom: "50%", left: "60px", transform: "translateX(-50%)", zIndex: 5,
                        transition: "opacity 0.2s ease-in-out", borderRadius: "10px", padding: "5px"
                    }}
                        onMouseEnter={() => {
                            setOpacityForNavigation("1");
                        }
                        }
                        onMouseLeave={() => {
                            setOpacityForNavigation("0.1");
                        }
                        }
                    >
                        <Tooltip title={t("go_previous")}>

                            <IconButton
                                color="inherit"
                                onClick={() => {
                                    PreviousPage();
                                }
                                }
                                edge="start"
                                sx={{ ml: 1, mr: 1 }}
                            >
                                <NavigateBefore />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Main>
            </Box>
            <BookSettingsDialog openModal={openBookSettings} onClose={handleCloseBookSettings} Reader={Reader} LOI={listofImgState} currentPage={currentPage} setCurrentPage={setCurrentPage} setDoublePageMode={setDoublePageMode} setBlankFirstPage={setBlankFirstPage} setDPMNoH={setDPMNoH} setActionbarON={setActionbarON} actionbarON={actionbarON} slideShow={isSlideShowOn} setSlideShow={setIsSlideShowOn} slideShowInterval={slideShowInterval} setSlideShowInterval={setSlideShowInterval} />
        </>
    );
}