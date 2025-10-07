const API_BASE_URL = import.meta.env.VITE_API_URL

let token: string | null = null;

const setApiToken = (newToken: string | null) => {
    token = newToken;
};

interface GeneralError {
    message: string;
}

interface ValidationError {
    generalErrors: string[];
    fieldErrors: Record<string, string[]>;
}

function isValidationError(err: any): err is ValidationError {
    return (
        typeof err === "object" &&
        err !== null &&
        Array.isArray(err.generalErrors) &&
        typeof err.fieldErrors === "object"
    );
}

function isGeneralError(err: any): err is GeneralError {
    return (
        typeof err === "object" &&
        err !== null &&
        typeof err.message === "string"
    );
}

async function handleResponse<T>(res: Response): Promise<T> {
    const text = await res.text();

    if (res.ok) {
        if (!text) {
            return undefined as unknown as T;
        }
        return JSON.parse(text) as T;
    }

    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch {
        throw {message: "Unknown error"} as GeneralError;
    }

    if (isValidationError(data) || isGeneralError(data)) {
        throw data;
    }

    throw {message: "Unknown error"} as GeneralError;
}

async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {...options, headers});

    return handleResponse<T>(res)
}

export {setApiToken, apiFetch, isGeneralError, isValidationError};
