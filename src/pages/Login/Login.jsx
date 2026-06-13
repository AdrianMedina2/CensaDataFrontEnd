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
            await authContext.login({ Correo, password });
            navigate("/home", { replace: true });
        } catch (err) {
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
                    placeholder="Ingrese su correo o usuario"
                    value={Correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />
                <div className="invalid-feedback">Usuario o Correo invalido</div>
            </div>

            <div className="mb-3 position-relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary position-absolute end-0 top-0 mt-1 me-2"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ zIndex: 2 }}
                >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </button>
                <div className="invalid-feedback">Ingrese su contraseña para continuar.</div>
            </div>

            <button
                type="submit"
                className="btn btn-brand w-100"
                disabled={loading}
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
