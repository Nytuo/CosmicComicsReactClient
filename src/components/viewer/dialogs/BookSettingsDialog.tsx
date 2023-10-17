/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from 'react-i18next';
import {
    Button,
    DialogActions,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    Input,
    Slider,
    Switch,
    Tooltip
} from '@mui/material';
import {AutoStories, Check, Close, Favorite, FavoriteBorder, Palette} from '@mui/icons-material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import {MuiColorInput} from 'mui-color-input';
import {ToasterHandler} from '../../common/ToasterHandler.tsx';
import {getFromDB, modifyConfigJson, ModifyDB} from '@/utils/Fetchers.ts';
import {GetTheName} from "@/utils/utils.ts";
import {IUserSettings} from "@/interfaces/IUserSettings.ts";

/**
 * A dialog component for creating a new account (used in the login screen for first setup).
 * @param onClose - A function to close the dialog.
 * @param openModal - A boolean value to determine if the dialog is open or not.
 * @param Reader - The function to change the page.
 * @param LOI - The list of images.
 * @param currentPage - The current page.
 * @param setCurrentPage - The function to change the current page.
 * @param setDoublePageMode - The function to change the double page mode.
 * @param setBlankFirstPage - The function to change the blank first page.
 * @param setDPMNoH - The function to change the no double page for horizontal.
 * @param setActionbarON - The function to change the actionbar.
 * @param actionbarON - The actionbar.
 * @param setSlideShow - The function to change the slideshow.
 * @param setSlideShowInterval - The function to change the slideshow interval.
 * @param slideShowInterval - The slideshow interval.
 * @param setMangaMode - The function to change the manga mode.
 * @param VIV_On - The vertical reader mode.
 * @param setVIVOn - The function to change the vertical reader mode.
 * @param setWebToonMode - The function to change the webtoon mode.
 * @param fixWidth - The function to fix the width.
 * @param fixHeight - The function to fix the height.
 * @param setBackgroundColorAuto - The function to change the background color.
 * @param backgroundColorAuto - The background color.
 * @param userSettings - The user settings.
 * @returns {JSX.Element} - A dialog component for creating a new account.
 */
