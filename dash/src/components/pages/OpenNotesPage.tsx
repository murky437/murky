import styles from './OpenNotesPage.module.css';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { vim } from '@replit/codemirror-vim';
import { indentWithTab } from '@codemirror/commands';
import { type Component, createEffect, onCleanup, onMount } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { createMutable } from 'solid-js/store';
import { debounce } from '../../util/debounce.ts';
import { basicSetup } from 'codemirror';
import type { ProjectsApi } from '../../app/api/projectsApi.ts';
import type { NotesState } from '../../app/notes/notesState.ts';
import { NotesLayout } from '../elements/NotesLayout.tsx';
import type { AuthApi } from '../../app/api/authApi.ts';
import type { AuthState } from '../../app/auth/authState.ts';

interface Props {
  projectsApi: ProjectsApi;
  notesState: NotesState;
  authApi: AuthApi;
  authState: AuthState;
}

const OpenNotesPage: Component<Props> = props => {
  const state = createMutable({
    fetchedNotes: null as string | null,
  });
  let wrapperDiv!: HTMLDivElement;
  let editorView: EditorView | null = null;
  const params = useParams();
  const navigate = useNavigate();

  const updateNotes = debounce(async (slug: string, notes: string) => {
    await props.projectsApi.updateProjectNotes(slug, { notes: notes });
  }, 300);

  onMount(() => {
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
              if (state.fetchedNotes !== null && doc === state.fetchedNotes) {
                state.fetchedNotes = null;
                return;
              }

              updateNotes(params.slug, doc);
            }
          }),
        ],
      }),
      parent: wrapperDiv,
    });
  });

  createEffect(() => {
    props.projectsApi
      .getProjectNotes(params.slug)
      .then(notes => {
        state.fetchedNotes = notes;
        editorView?.dispatch({
          changes: {
            from: 0,
            to: editorView.state.doc.length,
            insert: notes,
          },
        });
        editorView?.focus();
      })
      .catch(() => {
        navigate(`/notes`, { replace: true });
      });
  });

  createEffect(() => {
    if (params.slug) {
      props.notesState.setLastViewedProjectSlug(params.slug);
    }
  });

  onCleanup(() => {
    if (editorView) {
      editorView.destroy();
    }
  });

  return (
    <NotesLayout
      notesState={props.notesState}
      authApi={props.authApi}
      authState={props.authState}
      projectsApi={props.projectsApi}
    >
      <div class={styles.wrapper} ref={wrapperDiv}></div>
    </NotesLayout>
  );
};

export { OpenNotesPage };
