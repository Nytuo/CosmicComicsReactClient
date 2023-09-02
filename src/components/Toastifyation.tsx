import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { useEffect } from "react";

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