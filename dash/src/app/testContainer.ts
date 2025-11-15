import { AuthApi } from './api/authApi.ts';
import { ProjectsApi } from './api/projectsApi.ts';
import type { Container } from './container.ts';
import { vi } from 'vitest';
import { StatusApi } from './api/statusApi.ts';
import { ClientState } from './state/clientState.ts';
import { ServerState } from './state/serverState.ts';
import { LongRemindersApi } from './api/longRemindersApi.ts';

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

  const clientState = new ClientState(storage);

  const ApiMock = vi.fn().mockImplementation(() => ({
    fetch: vi.fn().mockImplementation(async () => ({ data: [] })),
  }));
  const api = new ApiMock();

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
    longRemindersApi,
    clientState,
    serverState,
  };
}

export { newTestContainer };
