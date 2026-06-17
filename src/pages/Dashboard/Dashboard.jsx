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
import { getEstadistica, getReportes, getReportePDF, updateReporteIsPublic } from "../../services/";
import "./dashboard.css"
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

const tipos = [
    "estadisticas por ingreso",
    "estadisticas por nivel educativo",
    "estadisticas por empleo",
    "estadisticas por estado civil",
    "estadisticas por edades",
    "estadisticas por Ingresos basados en el nivel educativo",
    "estadisticas desempleados general",
    "estadisticas desempleadas mujeres por edad",
    "estadisticas empleadas mujeres por edad",
    "estadisticas desempleados hombres por edad",
    "estadisticas empleados hombres por edad",
    "estadisticas ingresos de personas por barrios",
];

export default function Dashboard() {
    const [graficos, setGraficos] = useState({});
    const [chartType, setChartType] = useState("bar");
    const [reportes, setReportes] = useState([]);
    const [selectedReporte, setSelectedReporte] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmation, setConfirmation] = useState("");

    useEffect(() => {
        // cargar estadísticas una por una
        const fetchData = async () => {
            for (const tipo of tipos) {
                try {
                    const res = await getEstadistica(tipo);
                    setGraficos(prev => ({
                        ...prev,
                        [tipo]: res.data
                    }));
                } catch (error) {
                    console.error("Error cargando", tipo, error);
                }
            }
        };
        fetchData();

        // cargar reportes
        const fetchReportes = async () => {
            try {
                const res = await getReportes();
                setReportes(res.data);
            } catch (error) {
                console.error("Error cargando reportes:", error);
            }
        };
        fetchReportes();
    }, []);


    const handleUpdateIsPublic = async () => {
        if (selectedReporte) {
            try {
                setLoading(true);
                const result = await updateReporteIsPublic(selectedReporte);
                setConfirmation(`✅ Reporte "${selectedReporte}" actualizado como público.`);
                setTimeout(() => setConfirmation(""), 3000);
            } catch (error) {
                setConfirmation("❌ Error al actualizar el reporte.");
                setTimeout(() => setConfirmation(""), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDownload = async () => {
        if (selectedReporte) {
            try {
                setLoading(true);
                await getReportePDF(selectedReporte);
                setConfirmation(`✅ Reporte "${selectedReporte}" descargado correctamente.`);
                setTimeout(() => setConfirmation(""), 3000);
            } catch (error) {
                setConfirmation("❌ Error al descargar el reporte.");
                setTimeout(() => setConfirmation(""), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    const renderGrafico = (grafico) => {
        if (!grafico) return null;

        // Paleta de colores variada
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

        const chartData = {
            labels: grafico.labels,
            datasets: grafico.series.map((s, idx) => ({
                label: s.nombre,
                data: s.values,
                backgroundColor:
                    chartType === "pie"
                        ? colors
                        : grafico.labels.map((_, i) => colors[i % colors.length]),
                borderColor:
                    chartType === "pie"
                        ? colors.map((c) => c.replace("0.6", "1"))
                        : grafico.labels.map((_, i) => colors[i % colors.length].replace("0.6", "1")),

                borderWidth: 1,
                yAxisID:
                    grafico.series.length > 1
                        ? idx === 0
                            ? "y"
                            : "y1"
                        : "y",
            })),
        };

        const options = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: grafico.titulo,
                },
                legend: {
                    position: "top",
                },
            },
            scales:
                chartType === "pie"
                    ? {}
                    : grafico.series.length > 1
                        ? {
                            y: {
                                type: "linear",
                                position: "left",
                                title: {
                                    display: true,
                                    text:
                                        grafico.series[0]?.nombre ||
                                        "Eje Izquierdo",
                                },
                            },
                            y1: {
                                type: "linear",
                                position: "right",
                                grid: {
                                    drawOnChartArea: false,
                                },
                                title: {
                                    display: true,
                                    text:
                                        grafico.series[1]?.nombre ||
                                        "Eje Derecho",
                                },
                            },
                        }
                        : {
                            y: {
                                type: "linear",
                                position: "left",
                                title: {
                                    display: true,
                                    text:
                                        grafico.series[0]?.nombre ||
                                        "Cantidad",
                                },
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
        <div className="container">
            <h2 className="fw-bold mt-2 mb-4">📊 Dashboard de Estadísticas</h2>

            {/* Overlay de carga */}
            {loading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
                    <div className="spinner-border text-light me-2" role="status"></div>
                    <span className="text-white fw-bold fs-4">Cargando...</span>
                </div>
            )}

            {/* Mensaje de confirmación centrado */}
            {confirmation && (
                <div className="overlay-success">
                    <div className="alert alert-success text-center">
                        {confirmation}
                    </div>
                </div>
            )}

            {/* Selector de reporte y botón de descarga */}
            <div className="mb-4 d-flex align-items-center">
                <label className="me-2 fw-bold">Tipo de reporte:</label>
                <select
                    value={selectedReporte}
                    onChange={(e) => setSelectedReporte(e.target.value)}
                    className="form-select w-auto d-inline-block me-2"
                >
                    <option value="">Seleccione un reporte</option>
                    {reportes.map((r) => (
                        <option key={r.id} value={r.tiporeporte}>
                            {r.tiporeporte}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleDownload}
                    className="btn btn-brand"
                    disabled={!selectedReporte}
                >
                    Descargar PDF
                </button>
                {/* Botón de marcar como público */}
                <button
                    onClick={handleUpdateIsPublic}
                    className="btn btn-brand ms-2"
                    disabled={
                        !selectedReporte ||
                        reportes.find((r) => r.tiporeporte === selectedReporte)?.espublico
                    }
                >
                    {reportes.find((r) => r.tiporeporte === selectedReporte)?.espublico
                        ? "Reporte ya público"
                        : "Marcar como Público"}
                </button>
            </div>

            { }
            <div className="mb-4">
                <label className="me-2 fw-bold">Tipo de gráfico:</label>
                <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="form-select w-auto d-inline-block"
                >
                    <option value="bar">Barras</option>
                    <option value="line">Líneas</option>
                    <option value="pie">Pastel</option>
                </select>
            </div>

            <div className="row">
                {tipos.map((tipo, idx) => (
                    <div key={idx} className="col-md-6 mb-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                {renderGrafico(graficos[tipo]) || (
                                    <div className="text-center my-3">
                                        <p className="fw-bold mb-2">Cargando gráfico {tipo}...</p>
                                        <div className="d-flex justify-content-center">
                                            <div className="spinner-border text-brand" role="status">
                                                <span className="visually-hidden">Cargando {tipo}...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
