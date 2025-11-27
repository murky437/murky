import { type Component, createEffect, For, Match, Show, Switch } from 'solid-js';
import styles from './RemindersPage.module.css';
import { createMutable } from 'solid-js/store';
import type { LongReminder } from '../../../app/domain/reminders/types.ts';
import { useApp } from '../../../app/appContext.tsx';
import { v4 as uuidv4 } from 'uuid';
import { isGeneralError, isValidationError } from '../../../app/api/api.ts';

const RemindersPage: Component = () => {
  const app = useApp();
  const state = createMutable({
    longReminders: [] as LongReminder[],
  });

  const longReminderQuery = app.server.reminders.getLongReminderListQuery();

  createEffect(() => {
    if (longReminderQuery.isFetching || !longReminderQuery.data) {
      return;
    }

    state.longReminders = longReminderQuery.data.map(x => ({ ...x }));
  });

  const markDone = async (reminderId: string) => {
    const reminder = state.longReminders.find(r => r.id === reminderId);
    if (reminder) {
      reminder.markedDoneAt = new Date();
      await app.server.reminders.updateLongReminder(reminderId, {
        markedDoneAt: reminder.markedDoneAt.toISOString(),
      });
    }
  };

  const toggleEnabled = async (reminderId: string) => {
    const reminder = state.longReminders.find(r => r.id === reminderId);
    if (reminder) {
      reminder.isEnabled = !reminder.isEnabled;
      await app.server.reminders.updateLongReminder(reminderId, {
        isEnabled: reminder.isEnabled,
      });
    }
  };

  const update = (reminderId: string, title: string, intervalDays: number) => {
    const reminder = state.longReminders.find(r => r.id === reminderId);
    if (reminder) {
      reminder.title = title;
      reminder.intervalDays = intervalDays;
    }
  };

  const addNew = async () => {
    const newReminder: LongReminder = {
      id: uuidv4(),
      title: 'New reminder',
      intervalDays: 1,
      createdAt: new Date(),
      updatedAt: null,
      lastRemindedAt: null,
      markedDoneAt: null,
      isEnabled: true,
    };
    state.longReminders.push(newReminder);

    await app.server.reminders.createLongReminder({
      id: newReminder.id,
      title: newReminder.title,
      intervalDays: newReminder.intervalDays,
    });
  };

  const del = async (reminderId: string) => {
    const reminder = state.longReminders.find(r => r.id === reminderId);

    if (
      await app.client.shared.openConfirmModal(
        `Are you sure you want to delete reminder "${reminder?.title}"?`
      )
    ) {
      state.longReminders = state.longReminders.filter(r => r.id !== reminderId);

      await app.server.reminders.deleteLongReminder(reminderId);
    }
  };

  return (
    <div class={styles.remindersPage}>
      <h1>Reminders</h1>
      <h2>Long interval tasks</h2>
      <For each={state.longReminders}>
        {reminder => (
          <LongReminderBlock
            reminder={reminder}
            markDone={markDone}
            toggleEnabled={toggleEnabled}
            update={update}
            del={del}
          />
        )}
      </For>
      <button onClick={addNew} type="button" class={styles.addNewButton}>
        Add a long interval task
      </button>
    </div>
  );
};

interface RowProps {
  reminder: LongReminder;
  markDone: (reminderId: string) => void;
  toggleEnabled: (reminderId: string) => void;
  update: (reminderId: string, title: string, intervalDays: number) => void;
  del: (reminderId: string) => void;
}

