import { ContextMenu } from './ContextMenu.tsx';
import { type Component, createEffect } from 'solid-js';
import { auth } from '../../auth/auth.ts';
import { createMutable } from 'solid-js/store';
import { deleteRefreshToken } from '../../api/auth.tsx';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
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
    await deleteRefreshToken();
    auth.setAccessToken(null);
  };

  return (
    <ContextMenu x={state.x} y={state.y} onClose={props.onClose}>
      <button onClick={handleLogout}>Logout</button>
    </ContextMenu>
  );
};

export { SettingsContextMenu };
