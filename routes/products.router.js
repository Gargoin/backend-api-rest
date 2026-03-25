import { Router } from "express";

const router = Router();

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByOwner
} from "../controllers/products.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";


router.get("/my-products", authMiddleware, getProductsByOwner);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, createProduct); // obligamos a estar logeadado con token para poder crear producto

router.put("/:id", authMiddleware, updateProduct); // hacemos que sea privada para que tengan que meter el token para modificar

router.delete("/:id", authMiddleware, deleteProduct);

router.get("/category/:id", getProductsByCategory);



export default router;
