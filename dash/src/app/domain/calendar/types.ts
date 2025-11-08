type EventColor = 'red' | 'yellow' | 'green' | 'white';

interface CalendarEvent {
  date: string;
  title: string;
  color?: EventColor;
}

interface Day {
  number?: number;
  events: CalendarEvent[];
}

type Week = Day[];

interface Month {
  name: string;
  weeks: Week[];
}

interface Year {
  months: Record<number, Month>;
}

interface CalendarData {
  years: Record<number, Year>;
}

interface Layer {
  name: string;
  color: EventColor;
  events: CalendarEvent[];
  active: boolean;
}

export type { CalendarData, Year, Month, Week, Day, CalendarEvent, Layer };
