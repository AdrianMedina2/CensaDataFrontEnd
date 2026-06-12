import SectionLayout from "../../layouts/SectionsLayout/SectionsLayout";
import MaterialesConstruccionSection from "./MaterialesConstruccionSection";
import TiposTechosSection from "./TiposTechosSection";
import TiposPisosSection from "./TiposPisosSection";

export default function Infraestructura() {
    const sections = [
        { key: "materiales", label: "Materiales de Construcción", component: MaterialesConstruccionSection },
        { key: "techos", label: "Tipos de Techos", component: TiposTechosSection },
        { key: "pisos", label: "Tipos de Pisos", component: TiposPisosSection },
    ];

    return <SectionLayout title="Gestión de Infraestructura" sections={sections} />;
}
