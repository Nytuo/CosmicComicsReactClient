// noinspection HtmlUnknownTarget

import * as React from 'react';
import {alpha, CSSObject, styled, Theme, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
    Download,
    FileOpen,
    GpsFixed,
    Home,
    LibraryAdd,
    LibraryBooks,
    LocalLibrary,
    MoreHoriz,
    MoreVert
} from '@mui/icons-material';
import {Autocomplete, Avatar, CircularProgress, Menu, MenuItem, TextField} from '@mui/material';
import CollapsedBreadcrumbs from './Breadcrumb.tsx';
import {useTranslation} from 'react-i18next';
import {AllBooks, deleteLib, DetectFolderInLibrary, getFromDB, InsertIntoDB, logout} from '@/utils/Fetchers.ts';
import {buildTitleFromProvider, providerEnum, tryToParse} from '@/utils/utils.ts';
import HomeContainer from './Home.tsx';
import {cardModeEX, currentProfile, InsertIntoTarget, PDP} from '@/utils/Common.ts';
import UserAccountDialog from './dialogs/UserAccountDialog.tsx';
import {IBook} from '@/interfaces/IBook.ts';
import Book from '@/utils/Book.ts';
import Details from './Details.tsx';
import Series from './Series.tsx';
import {Marvel} from '@/API/Marvel.ts';
import {Anilist} from '@/API/Anilist.ts';
import ContainerExplorer from './ContainerExplorer.tsx';
import {ToasterHandler} from '../common/ToasterHandler.tsx';
import UploadDialog from './dialogs/UploadDialog.tsx';
import NavigationDialog from './dialogs/NavigationDialog.tsx';
import APISelectorDialog from './dialogs/APISelectorDialog.tsx';
import AddingLibraryDialog from './dialogs/AddingLibraryDialog.tsx';
import {API} from '@/API/API.ts';
import {ISeriesOfBook} from "@/interfaces/ISeriesOfBook.ts";

//#region Styles
const drawerWidth = 240;
const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 10,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const StyledInputBase = styled(TextField)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '40ch',
        },
    },
}));
const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    background: theme.palette.background.default,
    boxShadow: "none",

    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        background: theme.palette.background.default,
        boxShadow: "none",

    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        background: theme.palette.background.default,
        boxShadow: "none",
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);
//#endregion

