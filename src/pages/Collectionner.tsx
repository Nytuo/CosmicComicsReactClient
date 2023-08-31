import MiniDrawer from '@/components/Drawer.tsx';
import { PDP, checkLogin } from '@/utils/Common.ts';
import React, { useEffect, useLayoutEffect } from 'react';
function Collectionner() {
    const [CosmicComicsData, setCosmicComicsData] = React.useState("C:/Users/Public/Cosmic-Comics/data");
    const [CosmicComicsTemp, setCosmicComicsTemp] = React.useState("C:/Users/Public/Cosmic-Comics/temp");
    const [CosmicComicsTempI, setCosmicComicsTempI] = React.useState("setCosmicComicsData");
    useEffect(() => {
        document.title = "Collectionner";
    }, []);

    useLayoutEffect(() => {
        checkLogin();
        setInterval(() => {
            checkLogin();
        }, 1000 * 60 * 60 * 4);
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
                const dirnameFE = data;
                setCosmicComicsData(dirnameFE + "/CosmicComics_data");
                setCosmicComicsTempI(CosmicComicsTemp + "/current_book/");
            }).catch(function (error) {
                console.log(error);
            });

        };
        fetchLocation();

    }, []);
    return (
        <>
            <MiniDrawer CosmicComicsTemp={
                CosmicComicsTemp
            } />

        </>
    );
}


export default Collectionner;