import { useNavigate } from '@solidjs/router';
import { type Component, createEffect } from 'solid-js';
import styles from './NotesBasePage.module.css';
import { createMutable } from 'solid-js/store';
import type { NotesState } from '../../app/notes/notesState.ts';
import { NotesLayout } from '../elements/NotesLayout.tsx';
import type { AuthState } from '../../app/auth/authState.ts';
import type { AuthApi } from '../../app/api/authApi.ts';
import type { ProjectsApi } from '../../app/api/projectsApi.ts';

interface Props {
  notesState: NotesState;
  authState: AuthState;
  authApi: AuthApi;
  projectsApi: ProjectsApi;
}

const NotesBasePage: Component<Props> = props => {
  const state = createMutable({
    addModalShouldOpen: false,
  });
  const navigate = useNavigate();

  createEffect(() => {
    const projects = props.notesState.getProjects();
    if (projects.length === 0) {
      return;
    }

    const lastViewedProjectSlug = props.notesState.getLastViewedProjectSlug();
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
    <NotesLayout
      notesState={props.notesState}
      authApi={props.authApi}
      authState={props.authState}
      projectsApi={props.projectsApi}
      addModalShouldOpen={state.addModalShouldOpen}
      onAddModalOpen={onAddModalOpen}
    >
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
