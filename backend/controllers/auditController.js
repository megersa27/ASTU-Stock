import { getAuditLogs, getAuditLogById } from "../services/auditService.js";

export const getAll = async (req, res, next) => {
  try {
    const { userId, action, from, to, page, limit } = req.query;
    const result = await getAuditLogs({ userId, action, from, to, page, limit });
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
    const log = await getAuditLogById(id);
    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
};
