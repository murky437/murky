import { isObject } from '../../util/types.ts';
import type { AuthState } from '../auth/authState.ts';

class Api {
  readonly #baseUrl: string;
  #refreshPromise: Promise<boolean> | null = null;
  #authState: AuthState;

  constructor(baseUrl: string, authState: AuthState) {
    this.#baseUrl = baseUrl;
    this.#authState = authState;
  }

  async #handleResponse<T>(res: Response): Promise<T> {
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

  async #refreshAccessToken(): Promise<boolean> {
    if (!this.#refreshPromise) {
      this.#refreshPromise = (async () => {
        try {
          const res = await fetch(`${this.#baseUrl}/auth/refresh-access-token`, {
            method: 'POST',
            credentials: 'include', // send HttpOnly cookie
          });

          if (!res.ok) {
            throw new Error('Refresh failed');
          }

          const data = (await res.json()) as { accessToken?: string };
          if (data.accessToken) {
            this.#authState.setAccessToken(data.accessToken);
            return true;
          }
        } catch {
          this.#authState.setAccessToken(null);
          return false;
        } finally {
          this.#refreshPromise = null;
        }
        return false;
      })();
    }

    return this.#refreshPromise;
  }

  async fetch<T>(path: string, options: RequestInit = {}, requireAuth = true): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    const token = this.#authState.getAccessToken();

    if (requireAuth && !token) {
      throw { message: 'Unauthorized' } as GeneralError;
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let res = await fetch(`${this.#baseUrl}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle expired access token
    if (res.status === 401) {
      const refreshed = await this.#refreshAccessToken();
      if (refreshed && token) {
        headers['Authorization'] = `Bearer ${token}`;
        res = await fetch(`${this.#baseUrl}${path}`, {
          ...options,
          headers,
          credentials: 'include',
        });
      } else {
        throw { message: 'Unauthorized' } as GeneralError;
      }
    }

    return this.#handleResponse<T>(res);
  }
}

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

export { Api, isValidationError, isGeneralError };
