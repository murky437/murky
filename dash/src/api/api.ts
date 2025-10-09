const API_BASE_URL = import.meta.env.VITE_API_URL

let token: string | null = null;

const setApiToken = (newToken: string | null) => {
    token = newToken;
};

let refreshPromise: Promise<boolean> | null = null;
let onTokenRefresh: ((newToken: string | null) => void) | null = null;

const setOnTokenRefresh = (cb: (token: string | null) => void) => {
    onTokenRefresh = cb;
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

async function refreshAccessToken(): Promise<boolean> {
    if (refreshPromise) { // reuse ongoing refresh
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include", // send HttpOnly cookie
            });

            if (!res.ok) {
                throw new Error("Refresh failed");
            }

            const data = (await res.json()) as { accessToken?: string };
            if (data.accessToken) {
                setApiToken(data.accessToken);
                onTokenRefresh?.(data.accessToken); // notify React
                return true;
            }
        } catch {
            setApiToken(null);
            onTokenRefresh?.(null); // notify React
            return false;
        } finally {
            refreshPromise = null;
        }
        return false;
    })();

    return refreshPromise;
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

    let res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
    });

    // Handle expired access token
    if (res.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed && token) {
            headers["Authorization"] = `Bearer ${token}`;
            res = await fetch(`${API_BASE_URL}${path}`, {
                ...options,
                headers,
                credentials: "include",
            });
        } else {
            throw {message: "Unauthorized"} as GeneralError;
        }
    }

    return handleResponse<T>(res)
}

export {setApiToken, setOnTokenRefresh, apiFetch, isGeneralError, isValidationError};
