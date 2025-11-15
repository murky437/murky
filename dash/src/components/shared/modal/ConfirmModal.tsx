import { type Component, Show } from 'solid-js';
import { useApp } from '../../../app/appContext.tsx';
import { Modal } from './Modal.tsx';
import styles from './ConfirmModal.module.css';

const ConfirmModal: Component = () => {
  const app = useApp();

  const yes = () => {
    app.client.shared.closeConfirmModal(true);
  };

  const no = () => {
    app.client.shared.closeConfirmModal(false);
  };

  return (
    <Show when={app.client.shared.isConfirmModalOpen()}>
      <Modal onClose={no}>
        <div class={styles.confirmModal}>
          <div>{app.client.shared.getConfirmModalText()}</div>
          <div class={styles.bottom}>
            <button onClick={yes} class={`${styles.button} ${styles.yes}`}>
              Yes
            </button>
            <button onClick={no} class={`${styles.button} ${styles.no}`}>
              No
            </button>
          </div>
        </div>
      </Modal>
    </Show>
  );
};

export { ConfirmModal };
