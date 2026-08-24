import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
  } from "../services/productService.js";
  
  export const create = async (req, res, next) => {
    try {
      const {
        name,
        sku,
        price,
        stock,
        categoryId,
      } = req.body;
  
      if (!name || !sku || price === undefined || categoryId === undefined) {
        return res.status(400).json({
          error: "Name, SKU, price and categoryId are required",
        });
      }
  
      if (Number(price) < 0) {
        return res.status(400).json({
          error: "Price cannot be negative",
        });
      }
  
      if (stock !== undefined && Number(stock) < 0) {
        return res.status(400).json({
          error: "Stock cannot be negative",
        });
      }
  
      const product = await createProduct({
        name: name.trim(),
        sku: sku.trim(),
        price: Number(price),
        stock: stock === undefined ? 0 : Number(stock),
        categoryId: Number(categoryId),
      });
  
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };
  
  export const getAll = async (req, res, next) => {
    try {
      const products = await getAllProducts();
  
      res.json(products);
    } catch (error) {
      next(error);
    }
  };
  
  export const getOne = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      const product = await getProductById(id);
  
      res.json(product);
    } catch (error) {
      next(error);
    }
  };
  
  export const update = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      const {
        name,
        sku,
        price,
        stock,
        categoryId,
      } = req.body;
  
      if (!name || !sku || price === undefined || categoryId === undefined) {
        return res.status(400).json({
          error: "Name, SKU, price and categoryId are required",
        });
      }
  
      if (Number(price) < 0) {
        return res.status(400).json({
          error: "Price cannot be negative",
        });
      }
  
      if (Number(stock) < 0) {
        return res.status(400).json({
          error: "Stock cannot be negative",
        });
      }
  
      const product = await updateProduct(id, {
        name: name.trim(),
        sku: sku.trim(),
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
      });
  
      res.json(product);
    } catch (error) {
      next(error);
    }
  };
  
  export const remove = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      const product = await deleteProduct(id);
  
      res.json({
        message: "Product deleted successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  };