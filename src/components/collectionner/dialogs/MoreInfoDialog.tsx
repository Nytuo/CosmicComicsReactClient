import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from 'react-i18next';
import {Avatar, Typography} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import {tryToParse} from '@/utils/utils.ts';

/**
 * A dialog component that displays more information about a certain item.
 * @param onClose - A function that will be called when the dialog is closed.
 * @param openModal - A boolean that determines whether the dialog is open or not.
 * @param desc - A string that contains the description of the item.
 * @param name - A string that contains the name of the item.
 * @param hrefURL - A string that contains the URL of the item.
 * @param image - A string that contains the URL of the image of the item.
 * @param type - A string that determines the type of the item (either "avatar" or "cover").
 * @returns A React component that displays more information about a certain item.
 */
export default function MoreInfoDialog({onClose, openModal, desc, name, hrefURL, image, type}: {
    onClose: any,
    openModal: boolean,
    desc?: string,
    name?: string;
    hrefURL?: string;
    image?: string;
    type?: "avatar" | "cover";
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


    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth={true}
                    maxWidth="md">
                <DialogTitle>{t("seeMore")}</DialogTitle>
                <DialogContent>
                    {
                        type === "cover" ?
                            <img src={image} alt={name} style={{margin: "auto", display: "block", height: "30rem"}}/> :
                            <Avatar src={
                                image
                            } alt={name} sx=
                                        {
                                            {
                                                width: 100,
                                                height: 100,
                                                margin: "auto",
                                            }
                                        }
                            />
                    }
                    <Typography variant="h5" component="div" sx={
                        {
                            marginTop: 2,
                            textAlign: "center",
                            marginBottom: 2,
                        }
                    }>
                        {
                            name
                        }
                    </Typography>
                    <ReactMarkdown children={(desc === null || desc === undefined) ? "" : tryToParse(desc)}
                                   rehypePlugins={[rehypeRaw]}/>
                    <a target='_blank' href={
                        hrefURL
                    } style={{cursor: "pointer"}} id="moreinfo_btn">
                        {t("seeMore")}
                    </a>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t("close")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}