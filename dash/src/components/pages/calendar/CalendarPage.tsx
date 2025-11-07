import { type Component, For, Match, onMount, Switch } from 'solid-js';
import styles from './CalendarPage.module.css';
import { Sidebar } from '../../shared/sidebar/Sidebar.tsx';
import { generateInitialCalendarData } from '../../../app/domain/calendar/util.ts';
import { createMutable } from 'solid-js/store';

const CalendarPage: Component = () => {
  const state = createMutable({
    todayLayer: true,
  });
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  let calendarData = generateInitialCalendarData();

  const scrollToMonth = (month: number, year: number) => {
    const id = `${month}-${year}`;
    document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  };

  const isMonthInPast = (year: number, month: number): boolean => {
    return year < currentYear || (year === currentYear && month < currentMonth);
  };

  const isDayInPast = (year: number, month: number, day: number): boolean => {
    return year === currentYear && month === currentMonth && day < currentDay;
  };

  const isToday = (year: number, month: number, day: number): boolean => {
    return year === currentYear && month === currentMonth && day === currentDay;
  };

  onMount(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    requestAnimationFrame(() => scrollToMonth(currentMonth, currentYear));
  });

  return (
    <div class={styles.calendarPage}>
      <Sidebar>
        <div>
          <div>
            <div>1asdasd</div>
            <div>2asdasd</div>
            <div>3asdasd</div>
          </div>
        </div>
      </Sidebar>
      <div class={styles.calendar}>
        <For each={Object.entries(calendarData.years)}>
          {([year, yearData]) => (
            <For each={Object.entries(yearData.months)}>
              {([month, monthData]) => (
                <div
                  classList={{
                    [styles.month]: true,
                    [styles.past]:
                      state.todayLayer && isMonthInPast(parseInt(year), parseInt(month)),
                  }}
                  id={`${month}-${year}`}
                >
                  <div class={styles.yearNumber}>{year}</div>
                  <div class={styles.monthName}>{monthData.name}</div>
                  <div class={styles.weeks}>
                    <For each={monthData.weeks}>
                      {week => (
                        <div class={styles.week}>
                          <For each={week}>
                            {day => (
                              <Switch>
                                <Match when={!day.number}>
                                  <div class={styles.empty}></div>
                                </Match>
                                <Match when={day.number}>
                                  <div
                                    classList={{
                                      [styles.day]: true,
                                      [styles.past]:
                                        state.todayLayer &&
                                        isDayInPast(parseInt(year), parseInt(month), day.number!),
                                      [styles.today]:
                                        state.todayLayer &&
                                        isToday(parseInt(year), parseInt(month), day.number!),
                                    }}
                                  >
                                    <div class={styles.number}>{day.number}</div>
                                  </div>
                                </Match>
                              </Switch>
                            )}
                          </For>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          )}
        </For>
      </div>
    </div>
  );
};

export { CalendarPage };
