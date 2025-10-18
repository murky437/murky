import { type RouteSectionProps, useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { auth } from '../../../auth/auth.ts';

function AuthGuard(props: RouteSectionProps) {
  const navigate = useNavigate();

  createEffect(() => {
    if (!auth.getAccessToken()) {
      navigate('/login', { replace: true });
    }
  });

  return props.children;
}

export { AuthGuard };
