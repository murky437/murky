import { createMutable } from 'solid-js/store';
import type { Project } from '../types/project.ts';
import { getProjectList } from '../api/project.tsx';

const KEY_LAST_VIEWED_PROJECT_SLUG = 'lastViewedProjectSlug';

interface NotesData {
  projects: Project[];
  lastViewedProjectSlug: string | null;
}

const notesData = createMutable<NotesData>({
  projects: [],
  lastViewedProjectSlug: localStorage.getItem(KEY_LAST_VIEWED_PROJECT_SLUG),
});

const notes = {
  getProjects: () => {
    return notesData.projects;
  },
  loadProjectsFromServer: async () => {
    try {
      // TODO: maybe use tanstack query to automatically fetch data again after it becomes stale
      //  (useful when being away from pc or tab etc...)
      notesData.projects = await getProjectList();
    } catch (e) {}
  },
  getLastViewedProjectSlug: () => {
    return notesData.lastViewedProjectSlug;
  },
  setLastViewedProjectSlug: (lastViewedProjectSlug: string) => {
    notesData.lastViewedProjectSlug = lastViewedProjectSlug;
    localStorage.setItem(KEY_LAST_VIEWED_PROJECT_SLUG, lastViewedProjectSlug);
  },
};

export { notes };
