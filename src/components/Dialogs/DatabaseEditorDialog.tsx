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

export default function DatabaseEditorDialog({ onClose, openModal }: {
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

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{t("EDIT")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<p>Warning : Be careful when you modify those fields, DO NOT change the way they are written. If an item
							have '"', { } or [] at the beginning and at the end DO NOT remove them change only the
							content. The required fields have to respect this
							pattern.</p>
						<div id="commonEdit">
							<label htmlFor="lockCheck">Lock this item ? (That prevent the metadata to be overwritten when refresh
								and disable
								rematch)</label>
							<input type="checkbox" id="lockCheck" />


							<label>
								Path
								<input type="text" id="edit_PATH" />
							</label>
							<label>
								Description
								<input type="text" id="edit_description" />
							</label>
						</div>
						<div id="seriesEdit">
							<label>
								Title <span style="color: red">*</span>
								<input type="text" id="edit_title" />
							</label>

							<label>
								Cover <span style="color: red">*</span>
								<input type="text" id="edit_cover" />
							</label>
							<label>
								Source <span style="color: red">*</span>
								<input type="text" id="edit_SOURCE" />
							</label>
							<label>
								Link BG <span style="color: red">*</span>
								<input type="text" id="edit_BG" />
							</label>
							<label>
								Status
								<input type="text" id="edit_statut" />
							</label>
							<label>
								Start Date
								<input type="text" id="edit_start_date" />
							</label>
							<label>
								End Date
								<input type="text" id="edit_end_date" />
							</label>
							<label>
								Score
								<input type="text" id="edit_Score" />
							</label>
							<label>
								Genres <span style="color: red">*</span>
								<input type="text" id="edit_genres" />
							</label>
							<label>
								Trending
								<input type="text" id="edit_TRENDING" />
							</label>
							<label>
								Volumes <span style="color: red">*</span>
								<input type="text" id="edit_volumes" />
							</label>
							<label>
								Chapters
								<input type="text" id="edit_chapters" />
							</label>

						</div>
						<div id="bookEdit">
							<label>
								Title <span style="color: red">*</span>
								<input type="text" id="edit_NOM" />
							</label>
							<label>
								URLCover <span style="color: red">*</span>
								<input type="text" id="edit_URLCover" />
							</label>
							<label>
								issue Number
								<input type="text" id="edit_issueNumber" />
							</label>
							<label>
								format
								<input type="text" id="edit_format" />
							</label>
							<label>
								page Count
								<input type="text" id="edit_pageCount" />
							</label>
							<label>
								URLs <span style="color: red">*</span>
								<input type="text" id="edit_URLs" />
							</label>
							<label>
								series <span style="color: red">*</span>
								<input type="text" id="edit_series" />
							</label>
							<label>
								prices <span style="color: red">*</span>
								<input type="text" id="prices" />
							</label>
							<label>
								dates <span style="color: red">*</span>
								<input type="text" id="dates" />
							</label>
						</div>
					</DialogContentText>
					<TextField
						autoFocus
						required
						margin="dense"
						id="passwordLogin"
						label={t("ThePassToWorLabel")}
						type="text"
						fullWidth
						variant="outlined"
					/>
					<TextField
						required
						margin="dense"
						id="passwordLogin"
						label={t("ThePassToWorLabel")}
						type="text"
						fullWidth
						variant="outlined"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("cancel")}</Button>
					<Button onClick={() => { throw new Error("Not implemented"); }}>{t("send")}</Button>
				</DialogActions>
			</Dialog>
		</div >
	);
};