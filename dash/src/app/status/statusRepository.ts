import type { State } from '../state/state.ts';

class StatusRepository {
  #state: State;

  constructor(state: State) {
    this.#state = state;
  }

  isRequestLoading(): boolean {
    return this.#state.status.isRequestLoading;
  }

  setIsRequestLoading(loading: boolean) {
    this.#state.status.isRequestLoading = loading;
  }

  getLastRequestStatusCode(): number | null {
    return this.#state.status.lastRequestStatusCode;
  }

  setLastRequestStatusCode(statusCode: number | null) {
    this.#state.status.lastRequestStatusCode = statusCode;
  }

  getFrontendDeployCommitHash(): string | null {
    return this.#state.status.deploy.frontend.commit;
  }

  setFrontendDeployCommitHash(hash: string | null) {
    this.#state.status.deploy.frontend.commit = hash;
  }

  getFrontendDeployTimestamp(): string | null {
    return this.#state.status.deploy.frontend.timestamp;
  }

  setFrontendDeployTimestamp(timestamp: string | null) {
    this.#state.status.deploy.frontend.timestamp = timestamp;
  }

  getBackendDeployCommitHash(): string | null {
    return this.#state.status.deploy.backend.commit;
  }

  setBackendDeployCommitHash(hash: string | null) {
    this.#state.status.deploy.backend.commit = hash;
  }

  getBackendDeployTimestamp(): string | null {
    return this.#state.status.deploy.backend.timestamp;
  }

  setBackendDeployTimestamp(timestamp: string | null) {
    this.#state.status.deploy.backend.timestamp = timestamp;
  }
}

export { StatusRepository };
