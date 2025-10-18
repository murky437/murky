import { createEffect, onMount, type ParentComponent, Show } from 'solid-js';
import { createMutable } from 'solid-js/store';
import type { Project } from '../types/project.ts';
import { Sidebar } from './Sidebar.tsx';
import { EditProjectModal } from './modal/EditProjectModal.tsx';
import { AddProjectModal } from './modal/AddProjectModal.tsx';
import { notes } from '../store/notes.ts';
import styles from './NotesLayout.module.css';

interface Props {
  addModalShouldOpen?: boolean;
  onAddModalOpen?: () => void;
}

const NotesLayout: ParentComponent<Props> = props => {
  const state = createMutable({
    editModalProject: null as Project | null,
    isAddModalOpen: false,
  });

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
    await notes.loadProjectsFromServer();
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
        />
      </Show>
      <Show when={state.isAddModalOpen}>
        <AddProjectModal onClose={closeAddModal} onSuccess={loadProjects} />
      </Show>
    </>
  );
};

export { NotesLayout };
