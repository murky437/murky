import { onMount, type ParentComponent, Show } from 'solid-js';
import { Sidebar } from '../../elements/Sidebar.tsx';
import styles from './NotesLayout.module.css';
import { EditProjectModal } from '../../modal/EditProjectModal.tsx';
import { AddProjectModal } from '../../modal/AddProjectModal.tsx';
import { useNavigate } from '@solidjs/router';
import { useApp } from '../../../app/appContext.tsx';

const NotesLayout: ParentComponent = props => {
  const app = useApp();
  const navigate = useNavigate();

  const closeAddModal = () => {
    app.notes.setIsAddModalOpen(false);
  };

  const closeEditModal = () => {
    app.notes.setEditModalProject(null);
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

  return (
    <>
      <div class={styles.wrapper}>
        <Sidebar />
        {props.children}
      </div>
      <Show when={app.notes.getEditModalProject()}>
        <EditProjectModal
          project={app.notes.getEditModalProject()!}
          onClose={closeEditModal}
          onSuccess={loadProjects}
          onDelete={onDeleteProject}
        />
      </Show>
      <Show when={app.notes.isAddModalOpen()}>
        <AddProjectModal onClose={closeAddModal} onSuccess={loadProjects} />
      </Show>
    </>
  );
};

export { NotesLayout };
