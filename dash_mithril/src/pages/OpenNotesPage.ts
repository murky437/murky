import m from 'mithril';
import { Sidebar } from '../components/Sidebar.ts';
import { NotesEditor } from '../components/NotesEditor.ts';

function OpenNotesPage() {
  return {
    view: function () {
      return [m(Sidebar), m(NotesEditor)];
    },
  };
}

export { OpenNotesPage };
