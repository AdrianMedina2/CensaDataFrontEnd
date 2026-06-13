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
    ArcElement
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

        const chartData = {
            labels: grafico.labels,
            datasets: grafico.series.map((s) => ({
                label: s.nombre,
                data: s.values,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            })),
        };

        const options = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: grafico.titulo,
                },
            },
        };

        switch (grafico.TipodeGrafico) {
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
        <div className="container my-5">
            <h2 className="fw-bold mb-4">📊 Dashboard de Estadísticas</h2>
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
