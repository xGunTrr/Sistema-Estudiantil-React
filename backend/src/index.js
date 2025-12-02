import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import cursosRoutes from "./routes/cursos.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/cursos", cursosRoutes);

app.listen(3000, () => {
  console.log("Backend corriendo en http://localhost:3000");
});