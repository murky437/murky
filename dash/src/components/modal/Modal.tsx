import styles from './Modal.module.css';
import { Portal } from 'solid-js/web';
import { onCleanup, onMount, type ParentComponent } from 'solid-js';

interface Props {
  title: string;
  onClose: () => void;
}

const Modal: ParentComponent<Props> = props => {
  let modalDiv!: HTMLDivElement;

  const handleClickOutside = (e: MouseEvent) => {
    if (modalDiv && !modalDiv.contains(e.target as Node)) {
      props.onClose();
    }
  };

  onMount(() => document.addEventListener('mousedown', handleClickOutside));
  onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));

  const handleEscapeKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.onClose();
    }
  };

  onMount(() => window.addEventListener('keydown', handleEscapeKeyPress));
  onCleanup(() => window.removeEventListener('keydown', handleEscapeKeyPress));

  return (
    <Portal>
      <div class={styles.overlay}>
        <div ref={modalDiv} class={styles.modal}>
          <h2 class={styles.title}>{props.title}</h2>
          {props.children}
        </div>
      </div>
    </Portal>
  );
};

export { Modal };
