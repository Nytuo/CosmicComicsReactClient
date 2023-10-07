import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Button, DialogActions, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, IconButton, Input, Slider, Switch, Tooltip } from '@mui/material';
import { AutoStories, Check, Close, Favorite, FavoriteBorder, Palette } from '@mui/icons-material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { MuiColorInput } from 'mui-color-input';
import { Toaster } from '../Toaster.tsx';
import { ModifyDB, getFromDB, modifyConfigJson } from '@/utils/Fetchers.ts';

/**
 * A dialog component for creating a new account (used in the login screen for first setup).
 * @param {boolean} openModal - Determines whether the dialog is open or not.
 * @param {string} title - The title of the dialog.
 * @param {string} text - The text to display in the dialog.
 * @param {string} okBtn - The text to display on the OK button.
 * @param {Function} createFunction - The function to call when the OK button is clicked.
 * @returns {JSX.Element} - A dialog component for creating a new account.
 */
export default function BookSettingsDialog({ onClose, openModal, Reader, LOI, currentPage, setCurrentPage, setDoublePageMode, setBlankFirstPage, setDPMNoH, setActionbarON, actionbarON, slideShow, setSlideShow, setSlideShowInterval, slideShowInterval }: {
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
}) {
	const { t } = useTranslation();
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
		{ "double_page_mode": false },
		{ "blank_at_beggining": false },
		{ "no_dpm_horizontal": false },
		{ "manga_mode": false },
		{ "Slideshow": false },
		{ "nobar": false },
		{ "PageCount": true },
		{ "vertical_reader": false },
		{ "Webtoon_Mode": false },
		{ "scrollBar_visible": true },
	]);

	const [doublePage, setDoublePage] = React.useState(false);
	React.useEffect(() => {
		state[5] = { "nobar": !actionbarON };
	}, [actionbarON, state]);

	React.useEffect(() => {
		if (!doublePage) {
			state[2] = { "no_dpm_horizontal": false };
			state[1] = { "blank_at_beggining": false };
		}
	}, [doublePage, state]);



	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log(event.target.name);

		const pagecount = document.getElementById("pagecount");
		const styleSheet = document.styleSheets[1];
		switch (event.target.name) {
			case "PageCount":
				if (!pagecount) break;
				if (event.target.checked) {
					pagecount.style.display = "block";
				} else {
					pagecount.style.display = "none";
				}
				break;
			case "scrollBar_visible":
				if (event.target.checked) {
					styleSheet.deleteRule(0);
				} else {
					styleSheet.insertRule("::-webkit-scrollbar {display: none;}", 0);
				}
				break;
			case "double_page_mode":
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
			case "blank_at_beggining":
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
			case "nobar":
				if (event.target.checked) {
					setActionbarON(false);
				} else {
					setActionbarON(true);
				}
				break;
			case "Slideshow":
				if (event.target.checked) {
					setSlideShow(true);
				} else {
					setSlideShow(false);
				}
				break;
			default:
				break;
		}

		setState(prevState => {
			const newState = prevState.map((item: any) => {
				const itemKey = Object.keys(item)[0];
				if (itemKey === event.target.name) {
					const itemValue = item[itemKey];
					return { [itemKey]: !itemValue };
				}
				return item;
			});
			return newState;
		});
	};

	const [value, setValue] = React.useState(currentPage + 1);

	const [color, setColor] = React.useState('#000000');

	const handleSliderChange = (event: Event, newValue: number | number[]) => {
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

	function hasNumbers(t) {
		const regex = /\d/g;
		return regex.test(t);
	}
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

	const [isFavorite, setIsFavorite] = React.useState(false);

	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("book_settings")}</DialogTitle>
				<DialogContent>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<Tooltip title={t('mkread')}>
							<IconButton
								onClick={
									() => {
										Toaster(t("marked_as_read"), "success");
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
							><Check /></IconButton>
						</Tooltip>
						<Tooltip title={t('mkreading')}>
							<IconButton id="readingbtndetails"
								onClick={
									() => {
										Toaster(t("marked_as_reading"), "success");
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
												ModifyDB(
													"Books",
													"unread",
													"false",
													shortname
												);
											});
										});
									}}
							> <AutoStories /></IconButton></Tooltip>
						<Tooltip title={t('mkunread')}>
							<IconButton id="decheckbtn"
								onClick={
									() => {
										Toaster(t("marked_as_unread"), "success");
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
												ModifyDB(
													"Books",
													"unread",
													"true",
													shortname
												);
											});
										});
									}}
							><Close /></IconButton>
						</Tooltip>
						<Tooltip title={t('toogle_fav')}>
							<IconButton id="favoritebtn"
								onClick={
									() => {
										getFromDB("Books", "favorite FROM Books WHERE PATH='" + localStorage.getItem("currentBook") + "'").
											then((res) => {
												res = JSON.parse(res)[0]["favorite"];
												if (res) {
													Toaster(t("remove_fav"), "success");
													setIsFavorite(false);
													ModifyDB(
														"Books",
														"favorite",
														"false",
														shortname
													);
												} else {
													Toaster(t("add_fav"), "success");
													setIsFavorite(true);
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
									isFavorite ? <Favorite /> : <FavoriteBorder />
								}

							</IconButton>
						</Tooltip>
						<Tooltip title={t('auto_bg_color')}>
							<IconButton id="autobgbtn"
							>
								<Palette />
							</IconButton>
						</Tooltip>

					</div>
					<FormControl component="fieldset" variant="standard" sx={{
						width: "100%",
					}}>
						<FormLabel component="legend">Reader settings</FormLabel>
						<FormGroup>
							{
								state.map((item: any, index: number) => {
									const itemKey = Object.keys(item)[0];
									const itemValue = item[itemKey];
									return <FormControlLabel
										control={
											<Switch checked={itemValue} key={index} id={`id_${itemKey}`} disabled={
												!doublePage && (itemKey === "blank_at_beggining" || itemKey === "no_dpm_horizontal")
											} onChange={handleChange} name={itemKey} />
										}
										label={t(itemKey)}
									/>;
								})
							}
						</FormGroup>

						<FormLabel component="legend">SlideShow Interval time</FormLabel>

						<Slider
							size="small"
							defaultValue={5}
							value={slideShowInterval / 1000}
							step={1}
							onChange={(e) => {
								setSlideShowInterval(e.target.value * 1000);
							}}
							min={1}
							max={60}
							aria-label="Small"
							valueLabelDisplay="auto"
							valueLabelFormat={(x) => x + 's'}
						/>
						<FormLabel component="legend">Page Slider</FormLabel>

						<Grid2 container spacing={2} alignItems="center">
							<Grid item xs>
								<Slider
									value={typeof value === 'number' ? value : 0}
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
						<FormLabel component="legend">Background color</FormLabel>

						<MuiColorInput value={color} onChange={(e) => {
							setColor(e);
							document.body.style.background = e;
							modifyConfigJson(
								"Background_color",
								e
							);
						}} />
						<FormControlLabel
							control={
								<Switch defaultChecked={false} name={"background_by_theme"} />
							}
							label={t("background_by_theme")}
						/>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("close")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}