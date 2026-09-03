import {
    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
  } from "../services/expenseService.js";
  
  export const create = async (req, res, next) => {
    try {
      const { title, amount, description } = req.body;
  
      if (!title || amount === undefined) {
        return res.status(400).json({
          error: "Title and amount are required",
        });
      }
  
      if (Number(amount) < 0) {
        return res.status(400).json({
          error: "Amount cannot be negative",
        });
      }
  
      const expense = await createExpense({
        title: title.trim(),
        amount: Number(amount),
        description: description?.trim() || null,
        userId: req.user.userId,
      });
  
      res.status(201).json(expense);
    } catch (error) {
      next(error);
    }
  };
  
  export const getAll = async (req, res, next) => {
    try {
      const expenses = await getAllExpenses();
  
      res.json(expenses);
    } catch (error) {
      next(error);
    }
  };
  
  export const getOne = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      const expense = await getExpenseById(id);
  
      res.json(expense);
    } catch (error) {
      next(error);
    }
  };
  
  export const update = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { title, amount, description } = req.body;
  
      if (!title || amount === undefined) {
        return res.status(400).json({
          error: "Title and amount are required",
        });
      }
  
      if (Number(amount) < 0) {
        return res.status(400).json({
          error: "Amount cannot be negative",
        });
      }
  
      const expense = await updateExpense(id, {
        title: title.trim(),
        amount: Number(amount),
        description: description?.trim() || null,
      });
  
      res.json(expense);
    } catch (error) {
      next(error);
    }
  };
  
  export const remove = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      const expense = await deleteExpense(id);
  
      res.json({
        message: "Expense deleted successfully",
        expense,
      });
    } catch (error) {
      next(error);
    }
  };