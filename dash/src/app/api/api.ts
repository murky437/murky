import { isObject } from '../../util/types.ts';
import type { AuthRepository } from '../auth/authRepository.ts';
import type { StatusRepository } from '../status/statusRepository.ts';

class Api {
  readonly #baseUrl: string;
  #refreshPromise: Promise<boolean> | null = null;
  #authService: AuthRepository;
  #statusRepository: StatusRepository;

  constructor(baseUrl: string, authRepository: AuthRepository, statusRepository: StatusRepository) {
    this.#baseUrl = baseUrl;
    this.#authService = authRepository;
    this.#statusRepository = statusRepository;
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
          const res = await this.#fetch(`${this.#baseUrl}/auth/refresh-access-token`, {
            method: 'POST',
            credentials: 'include', // send HttpOnly cookie
          });

          if (!res.ok) {
            throw new Error('Refresh failed');
          }

          const data = (await res.json()) as { accessToken?: string };
          if (data.accessToken) {
            this.#authService.setAccessToken(data.accessToken);
            return true;
          }
        } catch {
          this.#authService.setAccessToken(null);
          return false;
        } finally {
          this.#refreshPromise = null;
        }
        return false;
      })();
    }

    return this.#refreshPromise;
  }

  async #fetch(input: RequestInfo, init?: RequestInit) {
    try {
      this.#statusRepository.setIsRequestLoading(true);
      const res = await fetch(input, init);
      this.#statusRepository.setLastRequestStatusCode(res.status);
      this.#statusRepository.setIsRequestLoading(false);
      return res;
    } catch (e) {
      this.#statusRepository.setLastRequestStatusCode(500);
      this.#statusRepository.setIsRequestLoading(false);
      throw e;
    }
  }

  async fetch<T>(path: string, options: RequestInit = {}, requireAuth = true): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    const token = this.#authService.getAccessToken();

    if (requireAuth && !token) {
      throw { message: 'Unauthorized' } as GeneralError;
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let res = await this.#fetch(`${this.#baseUrl}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle expired access token
    if (res.status === 401) {
      const refreshed = await this.#refreshAccessToken();
      if (refreshed && token) {
        headers['Authorization'] = `Bearer ${token}`;
        res = await this.#fetch(`${this.#baseUrl}${path}`, {
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
