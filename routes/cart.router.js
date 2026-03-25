import { Router } from "express";

const router = Router();

import {
 addProduct,
//  removeProduct,
//  modifyProduct,
} from "../controllers/cart.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

// router.post("/", (req, res) => {
//     res.send("OK");
// });

 router.post("/", addProduct);
// router.post("/", authMiddleware, removeProduct); 
// router.post("/", authMiddleware, modifyProduct);  


export default router;