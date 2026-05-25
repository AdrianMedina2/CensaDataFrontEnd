import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./RecuperarContraseña.css";

export default function RecuperarContraseña() {
    useEffect(() => {
        const forms = document.querySelectorAll(".needs-validation");
        Array.from(forms).forEach((form) => {
            form.addEventListener(
                "submit",
                (event) => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add("was-validated");
                },
                false
            );
        });
    }, []);

    return (
        <form className="needs-validation" noValidate>
            <h2 className="text-center fw-bold mb-4 fs-4">Recuperar contraseña</h2>

            <div className="mb-3">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Ingrese su correo"
                    required
                />
                <div className="invalid-feedback">Debe ingresar un correo válido.</div>
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
                <div className="invalid-feedback">Debe ingresar una nueva contraseña.</div>
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Confirmar contraseña"
                    required
                />
                <div className="invalid-feedback">Debe confirmar la contraseña.</div>
            </div>

            <button type="submit" className="btn btn-brand w-100">
                Actualizar contraseña
            </button>

            <div className="mt-3 text-center">
                <Link to="/login">Volver al inicio de sesión</Link>
            </div>
        </form>
    );
}
