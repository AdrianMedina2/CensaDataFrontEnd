import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TiltCard from "../../components/TiltCard/TiltCard";

export default function Home() {
    const { auth } = useAuth();
    const role = auth?.user?.role || auth?.role;

    return (
        <div className="container py-5">
            {/* Hero Section */}
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold color-brand fs-1">Bienvenido a CensaData</h1>
                <p className="lead text-muted fade-in slow">
                    Plataforma para gestión y análisis de datos censales del INIDE.
                </p>
            </div>

            {/* Encabezado de accesos */}
            <div className="mb-4">
                <h3 className="fw-bold color-brand fade-in">⚡ Accesos directos</h3>
                <p className="text-muted fade-in slow">
                    Ingresa rápidamente a las funciones principales.
                </p>
            </div>

            {/* Accesos rápidos por rol */}
            <div className="row g-4 mb-5">
                {/* Guía de Usuario como card */}
                <TiltCard className="col-md-6 col-lg-3 fade-in">
                    <div className="card shadow-sm h-100 text-center bg-brand text-white">
                        <div className="card-body">
                            <i className="bi bi-book display-4 mb-3"></i>
                            <h5 className="card-title">Guía de Usuario</h5>
                            <p className="card-text">
                                Aprende a utilizar CensaData paso a paso.
                            </p>
                            <Link to="/guia" className="btn btn-light rounded-pill">
                                Ver Guía
                            </Link>
                        </div>
                    </div>
                </TiltCard>

                {role === "ADMINISTRADOR" && (
                    <>
                        <TiltCard className="col-md-6 col-lg-3">
                            <div className="card shadow-sm h-100 fade-in text-center bg-brand text-white">
                                <div className="card-body">
                                    <i className="bi bi-speedometer2 display-4 mb-3"></i>
                                    <h5 className="card-title">Dashboard</h5>
                                    <p className="card-text">Visualiza estadísticas y reportes globales.</p>
                                    <Link to="/dashboard" className="btn btn-light rounded-pill">
                                        Ir al Dashboard
                                    </Link>
                                </div>
                            </div>
                        </TiltCard>

                        <TiltCard className="col-md-6 col-lg-3">
                            <div className="card shadow-sm h-100 fade-in text-center bg-brand text-white">
                                <div className="card-body">
                                    <i className="bi bi-folder display-4 mb-3"></i>
                                    <h5 className="card-title">Censos</h5>
                                    <p className="card-text">Administra y consulta censos.</p>
                                    <Link to="/censos" className="btn btn-light rounded-pill">
                                        Ver Censos
                                    </Link>
                                </div>
                            </div>
                        </TiltCard>

                        <TiltCard className="col-md-6 col-lg-3">
                            <div className="card shadow-sm h-100 fade-in text-center bg-brand text-white">
                                <div className="card-body">
                                    <i className="bi bi-person-badge display-4 mb-3"></i>
                                    <h5 className="card-title">Investigadores</h5>
                                    <p className="card-text">Gestiona y registra investigadores.</p>
                                    <Link to="/investigadores" className="btn btn-light rounded-pill">
                                        Ver Investigadores
                                    </Link>
                                </div>
                            </div>
                        </TiltCard>
                    </>
                )}

                {role === "INVESTIGADOR" && (
                    <>
                        <TiltCard className="col-md-6 col-lg-3">
                            <div className="card shadow-sm h-100 fade-in text-center bg-brand text-white">
                                <div className="card-body">
                                    <i className="bi bi-clipboard-check display-4 mb-3"></i>
                                    <h5 className="card-title">Encuestas</h5>
                                    <p className="card-text">¿Quieres iniciar una encuesta?</p>
                                    <Link to="/encuestas" className="btn btn-light rounded-pill">
                                        Ir a Encuestas
                                    </Link>
                                </div>
                            </div>
                        </TiltCard>
                    </>
                )}
            </div>
        </div>
    );
}
