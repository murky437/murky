import { useApp } from '../../../app/appContext.tsx';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
  const app = useApp();

  const handleLogout = async () => {
    await app.server.auth.deleteRefreshToken();
    await app.reset();
  };
  return (
    <div class={styles.wrapper}>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export { SettingsPage };
