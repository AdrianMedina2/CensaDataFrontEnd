import SectionLayout from "../../layouts/SectionsLayout/SectionsLayout";
import AreasConocimiento from "./AreasConocimientoSection";
import CarrerasSection from "./CarrerasSection";

export default function Estudiantil() {
    const sections = [
        { key: "areas", label: "Áreas de Conocimiento", component: AreasConocimiento },
        { key: "carreras", label: "Carreras", component: CarrerasSection },
    ];

    return <SectionLayout title="🧑‍🎓 Gestión estudiantil" sections={sections} />;
}
