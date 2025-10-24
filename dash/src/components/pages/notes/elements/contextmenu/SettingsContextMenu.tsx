import { ContextMenu } from '../../../../shared/contextmenu/ContextMenu.tsx';
import { type Component, createEffect } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { useApp } from '../../../../../app/appContext.tsx';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
}

const SettingsContextMenu: Component<Props> = props => {
  const app = useApp();
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
    await app.auth.logout();
    app.resetState();
  };

  return (
    <ContextMenu x={state.x} y={state.y} onClose={props.onClose}>
      <button onClick={handleLogout}>Log out</button>
    </ContextMenu>
  );
};

export { SettingsContextMenu };
