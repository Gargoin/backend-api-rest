import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import "./db.js";

import productsRouter from "./routes/products.router.js";
import categoriesRouter from "./routes/categories.router.js";
import authRouter from "./routes/auth.router.js";
import pingRouter from "./routes/ping.router.js";
// import { authMiddleware} from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors({ // se peude definir metodos, cabeceras y un monton de cosas mas

    // origin: "http://127.0.0.1:5500" // de donde viene la peticion REACT es 5173... OJO CON ESO


}));
app.use(express.json());

app.use("/products",productsRouter); // con esto hacemos que todo el modulo, necesita de login para verse
app.use("/categories", categoriesRouter);
app.use("/auth", authRouter); // le añadimos un prefijo a la ruta, que será /auth/register
app.use(pingRouter);

export default app;