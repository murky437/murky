import type { Api } from './api.ts';
import type { DeployStatus } from '../domain/status/types.ts';

class StatusApi {
  #api: Api;

  constructor(api: Api) {
    this.#api = api;
  }

  async get(): Promise<DeployStatus> {
    return await this.#api.fetch<DeployStatus>(`/status`);
  }
}

export { StatusApi };
