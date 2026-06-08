import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const { auth, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            logout();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            navigate("/login", { replace: true });
        }
    };

    const displayName = auth?.user?.Usuario || "Usuario";
    const role = auth?.user?.role || "Rol";
    const email = auth?.user?.email || "";

    // Cierra el dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-brand px-3">
            <div className="container-fluid">
                <button
                    className="navbar-toggler d-md-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sidebarOffcanvas"
                    aria-controls="sidebarOffcanvas"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <Link to="/home" className="logo-link">
                    <img src="/CensaDataWhite.png" alt="CensaData" className="ms-4 logo--navbar" />
                </Link>

                <div className="dropdown ms-auto position-relative" ref={dropdownRef}>
                    <button
                        className="btn btn-link text-white d-flex align-items-center text-decoration-none"
                        onClick={() => setOpen(!open)}
                    >
                        <i className="bi bi-person-circle fs-4 me-2"></i>
                        <span className="d-none d-sm-inline">{displayName}</span>
                        <i className="bi bi-caret-down-fill ms-2"></i>
                    </button>
                    {open && (
                        <ul
                            className="dropdown-menu dropdown-menu-end shadow show"
                            style={{
                                position: "fixed",
                                top: "60px",
                                right: "10px",
                                zIndex: 1050
                            }}
                        >
                            <li className="px-3 py-2">
                                <div className="fw-bold">{displayName}</div>
                                <div className="text-muted small">{email}</div>
                                <span className="badge bg-secondary mt-1">{role}</span>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button
                                    className="dropdown-item btn-brand d-flex align-items-center"
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}
