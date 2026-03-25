import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import bcrypt from "bcryptjs";

import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

describe("Products endpoint", function () {
  this.timeout(10000);

  beforeEach(async function () {

    await User.deleteMany({});
    const hash = await bcrypt.hash("123456", 10);

    const user = await User.create({
      email: "test@example.com",
      password: hash, 
    });


    await Category.deleteMany({});
  
    const category = await Category.create({
      name: "Electronics",
    });


    await Product.deleteMany({});

    await Product.create({
      name: "Mouse",
      price: 80,
      stock: 10,
      category: category._id,
      owner: user.id,
    });

  });

  it("debería tener un status 200 y un array", async function () {
    const res = await request(app).get("/products");

    // console.log(res.status, res.body);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(1);
  });


    it("Debería popular la categoría en el producto", async function() {

    const res = await (request(app).get(`/products`));

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(1);

    expect(res.body[0]).to.have.property("category");
    expect(res.body[0].category).to.be.an("object");
    expect(res.body[0].category).to.have.property("name");
    expect(res.body[0].category.name).to.equal("Electronics");

  })

  it("El primer producto tiene que tener nombre", async function () {
    const res = await request(app).get("/products");

    expect(res.body[0]).to.have.property("name");
  });

  it("Debería crear un producto", async function () {

    const login = await request(app).post("/auth/login").send({ // logueamos

      email: "test@example.com",
      password: "123456",

    }); 


    const category = await Category.findOne({ name: "Electronics" });

    // console.log(category.id, category._id);

    const newProduct = {
      name: "Notebook",
      price: 1000,
      stock: 5,
      category: category.id,
    };

    const res = await request(app).post("/products").send(newProduct).set("Authorization", `Bearer ${login.body.token}`); // aqui metemos el token y la cabecera de auth en la peticion

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("name");
    expect(res.body.name).to.equal("Notebook");
  });

  it("Debería traer un producto por el id", async function () {
    const product = await Product.findOne();

    const response = await request(app).get(`/products/${product.id}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("name");
    expect(response.body.name).to.equal("Mouse");

    expect(response.body).to.have.property("category");
    expect(response.body.category).to.be.an("object");
    expect(response.body.category).to.have.property("name");
    expect(response.body.category.name).to.equal("Electronics");
    
  });




  it("Debería devolver 422 si falta el nombre", async function () {

    const login = await request(app).post("/auth/login").send({ // logueamos

      email: "test@example.com",
      password: "123456",

    }); 

    const category = await Category.findOne();

    const newProduct = {
      price: 100,
      stock: 5,
      category: category.id,
    };

    const res = await request(app).post("/products").send(newProduct).set("Authorization", `Bearer ${login.body.token}`);

    expect(res.status).to.equal(422);
  });

  it("Debería actualizar un producto", async function () {

    const login = await request(app).post("/auth/login").send({ // logueamos

      email: "test@example.com",
      password: "123456",

    }); 

    const product = await Product.findOne();

    // product.name = "Mouse Gammer";
    // console.log(product);

    const updateProduct = {
      name: "Mouse Gammer",
      category: product.category,
    };

    const res = await request(app)
      .put(`/products/${product.id}`)
      .send(updateProduct).set("Authorization", `Bearer ${login.body.token}`);

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal("Mouse Gammer");
  });

  it("Debería retornar un error 400 porque el id no es valido", async function(){

    const res = await request(app).get(`/products/123`);
    expect(res.status).to.equal(400);


  });

  it("Debería retornar 404 si no encuentra un producto por le id", async function () {

    const res = await request(app).get(`/products/69b000000000000000000000`);
    expect(res.status).to.equal(404);




  });



  it("Debería borra un producto", async function () {

    const login = await request(app).post("/auth/login").send({ // logueamos

      email: "test@example.com",
      password: "123456",

    }); 


    const product = await Product.findOne();

    const res = await request(app).delete(`/products/${product.id}`).set("Authorization", `Bearer ${login.body.token}`);

    expect(res.status).to.equal(204);
  });


  it ("Debería traer los productos de una categoría con el populate de category", async function(){

    const category = await Category.findOne();

    const res = await request(app).get(`/products/category/${category.id}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(1);
    expect(res.body[0].category).to.be.an("object");
    expect(res.body[0].category).to.have.property("name");
    expect(res.body[0].category.name).to.equal("Electronics");

  })

  it("Debería traer un array vacío si la categoría no tiene productos", async function(){

    const category = await Category.create({
      name: "Analogics",
    });

    const res = await request(app).get(`/products/category/${category.id}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(0);

  });

  it("Debería retornar un error 400 si el id es invalido", async function () {

    const res = await request(app).get(`/products/category/123`);
    expect(res.status).to.equal(400);

  });

  it("Saber si un producto tiene la categoría Hardware", async function () {

    const category = await Category.create({
      name: "Hardware",
    });

    await Product.create({
      name: "Teclado",
      price: 80,
      stock: 10,
      category: category._id,
    });

    const res = await request(app).get(`/products/category/${category.id}`);

    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(1);
    expect(res.body[0].category).to.be.an("object");
    expect(res.body[0].category).to.have.property("name");
    expect(res.body[0].category.name).to.equal("Hardware");
    expect(res.status).to.equal(200);

  });


  it("Debería retornar un status 403 si el usuario no es propietario del producto", async function (){

    // creamos usuario:
    await request(app).post("/auth/register").send({

      email: "test2@example.com",
      password: "123456",

    });

    const login = await request(app).post("/auth/login").send({ // logueamos

      email: "test2@example.com",
      password: "123456",

    }); 

    const product = await Product.findOne();

    const updateProduct = {
      name: "Mouse Gammer",
      
    };

    const res = await request(app)
      .put(`/products/${product.id}`)
      .send(updateProduct).set("Authorization", `Bearer ${login.body.token}`);

    expect(res.status).to.equal(403);

  })


});
