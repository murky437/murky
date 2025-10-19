/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import { App } from './app/App.tsx';
import { Container, newContainer } from './app/container.ts';

declare global {
  interface Window {
    app: Container;
  }
}

const c = newContainer();
window.app = c;

render(() => <App container={c} />, document.getElementById('root')!);
