import React from "react";
import TiltCard from "../../components/TiltCard/TiltCard.jsx";
import "./AuthLayout.css";

export default function AuthLayout({ children }) {
    return (
        <main className="container-fluid vh-100 auth-layout">
            <div className="row h-100">
                {/* Panel izquierdo: solo visible en desktop */}
                <section className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center bg-white">
                    <img src="/CensaData.png" alt="CensaData" className="logo" />
                    <h1 className="mt-4 fs-5 color-brand text-center fw-bold fade-in delayed">
                        Sistema de gestión y análisis de datos censales
                    </h1>
                </section>

                {/* Panel derecho: ocupa todo el ancho en móvil */}
                <section className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-brand">
                    <TiltCard className="auth-card">
                        <div className="bg-white rounded-5 shadow p-4 py-5 fade-in fast w-100 text-center">
                            <img
                                src="/CensaData.png"
                                alt="CensaData"
                                className="logo-mobile d-block d-md-none mx-auto mb-4"
                            />
                            {children}
                        </div>
                    </TiltCard>
                </section>
            </div>
        </main>
    );
}
