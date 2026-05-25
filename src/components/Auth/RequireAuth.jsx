import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function RequireAuth({ children }) {
    const { isAuthenticated, initializing } = useContext(AuthContext);
    if (initializing) return <div>Comprobando sesión...</div>;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
