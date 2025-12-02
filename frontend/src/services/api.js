import axios from "axios";
const API = "http://localhost:3000";

function authHeaders(){
    return {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    };
}

export async function registerUser(data) {
    const res = await axios.post(`${API}/auth/register`, data);
    return res.data;
}

export async function loginUser(data) {
    const res = await axios.post(`${API}/auth/login`, data);
    const now = new Date();
    const expiry = now.getTime() + (60 * 60 * 1000);  // +1 hora en ms
    localStorage.setItem("session_expiry", expiry);

    return res.data;
}

export async function getCursosUsuario(cod_usuario) {
    return await axios.get(`${API}/cursos/mis-cursos/${cod_usuario}`, authHeaders());
}

export async function getMateriales(id_curso) {
    return (await axios.get(`${API}/cursos/${id_curso}/materiales`, authHeaders())).data;
}

export async function getTareas(id_curso) {
    return (await axios.get(`${API}/cursos/${id_curso}/tareas`, authHeaders())).data;
}

export async function crearTarea(id_curso, data){
    return (await axios.post(`${API}/cursos/${id_curso}/tareas`, data, authHeaders())).data;
}

export async function getForos(id_curso) {
    return (await axios.get(`${API}/cursos/${id_curso}/foros`, authHeaders())).data;
}

export async function getComentarios(id_foro) {
    return (await axios.get(`${API}/cursos/foro/${id_foro}/comentarios`, authHeaders())).data;
}

export async function publicarComentario(id_foro, comentario){
    return (await axios.post(`${API}/cursos/foro/${id_foro}/comentarios`, comentario, authHeaders())).data;
}
