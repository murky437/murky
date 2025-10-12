import m from 'mithril';
import styles from './NotesEditor.module.css';
import { basicSetup, EditorView } from 'codemirror';
import { vim } from '@replit/codemirror-vim';
import { EditorState } from '@codemirror/state';
import { getProjectNotes, updateProjectNotes } from '../api/project.ts';
import { debounce } from '../util/debounce.ts';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';

function NotesEditor(): m.Component {
  let slug: string;
  let fetchedNotes: string | null = null;
  let editorView: EditorView;

  const updateNotes = debounce(async (slug: string, notes: string) => {
    await updateProjectNotes(slug, { notes: notes });
  }, 300);

  return {
    oncreate: function (vnode) {
      editorView = new EditorView({
        state: EditorState.create({
          extensions: [
            basicSetup,
            keymap.of([indentWithTab]),
            vim(),
            EditorView.updateListener.of(e => {
              if (e.docChanged) {
                let doc = e.state.doc.toString();

                // ignore update event triggered by initial fetch from api
                if (fetchedNotes && doc === fetchedNotes) {
                  fetchedNotes = null;
                  return;
                }
                updateNotes(slug, doc);
              }
            }),
          ],
        }),
        parent: vnode.dom,
      });
    },
    onupdate: function () {
      editorView.focus();
      slug = m.route.param('slug');
      getProjectNotes(slug).then(notes => {
        fetchedNotes = notes;
        editorView.dispatch({
          changes: {
            from: 0,
            to: editorView.state.doc.length,
            insert: notes,
          },
        });
      });
    },
    view: function () {
      return m(`.${styles.wrap}`);
    },
  };
}

export { NotesEditor };
