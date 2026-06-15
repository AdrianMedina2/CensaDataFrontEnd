import React, { useState, useEffect } from "react";
import PersonaEmpadronadoForm from "../../components/Encuestas/PersonaEmpadronadoForm";
import CasaForm from "../../components/Encuestas/CasaForm";
import ConfirmModal from "../../components/ConfirmModal.jsx/ConfirmModal";
import "./Encuestas.css";
import {
    getCensos,
    getBarrios,
    getMaterialesConstrucciones,
    getTiposDeTechos,
    getTiposDePisos,
    encuestasApi,
    getEstadosCiviles,
    getNivelesEducativos,
    getEmpleos,
    getRelacionesParentescos,
    getInfraestructuras,
    createTipoDePiso,
    createTipoDeTecho,
    createMaterialConstruccion,
    createInfraestructura,
} from "../../services";

const hasValidDraft = (draft) => {
    const isEmptyCasa = !draft.Casa || Object.values(draft.Casa).every(v => v === "" || v === null);
    const isDefaultEncuesta = draft.encuestainide?.respuesta === "POSITIVA" && !draft.encuestainide?.censoid;

    const hasPersonas = draft.personas?.some(p =>
        Object.values(p).some(v => v !== "" && v !== null)
    );

    const hasEmpadronados = draft.empadronados?.some(e =>
        Object.values(e).some(v => v !== "" && v !== null && v !== 0)
    );

    return (!isEmptyCasa || hasPersonas || hasEmpadronados || (!!draft.encuestainide?.censoid));
};



