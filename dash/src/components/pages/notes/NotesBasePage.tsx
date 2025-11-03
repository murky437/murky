import { type RouteSectionProps, useNavigate } from '@solidjs/router';
import { type Component, createEffect } from 'solid-js';
import styles from './NotesBasePage.module.css';
import { useApp } from '../../../app/appContext.tsx';

const NotesBasePage: Component<RouteSectionProps> = () => {
  const app = useApp();
  const navigate = useNavigate();
  const projectListQuery = app.server.notes.getProjectListQuery();

  createEffect(() => {
    if (
      projectListQuery.isFetching ||
      !projectListQuery.data ||
      projectListQuery.data.length === 0
    ) {
      return;
    }

    const lastViewedProjectSlug = app.client.notes.getLastViewedProjectSlug();
    if (lastViewedProjectSlug) {
      const found = projectListQuery.data.find(p => p.slug === lastViewedProjectSlug);
      if (found) {
        navigate(`/notes/${lastViewedProjectSlug}`, { replace: true });
        return;
      }
    }

    navigate(`/notes/${[projectListQuery.data[0].slug]}`, { replace: true });
  });

  const openAddProjectModal = () => {
    app.client.notes.setIsAddModalOpen(true);
  };

  return (
    <div class={styles.wrapper}>
      <p>Right click the sidebar to add the first project.</p>
      <p>
        Or click this button: <button onClick={openAddProjectModal}>Add a new project</button>
      </p>
    </div>
  );
};

export { NotesBasePage };
