import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Badge, Stack } from '@mui/material';
import { PDP, currentProfile } from '@/utils/Common.ts';
import VerticalStepper from '../VerticalStepper';

/**
 * A dialog component for creating or editing user accounts.
 *
 * @param forWhat - The purpose of the dialog, either 'edit' or 'create'.
 * @param onClose - A function to be called when the dialog is closed.
 * @param openModal - A boolean indicating whether the dialog should be open or not.
 * @returns A React component.
 */
export default function UserAccountDialog({ forWhat, onClose, openModal }: {
	forWhat: 'edit' | 'create',
	onClose: any,
	openModal: boolean,
}) {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(openModal);
	const [nbImages, setNbImages] = React.useState<number[]>([]);
	const [selectedImage, setSelectedImage] = React.useState<number>(-1);
	const [username, setUsername] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");

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

	//Get the number of images in the folder
	useEffect(() => {
		fetch(PDP + "/profile/custo/getNumber").then((res) => {
			return res.json();
		}).then((data) => {
			setNbImages(Array.from({ length: data.length }, (_, i) => i));
		});
	}, []);

	return (
		<div>
			<Dialog open={open} onClose={handleClose}
				maxWidth="md"
				fullWidth={true}
			>
				<DialogTitle>{forWhat == 'edit' ? t("EDIT") : t("Createanewuser")}</DialogTitle>
				<DialogContent>
					{
						forWhat === "edit" ?
							<Stack spacing={1}>
								<TextField
									autoFocus
									margin="dense"
									id="usernameEdit"
									label={t("theUserNameLabel")}
									type="text"
									fullWidth
									variant="standard"
									defaultValue={currentProfile.getName}
									onChange={(e) => {
										setUsername(e.target.value);
									}}
								/>
								<TextField
									margin="dense"
									id="passwordEdit"
									label={t("ThePassToWorLabel")}
									type="password"
									fullWidth
									variant="standard"
									onChange={(e) => {
										setPassword(e.target.value);
									}}
								/>
								<div id="AMImages" style={{ textAlign: "center" }}>
									{
										nbImages.map((_, index) => {
											if (index === 0) return;
											if (index === selectedImage) {
												return (
													<Badge key={index} color="success" badgeContent=" " variant='dot'><img src={"Images/account_default/" + index + ".jpg"}
														onClick={(e) => {
															const oldone = document.getElementById("newImage");
															setSelectedImage(index);
															if (oldone == null) {
																e.currentTarget.id = "newImage";
															} else {
																oldone.removeAttribute("id");
																e.currentTarget.id = "newImage";
															}
														}
														}
														style={{ width: "60px", height: "60px", marginLeft: "5px" }}
														alt="Account profile picture" /></Badge>
												);
											} else {
												return (
													<img key={index} src={"Images/account_default/" + index + ".jpg"}
														onClick={(e) => {
															const oldone = document.getElementById("newImage");
															setSelectedImage(index);
															if (oldone == null) {
																e.currentTarget.id = "newImage";
															} else {
																oldone.removeAttribute("id");
																e.currentTarget.id = "newImage";
															}
														}
														}
														style={{ width: "60px", height: "60px", marginLeft: "5px" }}
														alt="Account profile picture" />
												);
											}

										})

									}
								</div>

								<Button variant="contained" color='error' id="delaccount" onClick={
									() => {
										currentProfile.DeleteAccount();
									}
								}>
									{t("delAccount")}
								</Button>
								<Button variant="contained" id="sendbdd"
									onClick={
										() => {
											currentProfile.DownloadBDD();
										}
									}
								>
									{t("downloadCopyBDD")}
								</Button>
							</Stack>
							:
							<VerticalStepper steps={[{
								label: t("theUserNameLabel"),
								content: <TextField
									autoFocus
									margin="dense"
									id="usernameEdit"
									label={t("theUserNameLabel")}
									type="text"
									fullWidth
									variant="standard"
								/>
							}, {
								label: t("ThePassToWorLabel"),
								content: <TextField
									margin="dense"
									id="passwordEdit"
									label={t("ThePassToWorLabel")}
									type="password"
									fullWidth
									variant="standard"
								/>
							},
							{
								label: t("Profile_Picture"),
								content: <div id="AMImages" style={{ textAlign: "center" }}>
									{
										nbImages.map((_, index) => {
											if (index === 0) return;
											if (index === selectedImage) {
												return (
													<Badge color="success" badgeContent=" " variant='dot'><img src={"Images/account_default/" + index + ".jpg"}
														id='newImage'
														style={{ width: "60px", height: "60px", marginLeft: "5px" }}
														alt="Account profile picture" /></Badge>
												);
											} else {
												return (
													<img src={"Images/account_default/" + index + ".jpg"}
														onClick={() => {
															setSelectedImage(index);
														}
														}
														style={{ width: "60px", height: "60px", marginLeft: "5px" }}
														alt="Account profile picture" />
												);
											}

										})

									}
								</div>
							}
							]}
								onFinish={() => {
									setTimeout(() => {
										currentProfile.createAccount(document.querySelector("#usernameEdit").value, document.querySelector("#passwordEdit").value, document.querySelector("#newImage").src);
									}, 500);
								}}
							/>
					}

				</DialogContent>
				<DialogActions>
					{
						forWhat === "edit" ? <Button onClick={
							() => {
								currentProfile.modifyAccount(username, password, PDP + "/Images/account_default/" + selectedImage + ".jpg");
							}
						}>{t("applyChanges")}</Button> : <></>
					}
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}