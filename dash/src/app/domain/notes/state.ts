import { createMutable, modifyMutable, reconcile } from 'solid-js/store';
import type { Project } from './types.ts';

interface Data {
  lastViewedProjectSlug: string | null;
  modals: {
    isAddModalOpen: boolean;
    editModalProject: Project | null;
  };
}

class NotesState {
  static readonly KEY_LAST_VIEWED_PROJECT_SLUG = 'lastViewedProjectSlug';

  readonly #reactiveData: Data;
  #storage: Storage;

  constructor(storage: Storage) {
    this.#storage = storage;
    this.#reactiveData = createMutable<Data>(this.#getInitialData());
  }

  #getInitialData(): Data {
    return {
      lastViewedProjectSlug: this.#storage.getItem('lastViewedProjectSlug'),
      modals: {
        isAddModalOpen: false,
        editModalProject: null,
      },
    };
  }

  reset() {
    modifyMutable(this.#reactiveData, reconcile(this.#getInitialData()));
  }

  getLastViewedProjectSlug() {
    return this.#reactiveData.lastViewedProjectSlug;
  }

  setLastViewedProjectSlug(lastViewedProjectSlug: string) {
    this.#reactiveData.lastViewedProjectSlug = lastViewedProjectSlug;
    this.#storage.setItem(NotesState.KEY_LAST_VIEWED_PROJECT_SLUG, lastViewedProjectSlug);
  }

  isAddModalOpen(): boolean {
    return this.#reactiveData.modals.isAddModalOpen;
  }

  setIsAddModalOpen(isAddModalOpen: boolean) {
    this.#reactiveData.modals.isAddModalOpen = isAddModalOpen;
  }

  getEditModalProject(): Project | null {
    return this.#reactiveData.modals.editModalProject;
  }

  setEditModalProject(project: Project | null) {
    this.#reactiveData.modals.editModalProject = project;
  }
}

export { NotesState };
