import React, { useState } from "react";

function CrearTarea() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (titulo.trim() === "" || descripcion.trim() === "") {
      alert("Completa todos los campos");
      return;
    }

    const nuevaTarea = {
      id: Date.now(),
      titulo,
      descripcion,
    };

    console.log("Tarea creada:", nuevaTarea);
    alert("Tarea creada correctamente");

    setTitulo("");
    setDescripcion("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Nueva Tarea</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Título de la tarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Crear Tarea
        </button>
      </form>
    </div>
  );
}

export default CrearTarea;
