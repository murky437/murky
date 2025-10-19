import { createMutable } from 'solid-js/store';
import type { Project } from '../types/project.ts';
import type { ProjectsApi } from '../api/projectsApi.ts';

const KEY_LAST_VIEWED_PROJECT_SLUG = 'lastViewedProjectSlug';

interface Data {
  projects: Project[];
  lastViewedProjectSlug: string | null;
}

const notesData = createMutable<Data>({
  projects: [],
  lastViewedProjectSlug: localStorage.getItem(KEY_LAST_VIEWED_PROJECT_SLUG),
});

class NotesState {
  #projectsApi: ProjectsApi;

  constructor(projectsApi: ProjectsApi) {
    this.#projectsApi = projectsApi;
  }

  getProjects() {
    return notesData.projects;
  }

  async loadProjectsFromServer() {
    try {
      // TODO: maybe use tanstack query to automatically fetch data again after it becomes stale
      //  (useful when being away from pc or tab etc...)
      notesData.projects = await this.#projectsApi.getProjectList();
    } catch (e) {}
  }

  getLastViewedProjectSlug() {
    return notesData.lastViewedProjectSlug;
  }

  setLastViewedProjectSlug(lastViewedProjectSlug: string) {
    notesData.lastViewedProjectSlug = lastViewedProjectSlug;
    localStorage.setItem(KEY_LAST_VIEWED_PROJECT_SLUG, lastViewedProjectSlug);
  }
}

export { NotesState };
