import { focusManager, QueryClient } from '@tanstack/solid-query';
import { StatusRequests } from '../domain/status/requests.ts';
import { AuthRequests } from '../domain/auth/requests.ts';
import { NotesRequests } from '../domain/notes/requests.ts';
import type { AuthApi } from '../api/authApi.ts';
import type { ProjectsApi } from '../api/projectsApi.ts';
import type { StatusApi } from '../api/statusApi.ts';

class ServerState {
  readonly queryClient: QueryClient;
  readonly auth: AuthRequests;
  readonly notes: NotesRequests;
  readonly status: StatusRequests;

  constructor(authApi: AuthApi, projectsApi: ProjectsApi, statusApi: StatusApi) {
    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Make QueryClient refetchOnWindowFocus also listen to 'focus' event in addition to the default 'visibilitychange' event
    focusManager.setEventListener(onFocus => {
      if (typeof window !== 'undefined' && window.addEventListener) {
        const listener = () => onFocus();
        // Listen to visibilitychange and focus
        window.addEventListener('visibilitychange', listener, false);
        window.addEventListener('focus', listener, false);

        return () => {
          // Be sure to unsubscribe if a new handler is set
          window.removeEventListener('visibilitychange', listener);
          window.removeEventListener('focus', listener);
        };
      }
      return;
    });

    this.auth = new AuthRequests(authApi);
    this.notes = new NotesRequests(this.queryClient, projectsApi);
    this.status = new StatusRequests(this.queryClient, statusApi);
  }

  async reset(): Promise<void> {
    await this.queryClient.invalidateQueries();
  }
}

export { ServerState };
