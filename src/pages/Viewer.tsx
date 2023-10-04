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

    return (
        <>
            <PersistentDrawerLeft />

        </>
    );
}


export default Viewer;