import { Modal } from '../../../../shared/modal/Modal.tsx';
import styles from '../../../../shared/modal/Modal.module.css';
import { type Component, onMount } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { isGeneralError, isValidationError } from '../../../../../app/api/api.ts';
import { GeneralErrors } from '../../../../shared/GeneralErrors.tsx';
import { FieldError } from '../../../../shared/FieldError.tsx';
import { useApp } from '../../../../../app/appContext.tsx';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const AddProjectModal: Component<Props> = props => {
  const app = useApp();
  const state = createMutable({
    title: '',
    slug: '',
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
      await app.server.notes.createProject({ title: state.title, slug: state.slug });
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

  onMount(() => {
    titleInputRef.focus();
  });

  return (
    <Modal title="Add project" onClose={props.onClose}>
      <form class={styles.form} onSubmit={handleSubmit} data-testid="add-project-form">
        <GeneralErrors errors={state.generalErrors} />
        <input
          ref={titleInputRef}
          class={styles.input}
          value={state.title}
          placeholder="Title"
          onChange={e => (state.title = e.target.value)}
        />
        <FieldError fieldErrors={state.fieldErrors.title} />
        <input
          class={styles.input}
          value={state.slug}
          placeholder="slug"
          onChange={e => (state.slug = e.target.value)}
        />
        <FieldError fieldErrors={state.fieldErrors.slug} />
        <div class={styles.buttonWrapper}>
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

export { AddProjectModal };
