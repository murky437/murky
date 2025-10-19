import { Route, Router } from '@solidjs/router';
import { Root } from '../components/pages/layout/Root.tsx';
import { LoginPage } from '../components/pages/LoginPage.tsx';
import type { Component } from 'solid-js';
import type { Container } from './container.ts';
import { AuthGuard } from '../components/pages/layout/AuthGuard.tsx';
import { IndexPage } from '../components/pages/IndexPage.tsx';
import { NotesBasePage } from '../components/pages/NotesBasePage.tsx';
import { OpenNotesPage } from '../components/pages/OpenNotesPage.tsx';

interface Props {
  container: Container;
}

const App: Component<Props> = props => {
  return (
    <Router root={Root}>
      <Route
        path={'/login'}
        component={() => (
          <LoginPage authState={props.container.authState} authApi={props.container.authApi} />
        )}
      />
      <Route
        component={routeProps => (
          <AuthGuard authState={props.container.authState} children={routeProps.children} />
        )}
      >
        <Route path={'/'} component={IndexPage} />
        <Route
          path={'/notes'}
          component={() => (
            <NotesBasePage
              notesState={props.container.notesState}
              authState={props.container.authState}
              authApi={props.container.authApi}
              projectsApi={props.container.projectsApi}
            />
          )}
        />
        <Route
          path={'/notes/:slug'}
          component={() => (
            <OpenNotesPage
              notesState={props.container.notesState}
              authState={props.container.authState}
              authApi={props.container.authApi}
              projectsApi={props.container.projectsApi}
            />
          )}
        />
      </Route>
    </Router>
  );
};

export { App };
