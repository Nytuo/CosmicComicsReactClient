import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip } from '@mui/material';
import { Bookmark, Download, Info, PhotoLibrary, Settings, TipsAndUpdates } from '@mui/icons-material';
import AboutDialog from './AboutDialog.tsx';
import BookmarksDialog from './BookmarksDialog.tsx';
import DownloadDialog from './DownloadDialog.tsx';
import { ToasterHandler } from '../ToasterHandler.tsx';
import { PDP, currentProfile } from '@/utils/Common.ts';
import SettingsDialog from './SettingsDialog.tsx';

/**
 * Navigation dialog component that displays a dialog with navigation options for the CosmicComicsReactClient application.
 * @param onClose - Function to be called when the dialog is closed.
 * @param openModal - Boolean value that determines whether the dialog is open or not.
 * @param CosmicComicsTemp - String value that represents the temporary directory path for the CosmicComicsReactClient application.
 * @returns A React component that displays a navigation dialog.
 */
export default function NavigationDialog({ onClose, openModal, CosmicComicsTemp }: {
	onClose: any,
	openModal: boolean,
	CosmicComicsTemp: string;
}) {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(openModal);
	const [openDownload, setOpenDownload] = React.useState(false);
	const [openAbout, setOpenAbout] = React.useState(false);
	const [openBookmarks, setOpenBookmarks] = React.useState(false);
	const [openSettings, setOpenSettings] = React.useState(false);

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

	//Handlers for the subdialogs

	const handleOpenAbout = () => {
		setOpenAbout(true);
	};

	const handleCloseAbout = () => {
		setOpenAbout(false);
	};

	const handleOpenBookmarks = () => {
		setOpenBookmarks(true);
	};

	const handleCloseBookmarks = () => {
		setOpenBookmarks(false);
	};

	const handleOpenDownload = () => {
		setOpenDownload(true);
	};

	const handleCloseDownload = () => {
		setOpenDownload(false);
	};

	const handleOpenSettings = () => {
		setOpenSettings(true);
	};

	const handleCloseSettings = () => {
		setOpenSettings(false);
	};
	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("navigation")}</DialogTitle>
				<DialogContent>
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
							<IconButton
								onClick={
									() => {
										handleOpenSettings();
									}
								}
							>
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
							<IconButton
								onClick={
									() => {
										fetch(PDP + "/fillBlankImage", {
											method: "POST",
											headers: {
												"Content-Type": "application/json"
											},
											body: JSON.stringify({
												"token": currentProfile.getToken
											}, null, 2)
										}).then(() => {
											ToasterHandler(t("emptyimageressourceswillbefilledupwiththecover"), "success");
										});
									}
								}
							>
								<PhotoLibrary />
							</IconButton>
						</Tooltip>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
			<AboutDialog openModal={openAbout} onClose={handleCloseAbout} />
			<BookmarksDialog openModal={openBookmarks} onClose={handleCloseBookmarks} />
			<DownloadDialog openModal={openDownload} onClose={handleCloseDownload} CosmicComicsTemp={CosmicComicsTemp} />
			<SettingsDialog openModal={openSettings} onClose={handleCloseSettings} />
		</div>
	);
}