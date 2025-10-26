import { QueryClient } from '@tanstack/solid-query';
import { StatusRequests } from '../domain/status/requests.ts';
import { AuthRequests } from '../domain/auth/requests.ts';
import { NotesRequests } from '../domain/notes/requests.ts';
import type { AuthApi } from '../api/authApi.ts';
import type { ProjectsApi } from '../api/projectsApi.ts';
import type { StatusApi } from '../api/statusApi.ts';

class ServerState {
  readonly #queryClient: QueryClient;
  readonly auth: AuthRequests;
  readonly notes: NotesRequests;
  readonly status: StatusRequests;

  constructor(authApi: AuthApi, projectsApi: ProjectsApi, statusApi: StatusApi) {
    this.#queryClient = new QueryClient();
    this.auth = new AuthRequests(authApi);
    this.notes = new NotesRequests(this.#queryClient, projectsApi);
    this.status = new StatusRequests(this.#queryClient, statusApi);
  }

  async reset(): Promise<void> {
    await this.#queryClient.invalidateQueries();
  }
}

export { ServerState };
