import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.json(category);
  } catch (error) {
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid ID" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.status(422).json({ error: error.errors });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryUpdate = await Category.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!categoryUpdate) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(categoryUpdate);
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.status(422).json({ error: error.errors });
    }

    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid ID" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryDelete = await Category.findByIdAndDelete(id);

    if (!categoryDelete) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid ID" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoryProducts = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.id,
    });

    res.json(products);
  } catch (error) {
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid category id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
