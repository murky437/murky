import styles from './FieldError.module.css';
import { For } from 'solid-js';

interface Props {
  fieldErrors?: string[];
}

function FieldError(props: Props) {
  return <For each={props.fieldErrors}>{item => <div class={styles.inputError}>{item}</div>}</For>;
}

export { FieldError };
