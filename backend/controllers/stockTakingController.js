import {
  createStockTaking,
  getStockTakings,
  getStockTakingById,
  approveStockTaking,
  rejectStockTaking,
} from "../services/stockTakingService.js";

export const create = async (req, res, next) => {
  try {
    const { inventoryId, physicalQuantity, countDate, notes } = req.body;
    const record = await createStockTaking(
      { inventoryId, physicalQuantity, countDate, notes },
      req.user
    );
    res.status(201).json({
      success: true,
      data: record,
      message: "Stock taking count submitted for PAO approval",
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await getStockTakings({ status, page, limit });
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const record = await getStockTakingById(id);
    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

export const approve = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { notes } = req.body;
    const result = await approveStockTaking(id, { notes }, req.user);
    res.json({
      success: true,
      data: result,
      message: "Stock adjustment approved and applied to inventory ledger",
    });
  } catch (error) {
    next(error);
  }
};

export const reject = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { notes } = req.body;
    const record = await rejectStockTaking(id, { notes }, req.user);
    res.json({
      success: true,
      data: record,
      message: "Stock adjustment rejected",
    });
  } catch (error) {
    next(error);
  }
};
