import * as React from 'react';
import { useState } from 'react';
import { isGeneralError, isValidationError } from '../api/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate, useRouter, useSearch } from '@tanstack/react-router';
import { createTokens } from '../api/auth.tsx';
import { FieldError } from '../components/FieldError.tsx';
import { GeneralErrors } from '../components/GeneralErrors.tsx';
import styles from './LoginPage.module.css';

function LoginPage() {
  const auth = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [generalErrors, setGeneralErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const search = useSearch({ from: '/login' });
  const navigate = useNavigate();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralErrors([]);
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await createTokens({ username, password });
      await auth.login(response.accessToken);
      await router.invalidate();
      await navigate({
        to: search.redirect || '/',
      });
    } catch (err) {
      if (isValidationError(err)) {
        setGeneralErrors(err.generalErrors || []);
        setFieldErrors(err.fieldErrors || {});
      } else if (isGeneralError(err)) {
        setGeneralErrors([err.message]);
      } else {
        setGeneralErrors(['Unknown error']);
      }
    }

    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        <GeneralErrors errors={generalErrors} />
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          autoFocus
        />
        <FieldError fieldErrors={fieldErrors.username} />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <FieldError fieldErrors={fieldErrors.password} />
        <button type="submit" disabled={loading}>
          Login
        </button>
      </form>
    </div>
  );
}

export { LoginPage };
