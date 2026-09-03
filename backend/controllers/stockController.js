import {
  receiveStock,
  issueStock,
  transferStock,
  getStockHistory,
  getBinCard,
} from "../services/stockService.js";

export const handleReceive = async (req, res, next) => {
  try {
    const {
      inventoryId,
      supplierId,
      quantity,
      unitCost,
      transactionDate,
      referenceNumber,
      warehouseId,
      notes,
    } = req.body;

    const result = await receiveStock(
      {
        inventoryId,
        supplierId,
        quantity,
        unitCost,
        transactionDate,
        referenceNumber,
        warehouseId,
        notes,
      },
      req.user
    );

    res.status(201).json({
      success: true,
      data: result,
      message: `Stock received successfully. ${result.grnNumber} generated.`,
    });
  } catch (error) {
    next(error);
  }
};

export const handleIssue = async (req, res, next) => {
  try {
    const {
      inventoryId,
      quantity,
      department,
      recipientName,
      transactionDate,
      referenceNumber,
      notes,
    } = req.body;

    const result = await issueStock(
      {
        inventoryId,
        quantity,
        department,
        recipientName,
        transactionDate,
        referenceNumber,
        notes,
      },
      req.user
    );

    res.status(201).json({
      success: true,
      data: result,
      message: `Stock issued successfully. ${result.voucherNumber} generated.`,
    });
  } catch (error) {
    next(error);
  }
};

export const handleTransfer = async (req, res, next) => {
  try {
    const {
      inventoryId,
      sourceWarehouseId,
      destWarehouseId,
      quantity,
      transactionDate,
      notes,
    } = req.body;

    const result = await transferStock(
      {
        inventoryId,
        sourceWarehouseId,
        destWarehouseId,
        quantity,
        transactionDate,
        notes,
      },
      req.user
    );

    res.status(201).json({
      success: true,
      data: result,
      message: `Stock transferred successfully. ${result.transferNumber} generated.`,
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const { inventoryId, type, from, to, page, limit } = req.query;
    const result = await getStockHistory({
      inventoryId,
      type,
      from,
      to,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getBinCardView = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { from, to } = req.query;
    const binCard = await getBinCard(id, { from, to });

    res.json({
      success: true,
      data: binCard,
    });
  } catch (error) {
    next(error);
  }
};
