import React, { useState, useEffect } from "react";
    import "./Login.css";
import TiltCard from "../../components/TiltCard/TiltCard.jsx";
import { login } from "../../services/api"; // importa tu función de api.js
import { useNavigate } from "react-router-dom";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const forms = document.querySelectorAll(".needs-validation");
        Array.from(forms).forEach(form => {
            form.addEventListener("submit", event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add("was-validated");
            }, false);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(usuario, password, role);
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("role", data.role);

            // Redirigir según rol
            if (data.role === "admin") {
                navigate("/admin");
            } else if (data.role === "investigador") {
                navigate("/investigador");
            } else {
                navigate("/"); // fallback por si el rol no es reconocido
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="container-fluid vh-100 login-page">
            <div className="row h-100">
                {/* Panel izquierdo */}
                <section className="col-md-6 d-flex flex-column align-items-center justify-content-center bg-white">
                    <div className="border border-2 border-secondary rounded p-5 mb-5 fw-bold">
                        Logo
                    </div>
                    <h1 className="fs-5 color-brand text-center fw-bold fade-in delayed">
                        Sistema de gestión y análisis de datos censales
                    </h1>
                </section>

                {/* Panel derecho */}
                <section className="col-md-6 d-flex align-items-center justify-content-center bg-brand">
                    <TiltCard className="w-50">
                        <div className="tilt-card-inner bg-white rounded-5 shadow p-4 py-5 fade-in fast">
                            <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                <h2 className="text-center fw-bold mb-4 fs-4">Iniciar sesión</h2>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese su usuario"
                                        value={usuario}
                                        onChange={e => setUsuario(e.target.value)}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Debe rellenar este campo.
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Ingrese su contraseña"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Ingrese su contraseña para continuar.
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <select
                                        className="form-select"
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione su rol</option>
                                        <option value="admin">Administrador</option>
                                        <option value="investigador">Investigador</option>
                                    </select>
                                    <div className="invalid-feedback">
                                        Debe elegir un rol.
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-brand w-100">
                                    Acceder
                                </button>
                            </form>

                            {error && (
                                <div className="alert alert-danger mt-3 text-center">
                                    {error}
                                </div>
                            )}

                            <div className="mt-3 text-center">
                                <a href="/recuperar">¿Olvidó su contraseña?</a>
                            </div>
                        </div>
                    </TiltCard>
                </section>
            </div>
        </main>
    );
}

export default Login;
