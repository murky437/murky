import { A, useLocation } from '@solidjs/router';
import styles from './Sidebar.module.css';
import { createMutable } from 'solid-js/store';
import { createEffect, type JSX, on, onMount, type ParentComponent } from 'solid-js';

interface Props {
  logo?: JSX.Element;
  isVisible?: boolean;
  setIsVisible?: (isVisible: boolean) => void;
  onContextMenu?: (e: MouseEvent) => void;
}

const Sidebar: ParentComponent<Props> = props => {
  const state = createMutable({
    isVisible: false,
  });
  const location = useLocation();

  const toggleVisibility = () => {
    state.isVisible = !state.isVisible;
    if (props.setIsVisible) {
      props.setIsVisible(state.isVisible);
    }
  };

  const hide = () => {
    state.isVisible = false;
    if (props.setIsVisible) {
      props.setIsVisible(state.isVisible);
    }
  };

  onMount(() => {
    hide();
  });

  createEffect(
    on(
      () => [location.pathname],
      () => {
        hide();
      }
    )
  );

  createEffect(() => {
    if (props.isVisible !== undefined) {
      state.isVisible = props.isVisible;
    }
  })

  return (
    <div classList={{ [styles.sidebar]: true, [styles.visible]: state.isVisible }}>
      <div class={styles.revealButtonArea} onClick={toggleVisibility}>
        <div class={styles.revealButton}>
          <div class={styles.circle}></div>
          <div class={styles.circle}></div>
          <div class={styles.circle}></div>
        </div>
      </div>
      <div class={styles.content} data-testid="sidebar" onContextMenu={props.onContextMenu}>
        <div class={styles.inside}>
          <div class={styles.logoWrapper}>{props.logo}</div>
          <div>{props.children}</div>
          <div class={styles.bottom}>
            <A href={'/apps'} onClick={hide}>
              Other apps
            </A>
            <div class={styles.separator}></div>
            <A href={'/settings'} onClick={hide}>
              Settings
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Sidebar };
