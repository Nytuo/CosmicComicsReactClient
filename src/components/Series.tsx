import { IBook } from "@/interfaces/IBook.ts";
import ContentViewer from "./ContentViewer";

function Series({ stateSeries, handleAddBreadcrumbs, handleChangeToDetails }: { stateSeries: { open: boolean; series: IBook[]; provider: any; } | null; handleAddBreadcrumbs: any; handleChangeToDetails: (open: boolean, book: IBook, provider: any) => void; }) {
    return (<>
        {stateSeries && stateSeries.open ? <ContentViewer type={"series"} provider={stateSeries.provider} TheBook={stateSeries.series} handleAddBreadcrumbs={handleAddBreadcrumbs} handleChangeToDetails={handleChangeToDetails} /> : <></>}
    </>);
}

export default Series;