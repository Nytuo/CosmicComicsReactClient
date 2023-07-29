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

export default function UserAccountDialog({ onClose, openModal }: {
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
						<div className="input-field col s6">
							<input className="form-control" type="text" id="usernameManager" name="usernameManager"
								autoComplete="off" />
							<label htmlFor="usernameManager" id="usernamemanagerLabel">Username : </label>
						</div>
						<br />
						<div className="input-field col s6">

							<input className="form-control" type="text" id="passwordManager" name="passwordManager"
								autoComplete="off" />
							<label htmlFor="passwordManager" id="passwmanagerLabel">Password : </label>
						</div>
						<br />
						<div id="AMImages">
							<template id="template_AMI">
								<img src="Images/account_default/1.jpg" style="width: 60px;height:60px;margin-left:5px;"
									alt="Account profile picture" />
							</template>

						</div>
						<br />
						<button id="delaccount" className="btn btns pure-material-button-contained">
							Delete the Account (THERE IS NO GOING BACK)
						</button>
						<button id="sendbdd" className="btn btns pure-material-button-contained">
							Download a copy of your database
						</button>
						<button id="sendaccount" className="btn btns pure-material-button-contained">
							Apply changes (You will need to reconnect)
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