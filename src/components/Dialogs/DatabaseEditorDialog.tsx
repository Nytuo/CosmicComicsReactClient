import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useLayoutEffect } from "react";
import { useTranslation } from 'react-i18next';
import { IBook } from '@/interfaces/IBook';
import { PDP, currentProfile } from '@/utils/Common.ts';
import { Checkbox, FormControlLabel } from '@mui/material';
import DatabaseEditorSkeleton from '../DatabaseEditorSkeleton';

export default function DatabaseEditorDialog({ onClose, openModal, TheBook, type }: {
	onClose: any,
	openModal: boolean,
	TheBook: IBook,
	type: 'series' | 'book';
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
		setSend(false);
		onClose();
	};

	const [send, setSend] = React.useState(false);

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
					<Button onClick={() => { setSend(true); }}>{t("send")}</Button>
				</DialogActions>
			</Dialog>
		</div >
	);
}