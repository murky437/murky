import {Sidebar} from "../../components/Sidebar.tsx";
import {Outlet} from "@tanstack/react-router";

function NotesBasePage() {
    return (
        <div style={{display: "flex", height: "100vh"}}>
            <Sidebar/>
            <Outlet/>
        </div>
    );
}

export {NotesBasePage};