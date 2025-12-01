import styles from './Breadcrumbs.module.css';
import type { Component } from 'solid-js';

interface Props {
  projectName: string;
}

const Breadcrumbs: Component<Props> = props => {
  return (
    <div class={styles.breadcrumbs}>
      <div class={styles.first}>Notes</div>
      <div class={styles.separator}><span class={styles.circle}></span></div>
      <div class={styles.crumb}>{props.projectName}</div>
    </div>
  );
};

export { Breadcrumbs };
