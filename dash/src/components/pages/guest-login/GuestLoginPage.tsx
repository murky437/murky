import { type Component, For, onMount, Show } from 'solid-js';
import styles from './GuestLoginPage.module.css';
import { createMutable } from 'solid-js/store';
import { isGeneralError, isValidationError } from '../../../app/api/api.ts';
import { useApp } from '../../../app/appContext.tsx';
import {A} from "@solidjs/router";

const GuestLoginPage: Component = () => {
  const app = useApp();
  const state = createMutable({
    email: '',
    loading: false,
    generalErrors: [] as string[],
    fieldErrors: {} as Record<string, string[]>,
    success: false,
  });
  let emailInputRef!: HTMLInputElement;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    state.loading = true;
    state.success = false;

    try {
      await app.server.auth.sendGuestLoginLink({
        email: state.email,
        url: window.location.protocol + '//' + window.location.host,
      });
      state.generalErrors = [];
      state.fieldErrors = {};
      state.success = true;
    } catch (err) {
      if (isValidationError(err)) {
        state.generalErrors = err.generalErrors || [];
        state.fieldErrors = err.fieldErrors || {};
      } else if (isGeneralError(err)) {
        state.generalErrors = [err.message];
        state.fieldErrors = {};
      } else {
        state.generalErrors = ['Unknown error'];
        state.fieldErrors = {};
      }
    }

    state.loading = false;
  };

  onMount(() => {
    emailInputRef.focus();
  });

  return (
    <div class={styles.guestLoginPage}>
      <div class={styles.formContainer}>
        <h1>Guest login</h1>
        <p>To try out the app as a guest, we can send an automatic login link to your email.</p>
        <p>All guest data is deleted every hour on the hour.</p>
        <form onSubmit={handleSubmit}>
          <Show when={state.success}>
            <div class={styles.successMessage}>Login link sent!</div>
          </Show>
          <For each={state.generalErrors}>
            {item => <div class={styles.generalError}>{item}</div>}
          </For>
          <label for="email">Email</label>
          <input
            id="username"
            type="email"
            value={state.email}
            onInput={e => (state.email = e.target.value)}
            ref={emailInputRef}
          />
          <For each={state.fieldErrors.email}>
            {item => <div class={styles.fieldError}>{item}</div>}
          </For>
          <button type="submit" disabled={state.loading}>Send login link</button>
        </form>
      </div>
      <div class={styles.bottom}>
        <A href={'/login'}>Go back to normal login.</A>
      </div>
    </div>
  );
};

export { GuestLoginPage };
