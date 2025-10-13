import { auth } from '../auth/auth.ts';
import { isObject } from '../util/types.ts';

const API_BASE_URL = import.meta.env.VITE_API_URL;

let refreshPromise: Promise<boolean> | null = null;

interface GeneralError {
  message: string;
}

interface ValidationError {
  generalErrors: string[];
  fieldErrors: Record<string, string[]>;
}

function isValidationError(err: unknown): err is ValidationError {
  return (
    isObject(err) &&
    'generalErrors' in err &&
    Array.isArray(err.generalErrors) &&
    'fieldErrors' in err &&
    typeof err.fieldErrors === 'object'
  );
}

function isGeneralError(err: unknown): err is GeneralError {
  return isObject(err) && 'message' in err && typeof err.message === 'string';
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
    throw { message: 'Unknown error' } as GeneralError;
  }

  if (isValidationError(data) || isGeneralError(data)) {
    throw data;
  }

  throw { message: 'Unknown error' } as GeneralError;
}

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) {
    // reuse ongoing refresh
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh-access-token`, {
        method: 'POST',
        credentials: 'include', // send HttpOnly cookie
      });

      if (!res.ok) {
        throw new Error('Refresh failed');
      }

      const data = (await res.json()) as { accessToken?: string };
      if (data.accessToken) {
        auth.setAccessToken(data.accessToken);
        return true;
      }
    } catch {
      auth.setAccessToken(null);
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
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  const token = auth.getAccessToken();

  if (requireAuth && !token) {
    throw { message: 'Unauthorized' } as GeneralError;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Handle expired access token
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed && token) {
      headers['Authorization'] = `Bearer ${token}`;
      res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: 'include',
      });
    } else {
      throw { message: 'Unauthorized' } as GeneralError;
    }
  }

  return handleResponse<T>(res);
}

export { apiFetch, isGeneralError, isValidationError };
