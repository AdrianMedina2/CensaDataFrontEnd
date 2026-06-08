import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, getProfile } from "../services";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        role: localStorage.getItem("role"),
        user: JSON.parse(localStorage.getItem("user")) || null,
    });

    // Login
    const login = async ({ Correo, password }) => {
        const data = await loginRequest({ Correo, password });
        if (data.access && data.refresh) {
            // Guardamos tokens
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);

            // Después de obtener el token, se pide el perfil
            const profile = await getProfile();

            // Guarda rol y perfil en localStorage
            localStorage.setItem("role", profile.role);
            localStorage.setItem("user", JSON.stringify(profile));

            setAuth({
                accessToken: data.access,
                refreshToken: data.refresh,
                role: profile.role,
                user: profile,
            });
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        setAuth({ accessToken: null, refreshToken: null, role: null, user: null });
    };

    // Al montar el contexto, si ya hay token, se intenta cargar el perfil del usuario
    useEffect(() => {
        const init = async () => {
            if (auth.accessToken) {
                try {
                    const profile = await getProfile();
                    localStorage.setItem("role", profile.role);
                    localStorage.setItem("user", JSON.stringify(profile));
                    setAuth((prev) => ({ ...prev, role: profile.role, user: profile }));
                } catch {
                    logout(); // si falla, se limpia la sesión
                }
            }
        };
        init();
    }, []);

    const isAuthenticated = !!auth.accessToken;
    const initializing = false;

    return (
        <AuthContext.Provider value={{ auth, login, logout, isAuthenticated, initializing }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
