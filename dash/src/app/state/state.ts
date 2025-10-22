import type { Project } from '../types/project.ts';
import { createMutable, modifyMutable, reconcile } from 'solid-js/store';

interface State {
  auth: {
    accessToken: string | null;
  };
  notes: {
    projects: Project[];
    lastViewedProjectSlug: string | null;
  };
}

class StateService {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  private getDefaultState(): State {
    return {
      auth: {
        accessToken: this.storage.getItem('accessToken'),
      },
      notes: {
        projects: [],
        lastViewedProjectSlug: this.storage.getItem('lastViewedProjectSlug'),
      },
    };
  }

  createState(): State {
    return createMutable<State>(this.getDefaultState());
  }

  resetState(state: State) {
    this.storage.clear();
    modifyMutable(state, reconcile(this.getDefaultState()));
  }
}

export { StateService };
export type { State };
