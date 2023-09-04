import { IBook } from "@/interfaces/IBook.ts";
import ContentViewer from "./ContentViewer";
import { useEffect } from "react";

/**
 * Renders a component that displays a series of books.
 * @param stateSeries - An object containing the series of books, whether it is open or not, and the provider.
 * @param handleAddBreadcrumbs - A function that adds breadcrumbs to the app.
 * @param handleChangeToDetails - A function that changes the app to the details view of a book.
 * @returns A JSX element that displays the series of books.
 */
function Series({ stateSeries, handleAddBreadcrumbs, handleChangeToDetails, handleChangeToSeries }: { stateSeries: { open: boolean; series: IBook[]; provider: any; } | null; handleAddBreadcrumbs: any; handleChangeToDetails: (open: boolean, book: IBook, provider: any) => void; handleChangeToSeries: (open: boolean, series: IBook[], provider: any) => void; }) {
    useEffect(() => {
        handleAddBreadcrumbs(stateSeries.series.NOM, () => {
            handleChangeToSeries(true, stateSeries.series, stateSeries.provider);
        });
    }, []);
    return (<>
        {stateSeries && stateSeries.open ? <ContentViewer type={"series"} provider={stateSeries.provider} TheBook={stateSeries.series} handleAddBreadcrumbs={handleAddBreadcrumbs} handleChangeToDetails={handleChangeToDetails} /> : <></>}
    </>);
}

export default Series;