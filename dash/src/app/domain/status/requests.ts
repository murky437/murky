import { QueryClient, useQuery } from '@tanstack/solid-query';
import { StatusApi } from '../../api/statusApi.ts';
import { type DeployStatus, isDeployStatus } from './types.ts';

class StatusRequests {
  readonly #queryClient: QueryClient;
  readonly #statusApi: StatusApi;

  constructor(queryClient: QueryClient, statusApi: StatusApi) {
    this.#queryClient = queryClient;
    this.#statusApi = statusApi;
  }

  getBackendDeployStatusQuery() {
    return useQuery(
      () => ({
        queryKey: ['status.getBackendDeployStatus'],
        queryFn: async () => {
          return await this.#statusApi.get();
        },
        staleTime: 1000 * 60 * 60,
      }),
      () => this.#queryClient
    );
  }

  getFrontendDeployStatusQuery() {
    return useQuery(
      () => ({
        queryKey: ['status.getFrontendDeployStatus'],
        queryFn: async (): Promise<DeployStatus> => {
          const res = await fetch('/deploy.json');
          if (!res.ok) {
            throw new Error('Frontend deploy.json not available');
          }

          const data = await res.json();
          if (!isDeployStatus(data)) {
            throw new Error('Frontend deploy.json has invalid format');
          }

          return data;
        },
        staleTime: 1000 * 60 * 60,
      }),
      () => this.#queryClient
    );
  }
}

export { StatusRequests };
