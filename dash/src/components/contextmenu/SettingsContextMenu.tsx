import { ContextMenu } from './ContextMenu.tsx';
import { type Component, createEffect } from 'solid-js';
import { createMutable } from 'solid-js/store';
import type { AuthApi } from '../../app/api/authApi.ts';
import type { AuthState } from '../../app/auth/authState.ts';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
  authApi: AuthApi;
  authState: AuthState;
}

const SettingsContextMenu: Component<Props> = props => {
  const state = createMutable({
    x: props.x,
    y: props.y,
  });
  const menuHeight = 24;

  createEffect(() => {
    state.x = props.x;
    state.y = props.y - menuHeight < 0 ? props.y : props.y - menuHeight;
  });

  const handleLogout = async () => {
    await props.authApi.deleteRefreshToken();
    props.authState.setAccessToken(null);
  };

  return (
    <ContextMenu x={state.x} y={state.y} onClose={props.onClose}>
      <button onClick={handleLogout}>Logout</button>
    </ContextMenu>
  );
};

export { SettingsContextMenu };
