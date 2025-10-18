import { useNavigate } from '@solidjs/router';
import { notes } from '../../store/notes.ts';
import { createEffect } from 'solid-js';
import styles from './NotesBasePage.module.css';
import { NotesLayout } from '../NotesLayout.tsx';
import { createMutable } from 'solid-js/store';

function NotesBasePage() {
  const state = createMutable({
    addModalShouldOpen: false,
  });
  const navigate = useNavigate();

  createEffect(() => {
    const projects = notes.getProjects();
    if (projects.length === 0) {
      return;
    }

    const lastViewedProjectSlug = notes.getLastViewedProjectSlug();
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
}

export { NotesBasePage };
