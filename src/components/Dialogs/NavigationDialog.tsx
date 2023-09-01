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
import { Icon, IconButton, Tooltip } from '@mui/material';
import { Bookmark, Download, Info, PhotoLibrary, Settings, TipsAndUpdates } from '@mui/icons-material';
import AboutDialog from './AboutDialog.tsx';
import BookmarksDialog from './BookmarksDialog.tsx';
import DownloadDialog from './DownloadDialog.tsx';

export default function NavigationDialog({ onClose, openModal, CosmicComicsTemp }: {
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
	const [openAbout, setOpenAbout] = React.useState(false);
	const handleOpenAbout = (event: React.MouseEvent<HTMLElement>) => {
		setOpenAbout(true);
	};

	const handleCloseAbout = () => {
		setOpenAbout(false);
	};

	const [openBookmarks, setOpenBookmarks] = React.useState(false);
	const handleOpenBookmarks = (event: React.MouseEvent<HTMLElement>) => {
		setOpenBookmarks(true);
	};

	const handleCloseBookmarks = () => {
		setOpenBookmarks(false);
	};

	const [openDownload, setOpenDownload] = React.useState(false);
	const handleOpenDownload = (event: React.MouseEvent<HTMLElement>) => {
		setOpenDownload(true);
	};

	const handleCloseDownload = () => {
		setOpenDownload(false);
	};
	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("navigation")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<div id="controller"
							style={
								{
									display: "flex",
									justifyContent: "space-around",
									alignItems: "center",
								}
							}
						>
							<Tooltip title={t('Bookmark')}>
								<IconButton onClick={handleOpenBookmarks}>
									<Bookmark />
								</IconButton>
							</Tooltip>
							<Tooltip title={t('settings')}>
								<IconButton>
									<Settings />
								</IconButton>
							</Tooltip>
							<Tooltip title={t('download')}>
								<IconButton
									onClick={handleOpenDownload}
								>
									<Download />
								</IconButton>
							</Tooltip>
							<Tooltip title={t('about')}>
								<IconButton
									onClick={handleOpenAbout}
								>
									<Info />
								</IconButton>
							</Tooltip>
							<Tooltip title={t('wiki')}>
								<IconButton
									onClick={() => {
										window.open("https://github.com/Nytuo/CosmicComics/wiki", "_blank");
									}
									}
								>
									<TipsAndUpdates />
								</IconButton>
							</Tooltip>
							<Tooltip title={t('ExtractMissingImg')}>
								<IconButton>
									<PhotoLibrary />
								</IconButton>
							</Tooltip>
						</div>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
			<AboutDialog openModal={openAbout} onClose={handleCloseAbout} />
			<BookmarksDialog openModal={openBookmarks} onClose={handleCloseBookmarks} />
			<DownloadDialog openModal={openDownload} onClose={handleCloseDownload} CosmicComicsTemp={CosmicComicsTemp} />
		</div>
	);
}