import type { Api } from './api.ts';
import type { Project } from '../domain/notes/types.ts';

interface GetProjectListResponse {
  data: Project[];
}

interface GetProjectResponse {
  title: string;
  slug: string;
}

interface GetProjectNotesResponse {
  notes: string;
}

interface UpdateProjectNotesRequest {
  notes: string;
}

interface CreateProjectRequest {
  title: string;
  slug: string;
}

interface UpdateProjectRequest {
  title: string;
  slug: string;
}

interface UpdateSortIndexRequest {
  sortIndex: number;
}

class ProjectsApi {
  #api: Api;

  constructor(api: Api) {
    this.#api = api;
  }

  async getList(): Promise<Project[]> {
    const data = await this.#api.fetch<GetProjectListResponse>('/projects');
    return data.data;
  }

  async get(slug: string): Promise<Project> {
    return await this.#api.fetch<GetProjectResponse>(`/projects/${slug}`);
  }

  async getNotes(slug: string): Promise<string> {
    const data = await this.#api.fetch<GetProjectNotesResponse>(`/projects/${slug}/notes`);
    return data.notes;
  }

  async updateNotes(slug: string, request: UpdateProjectNotesRequest): Promise<void> {
    await this.#api.fetch(`/projects/${slug}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }

  async create(request: CreateProjectRequest): Promise<void> {
    return this.#api.fetch(`/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }

  async update(slug: string, request: UpdateProjectRequest): Promise<void> {
    return this.#api.fetch(`/projects/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }

  async delete(slug: string): Promise<void> {
    return this.#api.fetch(`/projects/${slug}`, {
      method: 'DELETE',
    });
  }

  async updateSortIndex(slug: string, request: UpdateSortIndexRequest): Promise<void> {
    return this.#api.fetch(`/projects/${slug}/sort-index`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }
}

export { ProjectsApi };
