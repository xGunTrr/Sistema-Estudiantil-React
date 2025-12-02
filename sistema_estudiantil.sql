DROP DATABASE IF EXISTS sistema_estudiantil;
CREATE DATABASE sistema_estudiantil;
USE sistema_estudiantil;

CREATE TABLE roles (
	id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50)
);

INSERT INTO roles (nombre_rol) VALUES ("Estudiante");
INSERT INTO roles (nombre_rol) VALUES ("Profesor");
INSERT INTO roles (nombre_rol) VALUES ("Administrador");

CREATE TABLE usuarios (
	cod_usuario VARCHAR(9) PRIMARY KEY,
    password VARCHAR(200) NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE cursos (
	id_curso INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(100),
	descripcion TEXT
);

CREATE TABLE usuario_curso (
	id INT AUTO_INCREMENT PRIMARY KEY,
	cod_usuario VARCHAR(9),
	id_curso INT,
	FOREIGN KEY (cod_usuario) REFERENCES usuarios(cod_usuario),
	FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
);

CREATE TABLE materiales (
	id_material INT AUTO_INCREMENT PRIMARY KEY,
	id_curso INT,
	semana INT,
	titulo VARCHAR(200),
	descripcion TEXT,
	autor VARCHAR(200),
	fecha DATETIME DEFAULT NOW(),
	FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
);

CREATE TABLE tareas (
	id_tarea INT AUTO_INCREMENT PRIMARY KEY,
	id_curso INT,
	semana INT,
	titulo VARCHAR(200),
	descripcion TEXT,
	fecha_inicio DATETIME,
	fecha_fin DATETIME,
	autor VARCHAR(200),
	FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
);

CREATE TABLE tarea_entrega (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_tarea INT,
	cod_usuario VARCHAR(9),
	archivo VARCHAR(200),
	fecha_entrega DATETIME,
	FOREIGN KEY (id_tarea) REFERENCES tareas(id_tarea),
	FOREIGN KEY (cod_usuario) REFERENCES usuarios(cod_usuario)
);

CREATE TABLE foros (
	id_foro INT AUTO_INCREMENT PRIMARY KEY,
	id_curso INT,
	semana INT,
	titulo VARCHAR(200),
	descripcion TEXT,
	fecha_inicio DATETIME,
	fecha_fin DATETIME,
	autor VARCHAR(200),
	FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
);

CREATE TABLE foro_comentarios (
	id_comentario INT AUTO_INCREMENT PRIMARY KEY,
	id_foro INT,
	cod_usuario VARCHAR(9),
	comentario TEXT,
	fecha DATETIME DEFAULT NOW(),
	FOREIGN KEY (id_foro) REFERENCES foros(id_foro),
	FOREIGN KEY (cod_usuario) REFERENCES usuarios(cod_usuario)
);

-- ===============================
-- CURSOS DISPONIBLES
-- ===============================
INSERT INTO cursos (nombre, descripcion) VALUES
("Matemáticas I", "Fundamentos de álgebra y cálculo"),
("Redes y Comunicaciones", "Modelo OSI, TCP/IP, subnetting y routing"),
("Programación en Python", "Estructuras de datos, POO y web scraping"),
("Base de Datos I", "Modelo relacional, SQL, consultas y normalización");

-- =====================================
-- ASIGNAR CURSOS AL USUARIO EXISTENTE
-- =====================================
-- tu usuario es U22309167

INSERT INTO usuario_curso (cod_usuario, id_curso) VALUES
("U22309167", 1),
("U22309167", 2),
("U22309167", 3),
("U22309167", 4);

-- ===============================
-- MATERIALES INICIALES
-- ===============================
INSERT INTO materiales (id_curso, semana, titulo, descripcion, autor)
VALUES
(1, 1, "PDF Álgebra básica", "Conceptos introductorios", "PROF_MATH"),
(2, 1, "Modelo OSI", "Explicación detallada", "PROF_NET"),
(3, 1, "Introducción a Python", "Tipos de variables y operaciones", "PROF_PY"),
(4, 1, "Introducción a SQL", "Primeros pasos en consultas", "PROF_DB");

-- ===============================
-- TAREAS INICIALES
-- ===============================
INSERT INTO tareas (id_curso, semana, titulo, descripcion, fecha_inicio, fecha_fin, autor)
VALUES
(1, 1, "Tarea 1 — Álgebra", "Resolver ecuaciones", "2025-01-01 08:00:00", "2025-01-04 23:59:00", "PROF_MATH"),
(2, 1, "Tarea 1 — Redes", "Explicar capa 3 en sus palabras", "2025-01-01 09:00:00", "2025-01-05 23:59:00", "PROF_NET"),
(3, 1, "Tarea 1 — Python", "Crear un script que procese archivos", "2025-01-01 10:00:00", "2025-01-06 23:59:00", "PROF_PY"),
(4, 1, "Tarea 1 — SQL", "Crear 3 consultas con JOIN", "2025-01-01 11:00:00", "2025-01-07 23:59:00", "PROF_DB");

-- ===============================
-- FOROS INICIALES
-- ===============================
INSERT INTO foros (id_curso, semana, titulo, descripcion, fecha_inicio, fecha_fin, autor)
VALUES
(1, 1, "Debate sobre matemáticas", "Opiniones sobre su importancia", "2025-01-02 00:00:00", "2025-01-10 23:59:00", "PROF_MATH"),
(2, 1, "IPv4 vs IPv6", "Ventajas y desventajas", "2025-01-02 00:00:00", "2025-01-10 23:59:00", "PROF_NET"),
(3, 1, "¿Por qué Python es popular?", "Opiniones y experiencias", "2025-01-02 00:00:00", "2025-01-10 23:59:00", "PROF_PY"),
(4, 1, "Experiencias con SQL", "Preguntas y retos", "2025-01-02 00:00:00", "2025-01-10 23:59:00", "PROF_DB");

-- ===============================
-- COMENTARIOS EN FOROS
-- ===============================
INSERT INTO foro_comentarios (id_foro, cod_usuario, comentario)
VALUES
(1, "U22309167", "Las matemáticas son esenciales para la lógica computacional"),
(2, "U22309167", "IPv6 mejora la disponibilidad de direcciones IP"),
(3, "U22309167", "Python es muy usado para prototipos y ciencia de datos"),
(4, "U22309167", "SQL es fundamental para manejar y consultar datos");

SELECT * FROM usuarios;
