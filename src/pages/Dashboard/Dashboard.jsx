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
import { getEstadistica } from "../../services/";

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

    useEffect(() => {
        const fetchData = async () => {
            const results = {};
            for (const tipo of tipos) {
                try {
                    const res = await getEstadistica(tipo);
                    results[tipo] = res.data;
                } catch (error) {
                    console.error("Error cargando", tipo, error);
                }
            }
            setGraficos(results);
        };
        fetchData();
    }, []);

    const renderGrafico = (grafico) => {
        if (!grafico) return null;

        // Paleta extendida para pastel
        const colors = [
            "rgba(0, 51, 204, 0.6)",   
            "rgba(255, 99, 132, 0.6)", 
            "rgba(255, 206, 86, 0.6)", 
            "rgba(75, 192, 192, 0.6)", 
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)", 
            "rgba(54, 162, 235, 0.6)", 
            "rgba(201, 203, 207, 0.6)" 
        ];

        const chartData = {
            labels: grafico.labels,
            datasets: grafico.series.map((s, idx) => ({
                label: s.nombre,
                data: s.values,
                backgroundColor: chartType === "pie"
                    ? colors 
                    : colors[idx % colors.length],
                borderColor: chartType === "pie"
                    ? colors.map(c => c.replace("0.6", "1"))
                    : colors[idx % colors.length].replace("0.6", "1"),
                borderWidth: 1,
                yAxisID: grafico.series.length > 1 ? (idx === 0 ? "y" : "y1") : "y",
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
                                    text: grafico.series[0]?.nombre || "Eje Izquierdo",
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
                                    text: grafico.series[1]?.nombre || "Eje Derecho",
                                },
                            },
                        }
                        : {
                            y: {
                                type: "linear",
                                position: "left",
                                title: {
                                    display: true,
                                    text: grafico.series[0]?.nombre || "Cantidad",
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

            {/* Selector de tipo de gráfico */}
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
                                {renderGrafico(graficos[tipo]) || <p>Cargando {tipo}...</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
