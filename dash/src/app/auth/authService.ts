import type { AuthRepository } from './authRepository.ts';
import type { AuthApi } from '../api/authApi.ts';

class AuthService {
  #authRepository: AuthRepository;
  #authApi: AuthApi;

  constructor(authRepository: AuthRepository, authApi: AuthApi) {
    this.#authRepository = authRepository;
    this.#authApi = authApi;
  }

  isAuthenticated(): boolean {
    return this.#authRepository.getAccessToken() !== null;
  }

  getAccessToken() {
    return this.#authRepository.getAccessToken();
  }

  setAccessToken(accessToken: string | null) {
    return this.#authRepository.setAccessToken(accessToken);
  }

  async login(username: string, password: string): Promise<void> {
    const response = await this.#authApi.createTokens({ username, password });
    this.setAccessToken(response.accessToken);
  }

  async logout(): Promise<void> {
    await this.#authApi.deleteRefreshToken();
    this.setAccessToken(null);
  }
}

export { AuthService };
