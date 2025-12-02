import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Cursos from "./Cursos";
import { Routes, Route } from "react-router-dom";
import CursoDetalle from "./CursoDetalle";
import Actividad from "./Actividad";
import { getCursosUsuario } from "../services/api";

function AulaVirtual() {
  const [selectedTab, setSelectedTab] = useState("cursos");
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    async function fetchCursos() {
      const cod_usuario = localStorage.getItem("cod_usuario");
      if (!cod_usuario) return;

      try {
        const res = await getCursosUsuario(cod_usuario);
        console.log("CURSOS RECIBIDOS:", res.data);
        setCursos(res.data);
      } catch (error) {
        console.error("Error cargando cursos", error);
      }
    }

    fetchCursos();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <main className="flex-1 bg-[#f9f9f9] overflow-y-auto pt-32 pl-20">
        <div className="max-w-6xl">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[#232f50] mb-1">Mis cursos</h2>
            <div className="text-base text-[#232f50] font-medium mb-2">
              2025 - Ciclo 2 Agosto (Actual)
            </div>
          </div>
          <hr className="mb-8 border-t border-[#d0d5dd]" />

          <Routes>
            <Route path="/" element={<Cursos cursos={cursos} />} />
            <Route path="/curso/:id_curso" element={<CursoDetalle cursos={cursos} />} />
            <Route path="/curso/:id_curso/actividad/:aid" element={<Actividad cursos={cursos} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
export default AulaVirtual;
