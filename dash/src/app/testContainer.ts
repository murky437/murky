import { StateService } from './state/state.ts';
import { AuthService } from './auth/authService.ts';
import { NotesService } from './notes/notesService.ts';
import { AuthRepository } from './auth/authRepository.ts';
import { NotesRepository } from './notes/notesRepository.ts';
import { Api } from './api/api.ts';
import { AuthApi } from './api/authApi.ts';
import { ProjectsApi } from './api/projectsApi.ts';
import type { Container } from './container.ts';

function newTestContainer(): Container {
  const localStorageMock: Storage = {
    store: {} as Record<string, string>,
    getItem(key) {
      return this.store[key] ?? null;
    },
    setItem(key, value) {
      this.store[key] = value;
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
    key(i) {
      return Object.keys(this.store)[i] ?? null;
    },
    get length() {
      return Object.keys(this.store).length;
    },
  };

  const storage = localStorageMock;

  const stateService = new StateService(storage);
  const state = stateService.createState();

  const authRepository = new AuthRepository(state, storage);
  const notesRepository = new NotesRepository(state, storage);

  const api = new Api('http://test.local', authRepository);
  const authApi = new AuthApi(api);
  const projectsApi = new ProjectsApi(api);

  const authService = new AuthService(authRepository, authApi);
  const notesService = new NotesService(notesRepository, projectsApi);

  return {
    state,
    stateService,
    authService,
    authApi,
    api,
    authRepository,
    projectsApi,
    notesRepository,
    notesService,
    storage,
  };
}

export { newTestContainer };