const LongReminderBlock: Component<RowProps> = props => {
  const state = createMutable({
    showDetails: false,
    isDue: false,
    overdueDays: 0,
    daysUntilDueDate: 0,
    form: {
      title: props.reminder.title,
      intervalDays: props.reminder.intervalDays,
      loading: false,
      generalErrors: [] as string[],
      fieldErrors: {} as Record<string, string[]>,
    },
  });
  const app = useApp();

  // TODO: move to util package
  const formatLocal = (d: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  };

  const millisecondsInOneDay = 1000 * 60 * 60 * 24;

  const diffInDays = (d1: Date, d2: Date): number => {
    return (
      Math.abs(
        new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime() -
          new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime()
      ) / millisecondsInOneDay
    );
  };

  const isSameDay = (a: Date, b: Date): boolean => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const toggleShowDetails = () => {
    state.showDetails = !state.showDetails;
  };

  const calculateState = () => {
    const now = new Date();

    if (!props.reminder.markedDoneAt) {
      state.isDue = true;
      state.overdueDays = diffInDays(now, props.reminder.createdAt);
      state.daysUntilDueDate = 0;
      return;
    }

    const dueDate = new Date(
      props.reminder.markedDoneAt.getTime() + props.reminder.intervalDays * millisecondsInOneDay
    );

    if (dueDate <= now || isSameDay(dueDate, now)) {
      state.isDue = true;
      state.overdueDays = diffInDays(now, dueDate);
      state.daysUntilDueDate = 0;
      return;
    }

    state.isDue = false;
    state.daysUntilDueDate = diffInDays(now, dueDate);
    state.overdueDays = 0;
  };

  const update = async (e: SubmitEvent) => {
    e.preventDefault();
    state.form.loading = true;

    try {
      await app.server.reminders.updateLongReminder(props.reminder.id, {
        title: state.form.title,
        intervalDays: state.form.intervalDays,
      });

      props.update(props.reminder.id, state.form.title, state.form.intervalDays);
      toggleShowDetails();

      state.form.generalErrors = [];
      state.form.fieldErrors = {};
    } catch (err) {
      if (isValidationError(err)) {
        state.form.generalErrors = err.generalErrors || [];
        state.form.fieldErrors = err.fieldErrors || {};
      } else if (isGeneralError(err)) {
        state.form.generalErrors = [err.message];
      } else {
        state.form.generalErrors = ['Unknown error'];
      }
    }

    state.form.loading = false;
  };

  createEffect(() => {
    calculateState();
  });

  return (
    <div
      classList={{
        [styles.block]: true,
        [styles.isDue]: props.reminder.isEnabled && state.isDue,
        [styles.disabled]: !props.reminder.isEnabled,
      }}
    >
      <div class={styles.top}>{props.reminder.title}</div>
      <div class={styles.bottom}>
        <div class={styles.left}>
          <div class={styles.timeDescription}>every {props.reminder.intervalDays} days</div>
          <div class={styles.nextTime}>
            <Switch>
              <Match when={state.isDue && state.overdueDays === 0}>Due today</Match>
              <Match when={state.isDue && state.overdueDays === 1}>
                Overdue {state.overdueDays} day
              </Match>
              <Match when={state.isDue}>Overdue {state.overdueDays} days</Match>
              <Match when={!state.isDue && state.daysUntilDueDate === 1}>Next tomorrow</Match>
              <Match when={!state.isDue}>Next in {state.daysUntilDueDate} days</Match>
            </Switch>
          </div>
        </div>
        <div class={styles.right}>
          <div class={styles.detailsButton} onClick={toggleShowDetails}>
            {state.showDetails ? 'Hide details' : 'Show details'}
          </div>
        </div>
        <div class={styles.center}>
          <Switch>
            <Match when={!props.reminder.isEnabled}>DISABLED</Match>
            <Match when={state.isDue}>
              <div class={styles.link} onClick={() => props.markDone(props.reminder.id)}>
                MARK DONE
              </div>
            </Match>
          </Switch>
        </div>
      </div>
      <Show when={state.showDetails}>
        <div class={styles.details}>
          <form onSubmit={update}>
            <div class={styles.group}>
              <div class={styles.row}>
                <div class={styles.left}>Title:</div>
                <div class={styles.right}>
                  <div class={styles.inputWrap}>
                    <input
                      type="text"
                      placeholder="enter title"
                      value={state.form.title}
                      onInput={e => (state.form.title = e.target.value)}
                    />
                    <For each={state.form.fieldErrors.title}>
                      {item => <div class={styles.fieldError}>{item}</div>}
                    </For>
                  </div>
                </div>
              </div>
              <div class={styles.row}>
                <div class={styles.left}>Interval days:</div>
                <div class={styles.right}>
                  <div class={styles.inputWrap}>
                    <input
                      placeholder="enter interval days"
                      type="number"
                      step="1"
                      min="1"
                      value={state.form.intervalDays}
                      onInput={e => (state.form.intervalDays = Number(e.target.value))}
                    />
                  </div>
                  <div class={styles.errors}>
                    <For each={state.form.fieldErrors.intervalDays}>
                      {item => <div class={styles.fieldError}>{item}</div>}
                    </For>
                  </div>
                </div>
              </div>
            </div>
            <div class={styles.group}>
              <div class={styles.row}>
                <div class={styles.left}>Last reminded at:</div>
                <div class={styles.right}>
                  {props.reminder.lastRemindedAt
                    ? formatLocal(props.reminder.lastRemindedAt)
                    : 'never'}
                </div>
              </div>
              <div class={styles.row}>
                <div class={styles.left}>Marked done at:</div>
                <div class={styles.right}>
                  {props.reminder.markedDoneAt ? formatLocal(props.reminder.markedDoneAt) : 'never'}
                </div>
              </div>
            </div>
            <div class={styles.group}>
              <div class={`${styles.row} ${styles.three}`}>
                <div class={styles.left}>
                  <div class={styles.link} onClick={() => props.del(props.reminder.id)}>
                    Delete
                  </div>
                </div>
                <div class={styles.middle}>
                  <div class={styles.link} onClick={() => props.toggleEnabled(props.reminder.id)}>
                    {props.reminder.isEnabled ? 'Disable' : 'Enable'}
                  </div>
                </div>
                <div class={styles.right}>
                  <button type="submit" class={styles.saveButton}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Show>
    </div>
  );
};

export { RemindersPage };
