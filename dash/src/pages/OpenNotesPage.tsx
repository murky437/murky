import styles from './OpenNotesPage.module.css';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { vim } from '@replit/codemirror-vim';
import { indentWithTab } from '@codemirror/commands';
import { type Component, createEffect, onCleanup, onMount } from 'solid-js';
import { getProjectNotes, updateProjectNotes } from '../api/project.tsx';
import { useParams } from '@solidjs/router';
import { createMutable } from 'solid-js/store';
import { debounce } from '../util/debounce.ts';
import { basicSetup } from 'codemirror';
import { notes } from '../store/notes.ts';

const OpenNotesPage: Component = () => {
  const state = createMutable({
    fetchedNotes: null as string | null,
  });
  let wrapperDiv!: HTMLDivElement;
  let editorView: EditorView | null = null;
  const params = useParams();

  const updateNotes = debounce(async (slug: string, notes: string) => {
    await updateProjectNotes(slug, { notes: notes });
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
    getProjectNotes(params.slug).then(notes => {
      state.fetchedNotes = notes;
      editorView?.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: notes,
        },
      });
      editorView?.focus();
    });
  });

  createEffect(() => {
    if (params.slug) {
      notes.setLastViewedProjectSlug(params.slug);
    }
  });

  onCleanup(() => {
    if (editorView) {
      editorView.destroy();
    }
  });

  return <div class={styles.wrapper} ref={wrapperDiv}></div>;
};

export { OpenNotesPage };
