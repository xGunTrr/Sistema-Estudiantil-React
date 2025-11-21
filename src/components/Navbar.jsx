import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-700 p-4">
      <ul className="flex space-x-6 text-white">
        <li><Link to="/materiales" className="hover:underline">Materiales</Link></li>
        <li><Link to="/tareas" className="hover:underline">Tareas</Link></li>
        <li><Link to="/foros" className="hover:underline">Foros</Link></li>
        <li><Link to="/admin" className="hover:underline">Administrador</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
