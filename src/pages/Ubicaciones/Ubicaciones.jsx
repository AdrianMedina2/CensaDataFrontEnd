import SectionLayout from "../../layouts/SectionsLayout/SectionsLayout";
import DepartamentosSection from "./DepartamentosSection";
import MunicipiosSection from "./MunicipiosSection";
import BarriosSection from "./BarriosSection";

export default function Ubicaciones() {
    const sections = [
        { key: "departamentos", label: "Departamentos", component: DepartamentosSection },
        { key: "municipios", label: "Municipios", component: MunicipiosSection },
        { key: "barrios", label: "Barrios", component: BarriosSection },
    ];

    return <SectionLayout title="Gestión de Ubicaciones" sections={sections} />;
}
