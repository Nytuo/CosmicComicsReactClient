import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import i18next from 'i18next';

export default function SettingsDialog({ onClose, openModal }: {
	onClose: any,
	openModal: boolean,
}) {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(openModal);
	const [language, setLanguage] = React.useState<any>(localStorage.getItem("language") || "en");
	const [theme, setTheme] = React.useState<any>(localStorage.getItem("theme") || "darkTheme");

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

	const resolveLanguageNameByCode = (code: string) => {
		switch (code) {
			case "fr":
				return "Français";
			case "en":
				return "English";
			case "es":
				return "Espanol";
			case "it":
				return "Italian";
			case "de":
				return "Deutsch";
			case "dev":
				return "Dev";
			default:
				return code;
		}
	};

	const resolveThemeNameByCode = (code: string) => {
		switch (code) {
			case "OLED":
				return "OLED";
			case "blueTheme":
				return "Blue";
			case "darkTheme":
				return "Dark";
			case "sithTheme":
				return "Sith";
			case "redTheme":
				return "Red";
			case "xmasTheme":
				return "Xmas";
			case "lightTheme":
				return "Light";
			case "jediTheme":
				return "Jedi";
			case "halloween":
				return "Halloween";
			case "greenTheme":
				return "Green";
			default:
				return code;
		}
	};


	const locales = ["en", "fr", "es", "it", "de", "dev"];
	const themes = ["OLED", "blueTheme", "darkTheme", "sithTheme", "redTheme", "xmasTheme", "lightTheme", "jediTheme", "halloween", "greenTheme"];

	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("settings")}</DialogTitle>
				<DialogContent>
					<Box>
						<Stack spacing={2}>
							<FormControl fullWidth
								sx={
									{
										marginTop: 2,
									}
								}
							>
								<InputLabel id="demo-simple-select-label">{t("select_a_theme")}</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={theme}
									label={t("select_a_theme")}
									onChange={(e) => {
										setTheme(e.target.value);
										localStorage.setItem("theme", e.target.value);
										window.dispatchEvent(new Event('storage'));
									}}
								>
									{
										themes.map((theme: any, index: number) => {
											return <MenuItem key={index} value={theme}>{resolveThemeNameByCode(theme)}</MenuItem>;
										})
									}
								</Select>
							</FormControl>
							<FormControl fullWidth
								sx={
									{
										width: "100%",
									}
								}
							>
								<InputLabel id="demo-simple-select-label">{t("select_a_language")}</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									value={language}
									label={t("select_a_language")}
									onChange={async (lang: any) => {
										setLanguage(lang.target.value);
										i18next.changeLanguage(lang.target.value);
										localStorage.setItem("language", lang.target.value);
									}}
								>
									{
										locales.map((lang: any, index: number) => {
											return <MenuItem key={index} value={lang}>{resolveLanguageNameByCode(lang)}</MenuItem>;
										})
									}
								</Select>
							</FormControl>
						</Stack></Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}