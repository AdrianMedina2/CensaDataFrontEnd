import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Recuperar from "./pages/RecuperarContraseña/RecuperarContraseña.jsx";
import Home from "./pages/Home/Home.jsx";
import AuthLayout from "./layouts/AuthLayout/AuthLayout.jsx";
import MainLayout from "./layouts/MainLayout/MainLayout.jsx";
import RequireAuth from "./components/Auth/RequireAuth.jsx";
import { AuthContext } from "./context/AuthContext";
import Censos from "./pages/Censos/Censos.jsx";
import AuthRole from "./components/Auth/AuthRole.jsx";
import Investigadores from "./pages/Investigadores/Investigadores.jsx";
import Personal from "./pages/Personal/Personal.jsx"
import Ubicaciones from "./pages/Ubicaciones/Ubicaciones.jsx";
import Infraestructura from "./pages/Infraestructura/Infraestructura.jsx";

function App() {
    const { initializing } = useContext(AuthContext);

    if (initializing) return <div>Comprobando sesión...</div>;

    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/recuperar" element={<AuthLayout><Recuperar /></AuthLayout>} />

            {/* Rutas privadas */}
            <Route
                path="/home"
                element={
                    <RequireAuth>
                        <AuthRole allowed={["ADMINISTRADOR", "INVESTIGADOR"]}>
                            <MainLayout><Home /></MainLayout>
                        </AuthRole>
                    </RequireAuth>
                }
            />
            <Route
                path="/"
                element={
                    <RequireAuth>
                        <AuthRole allowed={["ADMINISTRADOR", "INVESTIGADOR"]}>
                            <MainLayout><Home /></MainLayout>
                        </AuthRole>
                    </RequireAuth>
                }
            />
            <Route
                path="/censos"
                element={
                    <RequireAuth>
                        <AuthRole allowed={["ADMINISTRADOR"]}>
                            <MainLayout><Censos /></MainLayout>
                        </AuthRole>
                    </RequireAuth>
                }
            />
            <Route
                path="/investigadores"
                element={
                    <RequireAuth>
                        <AuthRole allowed={["ADMINISTRADOR"]}>
                            <MainLayout><Investigadores /></MainLayout>
                        </AuthRole>
                    </RequireAuth>
                }
            />
            <Route
                path="/personal"
                element={
                    <RequireAuth>
                        <AuthRole allowed={["ADMINISTRADOR"]}>
                            <MainLayout><Personal /></MainLayout>
                        </AuthRole>
                    </RequireAuth>
                }
            />
            <Route
                path="/ubicaciones"
                element={
                    <RequireAuth>
                        <AuthRole allowed={["ADMINISTRADOR"]}>
                            <MainLayout><Ubicaciones /></MainLayout>
                        </AuthRole>
                    </RequireAuth>
                }
            />
            <Route
                path="/infraestructura"
                element={
                    <RequireAuth>
                        <AuthRole allowed={["ADMINISTRADOR"]}>
                            <MainLayout><Infraestructura /></MainLayout>
                        </AuthRole>
                    </RequireAuth>
                }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
