import { type Component, createEffect, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import styles from './AppStatus.module.css';
import { useApp } from '../../../app/appContext.tsx';
import { createMutable } from 'solid-js/store';
import { Spinner } from '../Spinner.tsx';

const AppStatus: Component = () => {
  const app = useApp();
  const state = createMutable({
    statusIcon: '?',
    colorClass: styles.gray,
  });

  createEffect(() => {
    const statusCode = app.status.getLastRequestStatusCode();
    if (statusCode) {
      if (statusCode >= 200 && statusCode < 300) {
        state.statusIcon = '✓';
        state.colorClass = styles.green;
      } else if (statusCode >= 400 && statusCode < 500) {
        state.statusIcon = '×';
        state.colorClass = styles.yellow;
      } else if (statusCode >= 500 && statusCode < 600) {
        state.statusIcon = '×';
        state.colorClass = styles.red;
      }
    } else {
      state.statusIcon = '?';
      state.colorClass = styles.gray;
    }
  });

  return (
    <Portal>
      <div class={styles.wrapper}>
        <div>
          <Show when={!app.status.isRequestLoading()} fallback={<Spinner class={styles.gray} />}>
            <span class={state.colorClass}>{state.statusIcon}</span>{' '}
            <span class={state.colorClass}>{app.status.getLastRequestStatusCode()}</span>
          </Show>
        </div>
        <div>
          <div>Deploy data</div>
          <div>frontend</div>
          <div>commit: {app.status.getFrontendDeployCommitHash() ?? 'N/A'}</div>
          <div>timestamp: {app.status.getFrontendDeployTimestamp() ?? 'N/A'}</div>
          <div>backend</div>
          <div>commit: {app.status.getBackendDeployCommitHash() ?? 'N/A'}</div>
          <div>timestamp: {app.status.getBackendDeployTimestamp() ?? 'N/A'}</div>
        </div>
      </div>
    </Portal>
  );
};

export { AppStatus };
