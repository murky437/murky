import type { Container } from './container.ts';
import type { ClientState } from './state/clientState.ts';
import type { ServerState } from './state/serverState.ts';

class App {
  readonly #storage: Storage;
  readonly client: ClientState;
  readonly server: ServerState;

  constructor(c: Container) {
    this.#storage = c.storage;
    this.client = c.clientState;
    this.server = c.serverState;
  }

  async reset() {
    this.#storage.clear();
    this.client.reset();
    await this.server.reset();
  }
}

export { App };
