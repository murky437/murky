import { useState } from 'react';
import { Modal } from './Modal.tsx';
import { createProject } from '../../api/project.tsx';
import styles from './Modal.module.css';
import * as React from 'react';
import { isGeneralError, isValidationError } from '../../api/api.ts';
import { GeneralErrors } from '../GeneralErrors.tsx';
import { FieldError } from '../FieldError.tsx';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

function AddProjectModal({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [generalErrors, setGeneralErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralErrors([]);
    setFieldErrors({});
    setLoading(true);

    try {
      await createProject({ title, slug });
      onSuccess();
      onClose();
    } catch (err) {
      if (isValidationError(err)) {
        setGeneralErrors(err.generalErrors || []);
        setFieldErrors(err.fieldErrors || {});
      } else if (isGeneralError(err)) {
        setGeneralErrors([err.message]);
      } else {
        setGeneralErrors(['Unknown error']);
      }
    }

    setLoading(false);
  };

  return (
    <Modal title="Add project" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <GeneralErrors errors={generalErrors} />
        <input
          autoFocus={true}
          className={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <FieldError fieldErrors={fieldErrors.title} />
        <input className={styles.input} value={slug} onChange={e => setSlug(e.target.value)} />
        <FieldError fieldErrors={fieldErrors.slug} />
        <div className={styles.buttonWrapper}>
          <div className={styles.right}>
            <button
              className={`${styles.button} ${styles.secondary}`}
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`${styles.button} ${styles.primary}`}
              type="submit"
              disabled={loading}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export { AddProjectModal };
