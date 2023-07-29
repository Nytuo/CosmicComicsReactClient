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

export default function AddingLibraryDialog({ onClose, openModal }: {
	onClose: any,
	openModal: boolean,
}) {
	const [open, setOpen] = React.useState(openModal);
	const { t } = useTranslation();
	useEffect(() => {
		if (openModal !== open) {
			setOpen(openModal);
		}
	}, [openModal]);
	const handleClose = () => {
		setOpen(false);
		onClose();
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{t("EDIT")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<div class="input-field">
							<input class="form-control" type="text" id="namelocation" name="namelocation" autocomplete="off" />
							<label for="namelocation" id="nameOfLib">Name of the library</label>
						</div>
						<br />
						<div class="input-field">

							<input class="form-control" type="text" id="locationa" name="locationa" autocomplete="off" />
							<label for="locationa" id="locationOnServer">Location on the server</label>
						</div>
						<br />
						<label>
							<select id="providerID" name="providerID">
								<option id="opt0" value="" disabled selected>Select a provider</option>
								<option id="opt1" value="1">Marvel (Comics Marvel & Star Wars)</option>
								<option id="opt2" value="2">Anilist (Manga)</option>
								<option id="opt3" value="4">Google Books</option>
								<option id="opt4" value="3">Open Library</option>
								<option id="opt5" value="0">MANUAL</option>
							</select>
						</label>
						<br />
						<button id="sendlib" class="btn btns pure-material-button-contained"
							onclick="return addLibrary({'form':[document.getElementById('namelocation'),document.getElementById('locationa'),document.getElementById('providerID')]});">
							Add Library
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
					<Button onClick={ }>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};