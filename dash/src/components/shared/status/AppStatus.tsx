import { type Component, createMemo, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import styles from './AppStatus.module.css';
import { useApp } from '../../../app/appContext.tsx';
import { Spinner } from '../Spinner.tsx';

const AppStatus: Component = () => {
  const app = useApp();

  const styleData = createMemo(() => {
    const styleData = {
      statusIcon: '?',
      colorClass: styles.gray,
    };
    const statusCode = app.client.status.getLastRequestStatusCode();
    if (statusCode) {
      if (statusCode >= 200 && statusCode < 300) {
        styleData.statusIcon = '✓';
        styleData.colorClass = styles.green;
      } else if (statusCode >= 400 && statusCode < 500) {
        styleData.statusIcon = '×';
        styleData.colorClass = styles.yellow;
      } else if (statusCode >= 500 && statusCode < 600) {
        styleData.statusIcon = '×';
        styleData.colorClass = styles.red;
      }
    }
    return styleData;
  });

  const frontendDeployStatusQuery = app.server.status.getFrontendDeployStatusQuery();
  const backendDeployStatusQuery = app.server.status.getBackendDeployStatusQuery();

  return (
    <Portal>
      <div class={styles.wrapper}>
        <div class={styles.requestStatus}>
          <Show
            when={!app.client.status.isRequestLoading()}
            fallback={<Spinner class={styles.gray} />}
          >
            <span class={styleData().colorClass}>{styleData().statusIcon}</span>{' '}
            <span class={styleData().colorClass}>
              {app.client.status.getLastRequestStatusCode()}
            </span>
          </Show>
        </div>
        <div class={styles.deployInfo}>
          <div>Deploy info</div>
          <div>frontend</div>
          <div>commit: {frontendDeployStatusQuery.data?.commit ?? 'N/A'}</div>
          <div>timestamp: {frontendDeployStatusQuery.data?.timestamp ?? 'N/A'}</div>
          <div>backend</div>
          <div>commit: {backendDeployStatusQuery.data?.commit ?? 'N/A'}</div>
          <div>timestamp: {backendDeployStatusQuery.data?.timestamp ?? 'N/A'}</div>
        </div>
      </div>
    </Portal>
  );
};

export { AppStatus };
