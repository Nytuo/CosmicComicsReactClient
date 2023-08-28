import { IBook } from "@/interfaces/IBook.ts";
import Card from "./Card.tsx";

function ContainerExplorer({ stateExplorer, handleAddBreadcrumbs, handleOpenDetails }: { stateExplorer: { open: boolean; explorer: IBook[]; provider: any; booksNumber: number; } | null; handleAddBreadcrumbs: any; handleOpenDetails: any; }) {
    return (<>
        <div className="cards-list" id="ContainerExplorer">

            {stateExplorer && stateExplorer.open ? stateExplorer.explorer.map((book: IBook, index: number) => {
                return <Card key={index} book={book} handleOpenDetails={handleOpenDetails} />;
            }) : <></>}
        </div>


    </>);
}

export default ContainerExplorer;