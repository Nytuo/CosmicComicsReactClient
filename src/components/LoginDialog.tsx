import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useEffect} from "react";
import IProfile from "@/utils/IProfile";
import {PDP, setCookie} from "@/utils/common";
import {useSnackbar} from "notistack";
import {Toastifycation} from "@/components/Toastifycation";
import {render} from "react-dom";
import {createRoot} from "react-dom/client";
import {Toaster} from "@/components/Toaster";

export default function LoginDialog({onClose, openModal, title, text, okBtn, cancelBtn, profile}: {
	onClose: any,
	openModal: boolean,
	title: string,
	text: string,
	okBtn: string,
	cancelBtn: string,
	profile: IProfile | undefined
}) {
	const [open, setOpen] = React.useState(openModal);
	const {enqueueSnackbar} = useSnackbar();
	useEffect(() => {
		if (openModal !== open) {
			setOpen(openModal);
		}
	}, [openModal]);
	const handleClose = () => {
		setOpen(false);
		onClose();
	};
	const handleConnect = async (): Promise<any> => {
		if (profile && document.getElementById("passwordLogin")) {
			console.log(PDP + "/profile/login/" + profile.name + "/" + (document.getElementById("passwordLogin") as HTMLInputElement)?.value.trim());
			await fetch(PDP + "/profile/login/" + profile.name + "/" + (document.getElementById("passwordLogin") as HTMLInputElement)?.value.trim(), {'cache': 'no-cache'}).then(function (response) {
				return response.text();
			}).then(function (data) {
				if (data === "false") {
					Toaster("Wrong password", "error");
				} else if (!data.includes("404")) {
					setCookie('selectedProfile', data, 2, document);
					window.location.href = "collectionner.html";
				} else {
					Toaster("Insert a password", "error");
				}
			}).catch(function (error) {
				console.log(error);
			});
		}
	};
	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{text}
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="passwordLogin"
						label="Password"
						type="password"
						fullWidth
						variant="standard"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{cancelBtn}</Button>
					<Button onClick={handleConnect}>{okBtn}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}