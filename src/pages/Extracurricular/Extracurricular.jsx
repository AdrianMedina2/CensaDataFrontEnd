import SectionLayout from "../../layouts/SectionsLayout/SectionsLayout";
import ActividadesSection from "./ActividadesSection";
import EventosSection from "./EventosSection";
import CategoriasSection from "./CategoriasSection";

export default function Extracurricular() {
    const sections = [
        { key: "eventos", label: "Eventos", component: EventosSection },
        { key: "actividades", label: "Actividades", component: ActividadesSection },
        { key: "categorias", label: "Categorías de Eventos", component: CategoriasSection },
    ];

    return <SectionLayout title="📋 Extracurricular" sections={sections} />;
}
