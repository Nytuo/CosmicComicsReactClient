import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { PDP } from '@/utils/Common.ts';
import Logger from '@/logger.ts';

/**
 * A dialog component that displays information about the application.
 * 
 * @param onClose - A function to be called when the dialog is closed.
 * @param openModal - A boolean indicating whether the dialog should be open or not.
 * @returns A React component.
 */
export default function AboutDialog({ onClose, openModal }: {
	onClose: any,
	openModal: boolean,
}) {
	const [open, setOpen] = React.useState(openModal);
	const [version, setVersion] = React.useState("");
	const { t } = useTranslation();

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

	// This is used to get the version of the application.
	useEffect(() => {
		fetch(PDP + "/getVersion").then(function (response) {
			return response.text();
		}).then(function (data) {
			setVersion(t("version") + " " + data);
			Logger.info("Version: " + data);
		}).catch(function (error) {
			Logger.error(error);
		});
	}, [t]);


	// This is used to display the list of beta testers.
	const listOfBetaTesters = [
		"Théo LEPRINCE",
		"Arnaud BEUX",
	];

	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("about")}</DialogTitle>
				<DialogContent sx={{ textAlign: "center" }}>
					<h1 style={{ textAlign: "center" }}>Cosmic Comics</h1>
					<img src="Images/Logo.png" alt="" width="auto" height="80px"
						className="navbar-brand rotate linear infinite" /><img src="Images/LogoTxt.png" alt=""
							className="navbar-brand" height="80px" />
					<p>{version}</p>
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
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("back")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}