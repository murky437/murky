import { Route, Router } from '@solidjs/router';
import { Root } from './pages/layout/Root.tsx';
import { LoginPage } from './pages/login/LoginPage.tsx';
import type { Component } from 'solid-js';
import type { App } from '../app/app.ts';
import { AuthGuard } from './pages/layout/AuthGuard.tsx';
import { IndexPage } from './pages/IndexPage.tsx';
import { NotesBasePage } from './pages/notes/NotesBasePage.tsx';
import { OpenNotesPage } from './pages/notes/OpenNotesPage.tsx';
import { AppContext } from '../app/appContext.tsx';
import { NotesLayout } from './pages/notes/layout/NotesLayout.tsx';

interface Props {
  app: App;
}

const Main: Component<Props> = props => {
  return (
    <AppContext.Provider value={props.app}>
      <Router root={Root}>
        <Route path={'/login'} component={LoginPage} />
        <Route component={AuthGuard}>
          <Route path={'/'} component={IndexPage} />
          <Route component={NotesLayout}>
            <Route path={'/notes'} component={NotesBasePage} />
            <Route path={'/notes/:slug'} component={OpenNotesPage} />
          </Route>
        </Route>
      </Router>
    </AppContext.Provider>
  );
};

export { Main };
