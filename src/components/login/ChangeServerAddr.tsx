import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from 'react-i18next';
import {changeDomainAndAddr} from "@/utils/Common.ts";
import {Checkbox, FormControlLabel} from "@mui/material";

/**
 * A dialog component for logging in a user.
 *
 * @param onClose - A function to be called when the dialog is closed.
 * @param openModal - A boolean indicating whether the dialog should be open or not.
 * @param okBtn - The text to be displayed on the "OK" button.
 * @param cancelBtn - The text to be displayed on the "Cancel" button.
 * @param profile - An optional `IProfile` object representing the user's profile.
 * @returns A `LoginDialog` component.
 */
export default function ChangeServerAddr({onClose, openModal, okBtn, cancelBtn}: {
    onClose: any,
    openModal: boolean,
    okBtn: string,
    cancelBtn: string
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

    const handleChangeAddAndPort = () => {
        const newPort = (document.getElementById("newPortForChange") as HTMLInputElement).value;
        const newAddr = (document.getElementById("newaddrForChange") as HTMLInputElement).value;
        const isHTTPS = (document.getElementById("newIsHTTPSForChange") as HTMLInputElement).checked;
        if (newPort == null || newAddr == null || isHTTPS == null) return;
        changeDomainAndAddr(newAddr, newPort, isHTTPS);
        window.location.reload();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth={true}
                    maxWidth="md">
                <DialogTitle>Manage server</DialogTitle>
                <DialogContent>
                    <h3>Current Config</h3>
                    <div style={{margin: "15px"}}>
                        <h4>Web Interface</h4>
                        <p>HOST: {window.location.hostname}</p>
                        <p>PORT: {window.location.port}</p>
                        <p>HTTPS: {window.location.protocol === "https:" ? "true" : "false"}</p>

                        <h4>Server</h4>
                        <p>HOST: {localStorage.getItem("hostname")}</p>
                        <p>PORT: {localStorage.getItem("port")}</p>
                        <p>HTTPS: {localStorage.getItem("isHTTPS") === "true" ? "true" : "false"}</p>
                    </div>
                    <h3>Change the SERVER config</h3>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="newaddrForChange"
                        label={t("servHostLabel")}
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        id="newPortForChange"
                        label={t("servNameLabel")}
                        type="number"
                        fullWidth
                        variant="standard"
                    />
                    <FormControlLabel control={<Checkbox id='newIsHTTPSForChange'
                                                         defaultChecked={true}
                    />}
                                      label="Does this server use HTTPS ?"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{cancelBtn}</Button>
                    <Button onClick={handleChangeAddAndPort}>{okBtn}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}