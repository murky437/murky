import type { Project } from '../types/project.ts';
import { createMutable, modifyMutable, reconcile } from 'solid-js/store';

interface State {
  auth: {
    accessToken: string | null;
  };
  notes: {
    projects: Project[];
    lastViewedProjectSlug: string | null;
    modals: {
      isAddModalOpen: boolean;
      editModalProject: Project | null;
    };
  };
  status: {
    isRequestLoading: boolean;
    lastRequestStatusCode: number | null;
    deploy: {
      frontend: {
        commit: string | null;
        timestamp: string | null;
      };
      backend: {
        commit: string | null;
        timestamp: string | null;
      };
    };
  };
}

class StateService {
  #storage: Storage;

  constructor(storage: Storage) {
    this.#storage = storage;
  }

  #getDefaultState(): State {
    return {
      auth: {
        accessToken: this.#storage.getItem('accessToken'),
      },
      notes: {
        projects: [],
        lastViewedProjectSlug: this.#storage.getItem('lastViewedProjectSlug'),
        modals: {
          isAddModalOpen: false,
          editModalProject: null,
        },
      },
      status: {
        isRequestLoading: false,
        lastRequestStatusCode: null,
        deploy: {
          frontend: {
            commit: null,
            timestamp: null,
          },
          backend: {
            commit: null,
            timestamp: null,
          },
        },
      },
    };
  }

  createState(): State {
    return createMutable<State>(this.#getDefaultState());
  }

  resetState(state: State) {
    this.#storage.clear();
    modifyMutable(state, reconcile(this.#getDefaultState()));
  }
}

export { StateService };
export type { State };
