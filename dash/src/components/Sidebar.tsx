import {LogoutButton} from "./LogoutButton.tsx";
import {Link, useLoaderData} from "@tanstack/react-router";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getProjectList} from "../api/project.tsx";
import type {Project} from "../types/project.ts";
import * as React from "react";
import {useState} from "react";
import {EditProjectModal} from "./modal/EditProjectModal.tsx";
import {AddProjectModal} from "./modal/AddProjectModal.tsx";
import {ProjectContextMenu} from "./contextmenu/ProjectContextMenu.tsx";
import {SidebarContextMenu} from "./contextmenu/SidebarContextMenu.tsx";
import styles from './Sidebar.module.css'

function Sidebar() {
    const queryClient = useQueryClient();

    // weird type issue here, idk...
    const {initialProjects} = useLoaderData({from: '/_auth/notes'}) as { initialProjects: Project[] }
    const {data: projects = []} = useQuery({
        queryKey: ["projects"],
        queryFn: getProjectList,
        initialData: initialProjects
    })

    const [sidebarContextMenu, setSidebarContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [projectContextMenu, setProjectContextMenu] = useState<{
        x: number;
        y: number;
        project: Project
    } | null>(null);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isAddOpen, setAddOpen] = useState(false);

    const openSidebarContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setSidebarContextMenu({x: e.clientX, y: e.clientY});
        setProjectContextMenu(null);
    }

    const openProjectContextMenu = (e: React.MouseEvent, project: Project) => {
        e.preventDefault();
        e.stopPropagation();
        setProjectContextMenu({x: e.clientX, y: e.clientY, project});
        setSidebarContextMenu(null);
    }

    const closeMenus = () => {
        setSidebarContextMenu(null);
        setProjectContextMenu(null);
    }

    const openEditModal = (p: Project) => {
        setEditingProject(p);
        setProjectContextMenu(null);
    }

    const openAddModal = () => {
        setAddOpen(true);
        setSidebarContextMenu(null);
    }

    const closeEditModal = () => {
        setEditingProject(null);
    }

    const closeAddModal = () => {
        setAddOpen(false);
    }

    const refreshProjects = () => {
        queryClient.invalidateQueries({queryKey: ['projects']})
    }

    return (
        <>
            <div className={styles.wrapper} onContextMenu={(e) => openSidebarContextMenu(e)}>
                <ul>
                    {projects.map((p) => (
                        <li key={p.slug} onContextMenu={(e) => openProjectContextMenu(e, p)}>
                            <Link to={'/notes/$slug'} params={{slug: p.slug}}>
                                {p.title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <LogoutButton/>
                {projectContextMenu && (
                    <ProjectContextMenu
                        x={projectContextMenu.x}
                        y={projectContextMenu.y}
                        onEdit={() => openEditModal(projectContextMenu.project)}
                        onClose={closeMenus}
                    />
                )}
                {sidebarContextMenu && (
                    <SidebarContextMenu
                        x={sidebarContextMenu.x}
                        y={sidebarContextMenu.y}
                        onAdd={openAddModal}
                        onClose={closeMenus}
                    />
                )}
            </div>
            {editingProject && (
                <EditProjectModal project={editingProject} onClose={closeEditModal} onSuccess={refreshProjects}/>
            )}
            {isAddOpen && (
                <AddProjectModal onClose={closeAddModal} onSuccess={refreshProjects}/>
            )}
        </>
    );
}

export {Sidebar};