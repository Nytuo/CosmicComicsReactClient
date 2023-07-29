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

export default function NavigationDialog({ onClose, openModal }: {
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
						<div id="controller">

							<button class="btn" style="margin: 10px" data-bs-toggle="modal" data-bs-target="#bm" id="id_bm">
								<i class="material-icons">bookmarks</i>
							</button>
							<button class="btn" style="margin: 10px" id="id_settings" data-bs-toggle="modal"
								data-bs-target="#settingsmodal">
								<i class="material-icons">settings</i>
							</button>
							<button class="btn" style="margin: 10px" id="id_openDL" data-bs-toggle="modal"
								data-bs-target="#dlmodal">
								<i class="material-icons">download</i>
							</button>
							<button class="btn" data-bs-toggle="modal" data-bs-target="#about"
								style="margin: 10px; height: 40px" id="id_info">
								<i class="material-icons">info</i>
							</button>
							<a class="btn" href="https://github.com/Nytuo/CosmicComics/wiki" target="_blank"
								style="margin: 10px; height: 40px" id="id_tips-btn">
								<i class="material-icons">tips_and_updates</i>
							</a>
							<button class="btn"
								style="margin: 10px; height: 40px" id="id_firstOfAll">
								<i class="material-icons">photo_library</i>
							</button>
						</div>
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