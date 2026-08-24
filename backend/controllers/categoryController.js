import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
  } from "../services/categoryService.js";
  
  export const create = async (req, res, next) => {
    try {
      const { name } = req.body;
  
      if (!name || !name.trim()) {
        return res.status(400).json({
          error: "Category name is required",
        });
      }
  
      const category = await createCategory({
        name: name.trim(),
      });
  
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };
  
  export const getAll = async (req, res, next) => {
    try {
      const categories = await getAllCategories();
  
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };
  
  export const getOne = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      const category = await getCategoryById(id);
  
      res.json(category);
    } catch (error) {
      next(error);
    }
  };
  
  export const update = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;
  
      if (!name || !name.trim()) {
        return res.status(400).json({
          error: "Category name is required",
        });
      }
  
      const category = await updateCategory(id, {
        name: name.trim(),
      });
  
      res.json(category);
    } catch (error) {
      next(error);
    }
  };
  
  export const remove = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      const category = await deleteCategory(id);
  
      res.json({
        message: "Category deleted successfully",
        category,
      });
    } catch (error) {
      next(error);
    }
  };