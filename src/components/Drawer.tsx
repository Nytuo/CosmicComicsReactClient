import * as React from 'react';
import { styled, useTheme, Theme, CSSObject, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { AccountCircle, Download, FileOpen, GpsFixed, Home, LibraryAdd, LibraryBooks, LocalLibrary, MoreHoriz, MoreVert } from '@mui/icons-material';
import { Avatar, InputBase, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CollapsedBreadcrumbs from './Breadcrumb.tsx';
import { useTranslation } from 'react-i18next';
import { getFromDB, logout } from '@/utils/Fetchers.ts';
import { providerEnum } from '@/utils/utils.ts';
import HomeContainer from './Home.tsx';
import { currentProfile } from '@/utils/Common.ts';
import UserAccountDialog from './Dialogs/UserAccountDialog.tsx';
import { IBook } from '@/interfaces/IBook.ts';
import Book from '@/utils/Book.ts';
import Details from './Details.tsx';


const drawerWidth = 240;
const Search = styled('div')(({ theme }) => ({
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

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
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

const DrawerHeader = styled('div')(({ theme }) => ({
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
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
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



export default function MiniDrawer() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const [anchorAPI, setAnchorAPI] = React.useState<null | HTMLElement>(null);
    const { t } = useTranslation();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [libraries, setLibraries] = React.useState([]);

    React.useEffect(() => {
        const fetchLibraries = async () => {
            await getFromDB("Libraries", "* FROM Libraries").then((res) => {
                if (!res) return;
                if (res.includes("404")) return;
                setLibraries(JSON.parse(res));
            });
        };
        fetchLibraries();
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const isMenuOpen = Boolean(anchorEl);
    const isAPIOpen = Boolean(anchorAPI);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
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
            <MenuItem onClick={() => { setUserAccountOpen(true); setDialogFor("edit"); }}>{t("Modifyyouraccount")}</MenuItem>
            <MenuItem onClick={() => { setUserAccountOpen(true); setDialogFor("create"); }}>{t("Createanewuser")}</MenuItem>
            <MenuItem onClick={() => {
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
            <MenuItem>
                <MoreHoriz />
                <p style={{ marginLeft: "10px" }}>Navigation</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Avatar alt="" src={currentProfile.getPP} />
                </IconButton>
                <p style={{ marginLeft: "10px" }}>Profile</p>
            </MenuItem>
        </Menu>
    );

    const [userAccountOpen, setUserAccountOpen] = React.useState(false);
    const [dialogFor, setDialogFor] = React.useState<'edit' | 'create'>('edit');
    const [openDetails, setOpenDetails] = React.useState<{ open: boolean, book: IBook, provider: any; } | null>(null);
    const handleOpenDetails = (open: boolean, book: IBook, provider: any) => {
        setOpenDetails({ open: open, book: book, provider: provider });
    };
    const [breadcrumbs, setBreadcrumbs] = React.useState<{ text: string; onClick: () => void; }[]>([{
        text: t("HOME"), onClick: () => {
            setOpenDetails(null);
            // TODO setOpenSeries(null);
            handleRemoveBreadcrumbsTo(1);
        }
    }]);
    const handleAddBreadcrumbs = (text: string, onClick: () => void) => {
        setBreadcrumbs([...breadcrumbs, { text: text, onClick: onClick }]);
    };
    const handleRemoveBreadcrumbsTo = (index: number) => {
        setBreadcrumbs(breadcrumbs.slice(0, index));
    };

    const handleCloseUserAccount = () => {
        setUserAccountOpen(false);
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <UserAccountDialog forWhat={dialogFor} onClose={handleCloseUserAccount} openModal={userAccountOpen} />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: "5px",
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
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
                    <CollapsedBreadcrumbs breadcrumbs={breadcrumbs} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <MoreHoriz />
                        </IconButton>

                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar alt="" src={currentProfile.getPP} />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreVert />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            {
                libraries.map((el: any, index: number) => {
                    return <Menu
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
                        {/* <MenuItem onClick={() => deleteLib(el)}>{t("DELETE")}</MenuItem>
                        <MenuItem onClick={() => modifyLib(el)}>{t("EDIT")}</MenuItem>
                        <MenuItem onClick={() => new API().refreshMetadata(el)}>{t("refreshMetadata")}</MenuItem> */}
                        <MenuItem >{t("DELETE")}</MenuItem>
                        <MenuItem >{t("EDIT")}</MenuItem>
                        <MenuItem >{t("refreshMetadata")}</MenuItem>
                    </Menu>;
                })
            }
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {[t("addLib"), t('open_file'), t('TRACKER')].map((text, index) => (
                        <ListItem key={index + text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
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
                                    {
                                        text === t("addLib") ? <LibraryAdd /> : (text === t('open_file') ? <FileOpen /> : <LocalLibrary />)
                                    }

                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem key={t('HOME') + Math.random()} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={() => {
                                //
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
                                <Home />
                            </ListItemIcon>
                            <ListItemText primary={t('HOME')} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={t('download') + Math.random()} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={() => {
                                // TODO breadcrumb logic
                                //TODO openLibrary(CosmicComicsTemp + "/downloads", 2);
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
                                <Download />
                            </ListItemIcon>
                            <ListItemText primary={t('download')} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={t('ALL') + Math.random()} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={() => {
                                // TODO breadcrumb logic
                                // AllBooks();
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
                                <LibraryBooks />
                            </ListItemIcon>
                            <ListItemText primary={t('ALL')} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={t('TRACKER') + Math.random()} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={() => {
                                //TODO Breadcrumb logic
                                // AllBooks("PATH IS NULL OR PATH = '' OR PATH = 'null'");
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
                                <GpsFixed />
                            </ListItemIcon>
                            <ListItemText primary={t('TRACKER')} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {
                        libraries.map((el: any, index: number) => {
                            return <ListItem key={el["NAME"]} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    onClick={() => {
                                        //TODO Breadcrumb logic
                                        //                 openLibrary(el["PATH"], el["API_ID"]);

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
                                        } alt="" className="libLogo" style={el["API_ID"] === providerEnum.MANUAL ? { filter: "invert(100%)" } : el["API_ID"] === providerEnum.OL ? { filter: "invert(100%)" } : {}} />

                                    </ListItemIcon>
                                    <ListItemText primary={el["NAME"]} sx={{ opacity: open ? 1 : 0 }} />
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
                                            aria-label="account of current user"
                                            aria-controls={"api-list-" + index}
                                            aria-haspopup="true"
                                            onClick={handleAPIOpen}
                                            color="inherit"
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>;
                        })
                    }
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }} style={{}}>
                <DrawerHeader />

                {
                    openDetails && openDetails.open ? <Details stateDetails={openDetails} handleAddBreadcrumbs={handleAddBreadcrumbs} /> : <HomeContainer handleOpenDetails={handleOpenDetails} />
                }
            </Box>
        </Box >
    );
}