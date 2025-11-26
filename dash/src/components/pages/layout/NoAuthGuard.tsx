import { type RouteSectionProps, useNavigate } from '@solidjs/router';
import { createEffect, type ParentComponent } from 'solid-js';
import { useApp } from '../../../app/appContext.tsx';

const NoAuthGuard: ParentComponent<RouteSectionProps> = props => {
  const app = useApp();
  const navigate = useNavigate();

  createEffect(() => {
    if (app.client.auth.isAuthenticated()) {
      navigate('/', {replace: true});
    }
  });

  return !app.client.auth.isAuthenticated() && props.children;
};

export { NoAuthGuard };
