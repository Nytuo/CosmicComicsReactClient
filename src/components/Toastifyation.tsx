import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { useEffect } from "react";

/**
 * A component that displays a toast notification using MUI Snackbar and Alert components.
 * @param {Object} props - The component props.
 * @param {boolean} props.openToast - A boolean indicating whether the toast should be open or closed.
 * @param {string} props.text - The text to be displayed in the toast notification.
 * @param {AlertColor} props.type - The type of the toast notification (success, error, warning, info).
 * @param {Function} props.onClose - A function to be called when the toast notification is closed.
 * @returns {JSX.Element} - A JSX element representing the toast notification.
 */
export function Toastifycation({ openToast, text, type, onClose }: {
	openToast: boolean,
	text: string,
	type: AlertColor,
	onClose: any;
}) {
	const [open, setOpen] = React.useState(openToast);
	useEffect(() => {
		if (openToast !== open) {
			setOpen(openToast);
		}
	}, [openToast, open]);
	return (
		<Snackbar open={open} autoHideDuration={6000} onClose={() => {
			setOpen(false);
			onClose();
		}}>
			<Alert onClose={() => setOpen(false)} severity={type} sx={{ width: '100%' }}>
				{text}
			</Alert>
		</Snackbar>
	);
}