import { database } from "../database.js"; // Importamos la conexión a la base de datos
import bcrypt from "bcrypt"; // Liberia para encriptar contraseñas
import jwt from "jsonwebtoken"; // Libreria para crear tokens de sesión

const SECRET_KEY = "MI_CLAVE_SECRETA_SUPER_SEGURA";

// Registro de usuarios
export const registerUser = async (req, res) => {
    const { cod_usuario, password, id_rol } = req.body; // Se obtienen los datos del cuerpo de la página

    // Se verifican que los parámetros no tengan valores vacíos
    if (!cod_usuario.toUpperCase() || !password || !id_rol){
        return res.status(400).json({ message: "Campos vacíos" });
    }

    // Query que devuelve todos los datos de un usuario haciendo uso de su código de usuario
    const [userExists] = await database.query(
        "SELECT * FROM usuarios WHERE cod_usuario = ?",
        [cod_usuario]
    );

    // Si la query retorna algo, significa que el usuario si existe por lo que no procede
    if (userExists.length > 0){
        return res.status(400).json({ message: "El usuario ya existe" });
    }

    // En caso que no exista el usuario, se crea una contraseña hasheada
    const hashedPassword = await bcrypt.hash(password, 10);

    // Query que inserta el usuario en la base de datos
    await database.query(
        "INSERT INTO usuarios (cod_usuario, password, id_rol) VALUES (?, ?, ?)",
        [cod_usuario.toUpperCase(), hashedPassword, id_rol]
    );

    // Se retorna un mensaje si todo sale de manera exitosa
    res.json({ 
        message: "Usuario registrado correctamente",
        cod_usuario,
        id_rol
    });
};

// Iniciar Sesión de usuarios
export const loginUser = async (req, res) => {
    const { cod_usuario, password } = req.body; // Se obtienen los datos del cuerpo de la página

    // Query que retorna las filas del usuario haciendo uso del código de usuario
    const [rows] = await database.query(
        "SELECT * FROM usuarios WHERE cod_usuario = ?",
        [cod_usuario.toUpperCase()]
    );

    // Si no existen filas se retorna 0, por lo que no continúa el proceso
    if (rows.length === 0){
        return res.status(400).json({ message: "Usuario no encontrado" })
    }

    const user = rows[0]; // Se crea un usuario con las filas recolectadas

    const validPassword = await bcrypt.compare(password, user.password); // validamos la contraseña

    // En caso la contraseña no sea la correcta
    if (!validPassword){
        return res.status(400).json({ message: "Contraseña Incorrecta" })
    }

    // Generamos token para guardar la sesión del usuario
    const token = jwt.sign(
        { cod_usuario: user.cod_usuario, id_rol: user.id_rol },
        SECRET_KEY,
        { expiresIn: "1h"}
    );

    res.json({
        message: "Login exitoso",
        token,
        cod_usuario: user.cod_usuario,
        id_rol: user.id_rol
    });
};