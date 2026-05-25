import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="container py-5">
            {/* Hero Section */}
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold color-brand fs-1">Bienvenido a CensaData</h1>
                <p className="lead text-muted">
                    Sistema para gestión y análisis de datos censales.
                </p>
            </div>

            {/* Card con enlace a Guía de Usuario */}
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="card-title">Guía de Usuario</h5>
                            <p className="card-text">
                                Aprende a utilizar CensaData paso a paso con nuestra guía.
                            </p>
                            <Link to="/home" className="btn btn-brand rounded-pill">
                                Ver Guía
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
