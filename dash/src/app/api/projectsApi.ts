import type { Api } from './api.ts';
import type { Project } from '../types/project.ts';

interface GetProjectListResponse {
  data: Project[];
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

class ProjectsApi {
  #api: Api;

  constructor(api: Api) {
    this.#api = api;
  }

  async getList(): Promise<Project[]> {
    const data = await this.#api.fetch<GetProjectListResponse>('/projects');
    return data.data;
  }

  async getNotes(slug: string): Promise<string> {
    const data = await this.#api.fetch<GetProjectNotesResponse>(`/projects/${slug}`);
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
}

export { ProjectsApi };
