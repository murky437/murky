import type { CalendarData, Month, Week, Year } from './types.ts';

function getRelevantYears(): number[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  return currentMonth > 6 ? [currentYear, currentYear + 1] : [currentYear - 1, currentYear];
}

function generateInitialCalendarData(): CalendarData {
  const relevantYears = getRelevantYears();
  const calendarData: CalendarData = { years: {} };

  for (const year of relevantYears) {
    calendarData.years[year] = generateCalendarYear(year);
  }

  return calendarData;
}

function generateCalendarYear(year: number): Year {
  const data: Year = { months: {} };

  for (let month = 1; month <= 12; month++) {
    data.months[month] = generateCalendarMonth(year, month);
  }

  return data;
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function generateCalendarMonth(year: number, month: number): Month {
  // index of the first day (0 = monday)
  const firstDay = (new Date(year, month - 1, 1).getDay() + 6) % 7;

  const daysInMonth = new Date(year, month, 0).getDate();

  const weeks: Week[] = [];

  // fill the week with empty objects until the first day
  let week: Week = Array(firstDay).fill({});

  for (let day = 1; day <= daysInMonth; day++) {
    week.push({ number: day });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length) {
    // for the last week, fill the end with empty objects
    weeks.push([...week, ...Array(7 - week.length).fill({})]);
  }

  return {
    name: monthNames[month - 1],
    weeks,
  };
}

export { generateInitialCalendarData, generateCalendarYear };
