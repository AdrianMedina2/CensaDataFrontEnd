import React from "react";
import TiltCard from "../../components/TiltCard/TiltCard.jsx";

export default function AuthLayout({ children }) {
    return (
        <main className="container-fluid vh-100 auth-layout">
            <div className="row h-100">
                {/* Panel izquierdo compartido */}
                <section className="col-md-6 d-flex flex-column align-items-center justify-content-center bg-white">
                    <div className="border border-2 border-secondary rounded p-5 mb-5 fw-bold">
                        Logo
                    </div>
                    <h1 className="fs-5 color-brand text-center fw-bold fade-in delayed">
                        Sistema de gestión y análisis de datos censales
                    </h1>
                </section>

                {/* Panel derecho: el layout provee el TiltCard y coloca children dentro */}
                <section className="col-md-6 d-flex align-items-center justify-content-center bg-brand">
                    <TiltCard className="w-50">
                        <div className="tilt-card-inner bg-white rounded-5 shadow p-4 py-5 fade-in fast">
                            {children}
                        </div>
                    </TiltCard>
                </section>
            </div>
        </main>
    );
}
