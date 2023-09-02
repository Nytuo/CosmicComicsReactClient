import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import VerticalStepper from '../VerticalStepper';

/**
 * A dialog component for creating a new account (used in the login screen for first setup).
 * @param {boolean} openModal - Determines whether the dialog is open or not.
 * @param {string} title - The title of the dialog.
 * @param {string} text - The text to display in the dialog.
 * @param {string} okBtn - The text to display on the OK button.
 * @param {Function} createFunction - The function to call when the OK button is clicked.
 * @returns {JSX.Element} - A dialog component for creating a new account.
 */
export default function CreateAccountDialog({ openModal, title, text, createFunction }: {
	openModal: boolean,
	title: string,
	text: string,
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

					<VerticalStepper steps={[
						{
							label: t("theUserNameLabel"),
							content: <TextField
								autoFocus
								margin="dense"
								className={"dark:bg-zinc-800 bg-amber-50"}
								id="username"
								label={t("theUserNameLabel")}
								type="text"
								fullWidth
								variant="standard"
							/>
						},
						{
							label: t("ThePassToWorLabel"),
							content: <TextField
								margin="dense"
								id="password"
								label={t("ThePassToWorLabel")}
								type="password"
								fullWidth
								variant="standard"
							/>
						},
						{
							label: t("servNameLabel"),
							content: <TextField
								margin="dense"
								id="port"
								label={t("servNameLabel")}
								type="number"
								fullWidth
								variant="standard"
							/>

						}
					]}
						onFinish={() => createFunction(
							document.getElementById("username") as HTMLInputElement,
							document.getElementById("password") as HTMLInputElement,
							document.getElementById("port") as HTMLInputElement
						)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}