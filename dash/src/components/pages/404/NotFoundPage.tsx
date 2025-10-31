import type { Component } from 'solid-js';
import styles from './NotFoundPage.module.css';

const NotFoundPage: Component = () => {
  return <div class={styles.wrapper}>404 Not Found</div>;
};

export { NotFoundPage };
