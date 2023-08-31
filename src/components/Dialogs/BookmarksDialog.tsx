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
import { PDP, currentProfile } from '@/utils/Common.ts';
import { IconButton } from '@mui/material';
import { getFromDB } from '@/utils/Fetchers.ts';
import { openBOOKM } from '@/utils/utils.ts';
import { Block } from '@mui/icons-material';

export default function BookmarksDialog({ onClose, openModal }: {
	onClose: any,
	openModal: boolean,
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
	const [bookmarks, setBookmarks] = React.useState<any[]>([]);
	const listBM = async () => {
		const option = {
			method: 'GET', headers: {
				'Content-Type': 'application/json', "token": currentProfile.getToken,
			}
		};
		fetch(PDP + "/BM/getBM", option).then((response) => {
			return response.json();
		}).then(function (info) {
			info.forEach((file: any) => {
				getFromDB("Books", "URLCover FROM Books WHERE ID_BOOK = '" + file["BOOK_ID"] + "'").then(async (resa: any) => {
					console.log(resa);
					setBookmarks(bookmarks => [...bookmarks, {
						URLCover: resa[0].URLCover,
						page: file["page"],
						path: file["PATH"]
					}]
					);
				});
			});
		}).catch(function (error) {
			console.log(error);
		});
	};

	React.useLayoutEffect(() => {
		listBM();
	}, []);

	return (
		<div>
			<Dialog open={open} onClose={handleClose}
				fullWidth={true}
				maxWidth="md"
			>
				<DialogTitle>{t("Bookmark")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<div id="bookmarkContainer" style={{ textAlign: "center" }}>
							{
								bookmarks.length > 0 ?
									bookmarks.map((bookmark: any, index: number) => {
										console.log(bookmark);
										return (
											<div key={index}>
												<Button
													onClick={() => {
														openBOOKM(bookmark.path, bookmark.page);
													}
													}
												>
													{
														t("Seethepage") + bookmark.page
													}
												</Button>
												<img src={bookmark.URLCover} />
											</div>
										);
									}) : <div><Block /></div>
							}
						</div>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}