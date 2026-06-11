import React, { useEffect, useState } from "react";
import { getCensos, createCenso, patchCenso, deleteCenso } from "../../services";
import TiltCard from "../../components/TiltCard/TiltCard.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx/ConfirmModal.jsx";
import ToastMessage from "../../components/ToastMessage/ToastMessage.jsx";
import ValidatedInput from "../../components/ValidatedInput/ValidatedInput.jsx";

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


    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        await handleDelete(deleteId);
    };


    const [formData, setFormData] = useState({
        nombrecenso: "",
        fechainiciocenso: "",
        fechafincenso: "",
    });

    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        nombrecenso: "",
        fechainiciocenso: "",
        fechafincenso: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCensos();
                setCensos(data);
            } catch (err) {
                setError("Error al cargar censos");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
        if (new Date(formData.fechafincenso) < new Date(formData.fechainiciocenso)) {
            setProcessing(false);
            return;
        }

        try {
            const nuevo = await createCenso(formData);
            setCensos((prev) => [...prev, nuevo]);
            setFormData({ nombrecenso: "", fechainiciocenso: "", fechafincenso: "" });
            setSubmittedCreate(false);
            setMessage({ type: "success", text: "Censo creado exitosamente ✅" });
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
            setCensos((prev) =>
                prev.map((c) => (c.id === id ? { ...c, estado: false } : c))
            );
            setMessage({ type: "warning", text: "Censo desactivado ⚠️" });
        } catch (err) {
            console.error("Error al desactivar censo:", err);
            setMessage({ type: "danger", text: "Error al desactivar censo ❌" });
        }
        setProcessing(false);
    };

    const handleEditClick = (censo) => {
        setEditId(censo.id);
        setEditData({
            nombrecenso: censo.nombrecenso,
            fechainiciocenso: censo.fechainiciocenso.split("T")[0],
            fechafincenso: censo.fechafincenso.split("T")[0],
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async (id) => {
        setProcessing(true);
        setSubmittedEdit(true);

        if (!editData.nombrecenso || editData.nombrecenso.length < 3) {
            setProcessing(false);
            return;
        }
        if (!editData.fechainiciocenso || !editData.fechafincenso) {
            setProcessing(false);
            return;
        }
        if (new Date(editData.fechafincenso) < new Date(editData.fechainiciocenso)) {
            setProcessing(false);
            return;
        }

        try {
            const actualizado = await patchCenso(id, editData);
            setCensos((prev) =>
                prev.map((c) => (c.id === id ? { ...c, ...actualizado } : c))
            );
            setEditId(null);
            setMessage({ type: "success", text: "Censo editado correctamente ✏️" });
        } catch (err) {
            console.error("Error al editar censo:", err.response?.data || err);
            setMessage({ type: "danger", text: "Error al editar censo ❌" });
        }
        setProcessing(false);
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
        <div className="container mt-4">

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

            {/* Mensajes de confirmación */}
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

            <h2 className="fw-bold mb-4">Gestionar Censos</h2>
            {/* Formulario de creación arriba */}
            <h3 className="fw-bold">Crear nuevo censo</h3>
            <form onSubmit={handleCreate} className="row g-3 mb-4">
                <div className="col-md-6">
                    <label className="form-label">Nombre</label>
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
                <div className="col-md-3">
                    <label className="form-label">Inicio</label>
                    <ValidatedInput
                        type="date"
                        value={formData.fechainiciocenso}
                        onChange={(val) => setFormData(prev => ({ ...prev, fechainiciocenso: val }))}
                        error={
                            submittedCreate && !formData.fechainiciocenso
                                ? "Selecciona una fecha de inicio válida"
                                : ""
                        }
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Fin</label>
                    <ValidatedInput
                        type="date"
                        value={formData.fechafincenso}
                        onChange={(val) => setFormData(prev => ({ ...prev, fechafincenso: val }))}
                        error={
                            submittedCreate && !formData.fechafincenso
                                ? "Selecciona una fecha de finalización válida"
                                : submittedCreate && new Date(formData.fechafincenso) < new Date(formData.fechainiciocenso)
                                    ? "La fecha de fin no puede ser anterior a la de inicio"
                                    : ""
                        }
                    />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-brand w-100">
                        Crear activo
                    </button>
                </div>
            </form>

            <h3 className="fw-bold">Censos activos</h3>
            <div className="row mt-3">
                {censos
                    .filter((c) => c.estado)
                    .sort((a, b) => b.id - a.id)
                    .map((censo) => (
                        <TiltCard className="col-md-4 mb-3" key={censo.id}>
                            <div className="card h-100">
                                <div className="card-body">
                                    {editId === censo.id ? (
                                        <>
                                            <ValidatedInput
                                                type="text"
                                                value={editData.nombrecenso}
                                                onChange={(val) => setEditData(prev => ({ ...prev, nombrecenso: val }))}
                                                error={
                                                    submittedEdit && (!editData.nombrecenso || editData.nombrecenso.length < 3)
                                                        ? "El nombre debe tener al menos 3 caracteres"
                                                        : ""
                                                }
                                            />

                                            <ValidatedInput
                                                type="date"
                                                value={editData.fechainiciocenso}
                                                onChange={(val) => setEditData(prev => ({ ...prev, fechainiciocenso: val }))}
                                                error={
                                                    submittedEdit && !editData.fechainiciocenso
                                                        ? "Selecciona una fecha de inicio válida"
                                                        : ""
                                                }
                                            />
                                            <ValidatedInput
                                                type="date"
                                                value={editData.fechafincenso}
                                                onChange={(val) => setEditData(prev => ({ ...prev, fechafincenso: val }))}
                                                error={
                                                    submittedEdit && !editData.fechafincenso
                                                        ? "Selecciona una fecha de finalización válida"
                                                        : submittedEdit && new Date(editData.fechafincenso) < new Date(editData.fechainiciocenso)
                                                            ? "La fecha de fin no puede ser anterior a la de inicio"
                                                            : ""
                                                }
                                            />
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => handleEditSave(censo.id)}
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => setEditId(null)}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <h5 className="card-title color-brand fw-bold">{censo.nombrecenso || "Sin nombre"}</h5>
                                            <p className="card-text">
                                                <strong>Personas encuestadas:</strong> {censo.cantidadencuestados || 0}
                                                <br />
                                                <strong>Casas encuestadas:</strong> {censo.cantidadrespuestaspositivas || 0}
                                                <br />
                                                <strong>Inicio:</strong>{" "}
                                                {new Date(censo.fechainiciocenso).toLocaleDateString()}
                                                <br />
                                                <strong>Fin:</strong>{" "}
                                                {new Date(censo.fechafincenso).toLocaleDateString()}
                                            </p>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleEditClick(censo)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => {
                                                    setDeleteId(censo.id);
                                                    setShowConfirm(true);
                                                }}
                                            >
                                                Desactivar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </TiltCard>
                    ))}
            </div>
        </div>
    );
}
