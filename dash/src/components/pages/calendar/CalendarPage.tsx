import { type Component, For, Match, onMount, Switch } from 'solid-js';
import styles from './CalendarPage.module.css';
import { Sidebar } from '../../shared/sidebar/Sidebar.tsx';
import { applyLayers, generateInitialCalendarData } from '../../../app/domain/calendar/util.ts';
import { createMutable } from 'solid-js/store';
import type { Layer } from '../../../app/domain/calendar/types.ts';
import holidays from '../../../assets/holidays.json';

const CalendarPage: Component = () => {
  const state = createMutable({
    showToday: true,
    calendarData: createMutable(generateInitialCalendarData()),
    layers: [
      {
        name: 'Holidays',
        color: 'red',
        events: holidays
          .filter(holiday => ['1', '2'].includes(holiday.kind_id))
          .map(holiday => ({ date: holiday.date, title: holiday.title })),
        active: true,
      },
      {
        name: 'National days',
        color: 'green',
        events: holidays
          .filter(holiday => !['1', '2'].includes(holiday.kind_id))
          .map(holiday => ({ date: holiday.date, title: holiday.title })),
        active: false,
      },
    ] as Layer[],
  });
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

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

  const toggleShowToday = () => {
    state.showToday = !state.showToday;
  };

  const toggleLayer = (name: string) => {
    const layer = state.layers.find(value => value.name === name);
    if (layer) {
      layer.active = !layer.active;
      applyLayers(
        state.calendarData,
        state.layers.filter(value => value.active)
      );
    }
  };

  onMount(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    requestAnimationFrame(() => scrollToMonth(currentMonth, currentYear));

    applyLayers(
      state.calendarData,
      state.layers.filter(value => value.active)
    );
  });

  return (
    <div class={styles.calendarPage}>
      <Sidebar>
        <div>
          <div class={styles.layers}>
            <div
              classList={{
                [styles.layer]: true,
                [styles.active]: state.showToday,
              }}
              onClick={toggleShowToday}
            >
              <div class={`${styles.indicator} ${styles.brown}`}></div>Today
            </div>
            <For each={state.layers}>
              {layer => (
                <div
                  classList={{
                    [styles.layer]: true,
                    [styles.active]: layer.active,
                  }}
                  onClick={_ => toggleLayer(layer.name)}
                >
                  <div
                    classList={{
                      [styles.indicator]: true,
                      [styles.red]: layer.color === 'red',
                      [styles.yellow]: layer.color === 'yellow',
                      [styles.green]: layer.color === 'green',
                      [styles.white]: layer.color === 'white',
                    }}
                  ></div>
                  {layer.name}
                </div>
              )}
            </For>
          </div>
        </div>
      </Sidebar>
      <div class={styles.calendar}>
        <For each={Object.entries(state.calendarData.years)}>
          {([year, yearData]) => (
            <For each={Object.entries(yearData.months)}>
              {([month, monthData]) => (
                <div
                  classList={{
                    [styles.month]: true,
                    [styles.past]:
                      state.showToday && isMonthInPast(parseInt(year), parseInt(month)),
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
                                  <div></div>
                                </Match>
                                <Match when={day.number}>
                                  <div
                                    classList={{
                                      [styles.day]: true,
                                      [styles.past]:
                                        state.showToday &&
                                        isDayInPast(parseInt(year), parseInt(month), day.number!),
                                      [styles.today]:
                                        state.showToday &&
                                        isToday(parseInt(year), parseInt(month), day.number!),
                                    }}
                                  >
                                    <div class={styles.inside}>
                                      <div class={styles.top}>
                                        <div class={styles.number}>{day.number}</div>
                                      </div>
                                      <div class={styles.events}>
                                        <For each={day.events}>
                                          {event => (
                                            <div
                                              classList={{
                                                [styles.event]: true,
                                                [styles.red]: event.color === 'red',
                                                [styles.yellow]: event.color === 'yellow',
                                                [styles.green]: event.color === 'green',
                                                [styles.white]: event.color === 'white',
                                              }}
                                            >
                                              {event.title}
                                            </div>
                                          )}
                                        </For>
                                      </div>
                                    </div>
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
