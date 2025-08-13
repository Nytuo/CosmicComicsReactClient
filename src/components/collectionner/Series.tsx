/* eslint-disable react-hooks/exhaustive-deps */
import { IBook } from "@/interfaces/IBook.ts";
import ContentViewer from "./ContentViewer.tsx";
import { useEffect } from "react";
import { ISeriesOfBook } from "@/interfaces/ISeriesOfBook.ts";

/**
 * Renders a component that displays a series of books.
 * @param stateSeries - An object containing the series of books, whether it is open or not, and the provider.
 * @param handleAddBreadcrumbs - A function that adds breadcrumbs to the app.
 * @param handleChangeToDetails - A function that changes the app to the details view of a book.
 * @param handleChangeToSeries - A function that changes the app to the series view of a book.
 * @returns A JSX element that displays the series of books.
 */
function Series({ stateSeries, handleAddBreadcrumbs, handleChangeToDetails, handleChangeToSeries }: {
    stateSeries: { open: boolean; series: ISeriesOfBook[]; provider: any; } | null;
    handleAddBreadcrumbs: any;
    handleChangeToDetails: (open: boolean, book: IBook, provider: any) => void;
    handleChangeToSeries: (open: boolean, series: ISeriesOfBook[], provider: any) => void;
}) {
    useEffect(() => {
        if (stateSeries && stateSeries.series) { // @ts-ignore
            handleAddBreadcrumbs(stateSeries.series.NOM, () => {
                handleChangeToSeries(true, stateSeries.series, stateSeries.provider);
            });
        }
    }, []);
    return (<>
        {stateSeries && stateSeries.open ?
            <ContentViewer type={"series"} provider={stateSeries.provider} TheBook={stateSeries.series}
                handleAddBreadcrumbs={handleAddBreadcrumbs}
                handleChangeToDetails={handleChangeToDetails} /> : <></>}
    </>);
}

export default Series;