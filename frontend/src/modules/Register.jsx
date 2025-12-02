import { useState } from "react";
import { registerUser } from "../services/api";
import { Link } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        cod_usuario: "",
        password: "",
        id_rol: ""
    });

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        const result = await registerUser(form);
        alert(`Registrado correctamente. Rol ID: ${result.id_rol}`);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="bg-[#eef4ff] flex items-center justify-center">
                <img src="../src/assets/web-login-pao.svg" className="w-3/4" alt="Imagen login"/>
            </div>

            <div className="flex items-center justify-center bg-white">
                <form onSubmit={onSubmit} className="w-80 flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">UTP + class</h2>
                    <p className="text-gray-600 mb-8 text-center">La nueva experiencia digital de aprendizaje</p>

                    <input name="cod_usuario" placeholder="Código de usuario" onChange={onChange} className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-600"/>
                    <input name="password" type="password" placeholder="Contraseña" onChange={onChange} className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-600"/>

                    <select name="id_rol" onChange={onChange} className="mb-4 w-full px-3 py-2 border rounded bg-white text-gray-700 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer">
                        <option value="">Seleccione rol</option>
                        <option value="1">Estudiante</option>
                        <option value="2">Profesor</option>
                        <option value="3">Administrador</option>
                    </select>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Registrar</button>

                    <p className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer">
                        <Link to="/">¿Ya tienes cuenta? Inicia Sesión</Link>
                    </p>                    
                </form>
            </div>
        </div>
    );
}

export default Register;