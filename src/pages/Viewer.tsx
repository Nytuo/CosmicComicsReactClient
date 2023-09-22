import PersistentDrawerLeft from '@/components/ViewerDrawer.tsx';
import { PDP, checkLogin, currentProfile } from '@/utils/Common.ts';
import React, { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
function Viewer() {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = "Viewer";
    }, []);

    useLayoutEffect(() => {
        checkLogin();
        setInterval(() => {
            checkLogin();
        }, 1000 * 60 * 60);
    }, []);

    useEffect(() => {

        const fetchLocation = async () => {

            await fetch(PDP + "/CosmicDataLoc").then(function (response) {
                return response.text();
            }).then(function (data) {
                localStorage.setItem("CosmicComicsTemp", data);
            });
            await fetch(PDP + "/dirname").then(function (response) {
                return response.text();
            }).then(function (data) {
                const dirnameFE = data;
                localStorage.setItem("CosmicComicsData", dirnameFE + "/CosmicComics_data");
                localStorage.setItem("CosmicComicsTempI", localStorage.getItem("CosmicComicsTemp") + "/profiles/" + currentProfile.getName + "/current_book/");
            }).catch(function (error) {
                console.log(error);
            });

        };
        fetchLocation();

    }, []);

    useLayoutEffect(() => {
        //keyboard Shortcuts
        window.addEventListener("keydown", (e) => {
            if ((e.code === "Equal" || e.code === "NumpadAdd") && e.ctrlKey === true) {
                ZoomIn();
            } else if (
                (e.code === "Digit6" || e.code === "NumpadSubtract") &&
                e.ctrlKey === true
            ) {
                ZoomOut();
            } else if (e.code === "ArrowLeft" && e.ctrlKey === false) {
                PreviousPage();
            } else if (e.code === "ArrowRight" && e.ctrlKey === false) {
                NextPage();
            } else if (e.code === "ArrowUp" && e.ctrlKey === false) {
                PreviousPage();
            } else if (e.code === "ArrowDown" && e.ctrlKey === false) {
                NextPage();
            } else if (e.code === "ArrowLeft" && e.ctrlKey === true) {
                Start();
            } else if (e.code === "ArrowRight" && e.ctrlKey === true) {
                End();
            } else if (e.code === "ArrowUp" && e.ctrlKey === true) {
                Start();
            } else if (e.code === "ArrowDown" && e.ctrlKey === true) {
                End();
            } else if (e.ctrlKey === true) {
                ctrlisDown = true;
            } else if (e.code === "KeyF") {
                fullscreen();
            } else if (e.code === "8") {
                window.location.href = "collectionner.html";
            } else if (e.code === "KeyH") {
                FixHeight();
            } else if (e.code === "KeyL") {
                FixWidth();
            } else if (e.code === "KeyB") {
                TBM();
            } else if (e.code === "KeyR" && e.shiftKey === false) {
                rotate(90);
            } else if (e.code === "KeyR" && e.shiftKey === true) {
                rotate(-90);
            } else if (e.code === "KeyO") {
                markasread();
            } else if (e.code === "KeyI") {
                markasreading();
            } else if (e.code === "KeyU") {
                markasunread();
            } else if (e.code === "KeyP") {
                ToogleFav();
            }

        });
    }, []);

    return (
        <>
            <PersistentDrawerLeft />

        </>
    );
}


export default Viewer;