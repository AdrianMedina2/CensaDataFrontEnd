import React, { createContext, useState, useCallback, useMemo, useEffect } from "react";
import { refreshWithCookie, logoutRequest } from "../services/api";

export const AuthContext = createContext({
    token: null,
    role: null,
    isAuthenticated: false,
    initializing: true,
    login: () => { },
    logout: () => { },
    setToken: () => { }
});

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [initializing, setInitializing] = useState(true);

    const login = useCallback((accessToken, userRole) => {
        setToken(accessToken);
        setRole(userRole);
        if (userRole) localStorage.setItem("role", userRole); // solo para mock/UI
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutRequest(token).catch(() => { });
        } finally {
            setToken(null);
            setRole(null);
            // limpieza local relacionada con auth
            try {
                localStorage.removeItem("role");
                sessionStorage.removeItem("mock_refresh_cookie");
                sessionStorage.removeItem("mock_role");
                sessionStorage.removeItem("refresh_token");
            } catch (e) { /* ignore */ }
        }
    }, [token]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                if (!token) {
                    const data = await refreshWithCookie().catch(() => null);
                    if (mounted && data && data.access_token) {
                        setToken(data.access_token);
                        if (data.role) setRole(data.role);
                    }
                }
            } catch (e) {
            } finally {
                if (mounted) setInitializing(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const value = useMemo(() => ({
        token,
        role,
        isAuthenticated: !!token,
        initializing,
        login,
        logout,
        setToken
    }), [token, role, initializing, login, logout]);

    if (typeof window !== "undefined") {
        window.__APP_AUTH__ = window.__APP_AUTH__ || {};
        window.__APP_AUTH__.getToken = () => token;
        window.__APP_AUTH__.setToken = (t) => setToken(t);
        window.__APP_AUTH__.logout = logout;
        window.__APP_AUTH__.login = (t, r) => login(t, r);
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
