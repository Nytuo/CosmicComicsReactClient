import { IBook } from "@/interfaces/IBook";
import ContentViewer from "./ContentViewer";
import { useEffect } from "react";

/**
 * Renders a component that displays the details of a book.
 * @param stateDetails - An object containing the details of the book, including whether the component should be open or not.
 * @param handleAddBreadcrumbs - A function to handle adding breadcrumbs to the application.
 * @returns A JSX element that displays the details of the book.
 */
function Details({ stateDetails, handleAddBreadcrumbs }: { stateDetails: { open: boolean; book: IBook; provider: any; } | null; handleAddBreadcrumbs: any; }) {
    useEffect(() => {
        handleAddBreadcrumbs(stateDetails.book.NOM, () => { });
    }, []);
    return (<>
        {stateDetails && stateDetails.open ? <ContentViewer type={"volume"} provider={stateDetails.provider} TheBook={stateDetails.book} handleAddBreadcrumbs={handleAddBreadcrumbs} /> : <></>}
    </>);
}

export default Details;