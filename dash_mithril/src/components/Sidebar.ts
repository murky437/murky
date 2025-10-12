import m from 'mithril';
import styles from './Sidebar.module.css';
import { getProjectList } from '../api/project.ts';
import type { Project } from '../types/project.ts';
import { SettingsContextMenu } from './contextmenu/SettingsContextMenu.ts';

function Sidebar(): m.Component {
  let projects: Project[] = [];
  getProjectList().then(newProjects => {
    projects = newProjects;
    m.redraw();
  });

  let isSettingsMenuOpen = false;
  let contextMenuPos: { x: number; y: number } = {};

  const openSettingsMenu = (e: PointerEvent) => {
    contextMenuPos = { x: e.clientX, y: e.clientY };
    isSettingsMenuOpen = true;
  };

  const closeMenus = () => {
    isSettingsMenuOpen = false;
  };

  const handleBlur = () => closeMenus();
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeMenus();
  };

  window.addEventListener('blur', handleBlur);
  window.addEventListener('keydown', handleKeyDown);

  return {
    view: function () {
      return [
        m(`div.${styles.sidebar}`, [
          m(
            'ul',
            projects.map(project => {
              return m('li', [m(m.route.Link, { href: `/notes/${project.slug}` }, project.title)]);
            })
          ),
          m('div', [m(`div.${styles.settings}`, { onclick: openSettingsMenu }, '☰')]),
          isSettingsMenuOpen &&
            m(SettingsContextMenu, {
              x: contextMenuPos.x,
              y: contextMenuPos.y,
              onclose: closeMenus,
            }),
        ]),
      ];
    },
  } as m.Component;
}

export { Sidebar };
