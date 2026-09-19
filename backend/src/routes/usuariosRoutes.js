import { Router } from "express";
import {
    cadastrarUsuario,
    login,
    listarUsuarios
} from "../controllers/usuarioController.js";

import { verificarToken, verificarMusico } from "../middleware/auth.js";

const router = Router();


router.post("/cadastro", cadastrarUsuario);
router.post("/login", login);

router.get("/listarUsuarios", verificarToken, verificarMusico, listarUsuarios);

export default router;