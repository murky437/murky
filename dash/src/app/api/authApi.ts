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

  sendGuestLoginLink(request: SendGuestLoginLinkRequest) {
    return this.#api.fetch<void>(
      `/auth/send-guest-login-link`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      },
      false
    );
  }

  createTokenWithGuestToken(request: CreateTokenWithGuestTokenRequest) {
    return this.#api.fetch<CreateTokenWithGuestTokenResponse>(
      `/auth/create-token-with-guest-token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
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

interface SendGuestLoginLinkRequest {
  email: string;
  url: string;
}

interface CreateTokenWithGuestTokenRequest {
  guestToken: string;
}

interface CreateTokenWithGuestTokenResponse {
  accessToken: string;
}

export { AuthApi };
export type {
  CreateTokensRequest,
  CreateTokensResponse,
  SendGuestLoginLinkRequest,
  CreateTokenWithGuestTokenRequest,
  CreateTokenWithGuestTokenResponse,
};
