import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AuthRole({ children, allowed }) {
    const { isAuthenticated, auth, initializing } = useContext(AuthContext);

    if (initializing) return <div>Comprobando sesión...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Rol: primero el de /me, luego el de localStorage como respaldo para eviatr problemas en el caso de que el perfil no se haya cargado aún
    const currentRole = auth?.user?.role || auth?.role;

    const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

    if (!allowedRoles.includes(currentRole)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
