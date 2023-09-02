import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

export default function SettingsDialog({ onClose, openModal }: {
	onClose: any,
	openModal: boolean,
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

	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("EDIT")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<button id="id_btn_CTN" class="btn pure-material-button-contained" style="width: 100%"
							onclick="clearTN()">
							Clear the thumbnails
						</button>
						<div style="margin: 10px">
							<select aria-label="Default select example" style="margin-bottom: 5px"
								onchange="selectTheme()" id="themeselector">
								<option value="" id="selectTheme_id">Select a theme</option>
							</select>
						</div>
						<div style="margin: 10px">
							<select aria-label="Default select example" style="margin-bottom: 5px"
								onchange="selectLang()" id="languageselector">
								<option value="" id="selectLang_id">Select a language</option>
								<option value="fr" id="selectfr_id">Français</option>
								<option value="en" id="selecten_id">English</option>
								<option value="es" id="selectes_id">Espanol</option>
								<option value="it" id="selectit_id">Italian</option>
								<option value="de" id="selectde_id">Deutsch</option>
								<option value="dev" id="selectdev_id">Dev</option>
							</select>
						</div>
						<button id="id_btn_TE" class="btn pure-material-button-contained" style="width: 100%"
							onclick="ToggleTBY()">
							No theme by event
						</button>
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="passwordLogin"
						label={t("ThePassToWorLabel")}
						type="password"
						fullWidth
						variant="standard"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("send")}</Button>
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}