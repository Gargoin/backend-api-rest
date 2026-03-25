import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

import Category from "../models/Category.js";

describe("Categories endpoint", () => {
  beforeEach(async function () {
    await Category.deleteMany({});

    await Category.create({
      name: "Electronics",
    });
  });

  it("Categoría debería tener un status 200 y un array", async function () {
    const res = await request(app).get("/categories");

    // console.log(res.status, res.body);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(1);
  });

  it("should return name categories ", async function () {
    const res = await request(app).get("/categories");

    expect(res.body[0]).to.have.property("name");
  });

  it("should create a new category and return it with a 201 status", async function () {
    const newCategory = {
      name: "Books",
      description: "All kinds of books",
    };

    const response = await request(app).post("/categories").send(newCategory);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("name");
    expect(response.body.name).to.equal("Books");
  });


  it("Debería mostrar una categoría por su id", async function () {
  

    const category = await Category.findOne({ name: "Electronics" });

    const response = await request(app).get(`/categories/${category.id}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("name");
    expect(response.body.name).to.equal("Electronics");
  });

  it("Debería retornar 422 si no tiene nombre", async function () {
    const res = await request(app).post("/categories").send({});

    expect(res.status).to.equal(422);
  });


  it("Debería actualizar una categoría", async function () {
    const category = await Category.findOne();

    const updatedCategory = {
      name: "Categoría actualizada",
    };

    const res = await request(app)
      .put(`/categories/${category._id}`)
      .send(updatedCategory);

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal("Categoría actualizada");
  });


it("Debería retornar un error 400 porque el id no es valido", async function(){

    const res = await request(app).get(`/categories/123`);
    expect(res.status).to.equal(400);


  });

  it("Debería retornar 404 si no encuentra una categoría por el id", async function () {

    const res = await request(app).get(`/categories/69b000000000000000000000`);
    expect(res.status).to.equal(404);

  });





  it("Debería borrar una categoria", async function () {
    const category = await Category.findOne();

    const res = await request(app).delete(`/categories/${category._id}`);

    expect(res.status).to.equal(204);
  });

  



});
