// src/components/NavbarMinimal/NavbarMinimal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logout } from "../../services/api";
import "./NavbarMinimal.css";

export default function NavbarMinimal() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getProfile().then(setUser).catch(() => {
            setUser({
                name: localStorage.getItem("user_name") || "Usuario",
                role: localStorage.getItem("role") || "rol",
            });
        });
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const displayName = user?.name || "Usuario";

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-brand px-3">
            <div className="container-fluid">
                {/* Toggle para sidebar en móvil */}
                <button
                    className="navbar-toggler d-md-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sidebarOffcanvas"
                    aria-controls="sidebarOffcanvas"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Logo */}
                <a className="navbar-brand ms-2" href="/">MiApp</a>

                {/* Dropdown usuario */}
                <div className="dropdown ms-auto">
                    <button
                        className="btn btn-link text-white dropdown-toggle d-flex align-items-center"
                        id="userMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <span className="user-avatar me-2">
                            {displayName.charAt(0).toUpperCase()}
                        </span>
                        <span className="d-none d-sm-inline">{displayName}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
                        <li><span className="dropdown-item-text">{user?.role || "Rol"}</span></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <button className="dropdown-item" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
