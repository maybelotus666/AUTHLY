import { Router } from "express";
import {
    cadastrarUsuario,
    login,
    loginGoogle,
    listarUsuarios,
    mostrarMusicas
} from "../controllers/usuarioController.js";


import { verificarToken, verificarMusico } from "../middleware/auth.js";

const router = Router();


router.post("/cadastro", cadastrarUsuario);
router.post("/login", login);
router.post("/google", loginGoogle);
router.get("/listarUsuarios", verificarToken, verificarMusico, listarUsuarios);
router.get("/musicas", mostrarMusicas);

export default router;