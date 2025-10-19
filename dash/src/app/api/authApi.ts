import type { Api } from './api.ts';

class AuthApi {
  readonly #api: Api;

  constructor(api: Api) {
    this.#api = api;
  }

  async createTokens(request: CreateTokensRequest): Promise<CreateTokensResponse> {
    return this.#api.fetch<CreateTokensResponse>(
      `/auth/create-tokens`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      },
      false
    );
  }

  async deleteRefreshToken(): Promise<void> {
    await this.#api.fetch(
      `/auth/delete-refresh-token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      false
    );
  }
}

interface CreateTokensRequest {
  username: string;
  password: string;
}

interface CreateTokensResponse {
  accessToken: string;
}

export { AuthApi };
