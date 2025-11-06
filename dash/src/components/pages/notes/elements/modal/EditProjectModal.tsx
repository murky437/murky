import { Modal } from '../../../../shared/modal/Modal.tsx';
import type { Project } from '../../../../../app/domain/notes/types.ts';
import styles from '../../../../shared/modal/Modal.module.css';
import { type Component, For, onMount } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { isGeneralError, isValidationError } from '../../../../../app/api/api.ts';
import { useApp } from '../../../../../app/appContext.tsx';

interface Props {
  project: Project;
  onClose: () => void;
  onSuccess: (oldSlug: string, newSlug: string) => void;
  onDelete: (deletedSlug: string) => void;
}

const EditProjectModal: Component<Props> = props => {
  const app = useApp();
  const state = createMutable({
    title: props.project.title,
    slug: props.project.slug,
    generalErrors: [] as string[],
    fieldErrors: {} as Record<string, string[]>,
    loading: false,
  });
  let titleInputRef!: HTMLInputElement;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    state.generalErrors = [];
    state.fieldErrors = {};
    state.loading = true;

    try {
      await app.server.notes.updateProject(props.project.slug, {
        title: state.title,
        slug: state.slug,
      });
      props.onSuccess(props.project.slug, state.slug);
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
      await app.server.notes.deleteProject(props.project.slug);
      props.onDelete(props.project.slug);
      props.onClose();
    }
  };

  onMount(() => {
    titleInputRef.focus();
  });

  return (
    <Modal title="Edit project" onClose={props.onClose}>
      <form class={styles.form} onSubmit={handleSubmit} data-testid="edit-project-form">
        <For each={state.generalErrors}>
          {item => <div class={styles.generalError}>{item}</div>}
        </For>
        <input
          ref={titleInputRef}
          class={styles.input}
          value={state.title}
          placeholder="Title"
          onChange={e => (state.title = e.target.value)}
        />
        <For each={state.fieldErrors.title}>
          {item => <div class={styles.fieldError}>{item}</div>}
        </For>
        <input
          class={styles.input}
          value={state.slug}
          placeholder="slug"
          onChange={e => (state.slug = e.target.value)}
        />
        <For each={state.fieldErrors.slug}>
          {item => <div class={styles.fieldError}>{item}</div>}
        </For>
        <div class={styles.buttonWrapper}>
          <div class={styles.left}>
            <button class={`${styles.button} ${styles.delete}`} type="button" onClick={del}>
              Delete
            </button>
            <button
              class={`${styles.button} ${styles.secondary}`}
              type="button"
              onClick={props.onClose}
            >
              Cancel
            </button>
          </div>
          <div class={styles.right}>
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
