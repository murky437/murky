import { createEffect, onMount, type ParentComponent, Show } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { Sidebar } from './Sidebar.tsx';
import styles from './NotesLayout.module.css';
import type { Project } from '../../app/types/project.ts';
import type { NotesState } from '../../app/notes/notesState.ts';
import { EditProjectModal } from '../modal/EditProjectModal.tsx';
import { AddProjectModal } from '../modal/AddProjectModal.tsx';
import type { AuthState } from '../../app/auth/authState.ts';
import type { AuthApi } from '../../app/api/authApi.ts';
import type { ProjectsApi } from '../../app/api/projectsApi.ts';
import { useNavigate } from '@solidjs/router';

interface Props {
  addModalShouldOpen?: boolean;
  onAddModalOpen?: () => void;
  notesState: NotesState;
  authState: AuthState;
  authApi: AuthApi;
  projectsApi: ProjectsApi;
}

const NotesLayout: ParentComponent<Props> = props => {
  const state = createMutable({
    editModalProject: null as Project | null,
    isAddModalOpen: false,
  });
  const navigate = useNavigate();

  const openAddModal = () => {
    state.isAddModalOpen = true;
  };

  const openEditModal = (project: Project | null) => {
    state.editModalProject = project;
  };

  const closeAddModal = () => {
    state.isAddModalOpen = false;
  };

  const closeEditModal = () => {
    state.editModalProject = null;
  };

  const loadProjects = async () => {
    await props.notesState.loadProjectsFromServer();
  };

  const onDeleteProject = async () => {
    await loadProjects();
    navigate(`/notes`, { replace: true });
  };

  onMount(async () => {
    await loadProjects();
  });

  createEffect(() => {
    if (props.addModalShouldOpen) {
      openAddModal();
      if (props.onAddModalOpen) {
        props.onAddModalOpen();
      }
    }
  });
  return (
    <>
      <div class={styles.wrapper}>
        <Sidebar
          authState={props.authState}
          authApi={props.authApi}
          notesState={props.notesState}
          openAddModal={openAddModal}
          openEditModal={openEditModal}
        />
        {props.children}
      </div>
      <Show when={state.editModalProject}>
        <EditProjectModal
          project={state.editModalProject!}
          onClose={closeEditModal}
          onSuccess={loadProjects}
          onDelete={onDeleteProject}
          projectsApi={props.projectsApi}
        />
      </Show>
      <Show when={state.isAddModalOpen}>
        <AddProjectModal
          onClose={closeAddModal}
          onSuccess={loadProjects}
          projectsApi={props.projectsApi}
        />
      </Show>
    </>
  );
};

export { NotesLayout };
