import { A } from '@solidjs/router';
import styles from './Sidebar.module.css';
import { createMutable } from 'solid-js/store';
import { type Component, For, Show } from 'solid-js';
import type { Project } from '../../app/types/project.ts';
import { SettingsContextMenu } from '../contextmenu/SettingsContextMenu.tsx';
import { ProjectContextMenu } from '../contextmenu/ProjectContextMenu.tsx';
import { SidebarContextMenu } from '../contextmenu/SidebarContextMenu.tsx';
import { useApp } from '../../app/appContext.tsx';

type ContextMenuState = 'Closed' | 'Sidebar' | 'Settings' | 'Project';

interface Props {
  openAddModal: () => void;
  openEditModal: (project: Project | null) => void;
}

const Sidebar: Component<Props> = props => {
  const app = useApp();
  const state = createMutable({
    contextMenu: {
      state: 'Closed' as ContextMenuState,
      pos: { x: 0, y: 0 },
      project: null as Project | null,
    },
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
    props.openAddModal();
    closeMenus();
  };

  const openEditModal = () => {
    props.openEditModal(state.contextMenu.project);
    closeMenus();
  };

  return (
    <>
      <div class={styles.wrapper} onContextMenu={e => setContextMenu(e, 'Sidebar')}>
        <ul>
          <For each={app.notes.getProjects()}>
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
    </>
  );
};

export { Sidebar };
