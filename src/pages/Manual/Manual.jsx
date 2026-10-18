import { useParams, Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

export default function Manual() {
    const { tipo } = useParams(); // "investigador" o "administrador"
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    // Seleccionar archivo según tipo
    const archivo =
        tipo === "investigador"
            ? "/Manual_Investigador.pdf"
            : "/Manual_Administrador.pdf";

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const nextPage = () =>
        setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
    const prevPage = () =>
        setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));

    return (
        <div className="container mt-4">
            {/* Botón para volver al Home */}
            <div className="mb-3">
                <Link to="/" className="btn btn-brand rounded-pill">
                    ⬅ Volver al inicio
                </Link>
            </div>

            <h2 className="text-center mb-4">
                Manual {tipo === "investigador" ? "del Investigador" : "del Administrador"}
            </h2>

            {/* Navegación */}
            {numPages && (
                <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                    <button className="btn btn-brand" onClick={prevPage} disabled={pageNumber <= 1}>
                        ◀ Anterior
                    </button>
                    <span>Página {pageNumber} de {numPages}</span>
                    <button className="btn btn-brand" onClick={nextPage} disabled={pageNumber >= numPages}>
                        Siguiente ▶
                    </button>
                </div>
            )}

            {/* PDF centrado con borde */}
            <Document file={archivo} onLoadSuccess={onDocumentLoadSuccess}>
                <div className="d-flex justify-content-center">
                    <div className="border rounded shadow-sm p-2 bg-light">
                        <Page
                            pageNumber={pageNumber}
                            width={800}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </div>
                </div>
            </Document>
        </div>
    );
}
