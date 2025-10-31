import styles from './Breadcrumbs.module.css';
import type { Component } from 'solid-js';

interface Props {
  projectName: string;
}

const Breadcrumbs: Component<Props> = props => {
  return <div class={styles.breadcrumbs}>{props.projectName}</div>;
};

export { Breadcrumbs };
