import {Router} from "express"

const router = Router();

import {register, login, profile} from "../controllers/auth.controller.js";
import { authMiddleware} from "../middlewares/auth.middleware.js";

router.post("/login", login); //añadimos el login
router.post("/register", register);

router.get("/profile", authMiddleware, profile); // metemos el authmiddleware, para qeu valide, y si ok, pasa a profile, hace de filtro, esto seria igual para cada ruta que deberiamos mostrar si es privada, es decir filtra

export default router;