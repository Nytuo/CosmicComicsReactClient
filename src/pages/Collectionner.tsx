import MiniDrawer from '@/components/Drawer.tsx';
import React, { useEffect } from 'react';
function Collectionner() {
    useEffect(() => {
        document.title = "Collectionner";
    }, []);
    return (
        <>
            <MiniDrawer />
        </>
    );
}


export default Collectionner;