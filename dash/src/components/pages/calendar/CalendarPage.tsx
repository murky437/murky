import { type Component, For, Match, Switch } from 'solid-js';
import styles from './CalendarPage.module.css';
import { generateInitialCalendarData } from '../../../app/domain/calendar/util.ts';

const CalendarPage: Component = () => {
  let calendarData = generateInitialCalendarData();

  return (
    <div class={`${styles.calendarPage}`}>
      <For each={Object.entries(calendarData.years)}>
        {([year, yearData]) => (
          <For each={Object.entries(yearData.months)}>
            {([_, monthData]) => (
              <div class={styles.month}>
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
                                <div class={styles.day}>
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
  );
};

export { CalendarPage };
