import styles from './ContextMenu.module.css';
import { onCleanup, type ParentComponent } from 'solid-js';
import { Portal } from 'solid-js/web';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
}

const ContextMenu: ParentComponent<Props> = props => {
  let wrapperDiv!: HTMLDivElement;

  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperDiv && !wrapperDiv.contains(e.target as Node)) {
      props.onClose();
    }
  };
  document.addEventListener('mousedown', handleClickOutside);

  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });

  return (
    <Portal>
      <div
        ref={wrapperDiv}
        style={{ left: `${props.x}px`, top: `${props.y}px` }}
        class={styles.wrapper}
      >
        {props.children}
      </div>
    </Portal>
  );
};

export { ContextMenu };
