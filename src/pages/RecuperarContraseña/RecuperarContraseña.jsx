import React from "react";
import { useEffect } from "react";
import "./RecuperarContraseña.css";
import TiltCard from "../../components/TiltCard/TiltCard.jsx";
function RecuperarContraseña() {
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

    return (
        <main className="container-fluid vh-100">
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
                            <form className="needs-validation" noValidate>
                                <h2 className="text-center fw-bold mb-4 fs-4">Recuperar contraseña</h2>

                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Ingrese su correo"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Debe ingresar un correo válido.
                                    </div>
                                </div>

                                <div className="mb-3 d-flex">
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        placeholder="Ingresar código"
                                        required
                                    />
                                    <button type="button" className="btn btn-brand fs-6">
                                        Enviar código
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Nueva contraseña"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Debe ingresar una nueva contraseña.
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirmar contraseña"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Debe confirmar la contraseña.
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-brand w-100">
                                    Acceder
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <a href="/">Volver al inicio de sesión</a>
                            </div>
                        </div>
                    </TiltCard>
                </section>
            </div>
        </main>
    );
}

export default RecuperarContraseña;
