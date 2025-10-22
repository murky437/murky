import { Route, Router } from '@solidjs/router';
import { Root } from '../components/pages/layout/Root.tsx';
import { LoginPage } from '../components/pages/LoginPage.tsx';
import type { Component } from 'solid-js';
import type { App } from './app.ts';
import { AuthGuard } from '../components/pages/layout/AuthGuard.tsx';
import { IndexPage } from '../components/pages/IndexPage.tsx';
import { NotesBasePage } from '../components/pages/NotesBasePage.tsx';
import { OpenNotesPage } from '../components/pages/OpenNotesPage.tsx';
import { AppContext } from './appContext.tsx';

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
          <Route path={'/notes'} component={NotesBasePage} />
          <Route path={'/notes/:slug'} component={OpenNotesPage} />
        </Route>
      </Router>
    </AppContext.Provider>
  );
};

export { Main };
