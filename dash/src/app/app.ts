import type { Container } from './container.ts';
import type { ClientState } from './state/clientState.ts';
import type { ServerState } from './state/serverState.ts';
import { type NavigateOptions, type Navigator } from '@solidjs/router';

class App {
  readonly #storage: Storage;
  readonly client: ClientState;
  readonly server: ServerState;
  #navigator: Navigator | null = null;

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

  setNavigator(navigator: Navigator) {
    if (this.#navigator) {
      throw new Error('Navigator already set');
    }
    this.#navigator = navigator;
  }

  navigate(to: string, options?: Partial<NavigateOptions>) {
    if (this.#navigator) {
      this.#navigator(to, options);
    }
  }
}

export { App };
