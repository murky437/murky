import styles from './OpenNotesPage.module.css';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { vim } from '@replit/codemirror-vim';
import { indentWithTab } from '@codemirror/commands';
import { type Component, createEffect, onCleanup, onMount } from 'solid-js';
import { type RouteSectionProps, useNavigate, useParams } from '@solidjs/router';
import { debounce } from '../../../util/debounce.ts';
import { basicSetup } from 'codemirror';
import { isGeneralError } from '../../../app/api/api.ts';
import { useApp } from '../../../app/appContext.tsx';
import { isTouchDevice } from '../../../util/isTouchDevice.ts';

const OpenNotesPage: Component<RouteSectionProps> = () => {
  const app = useApp();
  let wrapperDiv!: HTMLDivElement;
  let editorView: EditorView | null = null;
  let fetchedNotes: string | null = null;
  const params = useParams();
  const navigate = useNavigate();

  const updateNotes = debounce(async (slug: string, notes: string) => {
    await app.server.notes.updateProjectNotes(slug, notes);
  }, 300);

  const focusEditor = () => {
    editorView?.focus();
  };

  onMount(() => {
    const extensions = [
      basicSetup,
      keymap.of([indentWithTab]),
      EditorView.updateListener.of(e => {
        if (e.docChanged) {
          let doc = e.state.doc.toString();

          // ignore update event triggered by initial fetch from api
          if (fetchedNotes !== null && doc === fetchedNotes) {
            fetchedNotes = null;
            return;
          }
          fetchedNotes = null;

          updateNotes(params.slug, doc);
        }
      }),
    ];

    if (!isTouchDevice()) {
      extensions.push(vim());
    }

    editorView = new EditorView({
      state: EditorState.create({
        extensions: extensions,
      }),
      parent: wrapperDiv,
    });
  });

  onCleanup(() => {
    if (editorView) {
      editorView.destroy();
    }
  });

  createEffect(() => {
    const notes = app.server.notes.getProjectNotes(params.slug);
    createEffect(() => {
      if (notes.isSuccess) {
        fetchedNotes = notes.data;
        editorView?.dispatch({
          changes: {
            from: 0,
            to: editorView.state.doc.length,
            insert: notes.data,
          },
        });
      } else if (notes.isError) {
        if (isGeneralError(notes.error) && notes.error.message !== 'Unauthorized') {
          navigate(`/notes`, { replace: true });
        }
      }
    });
  });

  createEffect(() => {
    if (params.slug) {
      app.client.notes.setLastViewedProjectSlug(params.slug);
    }
  });

  return <div class={styles.wrapper} ref={wrapperDiv} onClick={focusEditor}></div>;
};

export { OpenNotesPage };
