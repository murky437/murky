import styles from './ContextMenu.module.css';
import m from 'mithril';

function ContextMenu(): m.Component {
  return {
    view: (vnode: m.VnodeDOM) => {
      const handleClickOutside = (e: MouseEvent) => {
        if (!vnode.dom.contains(e.target as Node)) {
          vnode.attrs.onclose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return m(
        `div.${styles.wrapper}`,
        { style: { position: 'absolute', left: vnode.attrs.x, top: vnode.attrs.y } },
        vnode.children
      );
    },
  };
}

export { ContextMenu };
