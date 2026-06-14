import { useEffect, useState } from "react";
import {
    getInvestigadores,
    patchInvestigador,
    deleteInvestigador,
    createInvestigador,
    createCuenta,
    getAdministradores,
    getCuentas
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function Investigadores() {
    const [investigadores, setInvestigadores] = useState([]);
    const [administradores, setAdministradores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [shakeFields, setShakeFields] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        usuario: "",
        correo: "",
        password: "",
        primernombre: "",
        primerapellido: "",
        edad: "",
        sexo: "",
        administradorid: ""
    });

    useEffect(() => {
        Promise.all([getInvestigadores(), getAdministradores()])
            .then(([investigadoresRes, administradoresRes]) => {
                console.log("Investigadores cargados:", investigadoresRes);
                setInvestigadores(Array.isArray(investigadoresRes.data) ? investigadoresRes.data : []);
                setAdministradores(Array.isArray(administradoresRes.data) ? administradoresRes.data : []);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "primernombre", label: "Nombre", rules: { required: true, minLength: 3 } },
        { key: "primerapellido", label: "Apellido", rules: { required: true, minLength: 3 } },
        { key: "edad", label: "Edad", rules: { required: true, min: 1 } },
        { key: "sexo", label: "Sexo", rules: { required: true } },
        {
            key: "administradorid",
            label: "Administrador a cargo",
            type: "select",
            options: administradores.map(a => ({
                value: a.id,
                label: `${a.primernombre} ${a.primerapellido}`
            })),
            rules: { required: true },
            render: (row) => {
                const admin = administradores.find(a => a.id === row.administradorid);
                return admin ? `${admin.primernombre} ${admin.primerapellido}` : "Sin asignar";
            }
        }
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchInvestigador(id, data)
            .then(() => getInvestigadores().then(res =>
                setInvestigadores(Array.isArray(res.data) ? res.data : [])
            ))
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Investigador editado correctamente ✅", type: "success" });
            });
    };


    const handleDelete = (id) => {
        setProcessing(true);
        deleteInvestigador(id)
            .then(() => getInvestigadores().then(res =>
                setInvestigadores(Array.isArray(res.data) ? res.data : [])
            ))
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Investigador eliminado correctamente 🗑️", type: "warning" });
            });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setValidated(true);

        const invalids = [];
        if (formData.usuario.length < 3) invalids.push("usuario");
        if (!formData.correo.includes("@")) invalids.push("correo");
        if (formData.password.length < 8) invalids.push("password");
        if (formData.primernombre.length < 3) invalids.push("primernombre");
        if (formData.primerapellido.length < 3) invalids.push("primerapellido");
        if (parseInt(formData.edad) <= 0) invalids.push("edad");
        if (!formData.administradorid) invalids.push("administradorid");
        if (!formData.sexo) invalids.push("sexo");

        if (invalids.length > 0) {
            setShakeFields(invalids);
            setTimeout(() => setShakeFields([]), 500);
            return;
        }

        setProcessing(true);
        try {
            setShowModal(false);

            const cuentaRes = await createCuenta({
                usuario: formData.usuario,
                password: formData.password,
                Role: "INVESTIGADOR",
                Correo: formData.correo,
            });

            console.log("Respuesta createCuenta:", cuentaRes);

            const cuentasRes = await getCuentas();
            const cuentas = Array.isArray(cuentasRes.data) ? cuentasRes.data : [];

            // localizar por correo (más seguro que por usuario)
            const cuenta = cuentas.find(c => c.Correo === formData.correo);

            if (!cuenta) {
                throw new Error("No se encontró la cuenta recién creada");
            }

            const nuevo = {
                primernombre: formData.primernombre,
                primerapellido: formData.primerapellido,
                edad: parseInt(formData.edad),
                sexo: formData.sexo,
                estado: true,
                cuentaid: cuenta.id,
                administradorid: parseInt(formData.administradorid),
            };

            await createInvestigador(nuevo);

            getInvestigadores().then(res =>
                setInvestigadores(Array.isArray(res.data) ? res.data : [])
            );
            setMessage({ text: "Investigador creado correctamente ➕", type: "success" });

            setValidated(false);
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.Correo) {
                    setMessage({ text: data.Correo[0], type: "error" });
                } else if (data.usuario) {
                    setMessage({ text: data.usuario[0], type: "error" });
                } else {
                    setMessage({ text: "Error al crear investigador ❌", type: "error" });
                }
            } else {
                console.error(err);
                setMessage({ text: "Error desconocido ❌", type: "error" });
            }
        } finally {
            setProcessing(false);
            setValidated(false);
            setFormData({
                usuario: "",
                correo: "",
                password: "",
                primernombre: "",
                primerapellido: "",
                edad: "",
                sexo: "",
                administradorid: ""
            });
        }
    };

    // Mapear investigadores con nombre del administrador
    const investigadoresConAdmin = Array.isArray(investigadores)
        ? investigadores
            .sort((a, b) => b.id - a.id)
            .map(inv => {
                const admin = administradores.find(a => a.id === inv.administradorid);
                return {
                    ...inv,
                    administradorNombre: admin
                        ? `${admin.primernombre} ${admin.primerapellido}`
                        : "Sin asignar"
                };
            })
        : [];

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="fw-bold mt-2 mb-4">👤 Gestionar investigadores</h2>
            <button
                className="btn btn-brand mb-3"
                onClick={() => {
                    if (!processing) {
                        setValidated(false); // reinicia validación
                        setFormData({
                            usuario: "",
                            correo: "",
                            password: "",
                            primernombre: "",
                            primerapellido: "",
                            edad: "",
                            sexo: "",
                            administradorid: ""
                        });
                        setShowModal(true);
                    }
                }}
                disabled={processing} //bloquea el botón
            >
                <i className="bi bi-person-plus me-2"></i> Registrar nuevo investigador
            </button>

            <EditableTable
                columns={columns}
                data={investigadoresConAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Mensaje de acción en curso */}
            {processing && (
                <ToastMessage
                    message="Procesando acción, por favor espera…"
                    type="warning"
                    autohide={false}
                    onClose={() => setProcessing(false)}
                />
            )}

            {/* Mensaje de resultado */}
            {message && (
                <ToastMessage
                    message={
                        <div className="d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            Procesando acción, por favor espera…
                        </div>}
                    type={message.type}
                    autohide={true}
                    delay={3000}
                    onClose={() => setMessage(null)}
                />
            )}

            {/* Modal Bootstrap con validaciones */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0">
                            <form onSubmit={handleAdd} noValidate>
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">
                                        <i className="bi bi-person-plus me-2"></i> Nuevo Investigador
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        {/* Usuario */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Usuario</label>
                                            <input
                                                type="text"
                                                name="usuario"
                                                value={formData.usuario}
                                                onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                                                className={`form-control ${validated && formData.usuario.length < 3 ? "is-invalid" : ""} ${shakeFields.includes("usuario") ? "shake" : ""}`}
                                                required
                                            />
                                            <div className="invalid-feedback">El usuario debe tener al menos 3 caracteres.</div>
                                        </div>

                                        {/* Correo */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Correo</label>
                                            <input
                                                type="email"
                                                name="correo"
                                                value={formData.correo}
                                                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                                                className={`form-control ${validated && !formData.correo.includes("@") ? "is-invalid" : ""} ${shakeFields.includes("correo") ? "shake" : ""}`}
                                                required
                                            />
                                            <div className="invalid-feedback">Ingresa un correo válido.</div>
                                        </div>

                                        {/* Contraseña */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Contraseña</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className={`form-control ${validated && formData.password.length < 8 ? "is-invalid" : ""} ${shakeFields.includes("password") ? "shake" : ""}`}
                                                required
                                            />
                                            <div className="invalid-feedback">La contraseña debe tener al menos 8 caracteres.</div>
                                        </div>

                                        {/* Nombres */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Primer Nombre</label>
                                            <input
                                                type="text"
                                                name="primernombre"
                                                value={formData.primernombre}
                                                onChange={(e) => setFormData({ ...formData, primernombre: e.target.value })}
                                                className={`form-control ${validated && formData.primernombre.length < 3 ? "is-invalid" : ""} ${shakeFields.includes("primernombre") ? "shake" : ""}`}
                                                required
                                            />
                                            <div className="invalid-feedback">El nombre debe tener al menos 3 caracteres.</div>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Segundo Nombre (opcional)</label>
                                            <input
                                                type="text"
                                                name="segundonombre"
                                                value={formData.segundonombre || ""}
                                                onChange={(e) => setFormData({ ...formData, segundonombre: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>

                                        {/* Apellidos */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Primer Apellido</label>
                                            <input
                                                type="text"
                                                name="primerapellido"
                                                value={formData.primerapellido}
                                                onChange={(e) => setFormData({ ...formData, primerapellido: e.target.value })}
                                                className={`form-control ${validated && formData.primerapellido.length < 3 ? "is-invalid" : ""} ${shakeFields.includes("primerapellido") ? "shake" : ""}`}
                                                required
                                            />
                                            <div className="invalid-feedback">El apellido debe tener al menos 3 caracteres.</div>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Segundo Apellido (opcional)</label>
                                            <input
                                                type="text"
                                                name="segundoapellido"
                                                value={formData.segundoapellido || ""}
                                                onChange={(e) => setFormData({ ...formData, segundoapellido: e.target.value })}
                                                className="form-control"
                                            />
                                        </div>

                                        {/* Edad */}
                                        <div className="col-md-3">
                                            <label className="form-label fw-bold">Edad</label>
                                            <input
                                                type="number"
                                                name="edad"
                                                value={formData.edad}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, edad: e.target.value })
                                                }
                                                className={`form-control ${validated && (!formData.edad || parseInt(formData.edad) <= 0)
                                                    ? "is-invalid"
                                                    : ""
                                                    } ${shakeFields.includes("edad") ? "shake" : ""}`}
                                                min="1"   // evita que el usuario pueda escribir 0 o negativos
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                La edad debe ser mayor a 0.
                                            </div>
                                        </div>

                                        {/* Sexo */}
                                        <div className="col-md-3">
                                            <label className="form-label fw-bold">Sexo</label>
                                            <select
                                                name="sexo"
                                                value={formData.sexo}
                                                onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                                                className={`form-select ${validated && !formData.sexo ? "is-invalid" : ""} ${shakeFields.includes("sexo") ? "shake" : ""}`}
                                                required
                                            >
                                                <option value="">Seleccione sexo</option>
                                                <option value="M">Masculino</option>
                                                <option value="F">Femenino</option>
                                            </select>
                                            <div className="invalid-feedback">Debe seleccionar un sexo.</div>
                                        </div>

                                        {/* Administrador a cargo */}
                                        <div className="col-md-12">
                                            <label className="form-label fw-bold">Administrador a cargo</label>
                                            <select
                                                name="administradorid"
                                                value={formData.administradorid || ""}
                                                onChange={(e) => setFormData({ ...formData, administradorid: parseInt(e.target.value) })}
                                                className={`form-select ${validated && !formData.administradorid ? "is-invalid" : ""} ${shakeFields.includes("administradorid") ? "shake" : ""}`}
                                                required
                                            >
                                                <option value="">Seleccione administrador</option>
                                                {administradores.map(admin => (
                                                    <option key={admin.id} value={admin.id}>
                                                        {admin.primernombre} {admin.primerapellido}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">Debe seleccionar un administrador.</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-success hover-lift">
                                        <i className="bi bi-check-circle me-1"></i> Guardar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary hover-lift"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <i className="bi bi-x-circle me-1"></i> Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
