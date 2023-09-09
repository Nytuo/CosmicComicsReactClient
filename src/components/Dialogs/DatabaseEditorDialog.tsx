import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { IBook } from '@/interfaces/IBook';
import DatabaseEditorSkeleton from '../DatabaseEditorSkeleton';

/**
 * A dialog component for editing a book or series in the database.
 * @param onClose - A function to close the dialog.
 * @param openModal - A boolean indicating whether the dialog should be open.
 * @param TheBook - The book or series to edit.
 * @param type - The type of item being edited ('series' or 'book').
 * @returns A React component that displays a dialog for editing a book or series in the database.
 */
export default function DatabaseEditorDialog({ onClose, openModal, TheBook, type }: {
	onClose: any,
	openModal: boolean,
	TheBook: IBook,
	type: 'series' | 'book';
}) {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(openModal);
	const [send, setSend] = React.useState(false);

	// This is used to update the state of the dialog when the parent component changes the value of openModal.
	useEffect(() => {
		if (openModal !== open) {
			setOpen(openModal);
		}
	}, [openModal, open]);

	// This is used to update the state of the parent component when the dialog is closed.
	const handleClose = () => {
		setOpen(false);
		setSend(false);
		onClose();
	};


	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("EDIT")}</DialogTitle>
				<DialogContent>
					<DatabaseEditorSkeleton TheBook={TheBook} type={type} triggerSend={send} />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("cancel")}</Button>
					<Button onClick={() => {
						setSend(true);
						setTimeout(() => {
							handleClose();
						}, 500);
					}}>{t("send")}</Button>
				</DialogActions>
			</Dialog>
		</div >
	);
}