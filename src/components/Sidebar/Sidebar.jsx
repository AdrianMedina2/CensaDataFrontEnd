import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Offcanvas } from "bootstrap";
import "./Sidebar.css";

export default function SidebarMenu() {
    const { auth } = useAuth();
    const role = auth?.user?.role || auth?.role;

    const handleNavClick = () => {
        const offcanvasEl = document.getElementById("sidebarOffcanvas");
        if (offcanvasEl) {
            const bsOffcanvas = Offcanvas.getInstance(offcanvasEl);
            bsOffcanvas?.hide();
        }
    };

    // Mantener limpieza del backdrop y scroll al cerrar el offcanvas
    useEffect(() => {
        const offcanvasEl = document.getElementById("sidebarOffcanvas");
        const onHidden = () => {
            document.querySelectorAll(".offcanvas-backdrop").forEach(el => el.remove());
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
        if (offcanvasEl) offcanvasEl.addEventListener("hidden.bs.offcanvas", onHidden);
        return () => {
            if (offcanvasEl) offcanvasEl.removeEventListener("hidden.bs.offcanvas", onHidden);
        };
    }, []);

    const commonLinks = (
        <NavLink to="/home" className="nav-link fs-5 text-white" onClick={handleNavClick}>
            {({ isActive }) => (
                <>
                    <i className={`bi ${isActive ? "bi-house-fill" : "bi-house"} me-2`}></i>
                    Home
                </>
            )}
        </NavLink>
    );

    const adminLinks = (
        <>
            <div className="sidebar-section">
                <h6 className="sidebar-section-title">General</h6>
                <NavLink to="/dashboard" className="nav-link fs-5 text-white" onClick={handleNavClick}>
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-speedometer2" : "bi-speedometer"} me-2`}></i>
                            Dashboard
                        </>
                    )}
                </NavLink>
                <NavLink to="/censos" className="nav-link fs-5 text-white" onClick={handleNavClick}>
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-folder-fill" : "bi-folder"} me-2`}></i>
                            Censos
                        </>
                    )}
                </NavLink>
            </div>

            <div className="sidebar-section">
                <h6 className="sidebar-section-title">Gestión</h6>
                <NavLink to="/investigadores" className="nav-link fs-5 text-white" onClick={handleNavClick}>
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-person-badge-fill" : "bi-person-badge"} me-2`}></i>
                            Investigadores
                        </>
                    )}
                </NavLink>
                <NavLink to="/personal" className="nav-link fs-5 text-white" onClick={handleNavClick}>
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-person-fill" : "bi-person"} me-2`}></i>
                            Personal
                        </>
                    )}
                </NavLink>
                <NavLink to="/estudiantil" className="nav-link fs-5 text-white" onClick={handleNavClick}>
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-mortarboard-fill" : "bi-mortarboard"} me-2`}></i>
                            Estudiantil
                        </>
                    )}
                </NavLink>
                <NavLink to="/extracurricular" className="nav-link fs-5 text-white" onClick={handleNavClick}>
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-calendar-event-fill" : "bi-calendar-event"} me-2`}></i>
                            Extracurricular
                        </>
                    )}
                </NavLink>
            </div>
        </>
    );

    const investigadorLinks = (
        <>
            <div className="sidebar-section">
                <h6 className="sidebar-section-title">Trabajo</h6>
                <NavLink to="/encuestas" className="nav-link fs-5 text-white" onClick={handleNavClick}>
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-clipboard-check" : "bi-clipboard"} me-2`}></i>
                            Encuestas
                        </>
                    )}
                </NavLink>
                <NavLink to="/chat" className="nav-link fs-5 text-white" onClick={handleNavClick}>
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-chat-dots-fill" : "bi-chat-dots"} me-2`}></i>
                            Chat
                        </>
                    )}
                </NavLink>
            </div>
        </>
    );

    return (
        <>
            {/* Sidebar fijo en escritorio */}
            <aside className="d-none d-md-block bg-brand sidebar" aria-label="Sidebar">
                <nav className="nav flex-column sidebar-inner">
                    {commonLinks}
                    {role === "ADMINISTRADOR" && adminLinks}
                    {role === "INVESTIGADOR" && investigadorLinks}
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
                        {commonLinks}
                        {role === "ADMINISTRADOR" && adminLinks}
                        {role === "INVESTIGADOR" && investigadorLinks}
                    </nav>
                </div>
            </div>
        </>
    );
}
