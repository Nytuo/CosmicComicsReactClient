// noinspection AllyJsxHardcodedStringInspection

import * as React from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getFromDB, InsertIntoDB, TrueDeleteFromDB } from "@/utils/Fetchers.ts";
import { IBook } from "@/interfaces/IBook.ts";
import { providerEnum, tryToParse } from "@/utils/utils.ts";
import DatabaseEditorSkeleton from "../DatabaseEditorSkeleton.tsx";
import RematchSkeleton from "../RematchSkeleton.tsx";
import { ToasterHandler } from "../../common/ToasterHandler.tsx";

export default function APISelectorDialog({
  onClose,
  openModal,
}: {
  onClose: any;
  openModal: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(openModal);
  const [TheBook, setTheBook] = React.useState<IBook | null>(null);
  const [provider, setProvider] = React.useState<any>("");
  const [send, setSend] = React.useState(false);

  // This is used to update the state of the dialog when the parent component changes the value of openModal.
  useEffect(() => {
    if (openModal !== open) {
      setOpen(openModal);
    }
  }, [openModal, open]);

  // This is used to update the state of the parent component when the dialog is closed.
  const handleClose = (sended: boolean) => {
    if (!sended) {
      ToasterHandler("Operation aborted", "info");
      if (TheBook !== null) {
        // noinspection JSIgnoredPromiseFromCall
        TrueDeleteFromDB("Books", TheBook.ID_book);
      }
    } else {
      ToasterHandler("Making changes on the database...", "info");
    }
    setOpen(false);
    setSend(false);
    setProvider(null);
    setTheBook(null);
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullScreen={true}>
        <DialogTitle>{t("APISelectorTitle")}</DialogTitle>
        <DialogContent>
          <FormControl
            fullWidth
            sx={{
              marginTop: 2,
            }}
          >
            <InputLabel id="demo-simple-select-label">
              {t("selectAProvider")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={provider}
              label={t("selectAProvider")}
              onChange={async (provider: any) => {
                setProvider(provider.target.value);
                await InsertIntoDB(
                  "Books",
                  "",
                  `(${Math.floor(Math.random() * 100000)},${null},'REPLACE THIS BY A VALUE',null,${0},${0},${1},${0},${0},${0},'${null}','${null}','${null}','${null}','${null}',${null},'${null}','${null}','${null}','${null}','${null}','${null}','${null}','${null}','${null}',0)`,
                );
                const TheBookTemp = await getFromDB(
                  "Books",
                  "* FROM Books WHERE NOM = 'REPLACE THIS BY A VALUE'",
                );
                if (TheBookTemp) {
                  setTheBook(tryToParse(TheBookTemp)[0]);
                }
              }}
            >
              <MenuItem value={1}>Marvel (Marvel & Star Wars)</MenuItem>
              <MenuItem value={2}>Anilist (Manga)</MenuItem>
              <MenuItem value={3}>Open Library</MenuItem>
              <MenuItem value={4}>Google Books</MenuItem>
              <MenuItem value={0}>{t("manual")}</MenuItem>
            </Select>
          </FormControl>

          {TheBook !== null ? (
            provider == providerEnum.MANUAL ? (
              <DatabaseEditorSkeleton
                TheBook={TheBook}
                type={"book"}
                triggerSend={send}
                trackedMode={true}
              />
            ) : provider == providerEnum.Marvel ? (
              <RematchSkeleton
                provider={provider}
                type={"book"}
                oldID={TheBook.ID_book}
              />
            ) : provider == providerEnum.Anilist ? (
              <DatabaseEditorSkeleton
                TheBook={TheBook}
                type={"book"}
                triggerSend={send}
                trackedMode={true}
              />
            ) : provider == providerEnum.GBooks ? (
              <RematchSkeleton
                provider={provider}
                type={"book"}
                oldID={TheBook.ID_book}
              />
            ) : provider == providerEnum.OL ? (
              <RematchSkeleton
                provider={provider}
                type={"book"}
                oldID={TheBook.ID_book}
              />
            ) : (
              <p>{t("error")}</p>
            )
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>{t("cancel")}</Button>
          <Button
            onClick={() => {
              setSend(true);
              setTimeout(() => {
                handleClose(true);
              }, 500);
            }}
          >
            {t("send")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
