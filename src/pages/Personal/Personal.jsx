import SectionLayout from "../../layouts/SectionsLayout/SectionsLayout";
import ParentescoSection from "./ParentescoSection";
import NivelesEducativos from "./NivelesEducativosSection";
import EmpleoSection from "./EmpleoSection";

export default function Personal() {
    const sections = [
        { key: "parentesco", label: "Parentescos", component: ParentescoSection },
        { key: "educacion", label: "NivelesEducativos", component: NivelesEducativos },
        { key: "empleo", label: "Empleos", component: EmpleoSection },
    ];

    return <SectionLayout title="Gestión de Personal" sections={sections} />;
}
