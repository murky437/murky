/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import { Main } from './app/Main.tsx';
import { App } from './app/app.ts';
import { newContainer } from './app/container.ts';

declare global {
  interface Window {
    app: App;
  }
}

const c = newContainer();
const app = new App(c);
window.app = app;

render(() => <Main app={app} />, document.getElementById('root')!);
