import SectionLayout from "../../layouts/SectionsLayout/SectionsLayout";

import DiscapacidadesSection from "./Discapacidades";

export default function Personal() {
    const sections = [
        { key: "discapacidad", label: "Discapacidades", component: DiscapacidadesSection },
    ];

    return <SectionLayout title="ℹ️ Gestión de Información Personal" sections={sections} />;
}
