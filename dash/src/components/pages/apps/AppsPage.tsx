import styles from './AppsPage.module.css';
import { A } from '@solidjs/router';
import type { Component } from 'solid-js';

const AppsPage: Component = () => {
  return (
    <div class={styles.appsPage}>
      <A href={'/notes'}>Notes</A>
      <A href={'/calendar'}>Calendar</A>
    </div>
  );
};

export { AppsPage };
