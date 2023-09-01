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
import { providerEnum } from '@/utils/utils.ts';
import { Marvel } from '@/API/Marvel.ts';
import { Toaster } from '../Toaster';
import { OpenLibrary } from '@/API/OpenLibrary';
import { GoogleBooks } from '@/API/GoogleBooks';
import { API } from '@/API/API';
import Card from '../Card';
import Book from '@/utils/Book';
import { Anilist } from '@/API/Anilist';
import RematchSkeleton from '../RematchSkeleton';

export default function RematchDialog({ onClose, openModal, provider, type }: {
	onClose: any,
	openModal: boolean,
	provider: any,
	type: "book" | "serie",
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
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("EDIT")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<RematchSkeleton provider={provider} type={type} />
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("done")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}