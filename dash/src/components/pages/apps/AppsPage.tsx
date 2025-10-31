import styles from './AppsPage.module.css';
import { A } from '@solidjs/router';
import type { Component } from 'solid-js';

const AppsPage: Component = () => {
  return (
    <div class={styles.wrapper}>
      <A href={'/notes'}>Notes</A>
    </div>
  );
};

export { AppsPage };
