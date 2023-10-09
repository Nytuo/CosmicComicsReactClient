import ViewerDrawer from '@/components/viewer/ViewerDrawer.tsx';
import {checkLogin, currentProfile, PDP} from '@/utils/Common.ts';
import {useEffect, useLayoutEffect} from 'react';

function Viewer() {
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
                localStorage.setItem("CosmicComicsData", data + "/CosmicComics_data");
                localStorage.setItem("CosmicComicsTempI", localStorage.getItem("CosmicComicsTemp") + "/profiles/" + currentProfile.getName + "/current_book/");
            }).catch(function (error) {
                console.log(error);
            });

        };
        fetchLocation();

    }, []);

    return (
        <>
            <ViewerDrawer/>
        </>
    );
}


export default Viewer;