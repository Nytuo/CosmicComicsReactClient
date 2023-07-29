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

export default function AboutDialog({ onClose, openModal }: {
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
						<h1>Cosmic Comics</h1>
						<img src="Images/Logo.png" alt="" width="auto" height="80px"
							class="navbar-brand rotate linear infinite" /><img src="Images/LogoTxt.png" alt=""
								class="navbar-brand" height="80px" />
						<p id="version">Version : </p>
						<p id="createdby">Created by Nytuo (Arnaud BEUX)</p>
						<p id="usewhat">This application is a web server based Comics & Manga reader & Collectionner.</p>
						<p id="seewhere">See the project on <a style='cursor: pointer' target='seemore'
							href='https://github.com/Nytuo/CosmicComics'>GitHub</a>, and feel
							free to open an issue on GitHub for any problems you may have, ask for functionalities.</p>
						<p id="project">All the code is available on GitHub, under the <a style='cursor: pointer'
							target='seemore'
							href='https://www.gnu.org/licenses/gpl-3.0.html'>GNU
							GPL-3.0</a> license.</p>
						<p id="translated"></p>
						<p id="beta_test">THEO LEPRINCE</p>
						<a href="https://nytuo.fr" target="_blank"><img
							src="Images/Nytuo_softwares.png" alt="" class="" height="80px" /></a>
						<a href="https://nytuo.fr" target="_blank"><img src="Images/Nytuo website.png"
							alt="" class=""
							height="80px" /></a>
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