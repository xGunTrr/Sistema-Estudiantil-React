    import { useState } from "react";

    function Login({ onLogin }) {
    const [role, setRole] = useState("Alumno");
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user && pass) {
        onLogin(role);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        
        <div className="bg-[#eef4ff] flex items-center justify-center">
            <img
            src="/ilustracion_login.png"
            className="w-3/4"
            alt="Imagen login"
            />
        </div>

        <div className="flex items-center justify-center bg-white">
            <form
            onSubmit={handleSubmit}
            className="w-80 flex flex-col items-center"
            >
            <h2 className="text-3xl font-bold mb-2 text-gray-800">UTP + class</h2>
            <p className="text-gray-600 mb-8 text-center">
                La nueva experiencia digital de aprendizaje
            </p>

            <input
                type="text"
                placeholder="Código de Alumno"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-600"
            />

            <input
                type="password"
                placeholder="Contraseña"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-600"
            />

            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mb-6 w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-600"
            >
                <option>Alumno</option>
                <option>Docente</option>
                <option>Administrador</option>
            </select>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                Iniciar sesión
            </button>

            <p className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer">
                ¿Olvidaste tu contraseña?
            </p>
            </form>
        </div>
        </div>
    );
    }

    export default Login;
