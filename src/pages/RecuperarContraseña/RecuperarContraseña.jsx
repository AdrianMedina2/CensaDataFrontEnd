import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./RecuperarContraseña.css";
import { requestRecovery, verifyRecovery, changePassword } from "../../services";

export default function RecuperarContraseña() {
    const [paso, setPaso] = useState(1);
    const [correo, setCorreo] = useState("");
    const [code, setCode] = useState("");
    const [token, setToken] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState(null);

    const limpiarMensajes = () => {
        setError("");
        setMessage(null);
    };

    const mostrarError = (texto) => {
        setError(texto);
        setMessage(null);
    };

    const mostrarMensaje = (texto, tipo = "info") => {
        setError("");
        setMessage({ texto, tipo });
    };

    const handleCorreoChange = (e) => {
        setCorreo(e.target.value);
        setCode("");
        setToken(null);
        setPassword("");
        setConfirmPassword("");
        setPaso(1);
        limpiarMensajes();
    };

    const handleRequestCode = async () => {
        const correoLimpio = correo.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
            mostrarError("Ingresá un correo electrónico válido.");
            return;
        }

        setLoading(true);
        limpiarMensajes();

        try {
            const res = await requestRecovery(correoLimpio);
            setCorreo(correoLimpio);
            setCode("");
            setToken(null);
            setPaso(2);
            mostrarMensaje(
                res.data?.message || "Si el correo está registrado, recibirás un código de recuperación.",
                "info"
            );
        } catch (err) {
            mostrarError(err.response?.data?.message || "No se pudo enviar el código. Intentá nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code.trim()) {
            mostrarError("Ingresá el código de verificación.");
            return;
        }

        setLoading(true);
        limpiarMensajes();

        try {
            const res = await verifyRecovery(correo, code.trim());

            if (!res.data?.token) {
                mostrarError("No se recibió el token de verificación.");
                return;
            }

            setToken(res.data.token);
            setPaso(3);
            mostrarMensaje("Código verificado correctamente.", "success");
        } catch (err) {
            mostrarError(err.response?.data?.message || "Código inválido o expirado.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (paso === 1) {
            await handleRequestCode();
            return;
        }

        if (paso === 2) {
            await handleVerifyCode();
            return;
        }

        if (paso !== 3 || !token) {
            mostrarError("Primero debés verificar el código.");
            return;
        }

        if (password.length < 8) {
            mostrarError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            mostrarError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        limpiarMensajes();

        try {
            await changePassword(token, password);
            setToken(null);
            setPassword("");
            setConfirmPassword("");
            setPaso(4);
            mostrarMensaje("Contraseña actualizada correctamente.", "success");
        } catch (err) {
            mostrarError(err.response?.data?.message || "No se pudo actualizar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recuperar-contraseña-page fade-in">
            <form noValidate onSubmit={handleSubmit}>
                <h2 className="text-center fw-bold mb-2 fs-4">Recuperar contraseña</h2>
                <p className="text-center text-muted small mb-4">
                    {paso === 1 && "Ingresá tu correo para recibir un código de recuperación."}
                    {paso === 2 && "Ingresá el código que enviamos a tu correo."}
                    {paso === 3 && "Creá una nueva contraseña para tu cuenta."}
                    {paso === 4 && "Tu contraseña se actualizó correctamente."}
                </p>

                {paso !== 4 && (
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        {[1, 2, 3].map((numero) => (
                            <React.Fragment key={numero}>
                                {numero > 1 && (
                                    <div className={`recuperacion-linea ${paso >= numero ? "activa" : ""}`} />
                                )}
                                <div className={`recuperacion-paso ${paso >= numero ? "activo" : ""}`}>
                                    {paso > numero ? "✓" : numero}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {message && paso !== 4 && (
                    <div className={`alert alert-${message.tipo} py-2 small mb-3`} role="status">
                        {message.texto}
                    </div>
                )}

                {paso === 1 && (
                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            className={`form-control ${error ? "is-invalid" : ""}`}
                            placeholder="Ingrese su correo"
                            value={correo}
                            onChange={handleCorreoChange}
                            autoComplete="email"
                            disabled={loading}
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
                    </div>
                )}

                {paso === 2 && (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <div className="input-group">
                                <input type="email" className="form-control" value={correo} readOnly />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setPaso(1);
                                        setCode("");
                                        setToken(null);
                                        limpiarMensajes();
                                    }}
                                    disabled={loading}
                                >
                                    Cambiar
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Código de verificación</label>
                            <input
                                type="text"
                                className={`form-control text-center recuperacion-codigo ${error ? "is-invalid" : ""}`}
                                placeholder="Ingresá el código"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    limpiarMensajes();
                                }}
                                autoComplete="one-time-code"
                                disabled={loading}
                            />
                            {error && <div className="invalid-feedback">{error}</div>}
                        </div>
                        <div className="text-center mb-3">
                            <span className="text-muted small">¿No recibiste el código? </span>
                            <button
                                type="button"
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                onClick={handleRequestCode}
                                disabled={loading}
                            >
                                Reenviar código
                            </button>
                        </div>
                    </>
                )}

                {paso === 3 && (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Nueva contraseña</label>
                            <div className="input-group">
                                <input
                                    type={mostrarPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Mínimo 8 caracteres"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        limpiarMensajes();
                                    }}
                                    autoComplete="new-password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                >
                                    {mostrarPassword ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirmar contraseña</label>
                            <div className="input-group">
                                <input
                                    type={mostrarConfirmacion ? "text" : "password"}
                                    className={`form-control ${confirmPassword && password !== confirmPassword ? "is-invalid" : ""}`}
                                    placeholder="Repetí tu contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        limpiarMensajes();
                                    }}
                                    autoComplete="new-password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setMostrarConfirmacion(!mostrarConfirmacion)}
                                >
                                    {mostrarConfirmacion ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <small className="text-danger">Las contraseñas no coinciden.</small>
                            )}
                        </div>
                        {error && <div className="text-danger small mb-3" role="alert">{error}</div>}
                    </>
                )}

                {paso === 4 ? (
                    <div className="text-center py-3">
                        <div className="recuperacion-exito mx-auto mb-3">✓</div>
                        <h5 className="fw-bold">¡Contraseña actualizada!</h5>
                        <p className="text-muted small">Ya podés iniciar sesión con tu nueva contraseña.</p>
                        <Link to="/login" className="btn btn-brand w-100 mt-2">
                            Ir al inicio de sesión
                        </Link>
                    </div>
                ) : (
                    <button type="submit" className="btn btn-brand w-100" disabled={loading}>
                        {loading && <span className="spinner-border spinner-border-sm me-2" role="status" />}
                        {loading
                            ? paso === 1 ? "Enviando..." : paso === 2 ? "Verificando..." : "Actualizando..."
                            : paso === 1 ? "Enviar código" : paso === 2 ? "Verificar código" : "Actualizar contraseña"}
                    </button>
                )}

                {paso !== 4 && (
                    <div className="mt-3 text-center">
                        <Link to="/login">Volver al inicio de sesión</Link>
                    </div>
                )}
            </form>
        </div>
    );
}