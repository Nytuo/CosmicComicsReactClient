import * as React from 'react';
import { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import VerticalStepper from '../../common/VerticalStepper.tsx';

/**
 * A dialog component for creating a new account (used in the login screen for first setup).
 * @param {boolean} openModal - Determines whether the dialog is open or not.
 * @param title - The title of the dialog.
 * @param text - The text of the dialog.
 * @param createFunction - The function that creates the account.
 * @returns {JSX.Element} - A dialog component for creating a new account.
 */
export default function CreateAccountDialog({ openModal, title, text, createFunction }: {
    openModal: boolean,
    title: string,
    text: string,
    createFunction: any;
}): JSX.Element {
    const [open, setOpen] = React.useState(openModal);
    const { t } = useTranslation();
    useEffect(() => {
        if (openModal !== open) {
            setOpen(openModal);
        }
    }, [openModal, open]);
    return (
        <div>
            <Dialog open={open} fullWidth={true}
                maxWidth="md">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {text}
                    </DialogContentText>

                    <VerticalStepper steps={[
                        {
                            label: t("theUserNameLabel"),
                            content: <TextField
                                autoFocus
                                margin="dense"
                                className={"dark:bg-zinc-800 bg-amber-50"}
                                id="username"
                                label={t("theUserNameLabel")}
                                type="text"
                                fullWidth
                                variant="standard"
                                required
                            />
                        },
                        {
                            label: t("ThePassToWorLabel"),
                            content: <TextField
                                margin="dense"
                                id="password"
                                label={t("ThePassToWorLabel")}
                                type="password"
                                fullWidth
                                variant="standard"
                            />
                        }
                    ]}
                        onFinish={() => createFunction(
                            document.getElementById("username") as HTMLInputElement,
                            document.getElementById("password") as HTMLInputElement,
                        )}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}