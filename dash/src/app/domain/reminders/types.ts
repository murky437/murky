interface LongReminder {
  id: string;
  title: string;
  intervalDays: number;
  createdAt: Date;
  updatedAt: Date | null;
  lastRemindedAt: Date | null;
  markedDoneAt: Date | null;
  isEnabled: boolean;
}

export type { LongReminder };
