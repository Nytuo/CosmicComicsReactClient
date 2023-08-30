import MiniDrawer from '@/components/Drawer.tsx';
import { PDP } from '@/utils/Common.ts';
import React, { useEffect } from 'react';
function Collectionner() {
    const [CosmicComicsData, setCosmicComicsData] = React.useState("C:/Users/Public/Cosmic-Comics/data");
    const [CosmicComicsTemp, setCosmicComicsTemp] = React.useState("C:/Users/Public/Cosmic-Comics/temp");
    const [CosmicComicsTempI, setCosmicComicsTempI] = React.useState("setCosmicComicsData");
    useEffect(() => {
        document.title = "Collectionner";
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