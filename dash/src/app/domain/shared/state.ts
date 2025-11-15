import { createMutable, modifyMutable, reconcile } from 'solid-js/store';

interface Data {
  confirmModal: {
    isOpen: boolean;
    text: string;
    resolveFn: (v: boolean) => void;
  };
}

class SharedState {
  readonly #reactiveData: Data;

  constructor() {
    this.#reactiveData = createMutable<Data>(this.#getInitialData());
  }

  #getInitialData(): Data {
    return {
      confirmModal: {
        isOpen: false,
        text: '',
        resolveFn: () => {},
      },
    };
  }

  reset() {
    modifyMutable(this.#reactiveData, reconcile(this.#getInitialData()));
  }

  isConfirmModalOpen(): boolean {
    return this.#reactiveData.confirmModal.isOpen;
  }

  getConfirmModalText(): string {
    return this.#reactiveData.confirmModal.text;
  }

  openConfirmModal(text: string): Promise<boolean> {
    this.#reactiveData.confirmModal.isOpen = true;
    this.#reactiveData.confirmModal.text = text;
    return new Promise(r => (this.#reactiveData.confirmModal.resolveFn = r));
  }

  closeConfirmModal(result: boolean): void {
    const resolveFn = this.#reactiveData.confirmModal.resolveFn;
    this.#reactiveData.confirmModal.resolveFn = () => {};
    resolveFn(result);
    this.#reactiveData.confirmModal.isOpen = false;
    this.#reactiveData.confirmModal.text = '';
  }
}

export { SharedState };
