import { ContextMenu } from './ContextMenu.ts';
import m from 'mithril';
import { setAccessToken } from '../../auth/auth.ts';

function SettingsContextMenu(): m.Component {
  const handleLogout = () => {
    setAccessToken(null);
    m.route.set('/login');
  };
  return {
    view: (vnode: m.Vnode) => {
      return m(
        ContextMenu,
        { x: vnode.attrs.x, y: vnode.attrs.y, onclose: vnode.attrs.onclose },
        m('button', { onclick: handleLogout }, 'Logout')
      );
    },
  };
}

export { SettingsContextMenu };
