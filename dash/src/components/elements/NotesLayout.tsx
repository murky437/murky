import { createEffect, onMount, type ParentComponent, Show } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { Sidebar } from './Sidebar.tsx';
import styles from './NotesLayout.module.css';
import type { Project } from '../../app/types/project.ts';
import { EditProjectModal } from '../modal/EditProjectModal.tsx';
import { AddProjectModal } from '../modal/AddProjectModal.tsx';
import { useNavigate } from '@solidjs/router';
import { useApp } from '../../app/appContext.tsx';

interface Props {
  addModalShouldOpen?: boolean;
  onAddModalOpen?: () => void;
}

const NotesLayout: ParentComponent<Props> = props => {
  const app = useApp();
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
    await app.notes.loadProjectsFromServer();
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
        <Sidebar openAddModal={openAddModal} openEditModal={openEditModal} />
        {props.children}
      </div>
      <Show when={state.editModalProject}>
        <EditProjectModal
          project={state.editModalProject!}
          onClose={closeEditModal}
          onSuccess={loadProjects}
          onDelete={onDeleteProject}
        />
      </Show>
      <Show when={state.isAddModalOpen}>
        <AddProjectModal onClose={closeAddModal} onSuccess={loadProjects} />
      </Show>
    </>
  );
};

export { NotesLayout };
