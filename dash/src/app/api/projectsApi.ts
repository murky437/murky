import type { Api } from './api.ts';
import type { Project } from '../types/project.ts';

class ProjectsApi {
  #api: Api;

  constructor(api: Api) {
    this.#api = api;
  }

  async getProjectList(): Promise<Project[]> {
    const data = await this.#api.fetch<GetProjectListResponse>('/projects');
    return data.data;
  }

  async getProjectNotes(slug: string): Promise<string> {
    const data = await this.#api.fetch<GetProjectNotesResponse>(`/projects/${slug}`);
    return data.notes;
  }

  async updateProjectNotes(slug: string, request: UpdateProjectNotesRequest): Promise<void> {
    await this.#api.fetch(`/projects/${slug}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }

  async createProject(request: CreateProjectRequest): Promise<void> {
    return this.#api.fetch(`/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }

  async updateProject(slug: string, request: UpdateProjectRequest): Promise<void> {
    return this.#api.fetch(`/projects/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }

  async deleteProject(slug: string): Promise<void> {
    return this.#api.fetch(`/projects/${slug}`, {
      method: 'DELETE',
    });
  }
}

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

export { ProjectsApi };
