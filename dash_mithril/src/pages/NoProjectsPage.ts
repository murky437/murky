import m from 'mithril';
import { Sidebar } from '../components/Sidebar.ts';
import styles from './NoProjectsPage.module.css';

function NoProjectsPage(): m.Component {
  return {
    view: function () {
      return m(`${styles.wrapper}`, [m(Sidebar), m('h1', 'No projects page')]);
    },
  };
}

export { NoProjectsPage };
