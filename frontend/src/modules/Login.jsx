import { useState } from "react";
import { loginUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();

    const [form, setForm] = useState({
        cod_usuario: "",
        password: ""
    });

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await loginUser(form);

        localStorage.setItem("token", result.token);
        localStorage.setItem("cod_usuario", result.cod_usuario);
        localStorage.setItem("id_rol", result.id_rol);

        navigate("/aulavirtual");
    };

    return(
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="bg-[#eef4ff] flex items-center justify-center">
                <img src="../src/assets/web-login-pao.svg" className="w-3/4" alt="Imagen login"/>
            </div>
            <div className="flex items-center justify-center bg-white">
                <form onSubmit={onSubmit} className="w-80 flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">UTP + class</h2>
                    <p className="text-gray-600 mb-8 text-center">La nueva experiencia digital de aprendizaje</p>
                    <input type="text" name="cod_usuario" placeholder="Código de Alumno" onChange={onChange} className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-600"/>
                    <input type="password" name="password" placeholder="Contraseña" onChange={onChange} className="mb-4 w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-600"/>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Iniciar sesión
                    </button>
                    <p className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer">
                        <Link to="/register">¿No tienes cuenta? Regístrate</Link>
                    </p>
                </form>
            </div>
        </div>          
    );
}
export default Login;
