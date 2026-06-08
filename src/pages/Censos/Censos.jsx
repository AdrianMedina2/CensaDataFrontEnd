import React, { useEffect, useState } from "react";
import { getCensos, createCenso, patchCenso, deleteCenso } from "../../services";
import TiltCard from "../../components/TiltCard/TiltCard.jsx";

export default function Censos() {
    const [censos, setCensos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null); // mensajes de confirmación
    const [processing, setProcessing] = useState(false);

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
        if (!formData.nombrecenso || formData.nombrecenso.length < 3) {
            setMessage({ type: "danger", text: "El nombre debe tener al menos 3 caracteres ❌" });
            setProcessing(false);
            return;
        }
        if (!formData.fechainiciocenso || !formData.fechafincenso) {
            setMessage({ type: "danger", text: "Debes seleccionar fechas válidas ❌" });
            setProcessing(false);
            return;
        }
        try {
            const nuevo = await createCenso(formData);
            setCensos((prev) => [...prev, nuevo]);
            setFormData({ nombrecenso: "", fechainiciocenso: "", fechafincenso: "" });
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
        if (!editData.nombrecenso || editData.nombrecenso.length < 3) {
            setMessage({ type: "danger", text: "El nombre debe tener al menos 3 caracteres ❌" });
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
            setProcessing(false);
        } catch (err) {
            console.error("Error al editar censo:", err.response?.data || err);
            setMessage({ type: "danger", text: "Error al editar censo ❌" });
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
        <div className="container mt-4">

            {processing && (
                <div className="alert alert-warning d-flex align-items-center" role="alert">
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Procesando acción, por favor espera…
                </div>
            )}

            {/* Mensajes de confirmación */}
            {message && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
                </div>
            )}

            {/* Formulario de creación arriba */}
            <h3 className="fw-bold">Crear nuevo censo</h3>
            <form onSubmit={handleCreate} className="row g-3 mb-4 needs-validation" noValidate>
                <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="nombrecenso"
                        value={formData.nombrecenso}
                        onChange={handleChange}
                        className="form-control"
                        required
                        minLength={3}
                    />
                    <div className="invalid-feedback">
                        El nombre del censo debe tener al menos 3 caracteres.
                    </div>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Inicio</label>
                    <input
                        type="date"
                        name="fechainiciocenso"
                        value={formData.fechainiciocenso}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                    <div className="invalid-feedback">
                        Selecciona una fecha de inicio válida.
                    </div>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Fin</label>
                    <input
                        type="date"
                        name="fechafincenso"
                        value={formData.fechafincenso}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                    <div className="invalid-feedback">
                        Selecciona una fecha de finalización válida.
                    </div>
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
                                            <input
                                                type="text"
                                                name="nombrecenso"
                                                value={editData.nombrecenso}
                                                onChange={handleEditChange}
                                                className="form-control mb-2"
                                                required
                                                minLength={3}
                                            />
                                            <input
                                                type="date"
                                                name="fechainiciocenso"
                                                value={editData.fechainiciocenso}
                                                onChange={handleEditChange}
                                                className="form-control mb-2"
                                                required
                                            />
                                            <input
                                                type="date"
                                                name="fechafincenso"
                                                value={editData.fechafincenso}
                                                onChange={handleEditChange}
                                                className="form-control mb-2"
                                                required
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
                                                onClick={() => handleDelete(censo.id)}
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
