import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
} from "chart.js";
import { getDashboard } from "../../services/";
import "./dashboard.css";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    PointElement
);

export default function Dashboard() {
    const [graficos, setGraficos] = useState({});
    const [kpis, setKpis] = useState({});
    const [chartType, setChartType] = useState("bar");
    const [loading, setLoading] = useState(false);
    const [desde, setDesde] = useState("2024-01-01");
    const [hasta, setHasta] = useState("2024-06-01");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getDashboard(desde, hasta);
            setGraficos(res.graficos);
            setKpis(res.kpis);
        } catch (error) {
            console.error("Error cargando dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatTitulo = (nombre) =>
        nombre.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const renderGrafico = (titulo, grafico, nombre) => {
        if (!grafico) return null;

        const colors = [
            "rgba(0, 51, 204, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(201, 203, 207, 0.6)",
            "rgba(0, 128, 0, 0.6)",
            "rgba(255, 0, 255, 0.6)",
        ];

        const labels =
            nombre === "evolucion_mensual_encuestados"
                ? grafico.map((g) => `${g.mes}/${g.anio}`)
                : grafico.map((g) => g.categoria);

        const dataValues = grafico.map((g) => g.valor);

        let chartData;
        if (chartType === "pie") {
            chartData = {
                labels,
                datasets: [
                    {
                        data: dataValues,
                        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                        borderColor: labels.map((_, i) =>
                            colors[i % colors.length].replace("0.6", "1")
                        ),
                        borderWidth: 1,
                    },
                ],
            };
        } else if (chartType === "line") {
            chartData = {
                labels,
                datasets: [
                    {
                        label: "Cantidad",
                        data: dataValues,
                        borderColor: "rgba(150, 150, 150, 0.8)",
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        tension: 0,
                        pointBackgroundColor: labels.map((_, i) => colors[i % colors.length]),
                        pointBorderColor: labels.map((_, i) => colors[i % colors.length].replace("0.6", "1")),
                        pointRadius: 5,
                    },
                ],
            };
        }

        else {
            chartData = {
                labels,
                datasets: [
                    {
                        label: "Cantidad",
                        data: dataValues,
                        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                        borderColor: labels.map((_, i) =>
                            colors[i % colors.length].replace("0.6", "1")
                        ),
                        borderWidth: 1,
                    },
                ],
            };
        }


        const options = {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        generateLabels: (chart) => {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                const dataset = data.datasets[0];
                                return data.labels.map((label, i) => ({
                                    text: label,
                                    fillStyle: dataset.pointBackgroundColor
                                        ? dataset.pointBackgroundColor[i]
                                        : dataset.backgroundColor[i],
                                    strokeStyle: dataset.pointBorderColor
                                        ? dataset.pointBorderColor[i]
                                        : dataset.borderColor[i],
                                    index: i,
                                }));
                            }
                            return Chart.defaults.plugins.legend.labels.generateLabels(chart);
                        },
                    },

                },
            },
            scales: {
                x: {
                    ticks: { display: false },
                },
            },
            datasets: {
                bar: {
                    barThickness: 30,
                    categoryPercentage: 1.0,
                    barPercentage: 1.0,
                },
            },
        };


        switch (chartType) {
            case "bar":
                return <Bar data={chartData} options={options} />;
            case "line":
                return <Line data={chartData} options={options} />;
            case "pie":
                return <Pie data={chartData} options={options} />;
            default:
                return <Bar data={chartData} options={options} />;
        }
    };


    return (
        <div className="container-fluid">
            <h2 className="fw-bold mt-2 mb-4">📊 Dashboard de Estadísticas</h2>

            {/* Filtro global de fechas + tipo de gráfico */}
            <div className="mb-4 d-flex flex-wrap align-items-center">
                <div className="input-group me-3" style={{ maxWidth: "500px" }}>
                    <input
                        type="date"
                        value={desde}
                        onChange={(e) => setDesde(e.target.value)}
                        className="form-control"
                    />
                    <input
                        type="date"
                        value={hasta}
                        onChange={(e) => setHasta(e.target.value)}
                        className="form-control"
                    />
                    <button onClick={fetchData} className="btn btn-brand">
                        Filtrar
                    </button>
                </div>

                <label className="me-2 fw-bold">Tipo de gráfico:</label>
                <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="form-select w-auto d-inline-block"
                >
                    <option value="bar">📊 Barras</option>
                    <option value="line">📈 Líneas</option>
                    <option value="pie">🥧 Pastel</option>
                </select>
            </div>

            {/* Overlay de carga */}
            {loading && (
                <div className="overlay-loading">
                    <div className="spinner-border text-light me-2" role="status"></div>
                    <span className="text-white fw-bold fs-4">Cargando datos...</span>
                </div>
            )}

            {/* KPIs */}
            <div className="d-flex flex-wrap gap-3 mb-4">
                {Object.values(kpis).map((kpi, idx) => (
                    <div
                        key={idx}
                        className="card text-center shadow-sm border-0 bg-light"
                        style={{ flex: "1 1 180px", minWidth: "180px" }}
                    >
                        <div className="card-body">
                            <h6 className="text-muted">{kpi.titulo}</h6>
                            <h3 className="fw-bold">
                                {kpi.titulo === "Edad promedio"
                                    ? Math.round(kpi.valor_actual)
                                    : kpi.valor_actual}
                            </h3>
                            <p className="mb-1">
                                <small className="text-muted">
                                    Anterior: {kpi.titulo === "Edad promedio"
                                        ? Math.round(kpi.valor_anterior)
                                        : kpi.valor_anterior}
                                </small>
                            </p>
                            {kpi.titulo !== "Edad promedio" && (
                                <>
                                    <p className="mb-1">
                                        <small className="text-muted">Diferencia: {kpi.diferencia}</small>
                                    </p>
                                    <small
                                        className={
                                            kpi.tendencia === "aumento"
                                                ? "text-success"
                                                : "text-danger"
                                        }
                                    >
                                        {kpi.tendencia} ({kpi.variacion_porcentual}%)
                                    </small>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráficos */}
            <div className="row">
                {Object.entries(graficos).map(([nombre, grafico], idx) => (
                    <div key={idx} className="col-12 col-md-6 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-brand text-white fw-bold">
                                {formatTitulo(nombre)}
                            </div>
                            <div className="card-body">
                                {renderGrafico(nombre, grafico, nombre)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
