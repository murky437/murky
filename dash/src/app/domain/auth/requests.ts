import {
  AuthApi,
  type CreateTokensRequest,
  type CreateTokenWithGuestTokenRequest,
  type SendGuestLoginLinkRequest,
} from '../../api/authApi.ts';

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

  sendGuestLoginLink(request: SendGuestLoginLinkRequest) {
    return this.#authApi.sendGuestLoginLink(request);
  }

  createTokenWithGuestToken(request: CreateTokenWithGuestTokenRequest) {
    return this.#authApi.createTokenWithGuestToken(request);
  }
}

export { AuthRequests };
