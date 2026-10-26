import React, { useState, useEffect, useRef } from "react";
import PersonaEmpadronadoForm from "../../components/Encuestas/PersonaEmpadronadoForm";
import ConfirmModal from "../../components/ConfirmModal.jsx/ConfirmModal";
import ValidatedInput from "../../components/ValidatedInput/ValidatedInput";
import {
    getCensos,
    getDiscapacidades,
    getCarreras,
    getEventos,
    getActividadesExtraCurriculares,
    encuestasApi
} from "../../services";
import "./Encuestas.css";
const fechaActual = () => {
    return new Date().toISOString().split("T")[0];
};

const crearPersona = () => ({
    primernombre: "",
    segundonombre: "",
    primerapellido: "",
    segundoapellido: "",
    sexo: "",
    fechanacimiento: "",
    discapacidades: []
});

const crearEmpadronado = () => ({
    numerocedula: "",
    contacto: "",
    semestre: "",
    tipobeca: "",
    carreraid: "",
    carnet: "",
    eventos: [],
    actividades: []
});

const crearEncuesta = () => ({
    censoid: "",
    fechainicio: fechaActual(),
    fechafin: fechaActual(),
    respuesta: "POSITIVA"
});

const crearCasa = () => ({
    numcasa: ""
});

//* Comentario general de la encuesta: el tipo se calcula con las estrellas.*
const crearComentario = () => ({
    comentario: "",
    calificacion: 0
});

const obtenerTipoComentario = (calificacion) => {
    if (calificacion <= 2) return "queja";
    if (calificacion === 3) return "neutral";
    return "satisfacción";
};

const obtenerLista = (respuesta) => {
    const datos = respuesta?.data ?? respuesta;
    if (Array.isArray(datos)) return datos;
    if (Array.isArray(datos?.results)) return datos.results;
    return [];
};

const convertirLista = (lista, prefijo, convertir) =>
    Object.fromEntries(
        lista.map((elemento, i) => [
            `${prefijo}${i + 1}`,
            convertir(elemento)
        ])
    );

const normalizarPersona = (persona = {}) => {
    const discapacidades = Array.isArray(persona.discapacidades)
        ? persona.discapacidades
        : persona.discapacidadid != null &&
            persona.discapacidadid !== "" &&
            Number(persona.discapacidadid) !== 0
            ? [Number(persona.discapacidadid)]
            : [];
    return {
        ...crearPersona(),
        ...persona,
        discapacidades: discapacidades.map(Number)
    };
};

const normalizarEmpadronado = (empadronado = {}) => ({
    ...crearEmpadronado(),
    ...empadronado,
    eventos: Array.isArray(empadronado.eventos)
        ? empadronado.eventos
        : [],
    actividades: Array.isArray(empadronado.actividades)
        ? empadronado.actividades
        : []
});

const tieneDatos = (objeto = {}, ignorar = []) =>
    Object.entries(objeto).some(([clave, valor]) => {
        if (ignorar.includes(clave)) return false;
        if (Array.isArray(valor)) return valor.length > 0;
        return valor !== "" && valor !== null && valor !== undefined;
    });

const hasValidDraft = (draft) => {
    if (!draft || typeof draft !== "object") return false;
    return (
        tieneDatos(draft.Casa) ||
        draft.encuestainide?.censoid !== "" &&
        draft.encuestainide?.censoid != null ||
        draft.personas?.some(p =>
            tieneDatos(p, ["discapacidadid", "discapacidades"])
        ) ||
        draft.empadronados?.some(e =>
            tieneDatos(e, ["eventos", "actividades"])
        ) ||
        Boolean(draft.comentario?.comentario?.trim()) ||
        Number(draft.comentario?.calificacion) > 0
    );
};

