import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Recuperar from "./pages/RecuperarContraseña/RecuperarContraseña.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/recuperar" element={<Recuperar />} />
            </Routes>
        </Router>
    );
}

export default App;
