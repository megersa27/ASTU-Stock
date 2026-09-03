import {
    createSale,
    getSales,
    getSaleById,
  } from "../services/saleService.js";
  
  export const create = async (req, res, next) => {
    try {
      const { items } = req.body;
  
      const sale = await createSale(items);
  
      res.status(201).json(sale);
    } catch (error) {
      next(error);
    }
  };
  
  export const getAll = async (req, res, next) => {
    try {
      const sales = await getSales();
  
      res.json(sales);
    } catch (error) {
      next(error);
    }
  };
  
  export const getOne = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
  
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          error: "Invalid sale ID",
        });
      }
  
      const sale = await getSaleById(id);
  
      res.json(sale);
    } catch (error) {
      next(error);
    }
  };