import { A, useLocation } from '@solidjs/router';
import styles from './Sidebar.module.css';
import { createMutable } from 'solid-js/store';
import { type Component, createEffect, on, onMount, Show } from 'solid-js';
import type { Project } from '../../../../app/domain/notes/types.ts';
import { ProjectContextMenu } from './contextmenu/ProjectContextMenu.tsx';
import { SidebarContextMenu } from './contextmenu/SidebarContextMenu.tsx';
import { useApp } from '../../../../app/appContext.tsx';
import { SortableList } from './SortableList.tsx';

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
    projects: [] as Project[],
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

  const hideSidebar = () => {
    state.isSidebarVisible = false;
  };

  onMount(() => {
    hideSidebar();
  });

  createEffect(
    on(
      () => [location.pathname],
      () => {
        hideSidebar();
      }
    )
  );

  createEffect(() => {
    if (projectListQuery.data) {
      state.projects = projectListQuery.data;
    }
  });

  const updateProjectIndex = async (oldIndex: number, newIndex: number) => {
    const projects = projectListQuery.data;
    if (!projects || oldIndex < 0 || oldIndex >= projects.length) {
      return;
    }
    const project = projects[oldIndex];
    await app.server.notes.updateProjectSortIndex(project.slug, newIndex);
    await app.server.notes.invalidateProjectListQuery();
  };

  const setProjects = (newProjects: Project[]) => {
    state.projects = newProjects;
  };

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
              <SortableList
                items={state.projects}
                onIndexChange={updateProjectIndex}
                onChange={setProjects}
              >
                {project => (
                  <li onContextMenu={e => setContextMenu(e, 'Project', project)}>
                    <A href={`/notes/${project.slug}`} onClick={hideSidebar}>
                      {project.title}
                    </A>
                  </li>
                )}
              </SortableList>
            </div>
            <div class={styles.bottomLinks}>
              <A href={'/apps'} onClick={hideSidebar}>
                Other apps
              </A>
              <div class={styles.separator}></div>
              <A href={'/settings'} onClick={hideSidebar}>
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
