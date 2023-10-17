/* eslint-disable react-hooks/exhaustive-deps */
import {IBook} from "@/interfaces/IBook.ts";
import ContentViewer from "./ContentViewer.tsx";
import {useEffect} from "react";
import {ISeriesOfBook} from "@/interfaces/ISeriesOfBook.ts";

/**
 * Renders a component that displays the details of a book.
 * @param stateDetails - An object containing the details of the book, including whether the component should be open or not.
 * @param handleAddBreadcrumbs - A function to handle adding breadcrumbs to the application.
 * @returns A JSX element that displays the details of the book.
 */
function Details({stateDetails, handleAddBreadcrumbs}: {
    stateDetails: { open: boolean; book: ISeriesOfBook | IBook; provider: any; };
    handleAddBreadcrumbs: any;
}) {
    useEffect(() => {
        handleAddBreadcrumbs(stateDetails.book.NOM, () => {
        });
    }, []);
    return (<>
        {stateDetails ? stateDetails.open ?
            <ContentViewer type={"volume"} provider={parseInt(stateDetails.book.API_ID)} TheBook={stateDetails.book}
                           handleAddBreadcrumbs={handleAddBreadcrumbs}/> : <></>:  <></>}
    </>);
}

export default Details;