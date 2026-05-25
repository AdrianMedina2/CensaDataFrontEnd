import React from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

export default function MainLayout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Navbar arriba */}
            <Navbar />

            {/* Cuerpo con sidebar + contenido */}
            <div className="d-flex flex-grow-1">
                {/* placeholder: reserva espacio en md+ para la sidebar fija */}
                <div className="d-none d-md-block" style={{ width: 220 }} aria-hidden="true" />

                <Sidebar />

                <main className="flex-grow-1 p-3">
                    {children}
                </main>
            </div>

            {/* Footer abajo */}
            <Footer />
        </div>
    );
}
