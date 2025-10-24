import type { StatusRepository } from './statusRepository.ts';
import { isObject } from '../../util/types.ts';
import type { StatusApi } from '../api/statusApi.ts';

class StatusService {
  #statusRepository: StatusRepository;
  #statusApi: StatusApi;

  constructor(statusRepository: StatusRepository, statusApi: StatusApi) {
    this.#statusRepository = statusRepository;
    this.#statusApi = statusApi;
  }

  isRequestLoading(): boolean {
    return this.#statusRepository.isRequestLoading();
  }

  getLastRequestStatusCode(): number | null {
    return this.#statusRepository.getLastRequestStatusCode();
  }

  getFrontendDeployCommitHash(): string | null {
    return this.#statusRepository.getFrontendDeployCommitHash();
  }

  getFrontendDeployTimestamp(): string | null {
    return this.#statusRepository.getFrontendDeployTimestamp();
  }

  getBackendDeployCommitHash(): string | null {
    return this.#statusRepository.getBackendDeployCommitHash();
  }

  getBackendDeployTimestamp(): string | null {
    return this.#statusRepository.getBackendDeployTimestamp();
  }

  async loadDeployStatus() {
    try {
      const res = await fetch('/deploy.json');
      if (res.ok) {
        const data = await res.json();
        if (isObject(data)) {
          if ('timestamp' in data) {
            this.#statusRepository.setFrontendDeployTimestamp(
              typeof data.timestamp === 'string' ? data.timestamp : null
            );
          }
          if ('commit' in data) {
            this.#statusRepository.setFrontendDeployCommitHash(
              typeof data.commit === 'string' ? data.commit : null
            );
          }
        }
      }
    } catch {}

    try {
      const res = await this.#statusApi.get();
      this.#statusRepository.setBackendDeployCommitHash(res.commit);
      this.#statusRepository.setBackendDeployTimestamp(res.timestamp);
    } catch {}
  }
}

export { StatusService };
