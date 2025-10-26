import { createMutable, modifyMutable, reconcile } from 'solid-js/store';

interface Data {
  accessToken: string | null;
}

class AuthState {
  static readonly KEY_ACCESS_TOKEN = 'accessToken';

  readonly #reactiveData: Data;
  readonly #storage: Storage;

  constructor(storage: Storage) {
    this.#storage = storage;
    this.#reactiveData = createMutable<Data>(this.#getInitialData());
  }

  #getInitialData(): Data {
    return {
      accessToken: this.#storage.getItem(AuthState.KEY_ACCESS_TOKEN),
    };
  }

  reset() {
    modifyMutable(this.#reactiveData, reconcile(this.#getInitialData()));
  }

  getAccessToken() {
    return this.#reactiveData.accessToken;
  }

  setAccessToken(accessToken: string | null) {
    this.#reactiveData.accessToken = accessToken;
    if (accessToken) {
      this.#storage.setItem(AuthState.KEY_ACCESS_TOKEN, accessToken);
    } else {
      this.#storage.removeItem(AuthState.KEY_ACCESS_TOKEN);
    }
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}

export { AuthState };
