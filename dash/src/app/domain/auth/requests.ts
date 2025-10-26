import { AuthApi, type CreateTokensRequest } from '../../api/authApi.ts';

class AuthRequests {
  readonly #authApi: AuthApi;

  constructor(authApi: AuthApi) {
    this.#authApi = authApi;
  }

  createTokens(request: CreateTokensRequest) {
    return this.#authApi.createTokens(request);
  }

  deleteRefreshToken() {
    return this.#authApi.deleteRefreshToken();
  }
}

export { AuthRequests };
