import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Cursos from "./Cursos";

function AulaVirtual() {
  const [selectedTab, setSelectedTab] = useState("cursos");
  const cursos = [
    { id: 1, nombre: "Matemáticas", descripcion: "Curso de álgebra y cálculo" },
    { id: 2, nombre: "Historia", descripcion: "Historia mundial contemporánea" },
    { id: 3, nombre: "Física", descripcion: "Introducción a la física clásica" },
    { id: 4, nombre: "Lenguaje", descripcion: "Comprensión lectora y redacción" },
    { id: 5, nombre: "Química", descripcion: "Bases de química orgánica" }
  ];

  return (
    <div className="flex h-screen">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <main className="flex-1 bg-[#f9f9f9] overflow-y-auto pt-32 pl-20">
        <div className="max-w-6xl">
          <h2 className="text-xl font-semibold text-[#232f50] mb-1">Mis cursos</h2>
          <div className="text-base text-[#232f50] font-medium mb-2">
            2025 - Ciclo 2 Agosto PREG (001) (Actual)
          </div>
          <hr className="mb-8 border-t border-[#d0d5dd]" />
          {selectedTab === "cursos" && <Cursos cursos={cursos} />}
        </div>
      </main>
    </div>
  );
}

export default AulaVirtual;
