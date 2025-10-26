import { onMount, type ParentComponent, Show } from 'solid-js';
import styles from './NotesLayout.module.css';
import { EditProjectModal } from '../elements/modal/EditProjectModal.tsx';
import { AddProjectModal } from '../elements/modal/AddProjectModal.tsx';
import { useNavigate } from '@solidjs/router';
import { useApp } from '../../../../app/appContext.tsx';
import { Sidebar } from '../elements/Sidebar.tsx';

const NotesLayout: ParentComponent = props => {
  const app = useApp();
  const navigate = useNavigate();

  const closeAddModal = () => {
    app.client.notes.setIsAddModalOpen(false);
  };

  const closeEditModal = () => {
    app.client.notes.setEditModalProject(null);
  };

  const loadProjects = async () => {
    await app.server.notes.invalidateProjectListQuery();
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
      <Show when={app.client.notes.getEditModalProject()}>
        <EditProjectModal
          project={app.client.notes.getEditModalProject()!}
          onClose={closeEditModal}
          onSuccess={loadProjects}
          onDelete={onDeleteProject}
        />
      </Show>
      <Show when={app.client.notes.isAddModalOpen()}>
        <AddProjectModal onClose={closeAddModal} onSuccess={loadProjects} />
      </Show>
    </>
  );
};

export { NotesLayout };
