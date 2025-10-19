import { Modal } from './Modal.tsx';
import type { Project } from '../../app/types/project.ts';
import styles from './Modal.module.css';
import { type Component, onMount } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { useNavigate } from '@solidjs/router';
import { isGeneralError, isValidationError } from '../../app/api/api.ts';
import type { ProjectsApi } from '../../app/api/projectsApi.ts';
import { GeneralErrors } from '../elements/GeneralErrors.tsx';
import { FieldError } from '../elements/FieldError.tsx';

interface Props {
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
  onDelete: () => void;
  projectsApi: ProjectsApi;
}

const EditProjectModal: Component<Props> = props => {
  const state = createMutable({
    title: props.project.title,
    slug: props.project.slug,
    generalErrors: [] as string[],
    fieldErrors: {} as Record<string, string[]>,
    loading: false,
  });
  const navigate = useNavigate();
  let titleInputRef!: HTMLInputElement;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    state.generalErrors = [];
    state.fieldErrors = {};
    state.loading = true;

    try {
      await props.projectsApi.updateProject(props.project.slug, {
        title: state.title,
        slug: state.slug,
      });
      if (state.slug !== props.project.slug) {
        navigate(`/notes/${state.slug}`, { replace: true });
      }
      props.onSuccess();
      props.onClose();
    } catch (err) {
      if (isValidationError(err)) {
        state.generalErrors = err.generalErrors || [];
        state.fieldErrors = err.fieldErrors || {};
      } else if (isGeneralError(err)) {
        state.generalErrors = [err.message];
      } else {
        state.generalErrors = ['Unknown error'];
      }
    }

    state.loading = false;
  };

  const del = async () => {
    if (confirm(`Are you sure you want to delete ${props.project.title}?`)) {
      await props.projectsApi.deleteProject(props.project.slug);
      props.onDelete();
      props.onClose();
    }
  };

  onMount(() => {
    titleInputRef.focus();
  });

  return (
    <Modal title="Edit project" onClose={props.onClose}>
      <form class={styles.form} onSubmit={handleSubmit}>
        <GeneralErrors errors={state.generalErrors} />
        <input
          ref={titleInputRef}
          class={styles.input}
          value={state.title}
          onChange={e => (state.title = e.target.value)}
        />
        <FieldError fieldErrors={state.fieldErrors.title} />
        <input
          class={styles.input}
          value={state.slug}
          onChange={e => (state.slug = e.target.value)}
        />
        <FieldError fieldErrors={state.fieldErrors.slug} />
        <div class={styles.buttonWrapper}>
          <button class={`${styles.button} ${styles.delete}`} type="button" onClick={del}>
            Delete
          </button>
          <div class={styles.right}>
            <button
              class={`${styles.button} ${styles.secondary}`}
              type="button"
              onClick={props.onClose}
            >
              Cancel
            </button>
            <button
              class={`${styles.button} ${styles.primary}`}
              type="submit"
              disabled={state.loading}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export { EditProjectModal };
