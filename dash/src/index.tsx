/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import { Route, Router } from '@solidjs/router';
import { NotesBasePage } from './pages/NotesBasePage.tsx';
import { IndexPage } from './pages/IndexPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { AuthGuard } from './pages/layout/AuthGuard.tsx';
import { OpenNotesPage } from './pages/OpenNotesPage.tsx';
import { NotesLayout } from './pages/layout/NotesLayout.tsx';

const root = document.getElementById('root');

render(
  () => (
    <Router>
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
