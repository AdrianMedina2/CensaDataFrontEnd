import SectionLayout from "../../layouts/SectionsLayout/SectionsLayout";
import ParentescoSection from "./ParentescoSection";
import NivelesEducativos from "./NivelesEducativosSection";
import EmpleoSection from "./EmpleoSection";
import EstadosCivilesSection from "./EstadosCivilesSection";

export default function Personal() {
    const sections = [
        { key: "parentesco", label: "Relaciones de parentescos", component: ParentescoSection },
        { key: "educacion", label: "Niveles Educativos", component: NivelesEducativos },
        { key: "empleo", label: "Empleos", component: EmpleoSection },
        { key: "estadocivil", label: "Estados Civiles", component: EstadosCivilesSection },
    ];

    return <SectionLayout title="Gestión de Información Personal" sections={sections} />;
}
