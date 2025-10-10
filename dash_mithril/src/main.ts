import './style.css';
import m from 'mithril';
import { OpenNotesPage } from './pages/OpenNotesPage.ts';
import { getProjectList } from './api/project.ts';
import { NoProjectsPage } from './pages/NoProjectsPage.ts';

const NotesResolver: m.RouteResolver = {
  onmatch: async function () {
    const projects = await getProjectList();
    const lastOpenProjectSlug = localStorage.getItem('lastOpenProjectSlug');
    const found = projects.find(p => p.slug === lastOpenProjectSlug);

    if (found) {
      m.route.set(`/notes/${lastOpenProjectSlug}`);
    }

    if (projects.length > 0) {
      m.route.set(`/notes/${projects[0].slug}`);
    }

    return NoProjectsPage;
  },
};

const root = document.querySelector('#app')!;

m.route.prefix = '';

m.route(root, '/notes', {
  '/notes': NotesResolver,
  '/notes/:slug': OpenNotesPage,
});
