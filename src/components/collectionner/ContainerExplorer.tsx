import {IBook} from "@/interfaces/IBook.ts";
import Card from "./Card.tsx";

function ContainerExplorer({stateExplorer, handleOpenDetails, type}: {
    stateExplorer: { open: boolean; explorer: IBook[]; provider: any; booksNumber: number; } | null;
    handleAddBreadcrumbs: any;
    handleOpenDetails: any;
    type: "book" | "lite";
}) {
    return (<>
        <div className="cards-list" id="ContainerExplorer">

            {stateExplorer ? stateExplorer.open ? stateExplorer.explorer.map((book: IBook, index: number) => {
                return <Card type={type} provider={stateExplorer.provider} key={index} book={book}
                             handleOpenDetails={handleOpenDetails}/>;
            }) : <></> : <></>}
        </div>
    </>);
}

export default ContainerExplorer;