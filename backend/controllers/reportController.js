import {
  getDashboardReport,
  getInventoryReport,
  getStockMovementReport,
  getLowStockReport,
  getFifoValuationReport,
} from "../services/reportService.js";
import { getDamagedItems } from "../services/damagedService.js";
import { getStockTakings } from "../services/stockTakingService.js";
import { getAuditLogs } from "../services/auditService.js";

export const getDashboard = async (req, res, next) => {
  try {
    const report = await getDashboardReport();
    res.json({
      success: true,
      data: report,
      ...report, // backward compatibility
    });
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const { categoryId, warehouseId, from, to } = req.query;
    const report = await getInventoryReport({ categoryId, warehouseId, from, to });
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockMovement = async (req, res, next) => {
  try {
    const { from, to, type } = req.query;
    const report = await getStockMovementReport({ from, to, type });
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const report = await getLowStockReport();
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getFifo = async (req, res, next) => {
  try {
    const report = await getFifoValuationReport();
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getDamaged = async (req, res, next) => {
  try {
    const { status, condition } = req.query;
    const result = await getDamagedItems({ status, condition, limit: 100 });
    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockTaking = async (req, res, next) => {
  try {
    const { status } = req.query;
    const result = await getStockTakings({ status, limit: 100 });
    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAudit = async (req, res, next) => {
  try {
    const { userId, action, from, to } = req.query;
    const result = await getAuditLogs({ userId, action, from, to, limit: 100 });
    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};