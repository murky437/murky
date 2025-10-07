import * as React from "react";
import {useState} from "react";
import {isGeneralError, isValidationError} from "../api/api.ts";
import {useAuth} from "../context/AuthContext.tsx";
import {useNavigate, useRouter, useSearch} from "@tanstack/react-router";
import {createTokens} from "../api/auth.tsx";

function LoginPage() {
    const auth = useAuth()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [generalErrors, setGeneralErrors] = useState<string[]>([])
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const search = useSearch({from: '/login'})
    const navigate = useNavigate()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralErrors([]);
        setFieldErrors({});
        setLoading(true);

        try {
            const response = await createTokens({username, password})
            await auth.login(response.accessToken);
            await router.invalidate()
            await navigate({
                to: search.redirect || '/'
            })
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

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit} className="login-form">
                {generalErrors.length > 0 && (
                    <div className="general-errors">
                        {generalErrors.map((error, idx) => (
                            <div key={idx} className="error-text">{error}</div>
                        ))}
                    </div>
                )}
                <div className="form-group">
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                        autoFocus
                    />
                    <FieldError fieldErrors={fieldErrors.username}/>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <FieldError fieldErrors={fieldErrors.password}/>
                </div>
                <button type="submit" disabled={loading}>Login</button>
            </form>
        </div>
    );
}

function FieldError({fieldErrors}: { fieldErrors?: string[] }) {
    if (!fieldErrors || fieldErrors.length === 0) return null;
    return (
        <>
            {fieldErrors.map((err, idx) => (
                <div key={idx} className="input-error">{err}</div>
            ))}
        </>
    );
}

export {LoginPage};