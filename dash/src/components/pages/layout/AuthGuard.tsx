import { useNavigate } from '@solidjs/router';
import { createEffect, type ParentComponent } from 'solid-js';
import type { AuthState } from '../../../app/auth/authState.ts';

interface Props {
  authState: AuthState;
}

const AuthGuard: ParentComponent<Props> = props => {
  const navigate = useNavigate();

  createEffect(() => {
    if (!props.authState.isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  });

  return props.children;
};

export { AuthGuard };
