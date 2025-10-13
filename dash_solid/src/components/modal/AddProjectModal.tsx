import { Modal } from './Modal.tsx';
import { createProject } from '../../api/project.tsx';
import styles from './Modal.module.css';
import { isGeneralError, isValidationError } from '../../api/api.ts';
import { GeneralErrors } from '../GeneralErrors.tsx';
import { FieldError } from '../FieldError.tsx';
import type { Component } from 'solid-js';
import { createMutable } from 'solid-js/store';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const AddProjectModal: Component<Props> = props => {
  const state = createMutable({
    title: '',
    slug: '',
    generalErrors: [] as string[],
    fieldErrors: {} as Record<string, string[]>,
    loading: false,
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    state.generalErrors = [];
    state.fieldErrors = {};
    state.loading = true;

    try {
      await createProject({ title: state.title, slug: state.slug });
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

  return (
    <Modal title="Add project" onClose={props.onClose}>
      <form class={styles.form} onSubmit={handleSubmit}>
        <GeneralErrors errors={state.generalErrors} />
        <input
          autofocus={true}
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
