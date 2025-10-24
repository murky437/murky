import type { Api } from './api.ts';

interface GetStatusResponse {
  commit: string;
  timestamp: string;
}

class StatusApi {
  #api: Api;

  constructor(api: Api) {
    this.#api = api;
  }

  async get(): Promise<GetStatusResponse> {
    return await this.#api.fetch<GetStatusResponse>(`/status`);
  }
}

export { StatusApi };
