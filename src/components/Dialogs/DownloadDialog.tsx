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

export default function DownloadDialog({ onClose, openModal }: {
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
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("EDIT")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<p class="red" id="downloaderSpeech">This functionality not work on all websites, such as the one's
							which use Google Drive
							or
							no-direct image link. Needs python on the server machine to work</p>
						<div class="mb-3">
							<label for="id_NAME_DL"></label><input class="form-control" type="text"
								placeholder="Name of the series"
								id="id_NAME_DL" />
							<label for="id_VOL_DL"></label><input class="form-control" type="text"
								placeholder="Chapter / Volume"
								id="id_VOL_DL" />
							<label for="id_URLDL"></label><input class="form-control" type="text" placeholder="URL"
								id="id_URLDL" />
						</div>
						<button class="btn pure-material-button-contained" onclick="downloader();" id="id_btnDLStart">Start
							Download
						</button>
						<div class="progress" id="progressbarDL">
							<div id="prgsDL" class="determinate"></div>
						</div>
						<p id="DLtxt"></p>
						<button class="btn pure-material-button-contained invisible" id="id_btnDLOpen"
							onclick="OpenDownloadDir();">Open
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