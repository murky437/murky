import { createMutable, modifyMutable, reconcile } from 'solid-js/store';

interface Data {
  isRequestLoading: boolean;
  lastRequestStatusCode: number | null;
}

class StatusState {
  readonly #reactiveData: Data;

  constructor() {
    this.#reactiveData = createMutable<Data>(this.#getInitialData());
  }

  #getInitialData(): Data {
    return {
      isRequestLoading: false,
      lastRequestStatusCode: null,
    };
  }

  reset() {
    modifyMutable(this.#reactiveData, reconcile(this.#getInitialData()));
  }

  isRequestLoading(): boolean {
    return this.#reactiveData.isRequestLoading;
  }

  setIsRequestLoading(isRequestLoading: boolean): void {
    this.#reactiveData.isRequestLoading = isRequestLoading;
  }

  getLastRequestStatusCode(): number | null {
    return this.#reactiveData.lastRequestStatusCode;
  }

  setLastRequestStatusCode(lastRequestStatusCode: number | null): void {
    this.#reactiveData.lastRequestStatusCode = lastRequestStatusCode;
  }
}

export { StatusState };
