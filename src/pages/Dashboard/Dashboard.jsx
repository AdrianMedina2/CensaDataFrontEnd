import { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { getDashboard } from "../../services/";
import "./dashboard.css";

const COLORES = ["#3155D9", "#F36B86", "#F5B84B", "#29A6A1", "#9473DB", "#EF8E4D", "#49A2E8", "#7D8BA5", "#39A46B", "#C76FC8"];
const TEMA = {
    text: { fontSize: 12, fill: "#596579" },
    axis: { ticks: { text: { fontSize: 11, fill: "#667085" } }, legend: { text: { fontSize: 12, fill: "#475467" } } },
    grid: { line: { stroke: "#E9EDF4", strokeWidth: 1 } },
    tooltip: { container: { background: "#fff", color: "#212529", borderRadius: 8, boxShadow: "0 6px 24px rgba(0,0,0,.12)" } },
    labels: { text: { fontSize: 11, fontWeight: 600 } }
};
const formatTitulo = (nombre) => String(nombre).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
const formatearNumero = valor => new Intl.NumberFormat("es-NI", { maximumFractionDigits: 2 }).format(Number(valor) || 0);
const etiquetaDe = (item, nombre, indice) => {
    if (nombre === "evolucion_mensual_encuestados" || (item.mes != null && item.anio != null)) return `${item.mes}/${item.anio}`;
    return String(item.categoria ?? item.nombre ?? item.label ?? `Categoría ${indice + 1}`);
};
const tipoRecomendado = nombre => {
    const clave = nombre.toLowerCase();
    if (/evolucion|mensual|tendencia|historico|histórico|tiempo/.test(clave)) return "line";
    if (/sexo|genero|género|distribucion|distribución|porcentaje|proporcion|proporción/.test(clave)) return "pie";
    return "bar";
};

function GraficoNivo({ nombre, grafico, tipo }) {
    if (!Array.isArray(grafico) || grafico.length === 0) {
        return <div className="dashboard-sin-datos d-flex align-items-center justify-content-center text-center text-secondary">No hay datos para mostrar en este período.</div>;
    }
    const datos = grafico.map((item, indice) => ({
        id: etiquetaDe(item, nombre, indice),
        valor: Number(item.valor) || 0,
        color: COLORES[indice % COLORES.length]
    }));
    const muchosDatos = datos.length > 7;
    const barrasHorizontales = datos.some(d => d.id.length > 15) || muchosDatos;
    const altura = tipo === "bar" && barrasHorizontales
        ? Math.max(300, datos.length * 39 + 75)
        : tipo === "pie" ? 330 : 320;
    const comun = { theme: TEMA, animate: true, motionConfig: "gentle" };

    return (
        <div className="dashboard-grafico-contenedor">
            <div className="dashboard-grafico" style={{ height: altura }}>
            {tipo === "bar" && (
                <ResponsiveBar
                    {...comun}
                    data={datos}
                    keys={["valor"]}
                    indexBy="id"
                    layout={barrasHorizontales ? "horizontal" : "vertical"}
                    margin={barrasHorizontales
                        ? { top: 15, right: 45, bottom: 40, left: Math.min(175, Math.max(95, ...datos.map(d => d.id.length * 7))) }
                        : { top: 20, right: 20, bottom: muchosDatos ? 85 : 65, left: 55 }}
                    padding={0.34}
                    colors={({ data }) => data.color}
                    borderRadius={5}
                    enableLabel={!muchosDatos}
                    labelSkipWidth={24}
                    labelSkipHeight={16}
                    labelTextColor="#ffffff"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={barrasHorizontales
                        ? { tickSize: 0, tickPadding: 10, legend: "Cantidad", legendPosition: "middle", legendOffset: 33 }
                        : { tickSize: 0, tickPadding: 12, tickRotation: datos.some(d => d.id.length > 11) ? -30 : 0 }}
                    axisLeft={barrasHorizontales
                        ? { tickSize: 0, tickPadding: 9, format: value => String(value).length > 25 ? `${String(value).slice(0, 23)}…` : value }
                        : { tickSize: 0, tickPadding: 10, legend: "Cantidad", legendPosition: "middle", legendOffset: -42 }}
                    enableGridX={barrasHorizontales}
                    enableGridY={!barrasHorizontales}
                    tooltip={({ indexValue, value }) => (
                        <div className="dashboard-tooltip"><strong>{indexValue}</strong><span>{formatearNumero(value)}</span></div>
                    )}
                    role="img"
                    ariaLabel={`Gráfico de barras: ${formatTitulo(nombre)}`}
                />
            )}
            {tipo === "line" && (
                <ResponsiveLine
                    {...comun}
                    data={[{ id: "Cantidad", color: COLORES[0], data: datos.map(d => ({ x: d.id, y: d.valor })) }]}
                    margin={{ top: 25, right: 25, bottom: 70, left: 55 }}
                    xScale={{ type: "point" }}
                    yScale={{ type: "linear", min: 0, max: "auto", stacked: false, reverse: false }}
                    curve="monotoneX"
                    colors={[COLORES[6]]}
                    lineWidth={3}
                    pointSize={10}
                    pointColor={COLORES[0]}
                    pointBorderWidth={2}
                    pointBorderColor="#ffffff"
                    enableArea
                    areaOpacity={0.09}
                    useMesh
                    enableGridX={false}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{ tickSize: 0, tickPadding: 12, tickRotation: muchosDatos ? -35 : 0 }}
                    axisLeft={{ tickSize: 0, tickPadding: 10, legend: "Cantidad", legendPosition: "middle", legendOffset: -42 }}
                    tooltip={({ point }) => (
                        <div className="dashboard-tooltip"><strong>{point.data.xFormatted}</strong><span>{formatearNumero(point.data.y)}</span></div>
                    )}
                    role="img"
                    ariaLabel={`Gráfico de líneas: ${formatTitulo(nombre)}`}
                />
            )}
            {tipo === "pie" && (
                <ResponsivePie
                    {...comun}
                    data={datos.filter(d => d.valor > 0).map(d => ({ id: d.id, label: d.id, value: d.valor, color: d.color }))}
                    margin={{ top: 20, right: 25, bottom: 20, left: 25 }}
                    innerRadius={0.62}
                    padAngle={1.3}
                    cornerRadius={4}
                    activeOuterRadiusOffset={7}
                    colors={{ datum: "data.color" }}
                    borderWidth={0}
                    enableArcLabels={datos.length <= 6}
                    arcLabelsSkipAngle={12}
                    arcLabelsTextColor="#ffffff"
                    enableArcLinkLabels={false}
                    tooltip={({ datum }) => (
                        <div className="dashboard-tooltip"><strong>{datum.label}</strong><span>{formatearNumero(datum.value)}</span></div>
                    )}
                    role="img"
                    ariaLabel={`Gráfico circular: ${formatTitulo(nombre)}`}
                />
            )}
            </div>
            {tipo === "pie" && (
                <div className="dashboard-leyenda-externa d-flex flex-wrap justify-content-center gap-3 px-3 pt-2 pb-3">
                    {datos.filter(d => d.valor > 0).map((d, i) => (
                        <div key={`${d.id}-${i}`} title={d.id} className="d-flex align-items-center gap-2 text-secondary small" style={{ minWidth: 0, maxWidth: "100%" }}>
                            <span style={{ width: 12, height: 12, flexShrink: 0, borderRadius: "50%", backgroundColor: d.color }} />
                            <span style={{ overflowWrap: "anywhere" }}>{d.id}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Dashboard() {
    const [graficos, setGraficos] = useState({});
    const [kpis, setKpis] = useState({});
    const [tiposGraficos, setTiposGraficos] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [desde, setDesde] = useState("2024-01-01");
    const [hasta, setHasta] = useState("2024-06-01");

    const fetchData = async () => {
        if (desde && hasta && desde > hasta) {
            setError("La fecha inicial no puede ser posterior a la fecha final.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await getDashboard(desde, hasta);
            setGraficos(res?.graficos ?? {});
            setKpis(res?.kpis ?? {});
        } catch (err) {
            console.error("Error cargando dashboard:", err);
            setError("No se pudieron cargar las estadísticas. Intentá nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className="container-fluid dashboard-nivo">
            <h2 className="fw-bold mt-2 mb-4">📊 Dashboard de Estadísticas</h2>
            <div className="mb-4 d-flex flex-wrap align-items-center gap-3">
                <div className="input-group" style={{ maxWidth: "500px" }}>
                    <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="form-control" aria-label="Fecha desde" />
                    <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="form-control" aria-label="Fecha hasta" />
                    <button type="button" onClick={fetchData} className="btn btn-brand" disabled={loading}>Filtrar</button>
                </div>
                <span className="text-muted small">Cada gráfico tiene su propio tipo de visualización.</span>
            </div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {loading && (
                <div className="overlay-loading">
                    <div className="spinner-border text-light me-2" role="status" />
                    <span className="text-white fw-bold fs-4">Cargando datos...</span>
                </div>
            )}
            <div className="d-flex flex-wrap gap-3 mb-4">
                {Object.values(kpis).map((kpi, idx) => (
                    <div key={idx} className="card text-center shadow-sm border-0 bg-light dashboard-kpi" style={{ flex: "1 1 180px", minWidth: "180px" }}>
                        <div className="card-body">
                            <h6 className="text-muted">{kpi.titulo}</h6>
                            <h3 className="fw-bold">{kpi.titulo === "Edad promedio" ? Math.round(kpi.valor_actual) : kpi.valor_actual}</h3>
                            <p className="mb-1"><small className="text-muted">Anterior: {kpi.titulo === "Edad promedio" ? Math.round(kpi.valor_anterior) : kpi.valor_anterior}</small></p>
                            {kpi.titulo !== "Edad promedio" && (
                                <>
                                    <p className="mb-1"><small className="text-muted">Diferencia: {kpi.diferencia}</small></p>
                                    <small className={kpi.tendencia === "aumento" ? "text-success" : "text-danger"}>{kpi.tendencia} ({kpi.variacion_porcentual}%)</small>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="dashboard-grid-graficos">
                {Object.entries(graficos).map(([nombre, grafico]) => {
                    const tipo = tiposGraficos[nombre] ?? tipoRecomendado(nombre);
                    return (
                        <section key={nombre} className="card shadow-sm dashboard-card-grafico overflow-hidden">
                            <div className="card-header bg-brand text-white fw-bold dashboard-card-header d-flex align-items-center justify-content-between gap-2">
                                <span>{formatTitulo(nombre)}</span>
                                <select
                                    className="form-select form-select-sm dashboard-tipo-selector"
                                    aria-label={`Tipo de gráfico para ${formatTitulo(nombre)}`}
                                    value={tipo}
                                    onChange={e => setTiposGraficos(prev => ({ ...prev, [nombre]: e.target.value }))}
                                >
                                    <option value="bar">Barras</option>
                                    <option value="line">Líneas</option>
                                    <option value="pie">Dona</option>
                                </select>
                            </div>
                            <div className="card-body">
                                <GraficoNivo nombre={nombre} grafico={grafico} tipo={tipo} />
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
