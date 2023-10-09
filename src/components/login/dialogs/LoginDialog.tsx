import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IProfile from "../../../interfaces/IProfile.ts";
import {PDP, setCookie} from "@/utils/Common.ts";
import {ToasterHandler} from "../../common/ToasterHandler.tsx";
import {useTranslation} from 'react-i18next';
import Logger from '@/logger.ts';

/**
 * A dialog component for logging in a user.
 *
 * @param onClose - A function to be called when the dialog is closed.
 * @param openModal - A boolean indicating whether the dialog should be open or not.
 * @param title - The title of the dialog.
 * @param text - The text to be displayed in the dialog.
 * @param okBtn - The text to be displayed on the "OK" button.
 * @param cancelBtn - The text to be displayed on the "Cancel" button.
 * @param profile - An optional `IProfile` object representing the user's profile.
 * @returns A `LoginDialog` component.
 */
export default function LoginDialog({onClose, openModal, title, text, okBtn, cancelBtn, profile}: {
    onClose: any,
    openModal: boolean,
    title: string,
    text: string,
    okBtn: string,
    cancelBtn: string,
    profile: IProfile | undefined;
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
     * Handles the login process for the user.
     * If the user's profile and password are valid, sets a cookie for the selected profile and redirects to the collection page.
     * If the password is incorrect, displays an error message.
     * If the profile or password are missing, displays an error message.
     * @returns A Promise that resolves when the login process is complete.
     */
    const handleConnect = async (): Promise<any> => {
        if (profile && document.getElementById("passwordLogin")) {
            Logger.debug(PDP + "/profile/login/" + profile.name + "/" + (document.getElementById("passwordLogin") as HTMLInputElement)?.value.trim());
            await fetch(PDP + "/profile/login/" + profile.name + "/" + (document.getElementById("passwordLogin") as HTMLInputElement)?.value.trim(), {'cache': 'no-cache'}).then(function (response) {
                return response.text();
            }).then(function (data) {
                if (data === "false") {
                    ToasterHandler(t("errors.wrong_password"), "error");
                } else if (!data.includes("404")) {
                    setCookie('selectedProfile', data, 2, document);
                    window.location.href = "collectionner";
                } else {
                    ToasterHandler(t("errors.no_password"), "error");
                }
            }).catch(function (error) {
                Logger.error(error);
            });
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth={true}
                    maxWidth="md">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="passwordLogin"
                        label={t("ThePassToWorLabel")}
                        type="password"
                        fullWidth
                        variant="standard"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleConnect();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{cancelBtn}</Button>
                    <Button onClick={handleConnect}>{okBtn}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}