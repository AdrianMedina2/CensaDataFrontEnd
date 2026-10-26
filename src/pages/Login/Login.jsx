import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

function Login() {
    const [Correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const obtenerMensajeError = (err) => {
        const status = err?.response?.status;
        const mensaje = String(err?.response?.data?.detail || err?.message || "").toLowerCase();

        if (status === 401 || mensaje.includes("401") || mensaje.includes("credenciales") ||
            mensaje.includes("incorrect") || mensaje.includes("invalid credentials")) {
            return "Correo, usuario o contraseña incorrectos.";
        }

        if (status === 429 || mensaje.includes("429")) {
            return "Demasiados intentos. Intentá nuevamente más tarde.";
        }

        if (status >= 500 || mensaje.includes("500")) {
            return "Ocurrió un problema en el servidor. Intentá más tarde.";
        }

        if (!err?.response && (
            mensaje.includes("network") ||
            mensaje.includes("conexión") ||
            mensaje.includes("timeout") ||
            mensaje.includes("failed to fetch")
        )) {
            return "No se pudo conectar con el servidor. Revisá tu conexión.";
        }

        return "No se pudo iniciar sesión. Verificá tus datos e intentá nuevamente.";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await authContext.login({ Correo, password });
            navigate("/home", { replace: true });
        } catch (err) {
            setError(obtenerMensajeError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="needs-validation" noValidate onSubmit={handleSubmit}>
            <h2 className="text-center fw-bold mb-4 fs-4">Iniciar sesión</h2>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese su correo o usuario"
                    value={Correo}
                    onChange={(e) => {
                        setCorreo(e.target.value);
                        setError(null);
                    }}
                    autoComplete="username"
                    required
                />
                <div className="invalid-feedback">
                    Ingresá tu correo o usuario.
                </div>
            </div>

            <div className="mb-3 position-relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                    }}
                    autoComplete="current-password"
                    required
                />
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary position-absolute end-0 top-0 mt-1 me-2"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ zIndex: 2 }}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </button>
                <div className="invalid-feedback">
                    Ingresá tu contraseña para continuar.
                </div>
            </div>

            {error && (
                <div className="alert alert-danger py-2 small text-center mb-3" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="btn btn-brand w-100"
                disabled={loading}
            >
                {loading && (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                )}
                {loading ? "Accediendo..." : "Acceder"}
            </button>

            <div className="mt-3 text-center">
                <Link to="/recuperar">¿Olvidó su contraseña?</Link>
            </div>
        </form>
    );
}

export default Login;