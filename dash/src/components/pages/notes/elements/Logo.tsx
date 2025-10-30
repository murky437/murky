import styles from './Logo.module.css';
import type { Component } from 'solid-js';

const Logo: Component = () => {
  return <div class={styles.logo}>Notes</div>;
};

export { Logo };
