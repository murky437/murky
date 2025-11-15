import { QueryClient, useQuery } from '@tanstack/solid-query';
import type { CreateRequest, LongRemindersApi } from '../../api/longRemindersApi.ts';

interface UpdateLongReminderRequest {
  title?: string;
  intervalDays?: number;
  markedDoneAt?: string;
  isEnabled?: boolean;
}

class RemindersRequests {
  readonly #queryClient: QueryClient;
  readonly #longRemindersApi: LongRemindersApi;

  constructor(queryClient: QueryClient, longRemindersApi: LongRemindersApi) {
    this.#queryClient = queryClient;
    this.#longRemindersApi = longRemindersApi;
  }

  getLongReminderListQuery() {
    return useQuery(
      () => ({
        queryKey: ['reminders.getLongReminderList'],
        queryFn: async () => {
          return await this.#longRemindersApi.getList();
        },
      }),
      () => this.#queryClient
    );
  }

  deleteLongReminder(id: string) {
    return this.#longRemindersApi.delete(id);
  }

  createLongReminder(request: CreateRequest) {
    return this.#longRemindersApi.create(request);
  }

  updateLongReminder(id: string, request: UpdateLongReminderRequest) {
    return this.#longRemindersApi.update(id, {
      title: request.title ?? null,
      intervalDays: request.intervalDays ?? null,
      markedDoneAt: request.markedDoneAt ?? null,
      isEnabled: request.isEnabled ?? null,
    });
  }
}

export { RemindersRequests };
