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

export default function MoreInfoDialog({ onClose, openModal }: {
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
						<img id="moreinfo_img" class="img-charac" src="#" alt="" />
						<p id="moreinfo_txt"></p>
						<a class="btn pure-material-button-contained" style="cursor: pointer" id="moreinfo_btn"></a>
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