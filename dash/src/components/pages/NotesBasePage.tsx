import { type RouteSectionProps, useNavigate } from '@solidjs/router';
import { type Component, createEffect } from 'solid-js';
import styles from './NotesBasePage.module.css';
import { createMutable } from 'solid-js/store';
import { NotesLayout } from '../elements/NotesLayout.tsx';
import { useApp } from '../../app/appContext.tsx';

const NotesBasePage: Component<RouteSectionProps> = () => {
  const app = useApp();
  const state = createMutable({
    addModalShouldOpen: false,
  });
  const navigate = useNavigate();

  createEffect(() => {
    const projects = app.notes.getProjects();
    if (projects.length === 0) {
      return;
    }

    const lastViewedProjectSlug = app.notes.getLastViewedProjectSlug();
    if (lastViewedProjectSlug) {
      const found = projects.find(p => p.slug === lastViewedProjectSlug);

      if (found) {
        navigate(`/notes/${lastViewedProjectSlug}`, { replace: true });
        return;
      }
    }

    navigate(`/notes/${[projects[0].slug]}`, { replace: true });
  });

  const openAddProjectModal = () => {
    state.addModalShouldOpen = true;
  };

  const onAddModalOpen = () => {
    state.addModalShouldOpen = false;
  };

  return (
    <NotesLayout addModalShouldOpen={state.addModalShouldOpen} onAddModalOpen={onAddModalOpen}>
      <div class={styles.wrapper}>
        <p>Right click the sidebar to add the first project.</p>
        <p>
          Or click this button: <button onClick={openAddProjectModal}>Add a new project</button>
        </p>
      </div>
    </NotesLayout>
  );
};

export { NotesBasePage };
