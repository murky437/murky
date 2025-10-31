import styles from './AppsPage.module.css';
import { A } from '@solidjs/router';

const AppsPage = () => {
  return (
    <div class={styles.wrapper}>
      <A href={'/notes'}>Notes</A>
    </div>
  );
};

export { AppsPage };
