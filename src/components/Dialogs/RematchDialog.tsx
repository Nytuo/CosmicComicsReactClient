import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import RematchSkeleton from '../RematchSkeleton';

/**
 * A dialog component for rematch feature.
 * @param onClose - A function to be called when the dialog is closed.
 * @param openModal - A boolean value to indicate whether the dialog is open or not.
 * @param provider - An object containing information about the provider.
 * @param type - A string value to indicate the type of rematch ("book" or "serie").
 * @returns A React component.
 */
export default function RematchDialog({ onClose, openModal, provider, type }: {
	onClose: any,
	openModal: boolean,
	provider: any,
	type: "book" | "serie",
}) {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(openModal);

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

	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("rematchTitle")}</DialogTitle>
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