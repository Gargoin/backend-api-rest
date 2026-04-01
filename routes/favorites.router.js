import { Router } from "express";

const router = Router();

import {
 getFavorites,
 clearFavorites,
 addFavorites,
 deleteFavorite
} from "../controllers/favorites.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";


router.post("/",authMiddleware, addFavorites);
router.get("/", authMiddleware, getFavorites);
router.delete("/clear", authMiddleware, clearFavorites);
router.delete("/:id", authMiddleware, deleteFavorite);

export default router;