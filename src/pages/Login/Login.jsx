import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest as apiLogin } from "../../services/api";
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = document.querySelector("form.needs-validation");

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await authContext.login({ usuario, password, role });
            navigate("/home", { replace: true });
        } catch (err) {
            setError(err?.message || "Error en la autenticación");
        } finally {
            setLoading(false);
        }

    };

    return (
        <form className="needs-validation" noValidate onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-center fw-bold mb-4 fs-4">Iniciar sesión</h2>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese su usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
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
                />
                <div className="invalid-feedback">Ingrese su contraseña para continuar.</div>
            </div>

            <div className="mb-3">
                <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="">Seleccione su rol</option>
                    <option value="administrador">Administrador</option>
                    <option value="investigador">Investigador</option>
                </select>
                <div className="invalid-feedback">Debe elegir un rol.</div>
            </div>

            <button
                type="button"
                className="btn btn-brand w-100"
                disabled={loading}
                onClick={(e) => handleSubmit(e)}
            >
                {loading ? "Accediendo..." : "Acceder"}
            </button>



            {error && (
                <div className="alert alert-danger mt-3 text-center">
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