export default function EncuestaForm() {
    const [censos, setCensos] = useState([]);
    const [barrios, setBarrios] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [techos, setTechos] = useState([]);
    const [pisos, setPisos] = useState([]);
    const [infraestructuras, setInfraestructuras] = useState([]);
    const [relaciones, setRelaciones] = useState([]);
    const [estadosCiviles, setEstadosCiviles] = useState([]);
    const [nivelesEducativos, setNivelesEducativos] = useState([]);
    const [empleos, setEmpleos] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDraftModal, setShowDraftModal] = useState(false);
    const [draftData, setDraftData] = useState(null);
    const hoy = new Date().toISOString().split("T")[0];
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [successSubmit, setSuccessSubmit] = useState(false);

    const [encuestainide, setEncuesta] = useState({
        censoid: "",
        fechainicio: hoy,
        fechafin: hoy,
        respuesta: "POSITIVA",
    });

    const [Casa, setCasa] = useState({
        numcasa: "",
        materialcontruccionid: "",
        tipodetechoid: "",
        tipodepisoid: "",
        barrioid: "",
        serviciodeagua: "",
        serviciodeenergia: "",
    });

    // Formas vacías por defecto para evitar undefined
    const emptyPersona = {
        primernombre: "",
        segundonombre: "",
        primerapellido: "",
        segundoapellido: "",
        sexo: "",
        fechanacimiento: "",
    };

    const emptyEmpadronado = {
        relacionid: "",
        estadocivilid: "",
        empleoid: "",
        niveleducativoid: "",
        numerocedula: "",
        ingresopersonal: 0,
    };

    const [personas, setPersonas] = useState([{ ...emptyPersona }]);
    const [empadronados, setEmpadronados] = useState([{ ...emptyEmpadronado }]);
    const [activePersonaIndex, setActivePersonaIndex] = useState(0);

    useEffect(() => {
        if (successSubmit) {
            const timer = setTimeout(() => setSuccessSubmit(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [successSubmit]);

    // 1. Cargar el draft al montar
    useEffect(() => {
        const saved = localStorage.getItem("encuestaDraft");
        if (saved) {
            const parsed = JSON.parse(saved);

            if (hasValidDraft(parsed)) {
                setDraftData(parsed);
                setShowDraftModal(true);
            } else {
                localStorage.removeItem("encuestaDraft"); // limpiar basura vacía
            }
        }

        Promise.all([
            getCensos(),
            getBarrios(),
            getMaterialesConstrucciones(),
            getTiposDeTechos(),
            getTiposDePisos(),
            getRelacionesParentescos(),
            getEstadosCiviles(),
            getNivelesEducativos(),
            getEmpleos(),
            getInfraestructuras(),
        ])
            .then(([censosRes, barriosRes, materialesRes, techosRes, pisosRes, relacionesRes, estadosRes, nivelesRes, empleosRes, infraRes]) => {
                setCensos(censosRes.data);
                setMateriales(materialesRes.data ?? []);
                setTechos(techosRes.data ?? []);
                setPisos(pisosRes ?? []);
                setBarrios(barriosRes.data ?? []);
                setRelaciones(relacionesRes.data);
                setEstadosCiviles(estadosRes.data);
                setNivelesEducativos(nivelesRes.data);
                setEmpleos(empleosRes.data);
                setInfraestructuras(infraRes);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando datos:", err);
                setLoading(false);
            });
    }, []);

    // 2. Guardar cada vez que cambien los estados (solo si ya cargó)
    useEffect(() => {
        if (loading) return; // evita sobrescribir con vacío mientras carga

        const data = {
            Casa,
            encuestainide,
            personas,
            empadronados,
            activePersonaIndex
        };

        if (hasValidDraft(data)) {
            localStorage.setItem("encuestaDraft", JSON.stringify(data));
        } else {
            localStorage.removeItem("encuestaDraft"); // limpiar si está vacío
        }
    }, [Casa, encuestainide, personas, empadronados, activePersonaIndex, loading]);

    const handleUseDraft = () => {
        if (draftData) {
            setCasa(draftData.Casa || Casa);
            setEncuesta(draftData.encuestainide || encuestainide);
            setPersonas(draftData.personas || personas);
            setEmpadronados(draftData.empadronados || empadronados);
            setActivePersonaIndex(draftData.activePersonaIndex || 0);
        }
        setShowDraftModal(false);
    };

    const handleDiscardDraft = () => {
        localStorage.removeItem("encuestaDraft");
        setShowDraftModal(false);
    };

    const handleReset = () => {
        setSubmitted(false);

        setEncuesta({
            censoid: "",
            fechainicio: hoy,
            fechafin: hoy,
            respuesta: "POSITIVA",
        });

        setCasa({
            numcasa: "",
            materialcontruccionid: "",
            tipodetechoid: "",
            tipodepisoid: "",
            barrioid: "",
            serviciodeagua: "",
            serviciodeenergia: "",
        });

        setPersonas([{ ...emptyPersona }]);
        setEmpadronados([{ ...emptyEmpadronado }]);
        setActivePersonaIndex(0);
    };

    const addPersona = () => {
        setPersonas((prev) => [...prev, { ...emptyPersona }]);
        setEmpadronados((prev) => [...prev, { ...emptyEmpadronado }]);
        setActivePersonaIndex((prev) => prev + 1);
    };

    const isEmptyRow = (p, e) => {
        const personaEmpty =
            !p || Object.values(p).every((v) => v === "" || v === undefined || v === null);
        const empEmpty =
            !e || Object.values(e).every((v) => v === "" || v === undefined || v === null);
        return personaEmpty && empEmpty;
    };

    const validateCasa = () => {
        return (
            Casa.numcasa &&
            Casa.materialcontruccionid &&
            Casa.tipodetechoid &&
            Casa.tipodepisoid &&
            Casa.barrioid &&
            Casa.serviciodeagua !== "" &&
            Casa.serviciodeenergia !== ""
        );
    };

    const validatePersonas = () => {
        let valido = true;

        for (let i = 0; i < Math.max(personas.length, empadronados.length); i++) {
            const p = personas[i] || {};
            const e = empadronados[i] || {};

            if (isEmptyRow(p, e)) continue;

            // Persona obligatoria
            if (!p.primernombre || p.primernombre.length < 3) valido = false;
            if (!p.primerapellido || p.primerapellido.length < 3) valido = false;
            if (!p.sexo) valido = false;
            if (!p.fechanacimiento) valido = false;

            // Empadronado obligatorio
            if (!e.relacionid) valido = false;
            if (!e.estadocivilid) valido = false;
            if (!e.empleoid) valido = false;
            if (!e.niveleducativoid) valido = false;

            // Cédula opcional, pero válida si se llena
            if (e.numerocedula && e.numerocedula.length < 10) valido = false;

            // Ingreso opcional, pero válido si se llena
            if (e.ingresopersonal !== "" && e.ingresopersonal !== undefined) {
                if (Number(e.ingresopersonal) < 0) valido = false;
            }
        }

        return valido;
    };

    const handleSubmit = async () => {
        setSubmitted(true);

        const casaValida = validateCasa();
        const personasValidas = validatePersonas();
        if (!casaValida || !personasValidas) return;

        setLoadingSubmit(true);

        try {
            let materialId = Casa.materialcontruccionid;
            let techoId = Casa.tipodetechoid;
            let pisoId = Casa.tipodepisoid;

            if (materialId === "otro" && Casa.nuevoMaterial) {
                await createMaterialConstruccion({ materialcontruccion: Casa.nuevoMaterial });
                const materialesRes = await getMaterialesConstrucciones();
                const materiales = materialesRes.data ?? materialesRes;
                const nuevoMaterial = materiales.find(m => m.materialcontruccion === Casa.nuevoMaterial);
                materialId = nuevoMaterial?.id;
            }

            if (techoId === "otro" && Casa.nuevoTecho) {
                await createTipoDeTecho({ tipodetecho: Casa.nuevoTecho });
                const techosRes = await getTiposDeTechos();
                const techos = techosRes.data ?? techosRes;
                const nuevoTecho = techos.find(t => t.tipodetecho === Casa.nuevoTecho);
                techoId = nuevoTecho?.id;
            }

            if (pisoId === "otro" && Casa.nuevoPiso) {
                await createTipoDePiso({ tipopiso: Casa.nuevoPiso });
                const pisosRes = await getTiposDePisos();
                const pisos = pisosRes.data ?? pisosRes;
                const nuevoPiso = pisos.find(p => p.tipopiso === Casa.nuevoPiso);
                pisoId = nuevoPiso?.id;
            }

            let infraestructuraMatch = infraestructuras.find(
                (i) =>
                    Number(i.materialcontruccionid) === Number(materialId) &&
                    Number(i.tipodetechoid) === Number(techoId) &&
                    Number(i.tipodepisoid) === Number(pisoId)
            );

            if (!infraestructuraMatch) {
                const payloadInfra = {
                    materialcontruccionid: Number(materialId),
                    tipodetechoid: Number(techoId),
                    tipodepisoid: Number(pisoId),
                };

                await createInfraestructura(payloadInfra);

                const infraResAll = await getInfraestructuras();
                infraestructuraMatch = infraResAll.find(
                    (i) =>
                        Number(i.materialcontruccionid) === Number(materialId) &&
                        Number(i.tipodetechoid) === Number(techoId) &&
                        Number(i.tipodepisoid) === Number(pisoId)
                );
            }

            const CasaFinal = {
                ...Casa,
                infraestructuraid: infraestructuraMatch.id,
            };

            const data = {
                Casa: CasaFinal,
                encuestainide,
                personas: personas.reduce((acc, p, i) => {
                    acc[`persona${i + 1}`] = p;
                    return acc;
                }, {}),
                empadronados: empadronados.reduce((acc, e, i) => {
                    acc[`empadronado${i + 1}`] = e;
                    return acc;
                }, {}),
            };
            await encuestasApi.create(data);
            localStorage.removeItem("encuestaDraft");
            handleReset();
            setSuccessSubmit(true);
        } finally {
            setLoadingSubmit(false);
        }
    };


    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando datos de la encuesta...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="mt-2 mb-4 fw-bold">📋 Nueva Encuesta</h2>

            <h4 className="mt-2 mb-4 fw-bold">Datos de la Encuesta</h4>
            <div className="mb-3">
                <label className="form-label">Censo de la encuesta</label>
                <select
                    className={`form-select ${submitted && !encuestainide.censoid ? "is-invalid" : ""}`}
                    value={encuestainide.censoid}
                    onChange={(e) => setEncuesta({ ...encuestainide, censoid: e.target.value })}
                >
                    <option value="">Seleccione...</option>
                    {Array.isArray(censos) &&
                        censos.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombrecenso}
                            </option>
                        ))}
                </select>
                {submitted && !encuestainide.censoid && (
                    <div className="invalid-feedback d-block">Debe seleccionar un censo</div>
                )}
            </div>

            <CasaForm
                Casa={Casa}
                setCasa={setCasa}
                submitted={submitted}
                materiales={materiales}
                techos={techos}
                pisos={pisos}
                barrios={barrios}
            />

            <h4 className="mt-4 mb-4 fw-bold">Personas</h4>
            <div className="mb-3 d-flex flex-wrap gap-2">
                {personas.map((_, i) => (
                    <div
                        key={i}
                        className={`nav-item d-flex align-items-center px-2 py-1 border rounded ${activePersonaIndex === i ? "bg-primary text-white" : "bg-light"
                            }`}
                        style={{ borderRadius: "6px" }}
                    >
                        <button
                            className="btn btn-link p-0 me-2 text-decoration-none"
                            style={{ color: activePersonaIndex === i ? "white" : "black" }}
                            onClick={() => setActivePersonaIndex(i)}
                        >
                            Persona {i + 1}
                        </button>
                        <button
                            className="btn-close btn-sm"
                            style={{ filter: activePersonaIndex === i ? "invert(1)" : "none" }}
                            onClick={() => {
                                const newPersonas = personas.filter((_, idx) => idx !== i);
                                const newEmpadronados = empadronados.filter((_, idx) => idx !== i);
                                setPersonas(newPersonas);
                                setEmpadronados(newEmpadronados);
                                setActivePersonaIndex(Math.max(0, i - 1));
                            }}
                        />
                    </div>
                ))}
                <button className="btn btn-sm btn-success" onClick={addPersona}>
                    ➕ Añadir Persona
                </button>
            </div>
            {personas[activePersonaIndex] && (
                <PersonaEmpadronadoForm
                    index={activePersonaIndex}
                    persona={personas[activePersonaIndex]}
                    empadronado={empadronados[activePersonaIndex]}
                    relaciones={relaciones}
                    estadosCiviles={estadosCiviles}
                    nivelesEducativos={nivelesEducativos}
                    empleos={empleos}
                    submitted={submitted}
                    onChangePersona={(idx, val) => {
                        setPersonas((prev) => {
                            const next = [...prev];
                            next[idx] = val;
                            return next;
                        });
                    }}
                    onChangeEmpadronado={(idx, val) => {
                        setEmpadronados((prev) => {
                            const next = [...prev];
                            next[idx] = val;
                            return next;
                        });
                    }}
                />
            )}
            <button className="btn btn-success mt-4" onClick={handleSubmit}>
                Enviar Encuesta
            </button>

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
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Enviando encuesta...</span>
                    </div>
                    <p className="text-light mt-2">Enviando encuesta...</p>
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
