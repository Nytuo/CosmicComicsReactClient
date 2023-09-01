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
import { PDP } from '@/utils/Common.ts';
import { Toaster } from '../Toaster.tsx';
import { Box, LinearProgress, Stack } from '@mui/material';

export default function DownloadDialog({ onClose, openModal, CosmicComicsTemp }: {
	onClose: any,
	openModal: boolean,
	CosmicComicsTemp: string;
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

	const [openDLDir, setOpenDLDir] = React.useState(false);
	const [downloadStarted, setDownloadStarted] = React.useState(false);

	async function downloader() {
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
			console.log(err);
		});
	}
	React.useLayoutEffect(() => {

	});


	function OpenDownloadDir() {
		window.location.href = "viewer.html?" + CosmicComicsTemp + "/downloaded_book/";
	}
	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("Downloader")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
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

					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("back")}</Button>
				</DialogActions>
			</Dialog>
		</div >
	);
}