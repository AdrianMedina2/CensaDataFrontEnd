import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// AuthRole: Componente para proteger rutas según el rol del usuario
export default function AuthRole({ children, allowed }) {
    const { isAuthenticated, role, initializing } = useContext(AuthContext);

    // Mientras se verifica la sesión inicial
    if (initializing) return <div>Comprobando sesión...</div>;

    // Si no hay sesión dirige al login
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // se normaliza allowed a array para facilitar la comprobación
    const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

    // Si el rol del usuario NO está permitido
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Si todo está bien → renderiza la ruta protegida
    return children;
}
