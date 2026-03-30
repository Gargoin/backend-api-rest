import { Router } from "express";

const router = Router();

import {
//  addProduct,
 getCart,
 clearCart,
 addToCart,
 removeProductFromCart
} from "../controllers/cart.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

// router.post("/",authMiddleware, addProduct); // sin el authMiddleware tira un undefined en el user, por que no desencripta el token...
router.post("/",authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/:productId", authMiddleware, removeProductFromCart)
router.delete("/clear", authMiddleware, clearCart);

export default router;