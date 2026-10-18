import React from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./MainLayout.css";

export default function MainLayout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Navbar arriba */}
            <Navbar />

            {/* Cuerpo con sidebar + contenido */}
            <div className="d-flex flex-grow-1">
                {/* Sidebar fija */}
                <Sidebar />

                {/* Contenido principal */}
                <main className="main-content">
                    {children}
                </main>
            </div>

            {/* Footer abajo */}
            <Footer />
        </div>
    );
}
