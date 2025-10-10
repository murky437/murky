import m from 'mithril';
import { Sidebar } from '../components/Sidebar.ts';

function NoProjectsPage() {
  return {
    view: function () {
      return [m(Sidebar), m('h1', 'No projects page')];
    },
  };
}

export { NoProjectsPage };
