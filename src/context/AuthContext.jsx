import { createContext, useState, useContext } from "react";
import { loginRequest } from "../services/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        role: localStorage.getItem("role"),
    });

    const login = async ({ Correo, password, role }) => {
        const data = await loginRequest({ Correo, password });
        if (data.access && data.refresh) {
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);
            localStorage.setItem("role", role);
            setAuth({ accessToken: data.access, refreshToken: data.refresh, role });
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        setAuth({ accessToken: null, refreshToken: null, role: null });
    };

    const isAuthenticated = !!auth.accessToken;
    const initializing = false; // si no hay lógica de refresco automático al cargar, esto siempre es false

    return (
        <AuthContext.Provider value={{ auth, login, logout, isAuthenticated, initializing }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
