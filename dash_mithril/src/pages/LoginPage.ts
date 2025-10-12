import m from 'mithril';
import styles from './LoginPage.module.css';
import { GeneralErrors } from '../components/GeneralErrors.ts';
import { FieldError } from '../components/FieldError.ts';
import { isGeneralError, isValidationError } from '../api/api.ts';
import { createTokens } from '../api/auth.ts';
import { setAccessToken } from '../auth/auth.ts';

function LoginPage(): m.Component {
  let generalErrors: string[] = [];
  let fieldErrors: Record<string, string[]> = {};
  let loading = false;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (loading) {
      console.log('already submitting');
      return;
    }

    generalErrors = [];
    fieldErrors = {};
    loading = true;

    const data = new FormData(e.target as HTMLFormElement);
    const username = data.get('username')?.toString() || '';
    const password = data.get('password')?.toString() || '';

    try {
      const response = await createTokens({ username, password });
      console.log('login token: ', response.accessToken);
      setAccessToken(response.accessToken);
      m.route.set('/');
    } catch (err) {
      if (isValidationError(err)) {
        generalErrors = err.generalErrors || [];
        fieldErrors = err.fieldErrors || {};
      } else if (isGeneralError(err)) {
        generalErrors = [err.message];
      } else {
        generalErrors = ['Unknown error'];
      }
    }

    loading = false;
  };

  return {
    view: function () {
      return m(
        `div.${styles.wrapper}`,
        m('form', { onsubmit: handleSubmit }, [
          m(GeneralErrors(generalErrors)),
          m('input', { type: 'text', name: 'username', placeholder: 'Username', autofocus: true }),
          m(FieldError(fieldErrors['username'])),
          m('input', { type: 'password', name: 'password', placeholder: 'Password' }),
          m(FieldError(fieldErrors['password'])),
          m('button', { type: 'submit' }, 'Login'),
        ])
      );
    },
  };
}

export { LoginPage };
