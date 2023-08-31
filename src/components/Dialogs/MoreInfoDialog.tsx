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
import { Avatar, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { tryToParse } from '@/utils/utils.ts';

export default function MoreInfoDialog({ onClose, openModal, desc, name, hrefURL, image, type }: {
	onClose: any,
	openModal: boolean,
	desc?: string,
	name?: string;
	hrefURL?: string;
	image?: string;
	type?: "avatar" | "cover";
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


	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("seeMore")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{
							type === "cover" ? <img src={image} alt={name} style={{ margin: "auto", display: "block", height: "30rem" }} /> :
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


						<ReactMarkdown children={(desc === null || desc === undefined) ? "" : tryToParse(desc)} rehypePlugins={[rehypeRaw]} />
						<a target='_blank' href={
							hrefURL
						} style={{ cursor: "pointer" }} id="moreinfo_btn">
							{t("seeMore")}
						</a>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("close")}</Button>
				</DialogActions>
			</Dialog>
		</div >
	);
};