export default function EncuestaForm() {
    const [censos, setCensos] = useState([]);
    const [discapacidades, setDiscapacidades] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [encuestainide, setEncuesta] = useState(crearEncuesta);
    const [Casa, setCasa] = useState(crearCasa);
    const [personas, setPersonas] = useState([crearPersona()]);
    const [empadronados, setEmpadronados] = useState([crearEmpadronado()]);
    const [comentario, setComentario] = useState(crearComentario);
    const [activePersonaIndex, setActivePersonaIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [successSubmit, setSuccessSubmit] = useState(false);
    const [error, setError] = useState("");
    const [errorCatalogos, setErrorCatalogos] = useState("");
    const [showDraftModal, setShowDraftModal] = useState(false);
    const [showComentarioModal, setShowComentarioModal] = useState(false);
    const [comentarioIntentado, setComentarioIntentado] = useState(false);
    const [draftData, setDraftData] = useState(null);
    const borradorRevisado = useRef(false);
    const omitirGuardado = useRef(false);
    //** Cargar los catálogos del backend**
    useEffect(() => {
        let activo = true;
        const cargarCatalogos = async () => {
            try {
                const respuestas = await Promise.all([
                    getCensos(),
                    getDiscapacidades(),
                    getCarreras(),
                    getEventos(),
                    getActividadesExtraCurriculares()
                ]);
                if (!activo) return;
                setCensos(obtenerLista(respuestas[0]));
                setDiscapacidades(obtenerLista(respuestas[1]));
                setCarreras(obtenerLista(respuestas[2]));
                setEventos(obtenerLista(respuestas[3]));
                setActividades(obtenerLista(respuestas[4]));
            } catch (err) {
                console.error("Error cargando catálogos:", err);
                if (activo) {
                    setErrorCatalogos(
                        "No se pudieron cargar todos los catálogos. Recargá la página para intentarlo nuevamente."
                    );
                }
            } finally {
                if (activo) setLoading(false);
            }
        };
        cargarCatalogos();
        return () => {
            activo = false;
        };
    }, []);
    //** Revisar si existe un borrador**
    useEffect(() => {
        try {
            const guardado = localStorage.getItem("encuestaDraft");
            if (guardado) {
                const parsed = JSON.parse(guardado);
                if (hasValidDraft(parsed)) {
                    setDraftData(parsed);
                    setShowDraftModal(true);
                } else {
                    localStorage.removeItem("encuestaDraft");
                }
            }
        } catch (err) {
            console.error("Error leyendo borrador:", err);
            localStorage.removeItem("encuestaDraft");
        } finally {
            borradorRevisado.current = true;
        }
    }, []);
    //** Guardado automático del borrador**
    useEffect(() => {
        if (loading || !borradorRevisado.current || showDraftModal) return;
        if (omitirGuardado.current) {
            omitirGuardado.current = false;
            return;
        }
        const data = {
            Casa,
            encuestainide,
            personas,
            empadronados,
            comentario,
            activePersonaIndex
        };
        try {
            if (hasValidDraft(data)) {
                localStorage.setItem("encuestaDraft", JSON.stringify(data));
            } else {
                localStorage.removeItem("encuestaDraft");
            }
        } catch (err) {
            console.error("Error guardando borrador:", err);
        }
    }, [
        Casa,
        encuestainide,
        personas,
        empadronados,
        comentario,
        activePersonaIndex,
        loading,
        showDraftModal
    ]);
    useEffect(() => {
        if (!successSubmit) return;
        const timer = setTimeout(() => setSuccessSubmit(false), 3000);
        return () => clearTimeout(timer);
    }, [successSubmit]);
    const handleUseDraft = () => {
        if (draftData) {
            setCasa({ ...crearCasa(), ...draftData.Casa });
            setComentario({ ...crearComentario(), ...draftData.comentario });
            setEncuesta({
                ...crearEncuesta(),
                ...draftData.encuestainide,
                respuesta: "POSITIVA"
            });
            const personasGuardadas = Array.isArray(draftData.personas)
                ? draftData.personas.map(normalizarPersona)
                : [];
            const empadronadosGuardados = Array.isArray(draftData.empadronados)
                ? draftData.empadronados.map(normalizarEmpadronado)
                : [];
            setPersonas(
                personasGuardadas.length
                    ? personasGuardadas
                    : [crearPersona()]
            );
            setEmpadronados(
                personasGuardadas.length
                    ? personasGuardadas.map(
                        (_, i) => empadronadosGuardados[i] || crearEmpadronado()
                    )
                    : [crearEmpadronado()]
            );
            setActivePersonaIndex(
                Math.min(
                    Math.max(0, Number(draftData.activePersonaIndex) || 0),
                    Math.max(0, personasGuardadas.length - 1)
                )
            );
        }
        setShowDraftModal(false);
        setDraftData(null);
    };
    const handleDiscardDraft = () => {
        localStorage.removeItem("encuestaDraft");
        setShowDraftModal(false);
        setDraftData(null);
    };
    const handleReset = () => {
        omitirGuardado.current = true;
        setSubmitted(false);
        setError("");
        setEncuesta(crearEncuesta());
        setCasa(crearCasa());
        setPersonas([crearPersona()]);
        setEmpadronados([crearEmpadronado()]);
        setComentario(crearComentario());
        setShowComentarioModal(false);
        setComentarioIntentado(false);
        setActivePersonaIndex(0);
        localStorage.removeItem("encuestaDraft");
    };
    const addPersona = () => {
        setPersonas(prev => [...prev, crearPersona()]);
        setEmpadronados(prev => [...prev, crearEmpadronado()]);
        setActivePersonaIndex(personas.length);
        setSubmitted(false);
        setError("");
    };
    const removePersona = (index) => {
        if (personas.length <= 1) return;
        setPersonas(prev => prev.filter((_, i) => i !== index));
        setEmpadronados(prev => prev.filter((_, i) => i !== index));
        setActivePersonaIndex(prev =>
            prev > index ? prev - 1 : Math.min(prev, personas.length - 2)
        );
    };
    const onChangePersona = (index, nuevaPersona) => {
        setPersonas(prev =>
            prev.map((persona, i) => i === index ? nuevaPersona : persona)
        );
    };
    const onChangeEmpadronado = (index, nuevoEmpadronado) => {
        setEmpadronados(prev =>
            prev.map((empadronado, i) =>
                i === index ? nuevoEmpadronado : empadronado
            )
        );
    };
    const validateCasa = () =>
        /^\d+$/.test(String(Casa.numcasa).trim()) &&
        Number(Casa.numcasa) > 0;
    const validatePersonas = () => {
        if (
            personas.length === 0 ||
            personas.length !== empadronados.length
        ) {
            return false;
        }
        return personas.every((p, i) => {
            const e = empadronados[i];
            if (!p || !e) return false;
            const datosPersonaValidos =
                p.primernombre?.trim().length >= 3 &&
                p.primerapellido?.trim().length >= 3 &&
                ["M", "F"].includes(p.sexo) &&
                Boolean(p.fechanacimiento) &&
                p.fechanacimiento <= fechaActual();
            const datosEmpadronadoValidos =
                /^[A-Za-z0-9]{14}$/.test(e.numerocedula || "") &&
                /^\d{8}$/.test(e.contacto || "") &&
                Number.isInteger(Number(e.semestre)) &&
                Number(e.semestre) >= 1 &&
                Number(e.semestre) <= 12 &&
                Boolean(e.tipobeca) &&
                e.carreraid !== "" &&
                e.carreraid !== null &&
                e.carreraid !== undefined &&
                /^\d{8}$/.test(e.carnet || "");
            //** Eventos opcionales, pero con posición si se seleccionan**
            const eventosValidos = (e.eventos || []).every(
                evento =>
                    evento.id !== "" &&
                    evento.id !== null &&
                    evento.id !== undefined &&
                    typeof evento.posicion === "string" &&
                    evento.posicion.trim().length > 0
            );
            return (
                datosPersonaValidos &&
                datosEmpadronadoValidos &&
                eventosValidos
            );
        });
    };
    const construirPayload = () => {
        const personasFinales = convertirLista(
            personas,
            "persona",
            p => {
                const {
                    discapacidadid,
                    discapacidades: seleccionadas,
                    ...datosPersona
                } = p;
                const ids = Array.isArray(seleccionadas)
                    ? seleccionadas
                        .map(Number)
                        .filter(id => Number.isFinite(id) && id !== 0)
                    : [];
                return {
                    ...datosPersona,
                    ...(ids.length > 0 && {
                        discapacidades: convertirLista(
                            ids,
                            "discapacidad",
                            id => id
                        )
                    })
                };
            }
        );
        const empadronadosFinales = convertirLista(
            empadronados,
            "empadronado",
            e => {
                const {
                    eventos: eventosSeleccionados = [],
                    actividades: actividadesSeleccionadas = [],
                    ...datosEmpadronado
                } = e;
                return {
                    ...datosEmpadronado,
                    semestre: Number(e.semestre),
                    carreraid: Number(e.carreraid),
                    ...(eventosSeleccionados.length > 0 && {
                        eventos: convertirLista(
                            eventosSeleccionados,
                            "evento",
                            evento => ({
                                id: Number(evento.id),
                                posicion: evento.posicion.trim()
                            })
                        )
                    }),
                    ...(actividadesSeleccionadas.length > 0 && {
                        actividades: convertirLista(
                            actividadesSeleccionadas,
                            "actividad",
                            id => Number(id)
                        )
                    })
                };
            }
        );
        return {
            Casa: {
                numcasa: Number(Casa.numcasa),
                serviciodeagua: 1,
                serviciodeenergia: 1,
                infraestructuraid: 1
            },
            encuestarecidente: {
                respuesta: "POSITIVA",
                censoid: Number(encuestainide.censoid),
                fechainicio: fechaActual(),
                fechafin: fechaActual()
            },
            personas: personasFinales,
            empadronados: empadronadosFinales,
            comentario: {
                comentario: comentario.comentario.trim(),
                fecha: fechaActual(),
                calificacion: Number(comentario.calificacion),
                tipo: obtenerTipoComentario(Number(comentario.calificacion))
            }
        };
    };
    const handleSubmit = async () => {
        if (loadingSubmit) return;
        setSubmitted(true);
        setError("");
        if (
            encuestainide.censoid === "" ||
            encuestainide.censoid === null ||
            encuestainide.censoid === undefined
        ) {
            setError("Seleccioná el censo de la encuesta.");
            return;
        }
        if (!validateCasa()) {
            setError("Ingresá un número de casa válido.");
            return;
        }
        if (!validatePersonas()) {
            const primerInvalido = personas.findIndex((p, i) => {
                const e = empadronados[i];
                if (!p || !e) return true;
                return (
                    p.primernombre?.trim().length < 3 ||
                    p.primerapellido?.trim().length < 3 ||
                    !p.sexo ||
                    !p.fechanacimiento ||
                    !/^[A-Za-z0-9]{14}$/.test(e.numerocedula || "") ||
                    !/^\d{8}$/.test(e.contacto || "") ||
                    !e.semestre ||
                    !e.tipobeca ||
                    e.carreraid === "" ||
                    e.carreraid == null ||
                    !/^\d{8}$/.test(e.carnet || "") ||
                    (e.eventos || []).some(ev => !ev.posicion?.trim())
                );
            });
            if (primerInvalido >= 0) {
                setActivePersonaIndex(primerInvalido);
            }
            setError(
                "Revisá los datos obligatorios de los estudiantes. Si seleccionaste eventos, ingresá también sus posiciones."
            );
            return;
        }
        setComentarioIntentado(false);
        setShowComentarioModal(true);
    };
    const confirmarEnvio = async () => {
        if (loadingSubmit) return;
        setComentarioIntentado(true);
        if (!Number.isInteger(Number(comentario.calificacion)) ||
            Number(comentario.calificacion) < 1 ||
            Number(comentario.calificacion) > 5) return;
        setShowComentarioModal(false);
        setLoadingSubmit(true);
        try {
            const payload = construirPayload();
            console.log("Payload a enviar:", payload);
            await encuestasApi.create(payload);
            handleReset();
            setSuccessSubmit(true);
        } catch (err) {
            console.error("Error enviando encuesta:", err);
            setError(
                "No se pudo guardar la encuesta. Revisá los datos e intentá nuevamente."
            );
        } finally {
            setLoadingSubmit(false);
        }
    };
    if (loading) {
        return (
            <div className="p-4 text-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando datos de la encuesta...</p>
            </div>
        );
    }
    return (
        <div>
            <h2 className="mt-2 mb-4 fw-bold">📋 Nueva Encuesta</h2>
            {errorCatalogos && (
                <div className="alert alert-warning" role="alert">
                    {errorCatalogos}
                </div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                </div>
            )}
            <h4 className="mt-2 mb-4 fw-bold">Datos de la Encuesta</h4>
            <div className="mb-3">
                <label className="form-label">Censo de la encuesta</label>
                <select
                    className={`form-select ${submitted &&
                            (encuestainide.censoid === "" ||
                                encuestainide.censoid == null)
                            ? "is-invalid"
                            : ""
                        }`}
                    value={encuestainide.censoid}
                    onChange={e =>
                        setEncuesta(prev => ({
                            ...prev,
                            censoid: e.target.value
                        }))
                    }
                >
                    <option value="">Seleccione...</option>
                    {censos.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.nombrecenso}
                        </option>
                    ))}
                </select>
                {submitted &&
                    (encuestainide.censoid === "" ||
                        encuestainide.censoid == null) && (
                        <div className="invalid-feedback d-block">
                            Debe seleccionar un censo.
                        </div>
                    )}
            </div>
            <div className="mb-4">
                <h4 className="mt-2 mb-4 fw-bold">Datos de la Casa</h4>
                <div className="mb-2">
                    <label className="form-label">Número de Casa</label>
                    <ValidatedInput
                        value={Casa.numcasa}
                        onChange={val =>
                            setCasa(prev => ({
                                ...prev,
                                numcasa: val
                            }))
                        }
                        error={
                            submitted && !validateCasa()
                                ? "Ingrese un número de casa válido."
                                : ""
                        }
                    />
                </div>
            </div>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-4 mb-3">
                <h4 className="fw-bold mb-0">Estudiantes</h4>
                <span className="badge bg-light text-dark border">
                    Total: {personas.length}
                </span>
            </div>
            <div className="mb-3 d-flex flex-wrap gap-2">
                {personas.map((_, i) => (
                    <div
                        key={i}
                        className={`nav-item d-flex align-items-center px-2 py-1 border rounded ${activePersonaIndex === i
                                ? "bg-primary text-white"
                                : "bg-light"
                            }`}
                    >
                        <button
                            type="button"
                            className="btn btn-link p-0 me-2 text-decoration-none"
                            style={{
                                color:
                                    activePersonaIndex === i
                                        ? "white"
                                        : "black"
                            }}
                            onClick={() => setActivePersonaIndex(i)}
                        >
                            Estudiante {i + 1}
                        </button>
                        {personas.length > 1 && (
                            <button
                                type="button"
                                className="btn-close btn-sm"
                                aria-label={`Eliminar estudiante ${i + 1}`}
                                style={{
                                    filter:
                                        activePersonaIndex === i
                                            ? "invert(1)"
                                            : "none"
                                }}
                                onClick={() => removePersona(i)}
                            />
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={addPersona}
                >
                    <i className="bi bi-plus-lg me-1"></i>
                    Añadir Estudiante
                </button>
            </div>
            {personas[activePersonaIndex] &&
                empadronados[activePersonaIndex] && (
                    <PersonaEmpadronadoForm
                        index={activePersonaIndex}
                        persona={personas[activePersonaIndex]}
                        empadronado={empadronados[activePersonaIndex]}
                        discapacidades={discapacidades}
                        carreras={carreras}
                        eventos={eventos}
                        actividades={actividades}
                        submitted={submitted}
                        onChangePersona={onChangePersona}
                        onChangeEmpadronado={onChangeEmpadronado}
                    />
                )}
            <button
                type="button"
                className="btn btn-brand mt-4"
                onClick={handleSubmit}
                disabled={loadingSubmit || Boolean(errorCatalogos)}
            >
                {loadingSubmit ? (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                        ></span>
                        Enviando...
                    </>
                ) : (
                    "Enviar Encuesta"
                )}
            </button>
            {showComentarioModal && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog"
                    aria-modal="true" aria-labelledby="tituloComentario"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="tituloComentario">Calificá la encuesta</h5>
                                <button type="button" className="btn-close" aria-label="Cerrar"
                                    onClick={() => setShowComentarioModal(false)} />
                            </div>
                            <div className="modal-body">
                                <p className="text-muted small">
                                    Antes de finalizar, seleccioná una calificación. El comentario es opcional.
                                </p>
                                <label className="form-label">Calificación (obligatoria)</label>
                                <div className="d-flex gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map(estrella => (
                                        <button key={estrella} type="button" className="btn p-0 border-0"
                                            onClick={() => setComentario(prev => ({ ...prev, calificacion: estrella }))}
                                            aria-label={`Calificar con ${estrella} estrellas`}
                                            aria-pressed={estrella === comentario.calificacion}>
                                            <i className={`bi ${estrella <= comentario.calificacion ? "bi-star-fill" : "bi-star"}`}
                                                style={{ fontSize: "1.8rem", color: "#ffc107" }} />
                                        </button>
                                    ))}
                                </div>
                                {comentarioIntentado && comentario.calificacion === 0 && (
                                    <div className="text-danger small mb-2">Seleccioná una calificación de 1 a 5 estrellas.</div>
                                )}
                                <label className="form-label mt-2">Comentario (opcional)</label>
                                <textarea className="form-control" rows={3}
                                    placeholder="Escribí tu opinión si lo deseás..."
                                    value={comentario.comentario}
                                    onChange={e => setComentario(prev => ({ ...prev, comentario: e.target.value }))} />
                                <small className="text-muted">Podés dejar este campo vacío.</small>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary"
                                    onClick={() => setShowComentarioModal(false)}>Cancelar</button>
                                <button type="button" className="btn btn-brand" disabled={loadingSubmit}
                                    onClick={confirmarEnvio}>
                                    {loadingSubmit ? "Enviando..." : "Confirmar y enviar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showDraftModal && (
                <ConfirmModal
                    show={showDraftModal}
                    title="Continuar borrador"
                    message="Se encontró un borrador guardado. ¿Quieres continuar con ese o empezar una nueva encuesta?"
                    onConfirm={handleUseDraft}
                    onCancel={handleDiscardDraft}
                />
            )}
            {loadingSubmit && (
                <div className="overlay-loading">
                    <div
                        className="spinner-border text-light"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Enviando encuesta...
                        </span>
                    </div>
                    <p className="text-light mt-2">
                        Enviando encuesta...
                    </p>
                </div>
            )}
            {successSubmit && (
                <div className="overlay-success">
                    <div className="alert alert-success text-center">
                        Encuesta añadida con éxito ✅
                    </div>
                </div>
            )}
        </div>
    );
}
