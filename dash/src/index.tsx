/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import { Route, Router } from '@solidjs/router';
import { NotesBasePage } from './components/pages/NotesBasePage.tsx';
import { IndexPage } from './components/pages/IndexPage.tsx';
import { LoginPage } from './components/pages/LoginPage.tsx';
import { AuthGuard } from './components/pages/layout/AuthGuard.tsx';
import { OpenNotesPage } from './components/pages/OpenNotesPage.tsx';
import { NotesLayout } from './components/pages/layout/NotesLayout.tsx';
import {RootLayout} from "./components/pages/layout/RootLayout.tsx";

const root = document.getElementById('root');

render(
  () => (
    <Router root={RootLayout}>
      <Route path={'/login'} component={LoginPage} />
      <Route component={AuthGuard}>
        <Route path={'/'} component={IndexPage} />
        <Route component={NotesLayout}>
          <Route path={'/notes'} component={NotesBasePage} />
          <Route path={'/notes/:slug'} component={OpenNotesPage} />
        </Route>
      </Route>
    </Router>
  ),
  root!
);
