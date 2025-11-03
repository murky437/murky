import { type ParentComponent, Show } from 'solid-js';
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

  const onAddProject = async () => {
    await app.server.notes.invalidateProjectListQuery();
  };

  const onEditProject = async (oldSlug: string, newSlug: string) => {
    await app.server.notes.invalidateProjectListQuery();
    if (oldSlug === params.slug && oldSlug !== newSlug) {
      navigate(`/notes/${newSlug}`, { replace: true });
    } else {
      await app.server.notes.invalidateProjectQuery(newSlug);
    }
  };

  const onDeleteProject = async (deletedSlug: string) => {
    if (deletedSlug === params.slug) {
      navigate(`/notes`, { replace: true });
    } else {
      await app.server.notes.invalidateProjectListQuery();
    }
  };

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
          onSuccess={onEditProject}
          onDelete={onDeleteProject}
        />
      </Show>
      <Show when={app.client.notes.isAddModalOpen()}>
        <AddProjectModal onClose={closeAddModal} onSuccess={onAddProject} />
      </Show>
    </>
  );
};

export { NotesLayout };
