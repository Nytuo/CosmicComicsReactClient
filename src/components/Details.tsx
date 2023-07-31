import { IBook } from "@/utils/IBook";
import ContentViewer from "./ContentViewer";

function Details({ stateDetails }: { stateDetails: { open: boolean; book: IBook; provider: any; } | null; }) {
    return (<>
        {stateDetails && stateDetails.open ? <ContentViewer type={"volume"} provider={stateDetails.provider} TheBook={stateDetails.book} /> : <></>}
    </>);
}

export default Details;