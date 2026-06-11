import { useState, useEffect } from "react";
import ValidatedInput from "../ValidatedInput/ValidatedInput"
import ConfirmModal from "../ConfirmModal.jsx/ConfirmModal";

export default function EditableTable({ columns, data, onEdit, onDelete, onAdd }) {
    const [editingRow, setEditingRow] = useState(null);
    const [formData, setFormData] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [invalidFields, setInvalidFields] = useState([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [newRow, setNewRow] = useState({});
    const [submittedCreate, setSubmittedCreate] = useState(false);
    const [invalidCreateFields, setInvalidCreateFields] = useState([]);
    const [invalidEditFields, setInvalidEditFields] = useState([]);


    const handleNewChange = (key, value) => {
        setNewRow(prev => ({ ...prev, [key]: value }));
    };

    const saveNew = () => {
        const invalids = [];

        columns.forEach(col => {
            const value = newRow[col.key];
            if (col.rules?.required && !value) {
                invalids.push({ key: col.key, msg: `${col.label} es obligatorio` });
            }
            if (col.rules?.minLength && typeof value === "string" && value.length < col.rules.minLength) {
                invalids.push({ key: col.key, msg: `${col.label} debe tener al menos ${col.rules.minLength} caracteres` });
            }
            if (col.rules?.min && !isNaN(value) && parseInt(value) < col.rules.min) {
                invalids.push({ key: col.key, msg: `${col.label} debe ser mayor a ${col.rules.min}` });
            }
        });

        if (invalids.length > 0) {
            setInvalidCreateFields(invalids);
            return;
        }

        if (typeof onAdd === "function") {
            onAdd(newRow);
            setNewRow({});
            setInvalidCreateFields([]);
        }
    };



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

        columns.forEach(col => {
            const value = formData[col.key];
            if (col.rules?.required && !value) {
                invalids.push({ key: col.key, msg: `${col.label} es obligatorio` });
            }
            if (col.rules?.minLength && typeof value === "string" && value.length < col.rules.minLength) {
                invalids.push({ key: col.key, msg: `${col.label} debe tener al menos ${col.rules.minLength} caracteres` });
            }
            if (col.rules?.min && !isNaN(value) && parseInt(value) < col.rules.min) {
                invalids.push({ key: col.key, msg: `${col.label} debe ser mayor a ${col.rules.min}` });
            }
        });

        if (invalids.length > 0) {
            setInvalidEditFields(invalids);
            return;
        }

        onEdit(editingRow, formData);
        setEditingRow(null);
        setFormData({});
        setInvalidEditFields([]);
    };

    const filteredData = data.filter((row) =>
        columns.some(col =>
            String(row[col.key] || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
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
                <div className="d-flex flex-column gap-2">

                    {/* bloque para añadir nuevo registro en mobile */}
                    {typeof onAdd === "function" && (
                        <div className="card border-success mb-2">
                            <div className="card-body">
                                {columns.map((col) => (
                                    <div key={col.key} className="mb-2">
                                        <strong>{col.label}:</strong>
                                        {col.type === "select" ? (
                                            <select
                                                className="form-select"
                                                value={newRow[col.key] || ""}
                                                onChange={(e) => handleNewChange(col.key, e.target.value)}
                                            >
                                                <option value="">Seleccione...</option>
                                                {col.options?.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <ValidatedInput
                                                value={newRow[col.key] || ""}
                                                onChange={(val) => handleNewChange(col.key, val)}
                                                error={invalidCreateFields.find(f => f.key === col.key)?.msg}
                                            />
                                        )}
                                    </div>
                                ))}

                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={saveNew}
                                >
                                    ➕ Añadir
                                </button>
                            </div>
                        </div>
                    )}
                    {filteredData.map((row) => (
                        <div key={row.id} className="card mb-2">
                            <div className="card-body">
                                {columns.map((col) => (
                                    <div key={col.key}>
                                        <strong>{col.label}:</strong>{" "}
                                        {editingRow === row.id ? (
                                            col.type === "select" ? (
                                                <select
                                                    className="form-select"
                                                    value={formData[col.key] || ""}
                                                    onChange={(e) => handleChange(col.key, e.target.value)}
                                                >
                                                    <option value="">Seleccione...</option>
                                                    {col.options?.map(opt => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <ValidatedInput
                                                    value={formData[col.key] || ""}
                                                    onChange={(val) => handleChange(col.key, val)}
                                                    error={invalidEditFields.find(f => f.key === col.key)?.msg}
                                                />
                                            )
                                        ) : (
                                            col.render ? col.render(row) : row[col.key]
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
                    ))}
                </div>
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
                            {/* Fila para añadir nuevo registro */}
                            {typeof onAdd === "function" && (
                                <tr>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.type === "select" ? (
                                                <select
                                                    className="form-select"
                                                    value={newRow[col.key] || ""}
                                                    onChange={(e) => handleNewChange(col.key, e.target.value)}
                                                >
                                                    <option value="">Seleccione...</option>
                                                    {col.options?.map(opt => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <ValidatedInput
                                                    value={newRow[col.key] || ""}
                                                    onChange={(val) => handleNewChange(col.key, val)}
                                                    error={invalidCreateFields.find(f => f.key === col.key)?.msg}
                                                />
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={saveNew}
                                        >
                                            ➕ Añadir
                                        </button>
                                    </td>
                                </tr>
                            )}
                            {filteredData.map((row) => (
                                <tr key={row.id}>
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {editingRow === row.id ? (
                                                col.type === "select" ? (
                                                    <select
                                                        className="form-select"
                                                        value={formData[col.key] || ""}
                                                        onChange={(e) => handleChange(col.key, e.target.value)}
                                                    >
                                                        <option value="">Seleccione...</option>
                                                        {col.options?.map(opt => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <ValidatedInput
                                                        value={formData[col.key] || ""}
                                                        onChange={(val) => handleChange(col.key, val)}
                                                        error={invalidEditFields.find(f => f.key === col.key)?.msg}
                                                    />
                                                )
                                            ) : (
                                                col.render ? col.render(row) : row[col.key]
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

            <ConfirmModal
                show={!!confirmDeleteId}
                title="Confirmar eliminación"
                message="¿Seguro que quieres eliminar este registro?"
                onConfirm={() => {
                    onDelete(confirmDeleteId);
                    setConfirmDeleteId(null);
                }}
                onCancel={() => setConfirmDeleteId(null)}
            />
        </div>
    );
}
