import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import i18next from 'i18next';

export default function SettingsDialog({ onClose, openModal }: {
	onClose: any,
	openModal: boolean,
}) {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(openModal);
	const [language, setLanguage] = React.useState<any>(localStorage.getItem("language") || "en");

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

	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("EDIT")}</DialogTitle>
				<DialogContent>
					{/* <div>
						<select aria-label="Default select example"
							onChange="selectTheme()" id="themeselector">
							<option value="" id="selectTheme_id">Select a theme</option>
						</select>
					</div> */}
					<FormControl fullWidth
						sx={
							{
								width: "100%",
							}
						}
					>
						<InputLabel id="demo-simple-select-label">{t("selectAProvider")}</InputLabel>
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
							<MenuItem value={"fr"}>Français</MenuItem>
							<MenuItem value={"en"}>English</MenuItem>
							<MenuItem value={"es"}>Espanol</MenuItem>
							<MenuItem value={"it"}>Italian</MenuItem>
							<MenuItem value={"de"}>Deutsch</MenuItem>
							<MenuItem value={"dev"}>Dev</MenuItem>
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}