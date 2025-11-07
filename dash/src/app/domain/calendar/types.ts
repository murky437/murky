type Day = { number?: number };

type Week = Day[];

interface Month {
  name: string;
  weeks: Week[];
}

interface Year {
  months: Record<number, Month>; // keys are month numbers 1-12
}

interface CalendarData {
  years: Record<number, Year>;
}

export type { CalendarData, Year, Month, Week, Day };