export default function MiniDrawer({
                                       CosmicComicsTemp
                                   }: {
                                       CosmicComicsTemp: string;
                                   }
) {
    const {t} = useTranslation();
    const theme = useTheme();
    //#region States
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const [anchorAPI, setAnchorAPI] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const [libraries, setLibraries] = React.useState([]);
    const [openNavigation, setOpenNavigation] = React.useState(false);
    const [userAccountOpen, setUserAccountOpen] = React.useState(false);
    const [uploadOpen, setUploadOpen] = React.useState(false);
    const [createLibraryOpen, setCreateLibraryOpen] = React.useState(false);
    const [createLibraryEditMode, setCreateLibraryEditMode] = React.useState<"add" | "edit">("add");
    const [old, setOld] = React.useState<any>(null);
    const [dialogFor, setDialogFor] = React.useState<'edit' | 'create'>('edit');
    const [openDetails, setOpenDetails] = React.useState<{ open: boolean, book: IBook, provider: any; } | null>(null);
    const [openSeries, setOpenSeries] = React.useState<{ open: boolean, series: ISeriesOfBook[], provider: any; }>({
        open: false,
        series: [],
        provider: null
    });
    const [openExplorer, setOpenExplorer] = React.useState<{
        open: boolean,
        explorer: IBook[] | ISeriesOfBook[],
        provider: any,
        booksNumber: number;
        type: "series" | "books";
    }>(({open: false, explorer: [], provider: null, booksNumber: 0, type: "series"}));
    const [openAPISelector, setOpenAPISelector] = React.useState(false);
    const [breadcrumbs, setBreadcrumbs] = React.useState<{ text: string; onClick: () => void; }[]>([{
        text: t("HOME"), onClick: () => {
            setOpenDetails(null);
            setOpenSeries({open: false, series: [], provider: null});
            setOpenExplorer({open: false, explorer: [], provider: null, booksNumber: 0, type: "series"});
            handleRemoveBreadcrumbsTo(1);
        }
    }]);
    const [cardMode] = React.useState(cardModeEX);
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [searchOptions, setSearchOptions] = React.useState<ISearchElement[]>([]);
    //#endregion
    const isMenuOpen = Boolean(anchorEl);
    const isAPIOpen = Boolean(anchorAPI);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const searchLoading = searchOpen && searchOptions.length === 0;

    //#region Handlers

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleOpenNavigation = () => {
        setOpenNavigation(true);
    };

    const handleCloseNavigation = () => {
        setOpenNavigation(false);
    };

    const handleAPIOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorAPI(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setAnchorAPI(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleCloseUpload = () => {
        setUploadOpen(false);
    };
    const handleOpenUpload = () => {
        setUploadOpen(true);
    };

    const handleCloseCreateLibrary = () => {
        setCreateLibraryOpen(false);
    };

    const handleOpenCreateLibrary = (type = "add", old?: any) => {
        if (type === "edit") {
            setCreateLibraryEditMode("edit");
            setOld(old);
        } else {
            setCreateLibraryEditMode("add");
            setOld(null);
        }
        setCreateLibraryOpen(true);
    };
    const handleOpenTracker = () => {
        setOpenAPISelector(true);
    };

    const handleOpenDetails = (open: boolean, book: IBook, provider: any) => {
        setOpenExplorer({open: false, explorer: [], provider: null, booksNumber: 0, type: "series"});
        setOpenSeries({open: false, series: [], provider: null});
        setOpenDetails({open: open, book: book, provider: provider});
    };

    const handleOpenSeries = (open: boolean, series: ISeriesOfBook[], provider: any) => {
        setOpenExplorer({open: false, explorer: [], provider: null, booksNumber: 0, type: "series"});
        setOpenDetails(null);
        setOpenSeries({open: open, series: series, provider: provider});
    };

    const handleChangeToDetails = (_open: boolean, book: IBook, provider: any) => {
        setOpenExplorer({open: false, explorer: [], provider: null, booksNumber: 0, type: "series"});
        setOpenSeries({open: false, series: [], provider: null});
        setOpenDetails({open: true, book: book, provider: provider});
    };

    const handleChangeToSeries = (_open: boolean, series: ISeriesOfBook[], provider: any) => {
        setOpenExplorer({open: false, explorer: [], provider: null, booksNumber: 0, type: "series"});
        setOpenDetails(null);
        setOpenSeries({open: true, series: series, provider: provider});
        handleRemoveBreadcrumbsTo(1);
    };
    const handleAddBreadcrumbs = (text: string, onClick: () => void) => {
        setBreadcrumbs([...breadcrumbs, {text: text, onClick: onClick}]);
    };
    const handleRemoveBreadcrumbsTo = (index: number) => {
        setBreadcrumbs(breadcrumbs.slice(0, index));
    };

    const handleCloseUserAccount = () => {
        setUserAccountOpen(false);
    };

    //#endregion

    //#region Functions
    /**
     *
     * @param provider The provider of the library
     * @param FolderRes The folder result
     * @param libraryPath The path to the library
     */
    async function loadContent(provider: number, FolderRes: string, libraryPath: string) {
        let n = 0;
        const listOfImages = [];
        FolderRes = JSON.parse(FolderRes);
        const divlist = document.createElement("div");
        divlist.className = "list-group";

        await getFromDB("Series", "PATH FROM Series").then(async (res) => {
            if (!res) return;
            for (const element of FolderRes) {
                const path = element;
                const name = path.replaceAll(libraryPath.replaceAll("\\", "/"), "").replace("/", "");
                console.log(name);
                let found = false;
                const titlesList = [];
                const returnedPath = JSON.parse(res);
                let foundPATH = "";
                for (const element of returnedPath) {
                    titlesList.push(element.PATH);
                }
                titlesList.forEach((el) => {
                    console.log(el);
                    if (el === path) {
                        found = true;
                        foundPATH = el;
                    }
                });
                if (!found) {
                    if (provider === providerEnum.Anilist) {
                        console.log("provider Anilist");
                        new Anilist().POST_SEARCH(name, path);
                    } else if (provider === providerEnum.Marvel) {
                        console.log("Provider: Marvel Comics");
                        new Marvel().InsertSeries(name, path);
                    } else if (provider === providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                        const randID = Math.floor(Math.random() * 1000000);
                        await InsertIntoDB("Series", "(ID_Series,title,note,statut,start_date,end_date,description,Score,genres,cover,BG,CHARACTERS,TRENDING,STAFF,SOURCE,volumes,chapters,favorite,PATH,lock)", "('" + randID + "U_0" + "','" + JSON.stringify(name.replaceAll("'", "''")) + "',null,null,null,null,null,'0',null,null,null,null,null,null,null,null,null,0,'" + path + "',false)");
                    }
                } else {
                    await getFromDB("Series", "* FROM Series where PATH = '" + foundPATH + "'").then((resa) => {
                        if (!resa) return;
                        console.log(foundPATH);
                        const res = JSON.parse(resa);
                        console.log(res);
                        let node;
                        if (provider === providerEnum.Marvel) {
                            node = JSON.parse(res[0].title);
                        } else if (provider == providerEnum.Anilist) {
                            node = (JSON.parse(res[0].title)["english"] + " / " + JSON.parse(res[0].title)["romaji"] + " / " + JSON.parse(res[0].title)["native"]);
                        } else if (provider == providerEnum.MANUAL || provider === providerEnum.OL || provider === providerEnum.GBooks) {
                            node = res[0].title;
                        }

                        const invertedPath = path.replaceAll("\\", "/");
                        let imagelink;
                        if (provider === providerEnum.Marvel) {
                            try {
                                imagelink = JSON.parse(res[0].cover).path + "/detail." + JSON.parse(res[0].cover)["extension"];
                            } catch (e) {
                                imagelink = "null";
                            }
                        } else {
                            imagelink = res[0].cover;
                        }
                        listOfImages.push(imagelink);
                        //Setting Card Div
                        if (openExplorer === null) return;
                        const OSseries = openExplorer.explorer as ISeriesOfBook[];
                        console.log("[RAW] Series from DB : ", res[0]);
                        console.log("provider", provider);
                        OSseries.push({
                            SOURCE: res[0]["SOURCE"], Score: res[0]["Score"], chapters: res[0]["chapters"], cover: imagelink.toString(), pageCount: 0,
                            API_ID: provider.toString(),
                            unread: 0,
                            read: 0,
                            reading: 0,
                            statut: res[0]["statut"],
                            start_date: res[0]["start_date"],
                            end_date: res[0]["end_date"],
                            ID_book: res[0]["ID_Series"],
                            URLCover: imagelink.toString(),
                            NOM: node,
                            raw_title: res[0]["title"],
                            favorite: res[0]["favorite"],
                            PATH: invertedPath,
                            folder: 0,
                            last_page: 0,
                            issueNumber: res[0]["chapters"],
                            description: res[0]["description"],
                            format: "",
                            URLs: res[0]["SOURCE"],
                            series: "",
                            creators: res[0]["STAFF"],
                            characters: res[0]["CHARACTERS"],
                            prices: "",
                            dates: "01-01-1970",
                            collectedIssues: "0",
                            collections: "0",
                            variants: "",
                            score: res[0]["Score"],
                            trending: res[0]["TRENDING"],
                            genres: res[0]["genres"],
                            volumes: res[0]["volumes"],
                            lock: res[0]["lock"],
                            note: res[0]["note"],
                            BG_cover: res[0]["BG"]
                        });
                        setOpenExplorer({
                            open: true,
                            explorer: OSseries,
                            provider: provider,
                            booksNumber: FolderRes.length,
                            type: "series"
                        });
                        n++;


                    });
                }
            }
        });
        if (!cardMode) if (n === 0) {
            ToasterHandler(t("empty_notSupported"), "error");
            setOpenDetails(null);
            setOpenSeries({open: false, series: [], provider: null});
            setOpenExplorer({open: false, explorer: [], provider: null, booksNumber: 0, type: "series"});
            setIsLoading(false);
            handleRemoveBreadcrumbsTo(1);
        }
    }


    /**
     * Load the content of the element
     * @param {string} FolderRes The folder path
     * @param {string} libraryPath The library path
     * @param {*} date The date of the element
     * @param {number} provider The provider of the element
     */
    function loadView(FolderRes: string, libraryPath: string, date: any = "", provider: number = providerEnum.MANUAL) {
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
                OSBook = await getFromDB("Books", "* FROM Books WHERE PATH = '" + path + "'").then((resa) => {
                    return InsertIntoTarget(resa, realname, date, path, OSBook, provider);
                });
            }
            setOpenExplorer({open: true, explorer: OSBook, provider: provider, booksNumber: 0, type: "books"});
        });
    }

    /**
     * Open the library
     * @param {string} folder The path to the library
     * @param {number} provider The provider of the library (default to MANUAL)
     */
    function openLibrary(folder: string, provider: number = 0) {
        setTimeout(() => {
            const result = folder.toString();
            if (result) {
                console.log(result);
                DetectFolderInLibrary(result).then((data) => {
                    console.log(data);
                    const dataParsed: any = data;
                    if (dataParsed.length <= 0) throw new Error(t("Folderemptyornotfound"));
                    //Ajouter a la DB les dossiers trouvés en tant que Collection
                    if (provider === providerEnum.OL || provider === providerEnum.GBooks) {
                        //inserer une series OL
                        //aller directement dedans
                        loadView(result, result, "", provider);
                        console.log("OpenLibrary_FUN=>", result);
                    } else {
                        // noinspection JSIgnoredPromiseFromCall
                        loadContent(provider, dataParsed, result);
                    }
                });
            } else {
                setOpenSeries({open: true, series: [], provider: provider});
            }
        }, 500);
    }

    //#endregion

    //#region Effects
    React.useEffect(() => {
        const fetchLibraries = async () => {
            await getFromDB("Libraries", "* FROM Libraries").then((res) => {
                if (!res) return;
                if (res.includes("404")) return;
                setLibraries(JSON.parse(res));
            });
        };
        // noinspection JSIgnoredPromiseFromCall
        fetchLibraries();
    }, []);
    React.useEffect(() => {
        if (openExplorer !== null && openExplorer.explorer.length === openExplorer.booksNumber) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [openExplorer]);
    React.useEffect(() => {

        if (!searchLoading) {
            return undefined;
        }

        if (searchOptions.length === 0) {
            (async () => {
                await getFromDB("Books", "NOM,PATH,URLCover,series,URLs FROM Books").then(async (resa) => {
                    if (!resa) return;
                    console.log(resa);
                    const parsedRes = JSON.parse(resa);
                    for (const element of parsedRes) {
                        const provider = ((element.series.includes("marvel")) ? (providerEnum.Marvel) : ((element.series.includes("Anilist")) ? (providerEnum.Anilist) : ((element.series.includes("OL")) ? (providerEnum.OL) : ((element.URLs.includes("google")) ? (providerEnum.GBooks) : (providerEnum.MANUAL)))));
                        setSearchOptions((prev) => [
                            ...prev,
                            {
                                title: element.NOM,
                                path: element.PATH,
                                provider: provider,
                                type: "book",
                                series: element.series,
                                rawTitle: element.NOM
                            },
                        ]);
                    }
                    await getFromDB("Series", "ID_Series,title,cover,PATH FROM Series").then(async (resaa) => {
                        if (!resaa) return;
                        const parsedResa = JSON.parse(resaa);
                        for (const element of parsedResa) {
                            const provider = ((element["ID_Series"].includes("_1")) ? (providerEnum.Marvel) : ((element["ID_Series"].includes("_2")) ? (providerEnum.Anilist) : (element["ID_Series"].includes("_3")) ? (providerEnum.OL) : ((element["ID_Series"].includes("_4")) ? (providerEnum.GBooks) : (providerEnum.MANUAL))));
                            setSearchOptions((prev) => [
                                ...prev,
                                {
                                    title: buildTitleFromProvider(element.title, provider),
                                    path: element.PATH,
                                    provider: provider,
                                    type: "series",
                                    series: element.title,
                                    rawTitle: element.title
                                },
                            ]);
                        }
                    });
                });
            })();
        }
    }, [searchLoading]);

    React.useEffect(() => {
        if (!searchOpen) {
            setSearchOptions([]);
        }
    }, [searchOpen]);
    //#endregion

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => {
                setUserAccountOpen(true);
                setDialogFor("edit");
            }}>{t("Modifyyouraccount")}</MenuItem>
            <MenuItem onClick={() => {
                setUserAccountOpen(true);
                setDialogFor("create");
            }}>{t("Createanewuser")}</MenuItem>
            <MenuItem onClick={() => {
                // noinspection JSIgnoredPromiseFromCall
                logout();
            }}>{t("logout")}</MenuItem>
        </Menu>
    );


    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem
                onClick={() => {
                    handleOpenNavigation();
                    handleMobileMenuClose();
                }
                }
            >
                <MoreHoriz/>
                <p style={{marginLeft: "10px"}}>{t('navigation')}</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label={t('accountOfCurrentUser')}
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Avatar alt="" src={currentProfile.getPP}/>
                </IconButton>
                <p style={{marginLeft: "10px"}}>{t('profile')}</p>
            </MenuItem>
        </Menu>
    );

    interface ISearchElement {
        title: string;
        path: string;
        provider: any;
        type: string;
        series?: string;
        rawTitle: string;
    }

    function AllBookOpener(res: string | void) {
        if (!res) return;
        if (openExplorer === null) return;
        const parsedRes = tryToParse(res);
        const OSseries = openExplorer.explorer as IBook[];
        for (const element of parsedRes) {
            const res = element;
            console.log(res);
            const book = new Book(res["ID_book"], res["NOM"], res["URLCover"], res["description"], res["creators"], res["characters"], res["URLs"], res["note"], res["read"], res["reading"], res["unread"], res["favorite"], res["last_page"], res["folder"], res["PATH"], res["issueNumber"], res["format"], res["pageCount"], res["series"], res["prices"], res["dates"], res["collectedIssues"], res["collections"], res["variants"], res["lock"], '0');
            OSseries.push(book.book as IBook);
        }
        setOpenExplorer({
            open: true,
            explorer: OSseries,
            provider: 0,
            booksNumber: parsedRes.length,
            type: "books"
        });
    }

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <UserAccountDialog forWhat={dialogFor} onClose={handleCloseUserAccount} openModal={userAccountOpen}/>
            <UploadDialog openModal={uploadOpen} onClose={handleCloseUpload} cosmicComicsTemp={CosmicComicsTemp}/>
            <NavigationDialog openModal={openNavigation} onClose={handleCloseNavigation}
                              CosmicComicsTemp={CosmicComicsTemp}/>
            <APISelectorDialog openModal={openAPISelector} onClose={() => {
                setOpenAPISelector(false);
            }}/>
            <AddingLibraryDialog openModal={createLibraryOpen} onClose={handleCloseCreateLibrary}
                                 type={createLibraryEditMode} old={old}/>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label={t('openDrawer')}
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: "5px",
                            ...(open && {display: 'none'}),
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <img
                        src="Images/Logo.png"
                        alt=""
                        width="auto"
                        height="40px"
                        id="logo_id"
                        className="navbar-brand rotate linear infinite"
                    />
                    <img
                        src="Images/LogoTxt.png"
                        alt=""
                        id="logo_id_txt"
                        className="navbar-brand"
                        height="40px"
                    />
                    <CollapsedBreadcrumbs breadcrumbs={breadcrumbs}/>
                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                        <Search>
                            <Autocomplete
                                id="asynchronous-demo"
                                sx={{width: 300}}
                                open={searchOpen}
                                onOpen={() => {
                                    setSearchOpen(true);
                                }}
                                onClose={() => {
                                    setSearchOpen(false);
                                }}
                                isOptionEqualToValue={(option, value) => option.title === value.title}
                                getOptionLabel={(option) => option.title + ((option.provider === providerEnum.Marvel) ? (" | Marvel") : ((option.provider === providerEnum.Anilist) ? (" | Anilist") : ((option.provider === providerEnum.OL) ? (" | OL") : ((option.provider === providerEnum.GBooks) ? (" | Google Books") : ("")))))}
                                groupBy={(option) => option.type}
                                options={searchOptions}
                                loading={searchLoading}
                                renderInput={(params) => (
                                    <StyledInputBase
                                        {...params}
                                        label={t('search')}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {searchLoading ?
                                                        <CircularProgress color="inherit" size={20}/> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                                onChange={async (_, value) => {
                                    if (!value) return;
                                    if (value.type === "book") {
                                        await getFromDB("Books", "* FROM Books WHERE PATH = '" + value.path + "'").then(async (resa) => {
                                            if (!resa) return;
                                            const bookList = JSON.parse(resa);
                                            const TheBook = bookList[0];
                                            console.log(TheBook);
                                            handleOpenDetails(true, TheBook, value.provider);
                                        });
                                    } else if (value.type === "series") {
                                        console.log(value);
                                        await getFromDB("Series", "* FROM Series WHERE title = '" + value.rawTitle + "'").then(async (resa) => {
                                            if (!resa) return;
                                            const bookList = JSON.parse(resa);
                                            console.log(bookList);
                                            const TheBook = bookList[0];
                                            console.log(TheBook);
                                            let imagelink;
                                            if (value.provider === providerEnum.Marvel) {
                                                try {
                                                    imagelink = JSON.parse(TheBook.cover).path + "/detail." + JSON.parse(TheBook.cover)["extension"];
                                                } catch (e) {
                                                    imagelink = "null";
                                                }
                                            } else {
                                                imagelink = TheBook.cover;
                                            }
                                            const parsedBook: ISeriesOfBook = {
                                                SOURCE: TheBook.SOURCE, Score: TheBook.Score, chapters: TheBook["chapters"], cover: imagelink.toString(), pageCount: 0, raw_title: value.rawTitle,
                                                API_ID: value.provider.toString(),
                                                unread: 0,
                                                read: 0,
                                                reading: 0,
                                                statut: TheBook["statut"],
                                                start_date: TheBook["start_date"],
                                                end_date: TheBook["end_date"],
                                                ID_book: TheBook["ID_Series"],
                                                URLCover: imagelink.toString(),
                                                NOM: value.title,
                                                favorite: TheBook["favorite"],
                                                PATH: value.path,
                                                folder: 0,
                                                last_page: 0,
                                                issueNumber: TheBook["chapters"],
                                                description: TheBook["description"],
                                                format: "",
                                                URLs: TheBook["SOURCE"],
                                                series: "",
                                                creators: TheBook["STAFF"],
                                                characters: TheBook["CHARACTERS"],
                                                prices: "",
                                                dates: "01-01-1970",
                                                collectedIssues: "0",
                                                collections: "0",
                                                variants: "",
                                                score: TheBook["Score"],
                                                trending: TheBook["TRENDING"],
                                                genres: TheBook["genres"],
                                                volumes: TheBook["volumes"],
                                                lock: TheBook["lock"],
                                                note: TheBook["note"],
                                                BG_cover: TheBook["BG"]
                                            };
                                            const seriesOfBook: ISeriesOfBook[] = [];
                                            seriesOfBook.push(parsedBook);
                                            handleOpenSeries(true, seriesOfBook, value.provider);
                                        });
                                    } else {
                                        ToasterHandler(t("empty_notSupported"), "error");
                                    }
                                }}
                            />
                        </Search>
                    </Box>

                    <Box sx={{flexGrow: 1}}/>
                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                        <IconButton size="large" color="inherit"
                                    onClick={handleOpenNavigation}
                        >
                            <MoreHoriz/>
                        </IconButton>

                        <IconButton
                            size="large"
                            edge="end"
                            aria-label={t('accountOfCurrentUser')}
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar alt="" src={currentProfile.getPP}/>
                        </IconButton>
                    </Box>
                    <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label={t('showMore')}
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreVert/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            {
                libraries.map((el: any, index: number) => {
                    return <Menu
                        key={index}
                        anchorEl={anchorAPI}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        id={"api-list-" + index}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={isAPIOpen}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => deleteLib(el)}>{t("DELETE")}</MenuItem>
                        <MenuItem onClick={() => handleOpenCreateLibrary("edit", el)}>{t("EDIT")}</MenuItem>
                        <MenuItem onClick={() => new API().refreshMetadata(el)}>{t("refreshMetadata")}</MenuItem>
                    </Menu>;
                })
            }
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    {[t("addLib"), t('open_file'), t('TRACKER')].map((text, index) => (
                        <ListItem key={index + text} disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => {
                                    if (text === t("addLib")) {
                                        handleOpenCreateLibrary();
                                    } else if (text === t('open_file')) {
                                        handleOpenUpload();
                                    } else if (text === t('TRACKER')) {
                                        handleOpenTracker();
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {
                                        text === t("addLib") ? <LibraryAdd/> : (text === t('open_file') ? <FileOpen/> :
                                            <LocalLibrary/>)
                                    }

                                </ListItemIcon>
                                <ListItemText primary={text} sx={{opacity: open ? 1 : 0}}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                <List>
                    <ListItem key={t('HOME') + Math.random()} disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            onClick={() => {
                                setOpenDetails(null);
                                setOpenSeries({open: false, series: [], provider: null});
                                setOpenExplorer({
                                    open: false,
                                    explorer: [],
                                    provider: null,
                                    booksNumber: 0,
                                    type: "series"
                                });
                                setIsLoading(false);
                                handleRemoveBreadcrumbsTo(1);
                            }}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <Home/>
                            </ListItemIcon>
                            <ListItemText primary={t('HOME')} sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={t('download') + Math.random()} disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            onClick={() => {
                                openLibrary(CosmicComicsTemp + "/downloads", 2);
                                if (openExplorer && openExplorer.open)
                                    openExplorer.explorer = [];
                                handleRemoveBreadcrumbsTo(1);

                            }}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <Download/>
                            </ListItemIcon>
                            <ListItemText primary={t('download')} sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={t('ALL') + Math.random()} disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            onClick={async () => {
                                setIsLoading(true);
                                setOpenDetails(null);
                                setOpenSeries({open: false, series: [], provider: null});
                                if (openExplorer && openExplorer.open)
                                    openExplorer.explorer = [];
                                await AllBooks().then(AllBookOpener);
                                setIsLoading(false);
                                handleRemoveBreadcrumbsTo(1);

                            }}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <LibraryBooks/>
                            </ListItemIcon>
                            <ListItemText primary={t('ALL')} sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={t('TRACKER') + Math.random()} disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            onClick={async () => {
                                setIsLoading(true);
                                setOpenDetails(null);
                                setOpenSeries({open: false, series: [], provider: null});
                                if (openExplorer && openExplorer.open)
                                    openExplorer.explorer = [];
                                await AllBooks("PATH IS NULL OR PATH = '' OR PATH = 'null'").then(AllBookOpener);

                                setIsLoading(false);
                                handleRemoveBreadcrumbsTo(1);

                            }}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <GpsFixed/>
                            </ListItemIcon>
                            <ListItemText primary={t('TRACKER')} sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    {
                        libraries.map((el: any, index: number) => {
                            return <ListItem key={el["NAME"]} disablePadding sx={{display: 'block'}}>
                                <ListItemButton
                                    onClick={() => {
                                        setIsLoading(true);
                                        setOpenDetails(null);
                                        setOpenSeries({open: false, series: [], provider: null});
                                        if (openExplorer && openExplorer.open)
                                            openExplorer.explorer = [];
                                        openLibrary(el["PATH"], el["API_ID"]);
                                        handleRemoveBreadcrumbsTo(1);

                                    }}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <img src={
                                            (el["API_ID"] === providerEnum.Marvel) ? "./Images/marvel-logo-png-10.png" :
                                                (el["API_ID"] === providerEnum.Anilist) ? "./Images/android-chrome-512x512.png" :
                                                    (el["API_ID"] === providerEnum.MANUAL) ? "./Images/manual.svg" :
                                                        (el["API_ID"] === providerEnum.OL) ? "./Images/OL.svg" :
                                                            (el["API_ID"] === providerEnum.GBooks) ? "./Images/Gbooks.svg" : ""
                                        } alt="" className="libLogo"
                                             style={el["API_ID"] === providerEnum.MANUAL ? {filter: "invert(100%)"} : el["API_ID"] === providerEnum.OL ? {filter: "invert(100%)"} : {}}/>

                                    </ListItemIcon>
                                    <ListItemText primary={el["NAME"]} sx={{opacity: open ? 1 : 0}}/>
                                    <ListItemIcon
                                        sx={{
                                            display: open ? 'flex' : 'none',
                                            opacity: open ? 1 : 0,
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IconButton
                                            size="large"
                                            edge="end"
                                            aria-label={t('accountOfCurrentUser')}
                                            aria-controls={"api-list-" + index}
                                            aria-haspopup="true"
                                            onClick={(event: any) => {
                                                event.stopPropagation();
                                                event.preventDefault();
                                                handleAPIOpen(event);
                                            }
                                            }
                                            color="inherit"
                                        >
                                            <MoreVert/>
                                        </IconButton>
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>;
                        })
                    }
                </List>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <DrawerHeader/>
                {isLoading ? <div id="overlay" style={{background: theme.palette.background.default}}>
                    <div style={{textAlign: "center", marginTop: "25%"}}>
                        <CircularProgress/>
                        <p id="decompressfilename" style={{marginTop: "10px"}}></p>
                        <p id="overlaymsg" style={{marginTop: "10px"}}>
                            {t("overlaymsg_takecare")}
                        </p>
                    </div>
                </div> : <></>}
                {
                    openExplorer && openExplorer.open ? <ContainerExplorer type='lite' stateExplorer={openExplorer}
                                                                           handleAddBreadcrumbs={handleAddBreadcrumbs}
                                                                           handleOpenDetails={openExplorer.type === "series" ? handleOpenSeries : handleOpenDetails}/> :
                        openSeries && openSeries.open ?
                            <Series stateSeries={openSeries} handleAddBreadcrumbs={handleAddBreadcrumbs}
                                    handleChangeToDetails={handleChangeToDetails}
                                    handleChangeToSeries={handleChangeToSeries}/> :
                            openDetails && openDetails.open ?
                                <Details stateDetails={openDetails} handleAddBreadcrumbs={handleAddBreadcrumbs}/> :
                                <HomeContainer handleOpenDetails={handleOpenDetails}/>
                }
            </Box>
        </Box>
    );
}