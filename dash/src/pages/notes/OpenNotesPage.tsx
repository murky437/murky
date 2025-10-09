import {useEffect, useRef, useState} from "react";
import {useParams} from "@tanstack/react-router";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getProjectNotes, updateProjectNotes} from "../../api/project.tsx";
import styles from './OpenNotesPage.module.css'
import {basicSetup, useCodeMirror} from "@uiw/react-codemirror";
import {vim} from "@replit/codemirror-vim";
import createTheme from "@uiw/codemirror-themes";

const myTheme = createTheme({
    theme: 'light',
    settings: {
        background: '#212121',
        backgroundImage: '',
        foreground: '#e8e8e8',
        caret: '#e8e8e8',
        selection: '#036dd626',
        selectionMatch: '#036dd626',
        lineHighlight: '#8888881a',
        gutterBackground: '#212121',
        gutterForeground: '#a8a8a866',
        gutterBorder: '#212121'
    },
    styles: [
        // { tag: t.comment, color: '#787b8099' },
        // { tag: t.variableName, color: '#0080ff' },
        // { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
        // { tag: t.number, color: '#5c6166' },
        // { tag: t.bool, color: '#5c6166' },
        // { tag: t.null, color: '#5c6166' },
        // { tag: t.keyword, color: '#5c6166' },
        // { tag: t.operator, color: '#5c6166' },
        // { tag: t.className, color: '#5c6166' },
        // { tag: t.definition(t.typeName), color: '#5c6166' },
        // { tag: t.typeName, color: '#5c6166' },
        // { tag: t.angleBracket, color: '#5c6166' },
        // { tag: t.tagName, color: '#5c6166' },
        // { tag: t.attributeName, color: '#5c6166' },
    ],
});

function OpenNotesPage() {
    const {slug} = useParams({from: '/_auth/notes/$slug'});
    const [notes, setNotes] = useState("");

    useEffect(() => {
        localStorage.setItem("lastOpenProjectSlug", slug);
    }, [slug]);

    const {data: fetchedNotes} = useQuery({
        queryKey: ["projectNotes", slug],
        queryFn: () => getProjectNotes(slug)
    });

    useEffect(() => {
        if (fetchedNotes !== undefined) {
            setNotes(fetchedNotes);
        }
    }, [fetchedNotes, slug]);

    const updateNotesMutation = useMutation({
        mutationFn: (newNotes: string) => updateProjectNotes(slug, {notes: newNotes})
    });

    useEffect(() => {
        const t = setTimeout(() => {
            if (notes !== fetchedNotes) {
                updateNotesMutation.mutate(notes);
            }
        }, 300);
        return () => clearTimeout(t);
    }, [notes, slug]);

    const editor = useRef<HTMLDivElement | null>(null)
    const {setContainer} = useCodeMirror({
        container: editor.current,
        extensions: [
            vim(),
            basicSetup()
        ],
        value: notes,
        onChange(value: string) {
            setNotes(value);
        },
        theme: myTheme,
        autoFocus: true,
        height: "100vh"
    })

    useEffect(() => {
        if (editor.current) {
            setContainer(editor.current);
        }
    }, [editor.current]);
    return (
        <div className={styles.content}>
            <div ref={editor}></div>
        </div>
    );
}

export {OpenNotesPage};