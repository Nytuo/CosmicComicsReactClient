/* eslint-disable react-hooks/exhaustive-deps */
import TextField from '@mui/material/TextField';
import {useEffect, useLayoutEffect} from "react";
import {IBook} from '@/interfaces/IBook.ts';
import {currentProfile, PDP} from '@/utils/Common.ts';
import {Checkbox, FormControlLabel} from '@mui/material';
import {ToasterHandler} from '../common/ToasterHandler.tsx';
import {t} from "i18next";

/**
 * A skeleton component for editing a book or series in the database.
 * @param TheBook - The book or series to edit.
 * @param type - The type of item being edited ('book' or 'series').
 * @param triggerSend - A flag that triggers sending the edited data to the server.
 * @param trackedMode - A flag that indicates whether the item is being tracked.
 * @returns A component that displays editable fields for the book or series.
 */
export default function DatabaseEditorSkeleton({TheBook, type, triggerSend, trackedMode}: {
    TheBook: IBook,
    type: 'series' | 'book';
    triggerSend: any;
    trackedMode?: boolean;
}) {
    useLayoutEffect(() => {
        if (TheBook) {
            console.log(TheBook);
            document.querySelectorAll("#commonEdit>div>div>input").forEach((e: any) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                e.value = TheBook[e.id.replaceAll("edit_", "")];
            });
            if (type === 'series') {
                document.querySelectorAll("#seriesEdit>div>div>input").forEach((e: any) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    e.value = TheBook[e.id.replaceAll("edit_", "")];
                });
            } else if (type === 'book') {
                document.querySelectorAll("#bookEdit>div>div>input").forEach((e: any) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    console.log(e.id.replaceAll("edit_", ""), TheBook[e.id.replaceAll("edit_", "")]);

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    e.value = TheBook[e.id.replaceAll("edit_", "")];
                });
            }
        }
    },[]);

    const handleSend = async () => {
        const values = [];
        const columns = [];
        document.querySelectorAll("#commonEdit>div>div>input").forEach((e: any) => {
            values.push(e.value);
            columns.push(e.id.replaceAll("edit_", ""));
        });
        if (type === 'series') {
            document.querySelectorAll("#seriesEdit>div>div>input").forEach((e: any) => {
                values.push(e.value);
                switch (e.id.replaceAll("edit_", "")) {
                    case "raw_title":
                        columns.push("title");
                        break;
                    case "URLCover":
                        columns.push("cover");
                        break;
                    case "URLs":
                        columns.push("source");
                        break;
                    case "BG_cover":
                        columns.push("BG");
                        break;
                    case "issueNumber":
                        columns.push("chapters");
                        break;
                    case "score":
                        columns.push("Score");
                        break;
                    default:
                        columns.push(e.id.replaceAll("edit_", ""));
                }
            });
        } else if (type === 'book') {
            document.querySelectorAll("#bookEdit>div>div>input").forEach((e: any) => {
                values.push(e.value);
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
                "whereEl": trackedMode ? "REPLACE THIS BY A VALUE" : TheBook.ID_book,
                "value": values,
                "where": trackedMode ? "NOM" : type === 'series' ? "ID_Series" : "ID_book"
            }, null, 2)
        }).then(async (res) => {
            if (res.status === 200) {
                ToasterHandler("Success", "success");
            } else {
                ToasterHandler("Error : " + await res.text(), "error");
            }
        }).catch((err) => {
            ToasterHandler(err, "error");
        });
    };

    useEffect(() => {
        if (triggerSend) {
            // noinspection JSIgnoredPromiseFromCall
            handleSend();
        }
    }, [triggerSend]);


    return (
        <div>
            {t('warningBeCarefulWhenYouModifyThoseFieldsDoNotChang')}
            <div id="commonEdit">
                <FormControlLabel control={<Checkbox id='lockCheck'
                                                     defaultChecked={TheBook.lock === 1}
                />}
                                  label={t('lockThisItemThatPreventTheMetadataToBeOverwrittenW')}/>

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
                        id="edit_raw_title"
                        label={'Title'}
                        type="text"
                        fullWidth
                        variant="outlined"
                    /><TextField
                    required
                    margin="dense"
                    id="edit_URLCover"
                    label={'Cover'}
                    type="text"
                    fullWidth
                    variant="outlined"
                /><TextField
                    required
                    margin="dense"
                    id="edit_URLs"
                    label={'Source'}
                    type="text"
                    fullWidth
                    variant="outlined"
                /><TextField
                    required
                    margin="dense"
                    id="edit_BG_cover"
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
                        id="edit_score"
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
                    /> <TextField
                    required
                    margin="dense"
                    id="edit_trending"
                    label={'Trending'}
                    type="text"
                    fullWidth
                    variant="outlined"
                /> <TextField
                    required
                    margin="dense"
                    id="edit_issueNumber"
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
        </div>
    );
}