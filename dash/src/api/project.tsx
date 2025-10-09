import type { Project } from '../types/project';
import { apiFetch } from './api.ts';

interface GetProjectListResponse {
  data: Project[];
}

async function getProjectList(): Promise<Project[]> {
  const data = await apiFetch<GetProjectListResponse>('/projects');
  return data.data;
}

interface GetProjectNotesResponse {
  notes: string;
}

async function getProjectNotes(slug: string): Promise<string> {
  const data = await apiFetch<GetProjectNotesResponse>(`/projects/${slug}`);
  return data.notes;
}

interface UpdateProjectNotesRequest {
  notes: string;
}

async function updateProjectNotes(slug: string, request: UpdateProjectNotesRequest): Promise<void> {
  await apiFetch(`/projects/${slug}/notes`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

interface CreateProjectRequest {
  title: string;
  slug: string;
}

async function createProject(request: CreateProjectRequest): Promise<void> {
  return apiFetch(`/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

interface UpdateProjectRequest {
  title: string;
  slug: string;
}

async function updateProject(slug: string, request: UpdateProjectRequest): Promise<void> {
  return apiFetch(`/projects/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

async function deleteProject(slug: string): Promise<void> {
  return apiFetch(`/projects/${slug}`, {
    method: 'DELETE',
  });
}

export {
  getProjectList,
  getProjectNotes,
  updateProjectNotes,
  createProject,
  updateProject,
  deleteProject,
};
