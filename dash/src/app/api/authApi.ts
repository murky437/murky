import type { Api } from './api.ts';

class AuthApi {
  readonly #api: Api;

  constructor(api: Api) {
    this.#api = api;
  }

  createTokens(request: CreateTokensRequest) {
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

  deleteRefreshToken() {
    return this.#api.fetch<void>(
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
export type { CreateTokensRequest, CreateTokensResponse };
