import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./RecuperarContraseña.css";
import { requestRecovery, verifyRecovery, changePassword } from "../../services";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function RecuperarContraseña() {
    const [correo, setCorreo] = useState("");
    const [code, setCode] = useState("");
    const [token, setToken] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    // Paso 1: solicitar código
    const handleRequestCode = async () => {
        if (!correo) {
            setMessage({ text: "Debes ingresar un correo válido antes de enviar código ⚠️", type: "warning" });
            return;
        }
        try {
            const res = await requestRecovery(correo);
            setMessage({ text: res.data.message, type: "info" }); // "Codigo enviado"
        } catch {
            setMessage({ text: "Error al enviar código ❌", type: "danger" });
        }
    };

    // Paso 2: verificar código y obtener token
    const handleVerifyCode = async () => {
        if (!correo || !code) {
            setMessage({ text: "Debes ingresar correo y código antes de verificar ⚠️", type: "warning" });
            return;
        }
        try {
            const res = await verifyRecovery(correo, code);
            setToken(res.data.token);
            setMessage({ text: "Código verificado ✅", type: "success" });
        } catch {
            setMessage({ text: "Código inválido ❌", type: "danger" });
        }
    };

    // Paso 3: cambiar contraseña
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setMessage({ text: "Primero debes verificar el código antes de cambiar la contraseña ⚠️", type: "warning" });
            return;
        }
        if (!password || !confirmPassword) {
            setMessage({ text: "Debes ingresar y confirmar la nueva contraseña ⚠️", type: "warning" });
            return;
        }
        if (password !== confirmPassword) {
            setMessage({ text: "Las contraseñas no coinciden ❌", type: "danger" });
            return;
        }
        try {
            await changePassword(token, password);
            setMessage({ text: "Contraseña cambiada correctamente 🔑", type: "success" });
        } catch {
            setMessage({ text: "Error al cambiar contraseña ❌", type: "danger" });
        }
    };

    return (
        <form className="needs-validation" noValidate onSubmit={handleSubmit}>
            <h2 className="text-center fw-bold mb-4 fs-4">Recuperar contraseña</h2>

            <div className="mb-3">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Ingrese su correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3 d-flex">
                <input
                    type="text"
                    className="form-control me-1"
                    placeholder="Ingresar código"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="btn btn-brand fs-6 me-1"
                    onClick={handleRequestCode}
                >
                    Enviar código
                </button>
                <button
                    type="button"
                    className="btn btn-brand fs-6"
                    onClick={handleVerifyCode}
                >
                    Verificar
                </button>
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn btn-brand w-100">
                Actualizar contraseña
            </button>

            {message && (
                <ToastMessage
                    message={message.text}
                    type={message.type}
                    autohide={true}
                    delay={3000}
                    onClose={() => setMessage(null)}
                />
            )}

            <div className="mt-3 text-center">
                <Link to="/login">Volver al inicio de sesión</Link>
            </div>
        </form>
    );
}
