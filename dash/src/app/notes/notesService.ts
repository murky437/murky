import type { ProjectsApi } from '../api/projectsApi.ts';
import type { NotesRepository } from './notesRepository.ts';
import type { Project } from '../types/project.ts';

class NotesService {
  #notesRepository: NotesRepository;
  #projectsApi: ProjectsApi;

  constructor(notesRepository: NotesRepository, projectsApi: ProjectsApi) {
    this.#notesRepository = notesRepository;
    this.#projectsApi = projectsApi;
  }

  getProjects() {
    return this.#notesRepository.getProjects();
  }

  async loadProjectsFromServer(): Promise<void> {
    try {
      // TODO: maybe use tanstack query to automatically fetch data again after it becomes stale
      //  (useful when being away from pc or tab etc...)
      this.#notesRepository.setProjects(await this.#projectsApi.getList());
    } catch (e) {}
  }

  getLastViewedProjectSlug() {
    return this.#notesRepository.getLastViewedProjectSlug();
  }

  setLastViewedProjectSlug(lastViewedProjectSlug: string) {
    this.#notesRepository.setLastViewedProjectSlug(lastViewedProjectSlug);
  }

  async updateProject(slug: string, project: Project): Promise<void> {
    await this.#projectsApi.update(slug, project);
  }

  async deleteProject(slug: string): Promise<void> {
    await this.#projectsApi.delete(slug);
  }

  async createProject(project: Project): Promise<void> {
    await this.#projectsApi.create(project);
  }

  async updateNotes(slug: string, notes: string): Promise<void> {
    try {
      await this.#projectsApi.updateNotes(slug, { notes: notes });
    } catch (e) {}
  }

  async getNotes(slug: string): Promise<string> {
    return await this.#projectsApi.getNotes(slug);
  }

  isAddModalOpen(): boolean {
    return this.#notesRepository.isAddModalOpen();
  }

  setIsAddModalOpen(isAddModalOpen: boolean) {
    this.#notesRepository.setIsAddModalOpen(isAddModalOpen);
  }

  getEditModalProject(): Project | null {
    return this.#notesRepository.getEditModalProject();
  }

  setEditModalProject(project: Project | null) {
    this.#notesRepository.setEditModalProject(project);
  }
}

export { NotesService };
