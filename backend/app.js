import "dotenv/config";
import express from "express";
import cors from "cors";

import usuariosRoutes from "./src/routes/usuariosRoutes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

app.use("/usuarios", usuariosRoutes);

export default app;

