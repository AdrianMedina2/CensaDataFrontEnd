import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as apiLogin } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const forms = Array.from(document.querySelectorAll(".needs-validation"));
        const handler = (event) => {
            const form = event.currentTarget;
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated");
        };

        forms.forEach((form) => form.addEventListener("submit", handler, false));
        return () => forms.forEach((form) => form.removeEventListener("submit", handler, false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await apiLogin(usuario, password, role);
            console.log("login response:", data);

            if (!data || !data.access_token) {
                setError("Respuesta inválida del servidor");
                setLoading(false);
                return;
            }

            // Guardar access token y role en el contexto (memoria)
            authContext.login(data.access_token, data.role);

            // Solo para el mock: guardar role en sessionStorage para que refreshWithCookie lo pueda devolver
            if (data.role) sessionStorage.setItem("mock_role", data.role);

            // Navegar a la ruta protegida una vez seteado el contexto
            navigate("/home", { replace: true });
        } catch (err) {
            console.error("login error:", err);
            setError(err?.message || "Error en la autenticación");
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
                    placeholder="Ingrese su usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                    aria-label="Usuario"
                />
                <div className="invalid-feedback">Debe rellenar este campo.</div>
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Contraseña"
                />
                <div className="invalid-feedback">Ingrese su contraseña para continuar.</div>
            </div>

            <div className="mb-3">
                <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    aria-label="Rol"
                >
                    <option value="">Seleccione su rol</option>
                    <option value="admin">Administrador</option>
                    <option value="investigador">Investigador</option>
                </select>
                <div className="invalid-feedback">Debe elegir un rol.</div>
            </div>

            <button
                type="submit"
                className="btn btn-brand w-100"
                disabled={loading}
                aria-busy={loading}
            >
                {loading ? "Accediendo..." : "Acceder"}
            </button>

            {error && (
                <div
                    className="alert alert-danger mt-3 text-center"
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </div>
            )}

            <div className="mt-3 text-center">
                <Link to="/recuperar">¿Olvidó su contraseña?</Link>
            </div>
        </form>
    );
}

export default Login;