export default function BookSettingsDialog({
                                               onClose,
                                               openModal,
                                               Reader,
                                               LOI,
                                               currentPage,
                                               setCurrentPage,
                                               setDoublePageMode,
                                               setBlankFirstPage,
                                               setDPMNoH,
                                               setActionbarON,
                                               actionbarON,
                                               setSlideShow,
                                               setSlideShowInterval,
                                               slideShowInterval,
                                               setMangaMode,
                                               VIV_On,
                                               setVIVOn,
                                               setWebToonMode,
                                               fixWidth,
                                               fixHeight,
                                               setBackgroundColorAuto,
                                               backgroundColorAuto,
                                               userSettings
                                           }: {
    onClose: any,
    openModal: boolean,
    Reader: any;
    LOI: any;
    currentPage: number;
    setCurrentPage: any;
    setDoublePageMode: any;
    setBlankFirstPage: any;
    setDPMNoH: any;
    setActionbarON: any;
    actionbarON: boolean;
    slideShow: boolean;
    setSlideShow: any;
    setSlideShowInterval: any;
    slideShowInterval: number;
    mangaMode: boolean;
    setMangaMode: any;
    VIV_On: boolean;
    setVIVOn: any;
    setWebToonMode: any;
    fixWidth: any;
    fixHeight: any;
    setBackgroundColorAuto: any;
    backgroundColorAuto: boolean;
    userSettings: IUserSettings;
}): JSX.Element {
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(openModal);

    // This is used to update the state of the dialog when the parent component changes the value of openModal.
    useEffect(() => {
        if (openModal !== open) {
            setOpen(openModal);
        }
    }, [openModal, open]);

    // This is used to update the state of the parent component when the dialog is closed.
    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const [state, setState] = React.useState([
        {"Double_Page_Mode": false},
        {"Blank_page_At_Begginning": false},
        {"No_Double_Page_For_Horizontal": false},
        {"Manga_Mode": false},
        {"SlideShow": false},
        {"NoBar": false},
        {"Page_Counter": true},
        {"Vertical_Reader_Mode": false},
        {"webToonMode": false},
        {"Scroll_bar_visible": true},
    ]);

    React.useEffect(() => {
        setColor(userSettings.Background_color);
        document.body.style.background = userSettings.Background_color;
        setBackgroundColorAuto(userSettings.Automatic_Background_Color);
        setSlideShow(userSettings.SlideShow);
        setSlideShowInterval(userSettings.SlideShow_Time);
        setMangaMode(userSettings.Manga_Mode);
        setVIVOn(userSettings.Vertical_Reader_Mode);
        setWebToonMode(userSettings.webToonMode);
        if (userSettings.webToonMode) {
            setVIVOn(true);
            fixWidth();
            state[7] = {"Vertical_Reader_Mode": true};
        }
        setActionbarON(!userSettings.NoBar);
        setDoublePageMode(userSettings.Double_Page_Mode);
        setDoublePage(userSettings.Double_Page_Mode);
        setBlankFirstPage(userSettings.Blank_page_At_Begginning);
        setDPMNoH(userSettings.No_Double_Page_For_Horizontal);
        if (!userSettings.Scroll_bar_visible) {
            const styleSheet = document.styleSheets[1];
            styleSheet.insertRule("::-webkit-scrollbar {display: none;}", 0);
        }
        if (userSettings.Page_Counter) {
            const pagecount = document.getElementById("pagecount");
            if (pagecount) {
                pagecount.style.display = "block";
            }
        }
        for (const usersetting in userSettings) {
            for (let i = 0; state.length > i; i++) {
                const itemKey = Object.keys(state[i])[0];
                if (itemKey === usersetting) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    state[i] = {[itemKey]: userSettings[usersetting]};
                }
            }
        }
    }, [userSettings]);

    const [doublePage, setDoublePage] = React.useState(false);
    React.useEffect(() => {
        state[5] = {"NoBar": !actionbarON};
    }, [actionbarON, state]);

    React.useEffect(() => {
        if (!doublePage) {
            state[2] = {"No_Double_Page_For_Horizontal": false};
            state[1] = {"Blank_page_At_Begginning": false};
        }
    }, [doublePage, state]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.name);

        const pagecount = document.getElementById("pagecount");
        const styleSheet = document.styleSheets[1];
        switch (event.target.name) {
            case "Page_Counter":
                if (!pagecount) break;
                if (event.target.checked) {
                    pagecount.style.display = "block";
                } else {
                    pagecount.style.display = "none";
                }
                break;
            case "Scroll_bar_visible":
                if (event.target.checked) {
                    styleSheet.deleteRule(0);
                } else {
                    styleSheet.insertRule("::-webkit-scrollbar {display: none;}", 0);
                }
                break;
            case "Double_Page_Mode":
                if (event.target.checked) {
                    setDoublePageMode(true);
                    setDoublePage(true);
                    try {
                        modifyConfigJson(
                            "Double_Page_Mode",
                            "true"
                        );
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    setDoublePageMode(false);
                    setDoublePage(false);
                    try {
                        modifyConfigJson(
                            "Double_Page_Mode",
                            "false"
                        );
                    } catch (e) {
                        console.log(e);
                    }
                    setBlankFirstPage(false);
                    setDPMNoH(false);
                }
                break;
            case "Blank_page_At_Begginning":
                if (event.target.checked) {
                    setBlankFirstPage(true);
                    try {
                        modifyConfigJson(
                            "Blank_page_At_Begginning",
                            "true"
                        );
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    setBlankFirstPage(false);
                    try {
                        modifyConfigJson(
                            "Blank_page_At_Begginning",
                            "false"
                        );
                    } catch (e) {
                        console.log(e);
                    }
                }
                break;
            case "no_dpm_horizontal":
                if (event.target.checked) {
                    setDPMNoH(true);
                    try {
                        modifyConfigJson(
                            "No_Double_Page_For_Horizontal",
                            "true"
                        );
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    setDPMNoH(false);
                    try {
                        modifyConfigJson(
                            "No_Double_Page_For_Horizontal",
                            "false"
                        );
                    } catch (e) {
                        console.log(e);
                    }
                }
                break;
            case "NoBar":
                if (event.target.checked) {
                    setActionbarON(false);
                } else {
                    setActionbarON(true);
                }
                break;
            case "SlideShow":
                if (event.target.checked) {
                    setSlideShow(true);
                } else {
                    setSlideShow(false);
                }
                break;
            case "Manga_Mode":
                if (event.target.checked) {
                    setMangaMode(true);
                    modifyConfigJson("Manga_Mode", "true");
                } else {
                    setMangaMode(false);
                    modifyConfigJson("Manga_Mode", "false");
                }
                break;
            case "Vertical_Reader_Mode":
                if (event.target.checked) {
                    setVIVOn(true);
                    modifyConfigJson("Vertical_Reader_Mode", "true");
                } else {
                    setVIVOn(false);
                    modifyConfigJson("Vertical_Reader_Mode", "false");
                }
                break;
            case "webToonMode":
                if (event.target.checked) {
                    modifyConfigJson("WebToonMode", "true");
                    setVIVOn(true);
                    setWebToonMode(true);
                    fixWidth();
                    state[7] = {"Vertical_Reader_Mode": true};
                } else {
                    modifyConfigJson("WebToonMode", "false");
                    setVIVOn(false);
                    setWebToonMode(false);
                    fixHeight();
                    state[7] = {"Vertical_Reader_Mode": false};
                }
                break;
            default:
                break;
        }

        setState(prevState => {
            return prevState.map((item: any) => {
                const itemKey = Object.keys(item)[0];
                if (itemKey === event.target.name) {
                    const itemValue = item[itemKey];
                    return {[itemKey]: !itemValue};
                }
                return item;
            });
        });
    };

    const [value, setValue] = React.useState(currentPage + 1);

    const [color, setColor] = React.useState('rgba(0,0,0,0)');

    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
        setCurrentPage(newValue as number);
        Reader(LOI, newValue as number);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
        setCurrentPage(event.target.value === '' ? 0 : Number(event.target.value));
        Reader(LOI, event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > LOI.length) {
            setValue(LOI.length);
        }
    };

    const shortname = GetTheName(localStorage.getItem("currentBook")?.split(".")[0]);

    const [isFavorite, setIsFavorite] = React.useState(false);

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth={true}
                    maxWidth="md">
                <DialogTitle>{t("book_settings")}</DialogTitle>
                <DialogContent>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Tooltip title={t('mkread')}>
                            <IconButton
                                onClick={
                                    () => {
                                        ToasterHandler(t("marked_as_read"), "success");
                                        ModifyDB(
                                            "Books",
                                            "reading",
                                            "false",
                                            shortname
                                        ).then(() => {
                                            ModifyDB(
                                                "Books",
                                                "unread",
                                                "false",
                                                shortname
                                            ).then(() => {
                                                // noinspection JSIgnoredPromiseFromCall
                                                ModifyDB(
                                                    "Books",
                                                    "read",
                                                    "true",
                                                    shortname
                                                );
                                            });
                                        });
                                    }
                                }
                            ><Check/></IconButton>
                        </Tooltip>
                        <Tooltip title={t('mkreading')}>
                            <IconButton id="readingbtndetails"
                                        onClick={
                                            () => {
                                                ToasterHandler(t("marked_as_reading"), "success");
                                                ModifyDB(
                                                    "Books",
                                                    "reading",
                                                    "true",
                                                    shortname
                                                ).then(() => {
                                                    ModifyDB(
                                                        "Books",
                                                        "read",
                                                        "false",
                                                        shortname
                                                    ).then(() => {
                                                        // noinspection JSIgnoredPromiseFromCall
                                                        ModifyDB(
                                                            "Books",
                                                            "unread",
                                                            "false",
                                                            shortname
                                                        );
                                                    });
                                                });
                                            }}
                            > <AutoStories/></IconButton></Tooltip>
                        <Tooltip title={t('mkunread')}>
                            <IconButton id="decheckbtn"
                                        onClick={
                                            () => {
                                                ToasterHandler(t("marked_as_unread"), "success");
                                                ModifyDB(
                                                    "Books",
                                                    "reading",
                                                    "false",
                                                    shortname
                                                ).then(() => {
                                                    ModifyDB(
                                                        "Books",
                                                        "read",
                                                        "false",
                                                        shortname
                                                    ).then(() => {
                                                        // noinspection JSIgnoredPromiseFromCall
                                                        ModifyDB(
                                                            "Books",
                                                            "unread",
                                                            "true",
                                                            shortname
                                                        );
                                                    });
                                                });
                                            }}
                            ><Close/></IconButton>
                        </Tooltip>
                        <Tooltip title={t('toogle_fav')}>
                            <IconButton id="favoritebtn"
                                        onClick={
                                            () => {
                                                getFromDB("Books", "favorite FROM Books WHERE PATH='" + localStorage.getItem("currentBook") + "'").then((res) => {
                                                    if (typeof res === "string") {
                                                        res = JSON.parse(res)[0]["favorite"];
                                                    }
                                                    if (res) {
                                                        ToasterHandler(t("remove_fav"), "success");
                                                        setIsFavorite(false);
                                                        // noinspection JSIgnoredPromiseFromCall
                                                        ModifyDB(
                                                            "Books",
                                                            "favorite",
                                                            "false",
                                                            shortname
                                                        );
                                                    } else {
                                                        ToasterHandler(t("add_fav"), "success");
                                                        setIsFavorite(true);
                                                        // noinspection JSIgnoredPromiseFromCall
                                                        ModifyDB(
                                                            "Books",
                                                            "favorite",
                                                            "true",
                                                            shortname
                                                        );
                                                    }
                                                });
                                            }
                                        }
                            >

                                {
                                    isFavorite ? <Favorite/> : <FavoriteBorder/>
                                }

                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('auto_bg_color')}>
                            <IconButton id="autobgbtn"
                                        onClick={
                                            () => {
                                                if (backgroundColorAuto) {
                                                    setBackgroundColorAuto(false);
                                                    modifyConfigJson("Automatic_Background_Color", "false");
                                                } else {
                                                    setBackgroundColorAuto(true);
                                                    modifyConfigJson("Automatic_Background_Color", "true");
                                                }
                                            }
                                        }
                            >
                                <Palette/>
                            </IconButton>
                        </Tooltip>

                    </div>
                    <FormControl component="fieldset" variant="standard" sx={{
                        width: "100%",
                    }}>
                        <FormLabel component="legend">{t('readerSettings')}</FormLabel>
                        <FormGroup>
                            {
                                state.map((item: any, index: number) => {
                                    const itemKey = Object.keys(item)[0];
                                    const itemValue = item[itemKey];
                                    return <FormControlLabel key={index}
                                                             control={
                                                                 <Switch checked={itemValue} id={`id_${itemKey}`}
                                                                         disabled={
                                                                             (!doublePage && (itemKey === "Blank_page_At_Begginning" || itemKey === "no_dpm_horizontal")) ||
                                                                             (VIV_On && (itemKey === "Double_Page_Mode" || itemKey === "Blank_page_At_Begginning" || itemKey === "no_dpm_horizontal"))
                                                                         } onChange={handleChange} name={itemKey}/>
                                                             }
                                                             label={t(itemKey)}
                                    />;
                                })
                            }
                        </FormGroup>

                        <FormLabel component="legend">{t('slideshowIntervalTime')}</FormLabel>

                        <Slider
                            size="small"
                            defaultValue={userSettings.SlideShow_Time | 1}
                            value={slideShowInterval / 1000}
                            step={1}
                            onChange={(e: any) => {
                                setSlideShowInterval(e.target.value * 1000);
                            }}
                            min={1}
                            max={60}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(x) => x + 's'}
                        />
                        <FormLabel component="legend">{t('pageSlider')}</FormLabel>

                        <Grid2 container spacing={2} alignItems="center">
                            <Grid item xs>
                                <Slider
                                    value={value}
                                    onChange={handleSliderChange}
                                    aria-labelledby="input-slider"
                                    max={LOI.length}
                                    step={1}
                                    size='small'
                                    min={1}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={value}
                                    size="small"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        step: 1,
                                        min: 1,
                                        max: LOI.length,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </Grid>
                        </Grid2>
                        <FormLabel component="legend">{t('backgroundColor')}</FormLabel>
                        <MuiColorInput value={color} onChange={(e) => {
                            setColor(e);
                            document.body.style.background = e;
                            modifyConfigJson(
                                "Background_color",
                                e
                            );
                        }}/>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t("close")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}