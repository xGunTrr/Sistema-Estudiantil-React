import React, { useState } from "react";

function SubirTarea() {
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!archivo) {
      alert("Selecciona un archivo antes de subirlo");
      return;
    }

    console.log("Archivo subido:", archivo);
    alert("Tarea subida correctamente");

    setArchivo(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subir Tarea</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="file"
          onChange={(e) => setArchivo(e.target.files[0])}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Subir Archivo
        </button>
      </form>
    </div>
  );
}

export default SubirTarea;
