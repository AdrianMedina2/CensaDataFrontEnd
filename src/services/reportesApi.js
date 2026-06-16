import api from "../utils/axiosInstance"

// Reportes
export const getReportes = async () => {
    const { data } = await api.get("/api/reportes/");
    return data;
};

// Reportes PDF
export const getReportePDF = async (tiporeporte) => {
    try {
        const response = await api.get(`/api/reportes/pdf/`, {
            params: { tiporeporte },
            responseType: 'blob',
        });

        // Crear un objeto URL para descargar el PDF
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reporte-${tiporeporte}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error al descargar reporte PDF:", error);
        throw error;
    }
};
