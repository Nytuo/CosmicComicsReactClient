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

export default function MoreInfoDialog({ onClose, openModal, desc, name, hrefURL, image }: {
	onClose: any,
	openModal: boolean,
	desc?: string,
	name?: string;
	hrefURL?: string;
	image?: string;
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
						<img id="moreinfo_img" className="img-charac" src={
							image
						} alt="" />
						<p id="moreinfo_txt">
							{desc == null ?
								name : (typeof desc === "object" && Object.keys(desc).length > 0) ? name + "<br/>" + JSON.parse(desc) : name + "<br/>" + desc
							}
						</p>
						<a target='_blank' href={
							hrefURL
						} style={{ cursor: "pointer" }} id="moreinfo_btn">
							{t("seeMore")}
						</a>
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
};