import { type RouteSectionProps, useNavigate } from '@solidjs/router';
import { type Component, createEffect, For, onMount } from 'solid-js';
import styles from './LoginPage.module.css';
import { createMutable } from 'solid-js/store';
import { isGeneralError, isValidationError } from '../../../app/api/api.ts';
import { useApp } from '../../../app/appContext.tsx';

const LoginPage: Component<RouteSectionProps> = () => {
  const app = useApp();
  const state = createMutable({
    username: '',
    password: '',
    loading: false,
    generalErrors: [] as string[],
    fieldErrors: {} as Record<string, string[]>,
  });
  const navigate = useNavigate();
  let usernameInputRef!: HTMLInputElement;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    state.loading = true;

    try {
      const response = await app.server.auth.createTokens({
        username: state.username,
        password: state.password,
      });
      app.client.auth.setAccessToken(response.accessToken);
      state.generalErrors = [];
      state.fieldErrors = {};
    } catch (err) {
      if (isValidationError(err)) {
        state.generalErrors = err.generalErrors || [];
        state.fieldErrors = err.fieldErrors || {};
      } else if (isGeneralError(err)) {
        state.generalErrors = [err.message];
      } else {
        state.generalErrors = ['Unknown error'];
      }
    }

    state.loading = false;
  };

  onMount(() => {
    usernameInputRef.focus();
  });

  createEffect(() => {
    if (app.client.auth.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  });

  return (
    <div class={styles.loginPage}>
      <div class={styles.formContainer}>
        <form onSubmit={handleSubmit} data-testid="login-form">
          <For each={state.generalErrors}>
            {item => <div class={styles.generalError}>{item}</div>}
          </For>
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            value={state.username}
            onInput={e => (state.username = e.target.value)}
            ref={usernameInputRef}
          />
          <For each={state.fieldErrors.username}>
            {item => <div class={styles.fieldError}>{item}</div>}
          </For>
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            value={state.password}
            onInput={e => (state.password = e.target.value)}
          />
          <For each={state.fieldErrors.password}>
            {item => <div class={styles.fieldError}>{item}</div>}
          </For>
          <button type="submit">Log in</button>
        </form>
      </div>
      <div class={styles.bottom}>
        <em>
          <strong>Coming soon:</strong>
        </em>{' '}
        Try out the app as a guest.
      </div>
    </div>
  );
};

export { LoginPage };
