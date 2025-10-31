import styles from './OpenNotesPage.module.css';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { vim } from '@replit/codemirror-vim';
import { indentWithTab } from '@codemirror/commands';
import { type Component, createEffect, onCleanup } from 'solid-js';
import { type RouteSectionProps, useNavigate, useParams } from '@solidjs/router';
import { debounce } from '../../../util/debounce.ts';
import { basicSetup } from 'codemirror';
import { isGeneralError } from '../../../app/api/api.ts';
import { useApp } from '../../../app/appContext.tsx';
import { isTouchDevice } from '../../../util/isTouchDevice.ts';
import { Breadcrumbs } from './elements/Breadcrumbs.tsx';
import { createMutable } from 'solid-js/store';

const OpenNotesPage: Component<RouteSectionProps> = () => {
  const app = useApp();
  let wrapperDiv!: HTMLDivElement;
  let editorView: EditorView | null = null;
  const params = useParams();
  const navigate = useNavigate();
  const state = createMutable({
    project: {
      title: '',
      slug: params.slug,
    },
  });

  const updateNotes = debounce(async (slug: string, notes: string) => {
    await app.server.notes.updateProjectNotes(slug, notes);
  }, 300);

  const createEditor = (initialNotes: string) => {
    const extensions = [
      basicSetup,
      EditorView.lineWrapping,
      keymap.of([indentWithTab]),
      EditorView.updateListener.of(e => {
        if (e.docChanged) {
          let doc = e.state.doc.toString();
          updateNotes(params.slug, doc);
        }
      }),
    ];

    if (!isTouchDevice()) {
      extensions.push(vim());
    }

    if (editorView) {
      editorView.destroy();
    }

    editorView = new EditorView({
      state: EditorState.create({
        doc: initialNotes,
        extensions: extensions,
      }),
      parent: wrapperDiv,
    });
  };

  const focusEditor = () => {
    if (editorView && !editorView.hasFocus) {
      editorView.focus();
    }
  };

  onCleanup(() => {
    if (editorView) {
      editorView.destroy();
    }
  });

  createEffect(() => {
    const notesQuery = app.server.notes.getProjectNotesQuery(params.slug);
    createEffect(() => {
      if (notesQuery.isSuccess) {
        createEditor(notesQuery.data);
      }
    });
  });

  createEffect(() => {
    if (params.slug) {
      app.client.notes.setLastViewedProjectSlug(params.slug);
    }
  });

  createEffect(() => {
    state.project.slug = params.slug;
    if (params.slug) {
      const projectQuery = app.server.notes.getProjectQuery(params.slug);
      createEffect(() => {
        if (projectQuery.isSuccess) {
          state.project.title = projectQuery.data.title;
        } else if (projectQuery.isError) {
          if (isGeneralError(projectQuery.error) && projectQuery.error.message !== 'Unauthorized') {
            navigate(`/notes`, { replace: true });
          }
        }
      });
    }
  });

  return (
    <>
      <Breadcrumbs projectName={state.project.title} />
      <div class={styles.wrapper} ref={wrapperDiv} onClick={focusEditor}></div>
    </>
  );
};

export { OpenNotesPage };
