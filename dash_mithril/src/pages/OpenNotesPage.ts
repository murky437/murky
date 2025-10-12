import m from 'mithril';
import { Sidebar } from '../components/Sidebar.ts';
import { NotesEditor } from '../components/NotesEditor.ts';
import styles from './OpenNotesPage.module.css';

function OpenNotesPage(): m.Component {
  return {
    view: function () {
      return m(`div.${styles.wrapper}`, [m(Sidebar), m(NotesEditor)]);
    },
  };
}

export { OpenNotesPage };
