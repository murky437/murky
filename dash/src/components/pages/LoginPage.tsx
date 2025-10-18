import { useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { auth } from '../../auth/auth.ts';
import styles from './LoginPage.module.css';
import { GeneralErrors } from '../GeneralErrors.tsx';
import { FieldError } from '../FieldError.tsx';
import { createTokens } from '../../api/auth.tsx';
import { isGeneralError, isValidationError } from '../../api/api.ts';
import { createMutable } from 'solid-js/store';

function LoginPage() {
  const state = createMutable({
    username: '',
    password: '',
    loading: false,
    generalErrors: [] as string[],
    fieldErrors: {} as Record<string, string[]>,
  });
  const navigate = useNavigate();

  createEffect(() => {
    if (auth.getAccessToken()) {
      navigate('/', { replace: true });
    }
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    state.generalErrors = [];
    state.fieldErrors = {};
    state.loading = true;

    try {
      const response = await createTokens({ username: state.username, password: state.password });
      auth.setAccessToken(response.accessToken);
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

  return (
    <div class={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        <GeneralErrors errors={state.generalErrors} />
        <input
          type="text"
          value={state.username}
          onChange={e => (state.username = e.target.value)}
          placeholder="Username"
          autofocus={true}
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
}

export { LoginPage };
