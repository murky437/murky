import { useNavigate } from '@solidjs/router';
import { type Component, createEffect, onMount } from 'solid-js';
import styles from './LoginPage.module.css';
import { createMutable } from 'solid-js/store';
import { GeneralErrors } from '../elements/GeneralErrors.tsx';
import { FieldError } from '../elements/FieldError.tsx';
import { isGeneralError, isValidationError } from '../../app/api/api.ts';
import type { AuthApi } from '../../app/api/authApi.ts';
import type { AuthState } from '../../app/auth/authState.ts';

interface Props {
  authState: AuthState;
  authApi: AuthApi;
}

const LoginPage: Component<Props> = props => {
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
    state.generalErrors = [];
    state.fieldErrors = {};
    state.loading = true;

    try {
      const response = await props.authApi.createTokens({
        username: state.username,
        password: state.password,
      });
      props.authState.setAccessToken(response.accessToken);
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
    if (props.authState.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  });

  return (
    <div class={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        <GeneralErrors errors={state.generalErrors} />
        <input
          type="text"
          value={state.username}
          onChange={e => (state.username = e.target.value)}
          placeholder="Username"
          ref={usernameInputRef}
        />
        <FieldError fieldErrors={state.fieldErrors.username} />
        <input
          type="password"
          value={state.password}
          onChange={e => (state.password = e.target.value)}
          placeholder="Password"
        />
        <FieldError fieldErrors={state.fieldErrors.password} />
        <button type="submit" disabled={state.loading}>
          Login
        </button>
      </form>
    </div>
  );
};

export { LoginPage };
