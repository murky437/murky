import styles from './GeneralErrors.module.css';
import { For, Show } from 'solid-js';

interface Props {
  errors: string[];
}

function GeneralErrors(props: Props) {
  return (
    <Show when={props.errors.length > 0}>
      <div class={styles.generalErrors}>
        <For each={props.errors}>{item => <div class={styles.errorText}>{item}</div>}</For>
      </div>
    </Show>
  );
}

export { GeneralErrors };
