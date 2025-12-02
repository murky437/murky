import { A, useLocation } from '@solidjs/router';
import styles from './Sidebar.module.css';
import { createMutable } from 'solid-js/store';
import { createEffect, type JSX, on, onMount, type ParentComponent } from 'solid-js';

interface Props {
  logo?: JSX.Element;
}

const Sidebar: ParentComponent<Props> = props => {
  const state = createMutable({
    isSidebarVisible: false,
  });
  const location = useLocation();

  const toggleSidebarVisibility = () => {
    state.isSidebarVisible = !state.isSidebarVisible;
  };

  const hideSidebar = () => {
    state.isSidebarVisible = false;
  };

  onMount(() => {
    hideSidebar();
  });

  createEffect(
    on(
      () => [location.pathname],
      () => {
        hideSidebar();
      }
    )
  );

  return (
    <div classList={{ [styles.sidebar]: true, [styles.visible]: state.isSidebarVisible }}>
      <div class={styles.revealButtonArea} onClick={toggleSidebarVisibility}>
        <div class={styles.revealButton}>
          <div class={styles.circle}></div>
          <div class={styles.circle}></div>
          <div class={styles.circle}></div>
        </div>
      </div>
      <div class={styles.content} data-testid="sidebar">
        <div class={styles.inside}>
          <div class={styles.logoWrapper}>{props.logo}</div>
          <div>{props.children}</div>
          <div class={styles.bottom}>
            <A href={'/apps'} onClick={hideSidebar}>
              Other apps
            </A>
            <div class={styles.separator}></div>
            <A href={'/settings'} onClick={hideSidebar}>
              Settings
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Sidebar };
