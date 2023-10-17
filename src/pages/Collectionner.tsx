/* eslint-disable react-hooks/exhaustive-deps */
import CollectionnerDrawer from '@/components/collectionner/Drawer.tsx';
import {checkLogin, PDP} from '@/utils/Common.ts';
import React, {useEffect, useLayoutEffect} from 'react';

function Collectionner() {
    const [, setCosmicComicsData] = React.useState("C:/Users/Public/Cosmic-Comics/data");
    const [CosmicComicsTemp, setCosmicComicsTemp] = React.useState("C:/Users/Public/Cosmic-Comics/temp");
    const [, setCosmicComicsTempI] = React.useState("setCosmicComicsData");
    useEffect(() => {
        document.title = "Collectionner";
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
                setCosmicComicsTemp(data);
            });
            await fetch(PDP + "/dirname").then(function (response) {
                return response.text();
            }).then(function (data) {
                setCosmicComicsData(data + "/CosmicComics_data");
                setCosmicComicsTempI(CosmicComicsTemp + "/current_book/");
            }).catch(function (error) {
                console.log(error);
            });

        };
        // noinspection JSIgnoredPromiseFromCall
        fetchLocation();

    }, []);
    return (
        <>
            <CollectionnerDrawer CosmicComicsTemp={
                CosmicComicsTemp
            }/>

        </>
    );
}


export default Collectionner;