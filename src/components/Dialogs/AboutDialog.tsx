import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { PDP } from '@/utils/Common.ts';

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
	const [version, setVersion] = React.useState("");

	useEffect(() => {
		/**
 * Get the version and display it on the info
 */
		fetch(PDP + "/getVersion").then(function (response) {
			return response.text();
		}).then(function (data) {
			setVersion(t("version") + data);
		}).catch(function (error) {
			console.log(error);
		});
	}, []);
	const handleClose = () => {
		setOpen(false);
		onClose();
	};

	const listOfBetaTesters = [
		"Théo LEPRINCE",
		"Arnaud BEUX",
	];

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{t("about")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<h1 style={{ textAlign: "center" }}>Cosmic Comics</h1>
						<img src="Images/Logo.png" alt="" width="auto" height="80px"
							className="navbar-brand rotate linear infinite" /><img src="Images/LogoTxt.png" alt=""
								className="navbar-brand" height="80px" />
						<p id="version">{version}</p>
						<p>{t("createdby")}</p>
						<p>{t("technology_used")}</p>
						<p dangerouslySetInnerHTML={{ __html: t("github_promoted") }}></p>
						<p dangerouslySetInnerHTML={{ __html: t("license") }}></p>
						<p>{t("translation")}</p>
						<p>{t("beta_test")}{
							listOfBetaTesters.map((betaTester, index) => {
								return (
									<span key={index}>
										{betaTester}
										{index < listOfBetaTesters.length - 1 ? ", " : ""}
									</span>
								);
							})
						}
						</p>
						<div style={{ textAlign: "center" }}>
							<a href="https://nytuo.fr" target="_blank"><img
								src="Images/Nytuo_softwares.png" alt="" height="80px" /></a>
							<a href="https://nytuo.fr" target="_blank"><img src="Images/Nytuo website.png"
								height="80px" /></a>
						</div>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};