import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useEffect, useLayoutEffect } from "react";
import { useTranslation } from 'react-i18next';
import { IBook } from '@/interfaces/IBook';
import { PDP, currentProfile } from '@/utils/Common.ts';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Toaster } from './Toaster';

export default function DatabaseEditorSkeleton({ TheBook, type, triggerSend, trackedMode }: {
    TheBook: IBook,
    type: 'series' | 'book';
    triggerSend: any;
    trackedMode?: boolean;
}) {
    const { t } = useTranslation();

    useLayoutEffect(() => {
        if (TheBook) {
            document.querySelectorAll("#commonEdit>label>input").forEach((e: any) => {
                e.value = TheBook[e.id.replaceAll("edit_", "")];
            });
            if (type === 'series') {
                document.querySelectorAll("#seriesEdit>label>input").forEach((e: any) => {
                    e.value = TheBook[e.id.replaceAll("edit_", "")];
                });
            } else if (type === 'book') {
                document.querySelectorAll("#bookEdit>label>input").forEach((e: any) => {
                    e.value = TheBook[e.id.replaceAll("edit_", "")];
                });
            }
        }
    }, []);

    useEffect(() => {
        if (triggerSend) {
            handleSend();
        }
    }, [triggerSend]);

    const handleSend = async () => {
        const values = [];
        const columns = [];
        document.querySelectorAll("#commonEdit>div>div>input").forEach((e: any) => {
            console.log(e.value);
            values.push(e.value.replaceAll("'", "''").replaceAll('"', "'"));
            columns.push(e.id.replaceAll("edit_", ""));
        });
        if (type === 'series') {
            document.querySelectorAll("#seriesEdit>div>div>input").forEach((e: any) => {
                values.push(e.value.replaceAll("'", "''").replaceAll('"', "'"));
                columns.push(e.id.replaceAll("edit_", ""));
            });
        } else if (type === 'book') {
            document.querySelectorAll("#bookEdit>div>div>input").forEach((e: any) => {
                values.push(e.value.replaceAll("'", "''").replaceAll('"', "'"));
                columns.push(e.id.replaceAll("edit_", ""));
            });
        }
        const lockCheck = document.getElementById("lockCheck") as HTMLInputElement;
        values.push(lockCheck ? lockCheck.checked : false);
        columns.push("lock");
        console.log(trackedMode);
        await fetch(PDP + "/DB/update", {
            method: "POST", headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                "token": currentProfile.getToken,
                "table": type === 'series' ? "Series" : "Books",
                "type": "edit",
                "column": columns,
                "whereEl": trackedMode ? "REPLACE THIS BY A VALUE" : TheBook.PATH,
                "value": values,
                "where": trackedMode ? "NOM" : "PATH"
            }, null, 2)
        }).then(async (res) => {
            if (res.status === 200) {
                Toaster("Success", "success");
            } else {
                Toaster("Error : " + await res.text(), "error");
            }
        }).catch((err) => {
            Toaster(err, "error");
        });
    };

    return (
        <div>
            Warning : Be careful when you modify those fields, DO NOT change the way they are written. If an item
            have '"', { } or [] at the beginning and at the end DO NOT remove them change only the
            content. The required fields have to respect this
            pattern.
            <div id="commonEdit">
                <FormControlLabel control={<Checkbox id='lockCheck'
                    defaultChecked={TheBook.lock === 1}
                />} label="Lock this item ? (That prevent the metadata to be overwritten when refresh and disable rematch)" />

                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="edit_PATH"
                    label={'Path'}
                    type="text"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    required
                    margin="dense"
                    id="edit_description"
                    label={'Description'}
                    type="text"
                    fullWidth
                    variant="outlined"
                />
            </div>
            {type === 'series' ?
                <div id="seriesEdit">
                    <TextField
                        required
                        margin="dense"
                        id="edit_title"
                        label={'Title'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    /><TextField
                        required
                        margin="dense"
                        id="edit_cover"
                        label={'Cover'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    /><TextField
                        required
                        margin="dense"
                        id="edit_SOURCE"
                        label={'Source'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    /><TextField
                        required
                        margin="dense"
                        id="edit_BG"
                        label={'Link BG'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    /><TextField
                        required
                        margin="dense"
                        id="edit_statut"
                        label={'Status'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="edit_start_date"
                        label={'Start Date'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    /><TextField
                        required
                        margin="dense"
                        id="edit_end_date"
                        label={'End Date'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="edit_Score"
                        label={'Score'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="edit_genres"
                        label={'Genres'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="edit_volumes"
                        label={'Volumes'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    />	<TextField
                        required
                        margin="dense"
                        id="edit_TRENDING"
                        label={'Trending'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    />	<TextField
                        required
                        margin="dense"
                        id="edit_chapters"
                        label={'Chapters'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                </div> : type === 'book' ?
                    <div id="bookEdit">
                        <TextField
                            required
                            margin="dense"
                            id="edit_NOM"
                            label={'NOM'}
                            type="text"
                            fullWidth
                            variant="outlined"
                        /><TextField
                            required
                            margin="dense"
                            id="edit_URLCover"
                            label={'URL Cover'}
                            type="text"
                            fullWidth
                            variant="outlined"
                        /><TextField
                            required
                            margin="dense"
                            id="edit_issueNumber"
                            label={'Issue Number'}
                            type="text"
                            fullWidth
                            variant="outlined"
                        /><TextField
                            required
                            margin="dense"
                            id="edit_format"
                            label={'Format'}
                            type="text"
                            fullWidth
                            variant="outlined"
                        /><TextField
                            required
                            margin="dense"
                            id="edit_pageCount"
                            label={'Page count'}
                            type="text"
                            fullWidth
                            variant="outlined"
                        /><TextField
                            required
                            margin="dense"
                            id="edit_URLs"
                            label={'URLs'}
                            type="text"
                            fullWidth
                            variant="outlined"
                        /><TextField
                            required
                            margin="dense"
                            id="edit_series"
                            label={'Series'}
                            type="text"
                            fullWidth
                            variant="outlined"
                        /><TextField
                            required
                            margin="dense"
                            id="prices"
                            label={'Prices'}
                            type="text"
                            fullWidth
                            variant="outlined"
                        /><TextField
                            required
                            margin="dense"
                            id="dates"
                            label={'Dates'}
                            type="text"
                            fullWidth
                            variant="outlined"
                        />
                    </div> : <></>}
        </div >
    );
}