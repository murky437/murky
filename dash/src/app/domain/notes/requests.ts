import { QueryClient, useQuery } from '@tanstack/solid-query';
import { ProjectsApi } from '../../api/projectsApi.ts';
import type { Project } from './types.ts';

class NotesRequests {
  readonly #queryClient: QueryClient;
  readonly #projectsApi: ProjectsApi;

  constructor(queryClient: QueryClient, projectsApi: ProjectsApi) {
    this.#queryClient = queryClient;
    this.#projectsApi = projectsApi;
  }

  getProjectListQuery() {
    return useQuery(
      () => ({
        queryKey: ['notes.getProjectList'],
        queryFn: async () => {
          return await this.#projectsApi.getList();
        },
      }),
      () => this.#queryClient
    );
  }

  invalidateProjectListQuery() {
    return this.#queryClient.invalidateQueries({
      queryKey: ['notes.getProjectList'],
    });
  }

  getProjectQuery(slug: string) {
    return useQuery(
      () => ({
        queryKey: ['notes.getProject', slug],
        queryFn: async () => {
          return await this.#projectsApi.get(slug);
        },
      }),
      () => this.#queryClient
    );
  }

  invalidateProjectQuery(slug: string) {
    return this.#queryClient.invalidateQueries({
      queryKey: ['notes.getProject', slug],
    });
  }

  getProjectNotesQuery(slug: string) {
    return useQuery(
      () => ({
        queryKey: ['notes.getProjectNotes', slug],
        queryFn: async () => {
          return await this.#projectsApi.getNotes(slug);
        },
      }),
      () => this.#queryClient
    );
  }

  updateProject(slug: string, project: Project) {
    return this.#projectsApi.update(slug, project);
  }

  deleteProject(slug: string) {
    return this.#projectsApi.delete(slug);
  }

  createProject(project: Project) {
    return this.#projectsApi.create(project);
  }

  updateProjectNotes(slug: string, notes: string) {
    return this.#projectsApi.updateNotes(slug, { notes: notes });
  }

  updateProjectSortIndex(slug: string, sortIndex: number) {
    return this.#projectsApi.updateSortIndex(slug, { sortIndex: sortIndex });
  }
}

export { NotesRequests };
