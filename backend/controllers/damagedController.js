import {
  reportDamagedItem,
  getDamagedItems,
  getDamagedItemById,
  approveDisposal,
  rejectDisposal,
} from "../services/damagedService.js";

export const create = async (req, res, next) => {
  try {
    const { inventoryId, condition, quantityAffected, description } = req.body;
    const record = await reportDamagedItem(
      { inventoryId, condition, quantityAffected, description },
      req.user
    );
    res.status(201).json({
      success: true,
      data: record,
      message: "Damaged / Obsolete item reported for PAO inspection",
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { status, condition, page, limit } = req.query;
    const result = await getDamagedItems({ status, condition, page, limit });
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
    const record = await getDamagedItemById(id);
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
    const result = await approveDisposal(id, { notes }, req.user);
    res.json({
      success: true,
      data: result,
      message: "Disposal approved and stock adjusted",
    });
  } catch (error) {
    next(error);
  }
};

export const reject = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { notes } = req.body;
    const record = await rejectDisposal(id, { notes }, req.user);
    res.json({
      success: true,
      data: record,
      message: "Disposal rejected",
    });
  } catch (error) {
    next(error);
  }
};
