import { onMount, type ParentComponent, Show } from 'solid-js';
import styles from './NotesLayout.module.css';
import { EditProjectModal } from '../elements/modal/EditProjectModal.tsx';
import { AddProjectModal } from '../elements/modal/AddProjectModal.tsx';
import { useNavigate, useParams } from '@solidjs/router';
import { useApp } from '../../../../app/appContext.tsx';
import { Sidebar } from '../elements/Sidebar.tsx';
import { Logo } from '../elements/Logo.tsx';

const NotesLayout: ParentComponent = props => {
  const app = useApp();
  const navigate = useNavigate();
  const params = useParams();

  const closeAddModal = () => {
    app.client.notes.setIsAddModalOpen(false);
  };

  const closeEditModal = () => {
    app.client.notes.setEditModalProject(null);
  };

  const loadProjects = async (oldSlug?: string, newSlug?: string) => {
    await app.server.notes.invalidateProjectListQuery();
    if (oldSlug && newSlug) {
      if (oldSlug === params.slug && oldSlug !== newSlug) {
        navigate(`/notes/${newSlug}`);
      } else {
        await app.server.notes.invalidateProjectQuery(newSlug);
      }
    }
  };

  const onDeleteProject = async () => {
    navigate(`/notes`, { replace: true });
  };

  onMount(async () => {
    await loadProjects();
  });

  return (
    <>
      <div class={styles.wrapper}>
        <Logo />
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
