import { Api } from './api/api.ts';
import { AuthApi } from './api/authApi.ts';
import { ProjectsApi } from './api/projectsApi.ts';
import { StatusApi } from './api/statusApi.ts';
import { ClientState } from './state/clientState.ts';
import { ServerState } from './state/serverState.ts';
import { LongRemindersApi } from './api/longRemindersApi.ts';

interface Container {
  storage: Storage;
  api: Api;
  authApi: AuthApi;
  projectsApi: ProjectsApi;
  statusApi: StatusApi;
  longRemindersApi: LongRemindersApi;
  clientState: ClientState;
  serverState: ServerState;
}

function newContainer(): Container {
  const storage = localStorage;

  const clientState = new ClientState(storage);

  const api = new Api(import.meta.env.VITE_API_URL, clientState.auth, clientState.status);

  const authApi = new AuthApi(api);
  const projectsApi = new ProjectsApi(api);
  const statusApi = new StatusApi(api);
  const longRemindersApi = new LongRemindersApi(api);

  const serverState = new ServerState(authApi, projectsApi, statusApi, longRemindersApi);

  return {
    authApi,
    api,
    projectsApi,
    storage,
    statusApi,
    longRemindersApi: longRemindersApi,
    serverState,
    clientState,
  };
}

export { newContainer };
export type { Container };
