import type { Api } from './api.ts';
import type { LongReminder } from '../domain/reminders/types.ts';

interface ListItem {
  id: string;
  title: string;
  intervalDays: number;
  createdAt: string;
  updatedAt: string | null;
  lastRemindedAt: string | null;
  markedDoneAt: string | null;
  isEnabled: boolean;
}

interface GetListResponse {
  data: ListItem[];
}

interface CreateRequest {
  id: string;
  title: string;
  intervalDays: number;
}

interface UpdateRequest {
  title: string | null;
  intervalDays: number | null;
  markedDoneAt: string | null;
  isEnabled: boolean | null;
}

class LongRemindersApi {
  #api: Api;

  constructor(api: Api) {
    this.#api = api;
  }

  async getList(): Promise<LongReminder[]> {
    const response = await this.#api.fetch<GetListResponse>('/long-reminders');
    return response.data.map(li => {
      return {
        id: li.id,
        title: li.title,
        intervalDays: li.intervalDays,
        createdAt: new Date(li.createdAt),
        updatedAt: li.updatedAt ? new Date(li.updatedAt) : null,
        lastRemindedAt: li.lastRemindedAt ? new Date(li.lastRemindedAt) : null,
        markedDoneAt: li.markedDoneAt ? new Date(li.markedDoneAt) : null,
        isEnabled: li.isEnabled,
      };
    });
  }

  async create(request: CreateRequest): Promise<void> {
    return this.#api.fetch(`/long-reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }

  async delete(id: string): Promise<void> {
    return this.#api.fetch(`/long-reminders/${id}`, {
      method: 'DELETE',
    });
  }

  async update(id: string, request: UpdateRequest): Promise<void> {
    return this.#api.fetch(`/long-reminders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }
}

export { LongRemindersApi };
export type { CreateRequest, UpdateRequest };
