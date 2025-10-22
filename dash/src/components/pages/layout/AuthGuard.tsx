import { type RouteSectionProps, useNavigate } from '@solidjs/router';
import { createEffect, type ParentComponent } from 'solid-js';
import { useApp } from '../../../app/appContext.tsx';

const AuthGuard: ParentComponent<RouteSectionProps> = props => {
  const app = useApp();
  const navigate = useNavigate();

  createEffect(() => {
    if (!app.auth.isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  });

  return props.children;
};

export { AuthGuard };
