import type { State } from '../state/state.ts';
import type { Project } from '../types/project.ts';

class NotesRepository {
  static readonly KEY_LAST_VIEWED_PROJECT_SLUG = 'lastViewedProjectSlug';

  #state: State;
  #storage: Storage;

  constructor(state: State, storage: Storage) {
    this.#state = state;
    this.#storage = storage;
  }

  getProjects() {
    return this.#state.notes.projects;
  }

  setProjects(projects: Project[]) {
    this.#state.notes.projects = projects;
  }

  getLastViewedProjectSlug() {
    return this.#state.notes.lastViewedProjectSlug;
  }

  setLastViewedProjectSlug(lastViewedProjectSlug: string) {
    this.#state.notes.lastViewedProjectSlug = lastViewedProjectSlug;
    this.#storage.setItem(NotesRepository.KEY_LAST_VIEWED_PROJECT_SLUG, lastViewedProjectSlug);
  }

  isAddModalOpen(): boolean {
    return this.#state.notes.modals.isAddModalOpen;
  }

  setIsAddModalOpen(isAddModalOpen: boolean) {
    this.#state.notes.modals.isAddModalOpen = isAddModalOpen;
  }

  getEditModalProject(): Project | null {
    return this.#state.notes.modals.editModalProject;
  }

  setEditModalProject(project: Project | null) {
    this.#state.notes.modals.editModalProject = project;
  }
}

export { NotesRepository };
