import { Link } from "react-router-dom";

function Cursos({ cursos = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-12 py-12">
      {cursos.map((curso) => (
        <Link
          key={curso.id_curso}
          to={`/aulavirtual/curso/${curso.id_curso}`}
          state={{ curso }}
          className="block"
        >
          <div className="bg-white rounded-2xl shadow-xl h-60 w-full flex flex-col justify-center items-start px-10 py-8 text-left hover:shadow-2xl transition">
            <h3 className="mb-3 font-bold text-2xl text-[#233971]">{curso.nombre}</h3>
            <p className="text-base text-[#54657c]">{curso.descripcion}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Cursos;
