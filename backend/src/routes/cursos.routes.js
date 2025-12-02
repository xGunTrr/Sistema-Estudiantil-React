console.log("📌 Cargando rutas de cursos");

import { Router } from "express";
import { database } from "../database.js";
const router = Router();

// RUTA DE MIS CURSOS PRIMERO 🔥🔥🔥
router.get("/mis-cursos/:cod_usuario", async (req, res) => {
    const { cod_usuario } = req.params;
    const [rows] = await database.query(
        `SELECT c.id_curso, c.nombre, c.descripcion
         FROM cursos c
         JOIN usuario_curso uc ON uc.id_curso = c.id_curso
         WHERE uc.cod_usuario = ?`, [cod_usuario]
    );
    res.json(rows);
});

// LUEGO LAS DEMÁS RUTAS
router.get("/:id_curso/tareas", async (req,res)=>{
    const { id_curso } = req.params;
    const [rows] = await database.query(
        `SELECT * FROM tareas WHERE id_curso = ?`, [id_curso]
    );
    res.json(rows);
});

router.get("/:id_curso/materiales", async (req,res)=>{
    const { id_curso } = req.params;
    const [rows] = await database.query(
        `SELECT * FROM materiales WHERE id_curso = ?`, [id_curso]
    );
    res.json(rows);
});

router.get("/:id_curso/foros", async (req,res)=>{
    const { id_curso } = req.params;
    const [rows] = await database.query(
        `SELECT * FROM foros WHERE id_curso = ?`, [id_curso]
    );
    res.json(rows);
});

router.get("/foro/:id_foro/comentarios", async (req,res)=>{
    const { id_foro } = req.params;
    const [rows] = await database.query(
        `SELECT fc.*, u.cod_usuario
        FROM foro_comentarios fc
        JOIN usuarios u ON u.cod_usuario = fc.cod_usuario
        WHERE id_foro = ?`, [id_foro]
    );
    res.json(rows);
});

router.post("/foro/:id_foro/comentarios", async (req,res)=>{
    const { id_foro } = req.params;
    const { cod_usuario, comentario } = req.body;
    await database.query(
        `INSERT INTO foro_comentarios(id_foro, cod_usuario, comentario)
         VALUES (?, ?, ?)`,
         [id_foro, cod_usuario, comentario]
    );
    res.json({status:"ok"});
});

export default router;
