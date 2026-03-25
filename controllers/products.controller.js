import Product from "../models/Product.js";
import Category from "../models/Category.js";



////////////////////// OBTENER PRODUCTOS /////////////////////////////////-----------------------------

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name").populate("owner", "email");// populamos tb owner, par auqe muestre toda la info y ademas que solo muestre name y email en ambos casos
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};



////////////////////// OBTENER PRODUCTOS POR ID /////////////////////////////////-----------------------------

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("category").populate("owner"); // populamos tb owner, par auqe muestre toda la info

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid product id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};



////////////////////// CREAR /////////////////////////////////-----------------------------


export const createProduct = async (req, res) => {
  
  try {
    
    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    // console.log(req.body, req.user);
    // const body ={...req.body}; // desetructuramos el req.body

    const data = { ...req.body, owner: req.user.id,} // aunque no tenemos como obligatorio el owner para generar el producto, esto choca y da un error, por que trata de obtener info del user.

    // const data = {name: req.nody.name, price: req.body.price, stock: req.body.stock, category: req.body.category, owner: req.user.id}; // ahora todo esto en la const data es loq ue va a tener el producto, entre otras cosa, la id del user


    const product = new Product(data);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.status(422).json({ error: error.errors });
    }

    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid category id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};


////////////////////// ACTUALIZAR PRODUCTOS /////////////////////////////////-----------------------------

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id); // buscamos el prducto por su id

    if(!product) { // si no hay producto
      return res.status(404).json({error: "Product not found"})
    };

    if (product.owner.toString() != req.user.id){
      return res.status(403).json({error: "No tienes permiso para eso"})
    };

    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const productUpdate = await Product.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!productUpdate) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(productUpdate);
  } catch (error) {

    // console.log(error);
    if (error.name == "ValidationError") {
      return res.status(422).json({ error: error.errors });
    }

    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};



////////////////////// BORRAR PRODUCTOS /////////////////////////////////-----------------------------

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

     const product = await Product.findById(id); // buscamos el prducto por su id

    if(!product) { // si no hay producto
      return res.status(404).json({error: "Product not found"})
    };

    if (product.owner.toString() != req.user.id){
      return res.status(403).json({error: "No tienes permiso para eso"})
    };

    // await product.deleteOne({_id: id}); // borrame un ene l qeu el id sea igual
    const productDelete = await Product.findByIdAndDelete(id);

    // if (!productDelete) {
    //   return res.status(404).json({ error: "Product not found" });
    // }

    res.status(204).send();
  } catch (error) {
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid product id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};


////////////////////// OBTENER PRODUCTOS POR CATEGORIA /////////////////////////////////-----------------------------

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.id }).populate(
      "category",
    );

    res.json(products);
    
  } catch (error) {
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid category id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};



////////////////////// OBTENER PRODUCTOS POR PROPIETARIO /////////////////////////////////-----------------------------

export const getProductsByOwner = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.id }).populate("owner",);
    res.json(products);
    
  } catch (error) {
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid product id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
