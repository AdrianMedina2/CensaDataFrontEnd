import { useState, useEffect } from "react";

function ValidatedInput({ value, onChange, rules, fieldName }) {
    const [error, setError] = useState("");

    const handleBlur = () => {
        if (rules.required && !value) {
            setError(`${fieldName} es obligatorio`);
        } else if (rules.minLength && value.length < rules.minLength) {
            setError(`${fieldName} debe tener al menos ${rules.minLength} caracteres`);
        } else if (rules.min && parseInt(value) < rules.min) {
            setError(`${fieldName} debe ser mayor a ${rules.min}`);
        } else {
            setError("");
        }
    };

    return (
        <div>
            <input
                className={`form-control form-control-sm ${error ? "is-invalid" : ""}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={handleBlur}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}

export default function EditableTable({ columns, data, onEdit, onDelete }) {
    const [editingRow, setEditingRow] = useState(null);
    const [formData, setFormData] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [invalidFields, setInvalidFields] = useState([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const startEdit = (row) => {
        setEditingRow(row.id);
        setFormData(row);
    };

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const saveEdit = () => {
        const invalids = [];

        if (!formData.primernombre || formData.primernombre.trim().length < 3) {
            invalids.push("primernombre");
        }
        if (!formData.primerapellido || formData.primerapellido.trim().length < 3) {
            invalids.push("primerapellido");
        }
        if (!formData.edad || parseInt(formData.edad) <= 0) {
            invalids.push("edad");
        }

        if (invalids.length > 0) {
            setInvalidFields(invalids);
            return;
        }

        onEdit(editingRow, formData);
        setEditingRow(null);
        setFormData({});
        setInvalidFields([]);
    };

    const filteredData = data.filter((row) =>
        `${row.primernombre} ${row.primerapellido}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredData.length === 0 ? (
                <div className="alert alert-warning text-center">
                    No se encontraron coincidencias.
                </div>
            ) : isMobile ? (
                filteredData.map((row) => (
                    <div key={row.id} className="card mb-2">
                        <div className="card-body">
                            {columns.map((col) => (
                                <div key={col.key}>
                                    <strong>{col.label}:</strong>{" "}
                                    {editingRow === row.id ? (
                                        <ValidatedInput
                                            value={formData[col.key] || ""}
                                            onChange={(val) => handleChange(col.key, val)}
                                            rules={
                                                col.key === "edad"
                                                    ? { required: true, min: 1 }
                                                    : { required: true, minLength: 3 }
                                            }
                                            fieldName={col.label}
                                        />
                                    ) : (
                                        row[col.key]
                                    )}
                                </div>
                            ))}
                            {editingRow === row.id ? (
                                <>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={saveEdit}
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setEditingRow(null)}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => startEdit(row)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => setConfirmDeleteId(row.id)}
                                    >
                                        Eliminar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key}>{col.label}</th>
                                ))}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row) => (
                                <tr key={row.id}>
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {editingRow === row.id ? (
                                                <ValidatedInput
                                                    value={formData[col.key] || ""}
                                                    onChange={(val) => handleChange(col.key, val)}
                                                    rules={
                                                        col.key === "edad"
                                                            ? { required: true, min: 1 }
                                                            : { required: true, minLength: 3 }
                                                    }
                                                    fieldName={col.label}
                                                />
                                            ) : (
                                                row[col.key]
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        {editingRow === row.id ? (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-primary me-2"
                                                    onClick={saveEdit}
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => setEditingRow(null)}
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => startEdit(row)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => setConfirmDeleteId(row.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {confirmDeleteId && (
                <div className="modal show d-block fade-in fast" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar eliminación</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setConfirmDeleteId(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Seguro que quieres eliminar este registro?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setConfirmDeleteId(null)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        onDelete(confirmDeleteId);
                                        setConfirmDeleteId(null);
                                    }}
                                >
                                    Sí, eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}
