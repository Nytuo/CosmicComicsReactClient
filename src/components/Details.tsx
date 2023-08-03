import { IBook } from "@/interfaces/IBook";
import ContentViewer from "./ContentViewer";

function Details({ stateDetails, handleAddBreadcrumbs }: { stateDetails: { open: boolean; book: IBook; provider: any; } | null; handleAddBreadcrumbs: any; }) {
    return (<>
        {stateDetails && stateDetails.open ? <ContentViewer type={"volume"} provider={stateDetails.provider} TheBook={stateDetails.book} handleAddBreadcrumbs={handleAddBreadcrumbs} /> : <></>}
    </>);
}

export default Details;