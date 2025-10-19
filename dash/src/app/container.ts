import { ProjectsApi } from './api/projectsApi.ts';
import { NotesState } from './notes/notesState.ts';
import { AuthState } from './auth/authState.ts';
import { AuthApi } from './api/authApi.ts';
import { Api } from './api/api.ts';

class Container {
  readonly authState: AuthState;
  readonly authApi: AuthApi;
  readonly projectsApi: ProjectsApi;
  readonly notesState: NotesState;

  constructor(
    authState: AuthState,
    authApi: AuthApi,
    projectsApi: ProjectsApi,
    notesState: NotesState
  ) {
    this.authState = authState;
    this.authApi = authApi;
    this.projectsApi = projectsApi;
    this.notesState = notesState;
  }
}

function newContainer(): Container {
  const storage = localStorage;
  const authState = new AuthState(storage);
  const api = new Api(import.meta.env.VITE_API_URL, authState);
  const authApi = new AuthApi(api);
  const projectsApi = new ProjectsApi(api);
  const notesState = new NotesState(projectsApi);
  return new Container(authState, authApi, projectsApi, notesState);
}

export { Container, newContainer };
