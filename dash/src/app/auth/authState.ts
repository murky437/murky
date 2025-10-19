import { createMutable } from 'solid-js/store';

interface Data {
  accessToken: string | null;
}

class AuthState {
  #data: Data;
  #storage: Storage;

  constructor(storage: Storage) {
    this.#storage = storage;
    this.#data = createMutable<Data>({
      accessToken: this.#storage.getItem('accessToken'),
    });
  }

  isAuthenticated() {
    return this.#data.accessToken !== null;
  }

  getAccessToken() {
    return this.#data.accessToken;
  }

  setAccessToken(accessToken: string | null) {
    this.#data.accessToken = accessToken;
    if (accessToken) {
      this.#storage.setItem('accessToken', accessToken);
    } else {
      this.#storage.removeItem('accessToken');
    }
  }
}

export { AuthState };
