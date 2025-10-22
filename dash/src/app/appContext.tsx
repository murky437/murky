import { createContext, useContext } from 'solid-js';
import { App } from './app.ts';

const AppContext = createContext<App>();

function useApp(): App {
  const app = useContext(AppContext);
  if (!app) {
    throw new Error('AppContext not provided');
  }
  return app;
}

export { AppContext, useApp };
