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

export default function CreateAccountDialog({ openModal, title, text, okBtn, createFunction }: {
	openModal: boolean,
	title: string,
	text: string,
	okBtn: string,
	createFunction: any;
}) {
	const [open, setOpen] = React.useState(openModal);
	const { t } = useTranslation();
	useEffect(() => {
		if (openModal !== open) {
			setOpen(openModal);
		}
	}, [openModal, open]);
	return (
		<div>
			<Dialog open={open} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{text}
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						className={"dark:bg-zinc-800 bg-amber-50"}
						id="username"
						label={t("theUserNameLabel")}
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
						id="password"
						label={t("ThePassToWorLabel")}
						type="password"
						fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
						id="port"
						label={t("servNameLabel")}
						type="number"
						fullWidth
						variant="standard"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => createFunction(
						document.getElementById("username") as HTMLInputElement,
						document.getElementById("password") as HTMLInputElement,
						document.getElementById("port") as HTMLInputElement
					)}>{okBtn}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}