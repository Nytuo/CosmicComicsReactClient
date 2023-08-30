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
import { Toaster } from '../Toaster.tsx';
import { PDP } from '@/utils/Common.ts';

export default function UploadDialog({ onClose, openModal, cosmicComicsTemp }: {
	onClose: any,
	openModal: boolean,
	cosmicComicsTemp: string;
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

	//Open a single file
	function openInViewer() {
		const form = document.getElementById("uploader") as HTMLFormElement;
		if (!form || form === null) return;
		const formData = new FormData(form);
		const xhr = new XMLHttpRequest();
		xhr.open("POST", PDP + "/uploadComic", true);
		xhr.send(formData);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				const response = xhr.responseText;
				if (response === "OK") {
					const fileUPElement = document.getElementById("fileUp") as HTMLInputElement;
					if (!fileUPElement || fileUPElement === null) return;
					if (!fileUPElement.files || fileUPElement.files === null) return;
					const url = cosmicComicsTemp + "/uploads/" + fileUPElement.files[0].name;
					const encoded = encodeURIComponent(url.replaceAll("/", "%C3%B9"));
					window.location.href = "viewer.html?" + encoded;
				} else {
					Toaster(t("Failedtoloadfile"), "error");
				}
			}
		};
	}

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{t("upload")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<iframe name="dummyUpload" id="dummyUpload" style={{ display: "none" }} title="dummyUpload"></iframe>
						<form action="/" target="dummyUpload" onSubmit={openInViewer} method="post" id="uploader"
							encType="multipart/form-data">
							<input type="file" name="ComicTemp" id="fileUp" />
							<Button style={{ marginTop: "10px" }} type="submit"
								id="uploadBtn">Upload
							</Button>
							<Button style={{ marginTop: "10px" }} type="reset"
								id="resetBtn">Reset
							</Button>
						</form>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};