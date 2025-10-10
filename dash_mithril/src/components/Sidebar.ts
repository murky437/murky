import m from 'mithril';
import styles from './Sidebar.module.css';
import { getProjectList } from '../api/project.ts';
import type { Project } from '../types/project.ts';

function Sidebar() {
  let projects: Project[] = [];
  getProjectList().then(newProjects => {
    projects = newProjects;
    m.redraw();
  });
  return {
    view: function () {
      return m(`div.${styles.sidebar}`, [
        m(
          'ul',
          projects.map(project => {
            return m('li', [m(m.route.Link, { href: `/notes/${project.slug}` }, project.title)]);
          })
        ),
      ]);
    },
  } as m.Component;
}

export { Sidebar };
