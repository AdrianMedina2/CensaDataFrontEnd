import React, { useEffect, useState } from "react";
import { getCensos, createCenso, patchCenso, deleteCenso } from "../../services";
import TiltCard from "../../components/TiltCard/TiltCard.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx/ConfirmModal.jsx";
import ToastMessage from "../../components/ToastMessage/ToastMessage.jsx";
import ValidatedInput from "../../components/ValidatedInput/ValidatedInput.jsx";
import "./Censos.css";
const extraerCensos = (respuesta) => {
    const contenido = respuesta?.data ?? respuesta;
    if (Array.isArray(contenido)) return contenido;
    if (Array.isArray(contenido?.data)) return contenido.data;
    return [];
};
const fechaSolo = (fecha) => typeof fecha === "string" ? fecha.split("T")[0] : "";
const fechaLegible = (fecha) => {
    const valor = fechaSolo(fecha);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return "Sin fecha";
    const [anio, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${anio}`;
};
export default function Censos() {
    const [censos, setCensos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [submittedCreate, setSubmittedCreate] = useState(false);
    const [submittedEdit, setSubmittedEdit] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;
    const confirmDelete = async () => {
        setShowConfirm(false);
        await handleDelete(deleteId);
    };
    const [formData, setFormData] = useState({
        nombrecenso: "",
        fechainiciocenso: today,
        fechafincenso: "",
        poblaciontotal: 0,
    });
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        fechainiciocenso: "",
        fechafincenso: "",
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getCensos();
                setCensos(extraerCensos(res));
            } catch (err) {
                setError("Error al cargar censos");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const handleCreate = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setSubmittedCreate(true);
        if (!formData.nombrecenso || formData.nombrecenso.length < 3) {
            setProcessing(false);
            return;
        }
        if (!formData.fechainiciocenso || !formData.fechafincenso) {
            setProcessing(false);
            return;
        }
        if (formData.fechainiciocenso < today) {
            setProcessing(false);
            setMessage({ type: "danger", text: "La fecha de inicio no puede ser anterior a hoy" });
            return;
        }
        if (formData.fechafincenso < formData.fechainiciocenso) {
            setProcessing(false);
            setMessage({ type: "danger", text: "La fecha de fin no puede ser anterior a la de inicio" });
            return;
        }
        try {
            await createCenso({ ...formData, poblaciontotal: 0, muestrapoblacional: 0 });
            const resAll = await getCensos();
            setCensos(extraerCensos(resAll));
            setFormData({
                nombrecenso: "",
                poblaciontotal: 0,
                fechainiciocenso: today,
                fechafincenso: ""
            });
            setSubmittedCreate(false);
            setMessage({ type: "success", text: "Censo creado exitosamente ✅" });
            setShowCreateModal(false);
        } catch (err) {
            console.error("Error al crear censo:", err.response?.data || err);
            setMessage({ type: "danger", text: "Error al crear censo ❌" });
        }
        setProcessing(false);
    };
    const handleDelete = async (id) => {
        setProcessing(true);
        try {
            await deleteCenso(id);
            setCensos((prev) => prev.filter((c) => c.id !== id));
            setMessage({ type: "warning", text: "Censo eliminado ⚠️" });
        } catch (err) {
            console.error("Error al eliminar censo:", err);
            setMessage({ type: "danger", text: "Error al eliminar censo ❌" });
        }
        setProcessing(false);
    };
    const handleEditClick = (censo) => {
        setEditId(censo.id);
        setSubmittedEdit(false);
        setEditData({
            fechainiciocenso: fechaSolo(censo.fechainiciocenso),
            fechafincenso: fechaSolo(censo.fechafincenso),
        });
    };
    const handleEditSave = async (id) => {
        setSubmittedEdit(true);
        if (!editData.fechainiciocenso || !editData.fechafincenso) return;
        if (editData.fechafincenso < editData.fechainiciocenso) return;
        setProcessing(true);
        try {
            const payload = {
                fechainiciocenso: editData.fechainiciocenso,
                fechafincenso: editData.fechafincenso,
            };
            await patchCenso(id, payload);
            setCensos((prev) => prev.map((censo) =>
                censo.id === id ? { ...censo, ...payload } : censo
            ));
            setEditId(null);
            setSubmittedEdit(false);
            setMessage({ type: "success", text: "Censo editado correctamente ✏️" });
        } catch (err) {
            console.error("Error al editar censo:", err.response?.data || err);
            setMessage({ type: "danger", text: "Error al editar censo ❌" });
        } finally {
            setProcessing(false);
        }
    };
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }
    if (error) return <p>{error}</p>;
    return (
        <div className="container-fluid px-0">
            {processing && (
                <ToastMessage
                    message={
                        <div className="d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            Procesando acción, por favor espera…
                        </div>
                    }
                    type="warning"
                    autohide={false}
                    onClose={() => setProcessing(false)}
                />
            )}
            {message && (
                <ToastMessage
                    message={message.text}
                    type={message.type}
                    autohide={true}
                    delay={3000}
                    onClose={() => setMessage(null)}
                />
            )}
            {showConfirm && (
                <ConfirmModal
                    show={showConfirm}
                    title="Confirmar eliminación"
                    message="¿Seguro que deseas desactivar este censo?"
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
            <h2 className="fw-bold mt-2 mb-4 d-flex justify-content-between align-items-center">
                🗂️ Gestionar Censos
                <button
                    className="btn btn-brand"
                    onClick={() => setShowCreateModal(true)}
                >
                    Crear nuevo censo
                </button>
            </h2>
            {showCreateModal && (
                <div className="modal show d-block fade-in fast" tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0">
                            <form onSubmit={handleCreate} noValidate>
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">
                                        <i className="bi bi-folder-plus me-2"></i> Nuevo Censo
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowCreateModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Nombre</label>
                                            <ValidatedInput
                                                type="text"
                                                value={formData.nombrecenso}
                                                onChange={(val) => setFormData(prev => ({ ...prev, nombrecenso: val }))}
                                                error={
                                                    submittedCreate && (!formData.nombrecenso || formData.nombrecenso.length < 3)
                                                        ? "El nombre debe tener al menos 3 caracteres"
                                                        : ""
                                                }
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Inicio</label>
                                            <ValidatedInput
                                                type="date"
                                                value={formData.fechainiciocenso}
                                                onChange={(val) => setFormData(prev => ({ ...prev, fechainiciocenso: val }))}
                                                error={
                                                    submittedCreate && !formData.fechainiciocenso
                                                        ? "Selecciona una fecha de inicio válida"
                                                        : submittedCreate && formData.fechainiciocenso < today
                                                            ? "La fecha de inicio no puede ser anterior a hoy"
                                                            : ""
                                                }
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Fin</label>
                                            <ValidatedInput
                                                type="date"
                                                value={formData.fechafincenso}
                                                onChange={(val) => setFormData(prev => ({ ...prev, fechafincenso: val }))}
                                                error={
                                                    submittedCreate && !formData.fechafincenso
                                                        ? "Selecciona una fecha de finalización válida"
                                                        : submittedCreate && formData.fechafincenso < formData.fechainiciocenso
                                                            ? "La fecha de fin no puede ser anterior a la de inicio"
                                                            : ""
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-success hover-lift">
                                        <i className="bi bi-check-circle me-2"></i>Crear
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary hover-lift"
                                        onClick={() => setShowCreateModal(false)}
                                    >
                                        <i className="bi bi-x-circle me-2"></i>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div>
                    <h3 className="fw-bold mb-1">Censos activos</h3>
                    <p className="text-body-secondary small mb-0">Consulta los períodos y administra los censos registrados.</p>
                </div>
                <span className="badge rounded-pill bg-body-tertiary border text-body-secondary fw-semibold px-3 py-2"><i className="bi bi-collection me-2"></i>{censos.length} censos</span>
            </div>
            <div className="row g-4">
                {[...censos]
                    .sort((a, b) => b.id - a.id)
                    .map((censo) => (
                        <TiltCard className="col-12 col-md-6 col-xl-4" key={censo.id}>
                            <div className="card h-100 border-0 rounded-4 shadow-sm overflow-hidden censo-card">
                                <div className="censo-accent"></div>
                                <div className="card-body p-4 d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                                        <span className="censo-icon d-inline-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary fs-4 flex-shrink-0"><i className="bi bi-clipboard2-data"></i></span>
                                        <span className="badge rounded-pill bg-body-tertiary border text-body-secondary fw-semibold px-3 py-2">Censo #{censo.id}</span>
                                    </div>
                                    <h5 className="card-title fw-bold text-body text-break mb-3" title={censo.nombrecenso || "Sin nombre"}>
                                        {censo.nombrecenso || "Sin nombre"}
                                    </h5>
                                    {editId === censo.id ? (
                                        <>
                                            <div className="bg-body-tertiary rounded-3 p-3 mb-3">
                                                <div className="d-flex align-items-center gap-2 mb-3">
                                                    <i className="bi bi-pencil-square text-primary"></i>
                                                    <span className="fw-semibold small">Editar período</span>
                                                </div>
                                                <label className="form-label small fw-semibold">Fecha de inicio</label>
                                                <ValidatedInput
                                                    type="date"
                                                    value={editData.fechainiciocenso}
                                                    onChange={(val) => setEditData((prev) => ({ ...prev, fechainiciocenso: val }))}
                                                    error={
                                                        submittedEdit && !editData.fechainiciocenso
                                                            ? "Selecciona una fecha de inicio válida"
                                                            : ""
                                                    }
                                                />
                                                <label className="form-label small fw-semibold mt-3">Fecha de fin</label>
                                                <ValidatedInput
                                                    type="date"
                                                    value={editData.fechafincenso}
                                                    onChange={(val) => setEditData((prev) => ({ ...prev, fechafincenso: val }))}
                                                    error={
                                                        submittedEdit && !editData.fechafincenso
                                                            ? "Selecciona una fecha de finalización válida"
                                                            : submittedEdit && editData.fechafincenso < editData.fechainiciocenso
                                                                ? "La fecha de fin no puede ser anterior a la de inicio"
                                                                : ""
                                                    }
                                                />
                                            </div>
                                            <div className="d-flex flex-wrap gap-2 mt-auto pt-3 border-top">
                                                <button className="btn btn-sm btn-primary rounded-3 py-2 fw-semibold flex-fill" disabled={processing} onClick={() => handleEditSave(censo.id)}>
                                                    <i className="bi bi-check2-circle me-2"></i>Guardar
                                                </button>
                                                <button className="btn btn-sm btn-outline-secondary rounded-3 py-2 fw-semibold flex-fill" disabled={processing} onClick={() => { setEditId(null); setSubmittedEdit(false); }}>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="d-grid gap-2 mb-3">
                                                <div className="d-flex align-items-center gap-3 p-3 bg-body-tertiary border rounded-3">
                                                    <span className="censo-date-icon d-inline-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary flex-shrink-0"><i className="bi bi-calendar-event"></i></span>
                                                    <div>
                                                        <div className="small text-body-secondary">Fecha de inicio</div>
                                                        <div className="fw-bold text-body">{fechaLegible(censo.fechainiciocenso)}</div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center gap-3 p-3 bg-body-tertiary border rounded-3">
                                                    <span className="censo-date-icon d-inline-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary flex-shrink-0"><i className="bi bi-calendar-check"></i></span>
                                                    <div>
                                                        <div className="small text-body-secondary">Fecha de finalización</div>
                                                        <div className="fw-bold text-body">{fechaLegible(censo.fechafincenso)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2 mt-auto pt-3 border-top">
                                                <button className="btn btn-sm btn-outline-primary rounded-3 py-2 fw-semibold flex-fill" disabled={processing} onClick={() => handleEditClick(censo)}>
                                                    <i className="bi bi-pencil-square me-2"></i>Editar
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger rounded-3 py-2 fw-semibold flex-fill" disabled={processing} onClick={() => { setDeleteId(censo.id); setShowConfirm(true); }}>
                                                    <i className="bi bi-slash-circle me-2"></i>Desactivar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </TiltCard>
                    ))}
                {censos.length === 0 && (
                    <div className="col-12">
                        <div className="text-center py-5 border rounded-4 text-body-secondary">
                            <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                            Todavía no hay censos para mostrar.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
