import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { PDP } from '@/utils/Common.ts';
import { Toaster } from '../Toaster.tsx';
import { Box, LinearProgress, Stack } from '@mui/material';
import Logger from '@/logger.ts';

/**
 * DownloadDialog component displays a dialog box that allows the user to download a comic book.
 * @param onClose - A function that is called when the dialog is closed.
 * @param openModal - A boolean value that determines whether the dialog is open or not.
 * @param CosmicComicsTemp - A string that represents the temporary directory where the downloaded book is stored.
 * @returns A React component that displays a dialog box with input fields for the user to download a comic book.
 */
export default function DownloadDialog({ onClose, openModal, CosmicComicsTemp }: {
	onClose: any,
	openModal: boolean,
	CosmicComicsTemp: string;
}) {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(openModal);
	const [downloadStarted, setDownloadStarted] = React.useState(false);
	const [openDLDir, setOpenDLDir] = React.useState(false);

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

	/**
	 * Downloads a book from a given URL and sets the download progress.
	 * @returns {Promise<void>} A promise that resolves when the download is complete.
	 */
	async function downloader(): Promise<void> {
		const urlElement = document.getElementById("id_URLDL") as HTMLInputElement;
		const url = urlElement.value;
		const nameElement = document.getElementById("id_NAME_DL") as HTMLInputElement;
		const name = nameElement.value;
		const volElement = document.getElementById("id_VOL_DL") as HTMLInputElement;
		const vol = volElement.value;
		setDownloadStarted(true);
		const option = {
			method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
				"url": url, "name": name, "vol": vol
			}, null, 2)
		};
		await fetch(PDP + '/downloadBook', option).then(() => {
			Toaster("Downloaded", "success");
			document.getElementById("progressbarDL")?.setAttribute("variant", "determinate");
			document.getElementById("progressbarDL")?.setAttribute("value", "100");
			setOpenDLDir(true);
		}).catch(err => {
			Toaster("Error", "error");
			Logger.error(err);
		});
	}

	/**
	 * Redirects the user to the downloaded book directory.
	 */
	function OpenDownloadDir() {
		localStorage.setItem("currentBook", CosmicComicsTemp + "/downloaded_book/");
		window.location.href = "/viewer";

	}

	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("Downloader")}</DialogTitle>
				<DialogContent>
					<p className="red">{t("downloaderSpeech")}</p>
					<Box
						component="form"
						sx={{
							marginTop: "10px",
							width: '100%',
						}}
						noValidate
						autoComplete="off"
					>
						<Stack spacing={2}>
							<TextField id="id_NAME_DL" label="Name of the series" variant="outlined" />
							<TextField id="id_VOL_DL" label="Chapter / Volume" variant="outlined" />
							<TextField id="id_URLDL" label="URL" variant="outlined" />
						</Stack>
					</Box>
					<Box
						sx={
							{
								textAlign: "center",
								marginTop: "10px",
							}
						}
					>
						<Button onClick={() => downloader()} id="id_btnDLStart">{t("startDownload")}
						</Button>
						{
							downloadStarted && <LinearProgress id='progressbarDL' />
						}
						{
							openDLDir && <Button
								onClick={() => { OpenDownloadDir(); }}>{t("openDL")}
							</Button>
						}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("back")}</Button>
				</DialogActions>
			</Dialog>
		</div >
	);
}