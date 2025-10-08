import * as React from "react";
import {useState} from "react";
import {Modal} from "./Modal.tsx";
import type {Project} from "../../types/project.ts";
import {deleteProject, updateProject} from "../../api/project.tsx";
import {useNavigate} from "@tanstack/react-router";
import {isGeneralError, isValidationError} from "../../api/api.ts";
import {FieldError} from "../FieldError.tsx";
import styles from './Modal.module.css'
import {GeneralErrors} from "../GeneralErrors.tsx";

interface Props {
    project: Project
    onClose: () => void
    onSuccess: () => void
}

function EditProjectModal({project, onClose, onSuccess}: Props) {
    const [title, setTitle] = useState(project.title);
    const [slug, setSlug] = useState(project.slug);
    const navigate = useNavigate()
    const [generalErrors, setGeneralErrors] = useState<string[]>([])
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralErrors([]);
        setFieldErrors({});
        setLoading(true);

        try {
            await updateProject(project.slug, {title, slug});
            if (slug !== project.slug) {
                await navigate({to: `/notes/${slug}`});
            }
            onSuccess();
            onClose()
        } catch (err) {
            if (isValidationError(err)) {
                setGeneralErrors(err.generalErrors || []);
                setFieldErrors(err.fieldErrors || {});
            } else if (isGeneralError(err)) {
                setGeneralErrors([err.message]);
            } else {
                setGeneralErrors(["Unknown error"]);
            }
        }

        setLoading(false);
    };

    const del = async () => {
        if (confirm(`Are you sure you want to delete ${project.title}?`)) {
            await deleteProject(project.slug);
            await navigate({to: `/notes`});
            onSuccess();
            onClose()
        }
    };

    return (
        <Modal title="Edit project" onClose={onClose}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <GeneralErrors errors={generalErrors} />
                <input autoFocus={true} className={styles.input} value={title} onChange={e => setTitle(e.target.value)}/>
                <FieldError fieldErrors={fieldErrors.title}/>
                <input className={styles.input} value={slug} onChange={e => setSlug(e.target.value)}/>
                <FieldError fieldErrors={fieldErrors.slug}/>
                <div className={styles.buttonWrapper}>
                    <button className={`${styles.button} ${styles.delete}`} type="button" onClick={del}>Delete</button>
                    <div className={styles.right}>
                        <button className={`${styles.button} ${styles.secondary}`} type="button" onClick={onClose}>Cancel</button>
                        <button className={`${styles.button} ${styles.primary}`} type="submit" disabled={loading}>Save</button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export {EditProjectModal}