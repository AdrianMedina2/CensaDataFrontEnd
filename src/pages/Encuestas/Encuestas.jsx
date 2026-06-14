import React, { useState, useEffect } from "react";
import PersonaEmpadronadoForm from "../../components/Encuestas/PersonaEmpadronadoForm";
import CasaForm from "../../components/Encuestas/CasaForm";
import ConfirmModal from "../../components/ConfirmModal.jsx/ConfirmModal";
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
} from "../../services";

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
        ingresopersonal: "",
    };

    const [personas, setPersonas] = useState([{ ...emptyPersona }]);
    const [empadronados, setEmpadronados] = useState([{ ...emptyEmpadronado }]);
    const [activePersonaIndex, setActivePersonaIndex] = useState(0);

    // 1. Cargar el draft al montar
    useEffect(() => {
        const saved = localStorage.getItem("encuestaDraft");
        if (saved) {
            setDraftData(JSON.parse(saved));
            setShowDraftModal(true);
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
        localStorage.setItem("encuestaDraft", JSON.stringify(data));
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

            if (!p.primernombre || p.primernombre.length < 3) valido = false;
            if (!p.primerapellido || p.primerapellido.length < 3) valido = false;
            if (!p.sexo) valido = false;
            if (!p.fechanacimiento) valido = false;

            if (!e.relacionid) valido = false;
            if (!e.estadocivilid) valido = false;
            if (!e.empleoid) valido = false;
            if (!e.niveleducativoid) valido = false;
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

        if (!casaValida || !personasValidas) {
            // Mostrar errores en UI (submitted = true) y no enviar
            return;
        }

        // Si hay infraestructuras cargadas, intentar hacer el match
        if (infraestructuras && infraestructuras.length > 0) {
            const matId = Number(Casa.materialcontruccionid);
            const techoId = Number(Casa.tipodetechoid);
            const pisoId = Number(Casa.tipodepisoid);

            const infraestructuraMatch = infraestructuras.find(
                (i) =>
                    String(i.materialcontruccionid) === Casa.materialcontruccionid &&
                    String(i.tipodetechoid) === Casa.tipodetechoid &&
                    String(i.tipodepisoid) === Casa.tipodepisoid
            );


            if (!infraestructuraMatch) {
                alert("No existe una infraestructura con esa combinación de Material, Techo y Piso");
                return;
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

            console.log("Data enviada:", data);
            await encuestasApi.create(data);
            localStorage.removeItem("encuestaDraft");
            handleReset()
            return;
        }

        // Si no hay infraestructuras para chequear, enviar sin infraestructuraid
        const data = {
            Casa,
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

        console.log("Data enviada:", data);
        await encuestasApi.create(data);
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
        <div className="p-4">
            <h2>Nueva Encuesta</h2>

            <h4>Datos de la Encuesta</h4>
            <div className="mb-3">
                <label className="form-label">Censo</label>
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

            <h4 className="mt-4">Personas</h4>
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

        </div>
    );
}
