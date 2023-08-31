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
import { Divider, Grid, Stack } from '@mui/material';
import { PDP } from '@/utils/Common.ts';

export default function UserAccountDialog({ forWhat, onClose, openModal }: {
	forWhat: 'edit' | 'create',
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
	const [nbImages, setNbImages] = React.useState<number[]>([]);
	useEffect(() => {
		fetch(PDP + "/profile/custo/getNumber").then((res) => {
			return res.json();
		}).then((data) => {
			setNbImages(Array.from({ length: data.length }, (_, i) => i));
		});
	}, []);

	return (
		<div>
			<Dialog open={open} onClose={handleClose}
				maxWidth="md"
				fullWidth={true}
			>
				<DialogTitle>{forWhat == 'edit' ? t("EDIT") : t("Createanewuser")}</DialogTitle>
				<DialogContent>
					<Stack spacing={1}>
						<TextField
							autoFocus
							margin="dense"
							id="usernameEdit"
							label={t("theUserNameLabel")}
							type="text"
							fullWidth
							variant="standard"
						/>
						<TextField
							margin="dense"
							id="passwordEdit"
							label={t("ThePassToWorLabel")}
							type="password"
							fullWidth
							variant="standard"
						/>
						<div id="AMImages" style={{ textAlign: "center" }}>
							{
								nbImages.map((_, index) => {
									if (index === 0) return;
									return (<img src={"Images/account_default/" + index + ".jpg"}
										onClick={(e) => {
											const oldone = document.getElementById("newImage");
											if (oldone == null) {
												e.currentTarget.id = "newImage";
											} else {
												oldone.removeAttribute("id");
												e.currentTarget.id = "newImage";
											}
										}
										}
										style={{ width: "60px", height: "60px", marginLeft: "5px" }}
										alt="Account profile picture" />);
								})

							}
						</div>

						<Button variant="contained" id="delaccount">
							{t("delAccount")}
						</Button>
						<Button variant="contained" id="sendbdd">
							{t("downloadCopyBDD")}
						</Button>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("applyChanges")}</Button>
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}