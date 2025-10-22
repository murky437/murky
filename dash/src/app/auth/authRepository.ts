import type { State } from '../state/state.ts';

class AuthRepository {
  static readonly KEY_ACCESS_TOKEN = 'accessToken';

  private state: State;
  private storage: Storage;

  constructor(state: State, storage: Storage) {
    this.state = state;
    this.storage = storage;
  }

  getAccessToken() {
    return this.state.auth.accessToken;
  }

  setAccessToken(accessToken: string | null) {
    this.state.auth.accessToken = accessToken;
    if (accessToken) {
      this.storage.setItem(AuthRepository.KEY_ACCESS_TOKEN, accessToken);
    } else {
      this.storage.removeItem(AuthRepository.KEY_ACCESS_TOKEN);
    }
  }
}

export { AuthRepository };
