import { A, useLocation } from '@solidjs/router';
import styles from './Sidebar.module.css';
import { createMutable } from 'solid-js/store';
import { type Component, createEffect, For, on, onMount, Show } from 'solid-js';
import type { Project } from '../../../../app/domain/notes/types.ts';
import { ProjectContextMenu } from './contextmenu/ProjectContextMenu.tsx';
import { SidebarContextMenu } from './contextmenu/SidebarContextMenu.tsx';
import { useApp } from '../../../../app/appContext.tsx';

type ContextMenuState = 'Closed' | 'Sidebar' | 'Project';

const Sidebar: Component = () => {
  const app = useApp();
  const state = createMutable({
    isSidebarVisible: false,
    contextMenu: {
      state: 'Closed' as ContextMenuState,
      pos: { x: 0, y: 0 },
      project: null as Project | null,
    },
  });
  const location = useLocation();
  let sidebarContentRef!: HTMLDivElement;

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
    app.client.notes.setIsAddModalOpen(true);
    closeMenus();
  };

  const openEditModal = () => {
    app.client.notes.setEditModalProject(state.contextMenu.project);
    closeMenus();
  };

  const projectListQuery = app.server.notes.getProjectListQuery();

  const toggleSidebarVisibility = () => {
    state.isSidebarVisible = !state.isSidebarVisible;
  };

  // TODO: move this to settings page
  // const handleLogout = async () => {
  //   await app.server.auth.deleteRefreshToken();
  //   await app.reset();
  // };

  onMount(() => {
    state.isSidebarVisible = false;
  });

  createEffect(
    on(
      () => [location.pathname],
      () => {
        state.isSidebarVisible = false;
      }
    )
  );

  return (
    <>
      <div classList={{ [styles.sidebar]: true, [styles.visible]: state.isSidebarVisible }}>
        <div class={styles.revealButtonArea} onClick={toggleSidebarVisibility}>
          <div class={styles.revealButton}>
            <div class={styles.circle}></div>
            <div class={styles.circle}></div>
            <div class={styles.circle}></div>
          </div>
        </div>
        <div
          class={styles.content}
          onContextMenu={e => setContextMenu(e, 'Sidebar')}
          data-testid="sidebar"
          ref={sidebarContentRef}
        >
          <div class={styles.inside}>
            <div class={styles.projects}>
              <ul>
                <For each={projectListQuery.data}>
                  {project => (
                    <li onContextMenu={e => setContextMenu(e, 'Project', project)}>
                      <label for={styles.revealCheckbox}>
                        <A href={`/notes/${project.slug}`} onClick={toggleSidebarVisibility}>
                          {project.title}
                        </A>
                      </label>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class={styles.bottomLinks}>
              <A href={'/apps'} onClick={toggleSidebarVisibility}>
                Other apps
              </A>
              <div class={styles.separator}></div>
              <A href={'/settings'} onClick={toggleSidebarVisibility}>
                Settings
              </A>
            </div>
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
        </div>
      </div>
    </>
  );
};

export { Sidebar };
