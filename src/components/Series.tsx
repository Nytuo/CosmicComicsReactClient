import { IBook } from "@/interfaces/IBook.ts";
import ContentViewer from "./ContentViewer";

function Series({ stateSeries, handleAddBreadcrumbs }: { stateSeries: { open: boolean; series: IBook[]; provider: any; } | null; handleAddBreadcrumbs: any; }) {
    return (<>
        {stateSeries && stateSeries.open ? <ContentViewer type={"series"} provider={stateSeries.provider} TheBook={stateSeries.series} handleAddBreadcrumbs={handleAddBreadcrumbs} /> : <></>}
    </>);
}

export default Series;