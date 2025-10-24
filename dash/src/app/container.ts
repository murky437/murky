import { type State, StateService } from './state/state.ts';
import { AuthService } from './auth/authService.ts';
import { NotesService } from './notes/notesService.ts';
import { AuthRepository } from './auth/authRepository.ts';
import { NotesRepository } from './notes/notesRepository.ts';
import { Api } from './api/api.ts';
import { AuthApi } from './api/authApi.ts';
import { ProjectsApi } from './api/projectsApi.ts';
import { StatusRepository } from './status/statusRepository.ts';
import { StatusService } from './status/statusService.ts';
import { StatusApi } from './api/statusApi.ts';

interface Container {
  storage: Storage;
  stateService: StateService;
  state: State;
  authRepository: AuthRepository;
  notesRepository: NotesRepository;
  statusRepository: StatusRepository;
  api: Api;
  authApi: AuthApi;
  projectsApi: ProjectsApi;
  statusApi: StatusApi;
  authService: AuthService;
  notesService: NotesService;
  statusService: StatusService;
}

function newContainer(): Container {
  const storage = localStorage;

  const stateService = new StateService(storage);
  const state = stateService.createState();

  const authRepository = new AuthRepository(state, storage);
  const notesRepository = new NotesRepository(state, storage);
  const statusRepository = new StatusRepository(state);

  const api = new Api(import.meta.env.VITE_API_URL, authRepository, statusRepository);
  const authApi = new AuthApi(api);
  const projectsApi = new ProjectsApi(api);
  const statusApi = new StatusApi(api);

  const authService = new AuthService(authRepository, authApi);
  const notesService = new NotesService(notesRepository, projectsApi);
  const statusService = new StatusService(statusRepository, statusApi);

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
    statusRepository,
    statusService,
    statusApi,
  };
}

export { newContainer };
export type { Container };
