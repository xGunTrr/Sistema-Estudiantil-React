import mysql from "mysql2/promise";

// CONFIGURACIÓN: Cambiar host, user y password por la configuración de mysql
export const database = await mysql.createPool({
    host:"localhost",
    user:"root",
    password:"12345",
    database:"sistema_estudiantil",
});