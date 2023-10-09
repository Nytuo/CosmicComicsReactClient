import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from 'react-i18next';
import {ToasterHandler} from '../../common/ToasterHandler.tsx';
import {PDP} from '@/utils/Common.ts';

/**
 * A dialog component for uploading a comic file.
 * @param onClose - A function to close the dialog.
 * @param openModal - A boolean to determine if the dialog is open.
 * @param cosmicComicsTemp - A string representing the temporary folder for the comic file.
 * @returns A React component.
 */
export default function UploadDialog({onClose, openModal, cosmicComicsTemp}: {
    onClose: any,
    openModal: boolean,
    cosmicComicsTemp: string;
}) {
    const {t} = useTranslation();
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

    /**
     * Sends a POST request to upload a comic and opens it in the viewer if successful.
     */
    function uploadAndOpen(): void {
        const form = document.getElementById("uploader") as HTMLFormElement;
        if (!form) return;
        const formData = new FormData(form);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", PDP + "/uploadComic", true);
        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = xhr.responseText;
                if (response === "OK") {
                    const fileUPElement = document.getElementById("fileUp") as HTMLInputElement;
                    if (!fileUPElement) return;
                    if (!fileUPElement.files) return;
                    const url = cosmicComicsTemp + "/uploads/" + fileUPElement.files[0].name;
                    localStorage.setItem("currentBook", url);
                    window.location.href = "/viewer";

                } else {
                    ToasterHandler(t("Failedtoloadfile"), "error");
                }
            }
        };
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth={true}
                    maxWidth="md">
                <DialogTitle>{t("upload")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <iframe name="dummyUpload" id="dummyUpload" style={{display: "none"}}
                                title="dummyUpload"></iframe>
                        <form action="/" target="dummyUpload" onSubmit={uploadAndOpen} method="post" id="uploader"
                              encType="multipart/form-data">
                            <input type="file" name="ComicTemp" id="fileUp"/>
                            <Button style={{marginTop: "10px"}} type="submit"
                                    id="uploadBtn">Upload
                            </Button>
                            <Button style={{marginTop: "10px"}} type="reset"
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
}