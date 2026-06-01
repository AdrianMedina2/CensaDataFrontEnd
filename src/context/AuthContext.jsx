import React, { createContext, useState, useCallback, useMemo, useEffect, useContext } from "react";
import { loginRequest, refreshRequest, logoutRequest } from "../services/api";

export const AuthContext = createContext({
    accessToken: null,
    refreshToken: null,
    role: null,
    isAuthenticated: false,
    initializing: true,
    login: () => { },
    logout: () => { },
    setTokens: () => { }
});

export function useAuth() {
    return useContext(AuthContext); // hook que expone el contexto
}

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));
    const [role, setRole] = useState(() => localStorage.getItem("role"));
    const [initializing, setInitializing] = useState(true);

    const setTokens = useCallback((access, refresh, userRole) => {
        setAccessToken(access);
        setRefreshToken(refresh);
        setRole(userRole);

        if (access) localStorage.setItem("accessToken", access);
        else localStorage.removeItem("accessToken");

        if (refresh) localStorage.setItem("refreshToken", refresh);
        else localStorage.removeItem("refreshToken");

        if (userRole) localStorage.setItem("role", userRole);
        else localStorage.removeItem("role");

        console.log("Guardando tokens:", { access, refresh, userRole });
    }, []);

    const login = useCallback(async ({ usuario, password, role }) => {
        const data = await loginRequest({ usuario, password, role });
        setTokens(data.access_token, data.refresh_token, data.role);
    }, [setTokens]);

    const logout = useCallback(async () => {
        try {
            if (refreshToken) {
                await logoutRequest(refreshToken);
            }
        } catch (_) { }
        setTokens(null, null, null);
    }, [refreshToken, setTokens]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!refreshToken || refreshToken === "null") {
                setInitializing(false);
                return;
            }
            try {
                const data = await refreshRequest({ refresh_token: refreshToken });
                console.log("Respuesta refresh:", data);
                if (mounted && data?.access_token) {
                    setTokens(data.access_token, data.refresh_token, data.role || role);
                }
            } catch (_) {
                setTokens(null, null, null);
            } finally {
                if (mounted) setInitializing(false);
            }
        })();
        return () => { mounted = false };
    }, []); // solo corre una vez al montar


    const value = useMemo(() => ({
        accessToken,
        refreshToken,
        role,
        isAuthenticated: !!accessToken,
        initializing,
        login,
        logout,
        setTokens
    }), [accessToken, refreshToken, role, initializing, login, logout, setTokens]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
