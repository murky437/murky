import {useEffect, useState} from "react";
import {useParams} from "@tanstack/react-router";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getProjectNotes, updateProjectNotes} from "../../api/project.tsx";

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
    }, [fetchedNotes]);

    const updateNotesMutation = useMutation({
        mutationFn: (newNotes: string) => updateProjectNotes(slug, {notes: newNotes})
    });

    useEffect(() => {
        const t = setTimeout(() => updateNotesMutation.mutate(notes), 300);
        return () => clearTimeout(t);
    }, [notes]);

    return (
        <div className="notes-content">
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