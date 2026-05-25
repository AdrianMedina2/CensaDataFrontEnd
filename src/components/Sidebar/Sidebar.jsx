import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function SidebarMenu() {
    return (
        <>
            {/* Sidebar fijo en escritorio */}
            <aside className="d-none d-md-block bg-brand sidebar" aria-label="Sidebar">
                <nav className="nav flex-column pt-3">
                    <Link className="nav-link fs-5 text-white" to="/home">
                        <i className="bi bi-speedometer2 me-2" aria-hidden="true"></i> Dashboard
                    </Link>
                    <Link className="nav-link fs-5 text-white" to="/proyectos">
                        <i className="bi bi-folder me-2" aria-hidden="true"></i> Proyectos
                    </Link>
                    <Link className="nav-link fs-5 text-white" to="/reportes">
                        <i className="bi bi-bar-chart me-2" aria-hidden="true"></i> Reportes
                    </Link>
                </nav>
            </aside>

            {/* Offcanvas en móvil */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="sidebarOffcanvas">
                <div className="offcanvas-header bg-brand text-white">
                    <h5 className="offcanvas-title">Menú</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
                </div>
                <div className="offcanvas-body bg-brand">
                    <nav className="nav flex-column">
                        <Link className="nav-link fs-5 text-white" to="/home" data-bs-dismiss="offcanvas">
                            <i className="bi bi-speedometer2 me-2" aria-hidden="true"></i> Home
                        </Link>
                        <Link className="nav-link fs-5 text-white" to="/proyectos" data-bs-dismiss="offcanvas">
                            <i className="bi bi-folder me-2" aria-hidden="true"></i> Proyectos
                        </Link>
                        <Link className="nav-link fs-5 text-white" to="/reportes" data-bs-dismiss="offcanvas">
                            <i className="bi bi-bar-chart me-2" aria-hidden="true"></i> Reportes
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
}
