import {createContext, type ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {setApiToken, setOnTokenRefresh} from "../api/api.ts";
import {emitAuthInvalid} from "../utils/authEvents.ts";

interface AuthContext {
    isAuthenticated: boolean
    login: (token: string) => Promise<void>
    logout: () => Promise<void>
    token: string | null
}

const AuthContext = createContext<AuthContext | null>(null);

const key = 'auth.token'

function getStoredToken() {
    return localStorage.getItem(key)
}

function setStoredToken(token: string | null) {
    if (token) {
        localStorage.setItem(key, token)
    } else {
        localStorage.removeItem(key)
    }
}

function AuthProvider({children}: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const isAuthenticated = !!token

    const login = useCallback(async (newToken: string) => {
        setStoredToken(newToken)
        setToken(newToken)
        setApiToken(newToken)
    }, []);

    const logout = useCallback(async () => {
        setStoredToken(null)
        setToken(null)
        setApiToken(null)
    }, []);

    useEffect(() => {
        const storedToken = getStoredToken()
        setToken(storedToken)
        setApiToken(storedToken)

        setOnTokenRefresh((newToken) => {
            setStoredToken(newToken);
            setToken(newToken);
            if (!newToken) {
                emitAuthInvalid()
            }
        });
    }, [])

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout, token}}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export {AuthContext, AuthProvider, useAuth};
