import { A } from '@solidjs/router';
import styles from './Sidebar.module.css';
import { createMutable } from 'solid-js/store';
import type { Project } from '../types/project.ts';
import { type Component, createEffect, For, Show } from 'solid-js';
import { SettingsContextMenu } from './contextmenu/SettingsContextMenu.tsx';
import { ProjectContextMenu } from './contextmenu/ProjectContextMenu.tsx';
import { SidebarContextMenu } from './contextmenu/SidebarContextMenu.tsx';
import { EditProjectModal } from './modal/EditProjectModal.tsx';
import { AddProjectModal } from './modal/AddProjectModal.tsx';
import { notes } from '../store/notes.ts';

type ContextMenuState = 'Closed' | 'Sidebar' | 'Settings' | 'Project';

const Sidebar: Component = () => {
  const state = createMutable({
    contextMenu: {
      state: 'Closed' as ContextMenuState,
      pos: { x: 0, y: 0 },
      project: null as Project | null,
    },
    editModalProject: null as Project | null,
    isAddModalOpen: false,
  });

  const setContextMenu = (
    e: MouseEvent,
    contextMenuState: ContextMenuState,
    project: Project | null = null
  ) => {
    e.preventDefault();
    e.stopPropagation();
    state.contextMenu.state = contextMenuState;
    state.contextMenu.pos = { x: e.clientX, y: e.clientY };
    state.contextMenu.project = project;
  };

  const closeMenus = () => {
    state.contextMenu.state = 'Closed';
  };

  const openAddModal = () => {
    state.isAddModalOpen = true;
    closeMenus();
  };

  const openEditModal = () => {
    state.editModalProject = state.contextMenu.project;
    closeMenus();
  };

  const closeAddModal = () => {
    state.isAddModalOpen = false;
  };

  const closeEditModal = () => {
    state.editModalProject = null;
  };

  const loadProjects = async () => {
    await notes.loadProjectsFromServer();
  };

  createEffect(async () => {
    await loadProjects();
  });

  return (
    <>
      <div class={styles.wrapper} onContextMenu={e => setContextMenu(e, 'Sidebar')}>
        <ul>
          <For each={notes.getProjects()}>
            {project => (
              <li onContextMenu={e => setContextMenu(e, 'Project', project)}>
                <A href={`/notes/${project.slug}`}>{project.title}</A>
              </li>
            )}
          </For>
        </ul>
        <div>
          <div class={styles.settings} onClick={e => setContextMenu(e, 'Settings')}>
            ☰
          </div>
        </div>
        <Show when={state.contextMenu.state === 'Settings'}>
          <SettingsContextMenu
            x={state.contextMenu.pos.x}
            y={state.contextMenu.pos.y}
            onClose={closeMenus}
          />
        </Show>
        <Show when={state.contextMenu.state === 'Project'}>
          <ProjectContextMenu
            x={state.contextMenu.pos.x}
            y={state.contextMenu.pos.y}
            onEdit={openEditModal}
            onClose={closeMenus}
          />
        </Show>
        <Show when={state.contextMenu.state === 'Sidebar'}>
          <SidebarContextMenu
            x={state.contextMenu.pos.x}
            y={state.contextMenu.pos.y}
            onAdd={openAddModal}
            onClose={closeMenus}
          />
        </Show>
      </div>
      <Show when={state.editModalProject}>
        <EditProjectModal
          project={state.editModalProject!}
          onClose={closeEditModal}
          onSuccess={loadProjects}
        />
      </Show>
      <Show when={state.isAddModalOpen}>
        <AddProjectModal onClose={closeAddModal} onSuccess={loadProjects} />
      </Show>
    </>
  );
};

export { Sidebar };
