import SectionLayout from "../../layouts/SectionsLayout/SectionsLayout";
import ActividadesSection from "./ActividadesSection";
import EventosSection from "./EventosSection";
import CategoriasSection from "./CategoriasSection";

export default function Extracurricular() {
    const sections = [
        { key: "categorias", label: "Categorías de Eventos", component: CategoriasSection },
        { key: "eventos", label: "Eventos", component: EventosSection },
        { key: "actividades", label: "Actividades", component: ActividadesSection },
    ];

    return <SectionLayout title="📋 Extracurricular" sections={sections} />;
}
