import type { State } from '../state/state.ts';
import type { Project } from '../types/project.ts';

class NotesRepository {
  static readonly KEY_LAST_VIEWED_PROJECT_SLUG = 'lastViewedProjectSlug';

  private state: State;
  private storage: Storage;

  constructor(state: State, storage: Storage) {
    this.state = state;
    this.storage = storage;
  }

  getProjects() {
    return this.state.notes.projects;
  }

  setProjects(projects: Project[]) {
    return (this.state.notes.projects = projects);
  }

  getLastViewedProjectSlug() {
    return this.state.notes.lastViewedProjectSlug;
  }

  setLastViewedProjectSlug(lastViewedProjectSlug: string) {
    this.state.notes.lastViewedProjectSlug = lastViewedProjectSlug;
    this.storage.setItem(NotesRepository.KEY_LAST_VIEWED_PROJECT_SLUG, lastViewedProjectSlug);
  }
}

export { NotesRepository };
