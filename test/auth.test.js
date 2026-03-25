import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

import User from "../models/User.js"

import bcrypt from "bcryptjs";




describe("Auth User", function () {

    this.beforeEach(async function () {
        await User.deleteMany({});

        const hash = await bcrypt.hash("123456", 10); // hasheamos el pass

        await User.create({ // creamos un usuario
    
            email: "cosillas3@buenasemail.com",
            password: hash // usamos el haseado

        });

    });

    it("debería registrar un usuario", async function () {
        const res = await request(app).post("/auth/register").send({
    
            email: "nuevo@buenasemail.com",
            password: "123456"

        });

        expect(res.status).to.equal(201);
    });

    it("Debería obtener un token", async function() {
        
    const res = await request(app).post("/auth/login").send({

            email: "cosillas3@buenasemail.com",
            password: "123456"

        });

        expect(res.status).to.equal(200);

    })

    it("Debería enviar un status 401 si no envío el token", async function () {

        const res = await request(app).get("/auth/profile");

        expect(res.status).to.equal(401);           
    });

    it ("Debería retornar el profile con el token valido", async function () {

        const login = await request(app).post("/auth/login").send({

            email: "cosillas3@buenasemail.com",
            password: "123456"

        });

        const token = login.body.token;

        const res = await request(app).get("/auth/profile").set("Authorization", `Bearer ${token}`); //seteamos con set en vez de send por ser una header, ponemos el Berar con espacio mas el token para que pase uno de los if que añadimos

        expect(res.status).to.equal(200);  


    });

});