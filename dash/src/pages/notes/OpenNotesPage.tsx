import {useEffect, useState} from "react";
import {useParams} from "@tanstack/react-router";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getProjectNotes, updateProjectNotes} from "../../api/project.tsx";
import styles from './OpenNotesPage.module.css'

function OpenNotesPage() {
    const {slug} = useParams({from: '/_auth/notes/$slug'});
    const [notes, setNotes] = useState("");

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

    return (
        <div className={styles.content}>
            <textarea
                value={notes}
                onChange={(e) => {
                    setNotes(e.target.value);
                }}
                spellCheck={false}
            />
        </div>
    );
}

export {OpenNotesPage};