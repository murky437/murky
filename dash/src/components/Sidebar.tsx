import {LogoutButton} from "./LogoutButton.tsx";
import {Link, useLoaderData} from "@tanstack/react-router";
import {useQuery} from "@tanstack/react-query";
import {getProjectList} from "../api/project.tsx";
import type {Project} from "../types/project.ts";

function Sidebar() {
    // weird type issue here, idk...
    const {initialProjects} = useLoaderData({from: '/_auth/notes'}) as {initialProjects: Project[]}
    const {data: projects = []} = useQuery({
        queryKey: ["projects"],
        queryFn: getProjectList,
        initialData: initialProjects
    })

    return (
        <div className="sidebar">
            <ul>
                {projects.map((p) => (
                    <li key={p.slug}>
                        <Link to={'/notes/$slug'} params={{slug: p.slug}}>
                            {p.title}
                        </Link>
                    </li>
                ))}
            </ul>
            <LogoutButton/>
        </div>
    );
}

export {Sidebar};