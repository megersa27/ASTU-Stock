import { getProductById } from "./productService.js";
import { createAdjustment } from "./stockService.js";
import { recordAuditLog } from "./auditService.js";

let stockTakings = [
  {
    id: 1,
    inventoryId: 1,
    itemName: "A4 Printing Paper (80gsm)",
    itemCode: "4401-001",
    systemQuantity: 120,
    physicalQuantity: 115,
    variance: -5,
    countedBy: 1,
    countedByName: "Megersa Tekalign",
    approvedBy: null,
    approvedByName: null,
    status: "pending",
    notes: "5 reams damaged during rainy season roof leak in Section B",
    countDate: "2026-08-25",
    approvedAt: null,
    createdAt: new Date("2026-08-25T14:30:00Z").toISOString(),
  },
  {
    id: 2,
    inventoryId: 3,
    itemName: "Heavy Duty Floor Detergent 5L",
    itemCode: "4402-001",
    systemQuantity: 45,
    physicalQuantity: 45,
    variance: 0,
    countedBy: 1,
    countedByName: "Megersa Tekalign",
    approvedBy: 2,
    approvedByName: "PAO Officer",
    status: "approved",
    notes: "Annual routine verification - count matches ledger exactly",
    countDate: "2026-08-20",
    approvedAt: new Date("2026-08-21T09:00:00Z").toISOString(),
    createdAt: new Date("2026-08-20T11:00:00Z").toISOString(),
  },
];
let nextStockTakingId = 3;

export const createStockTaking = async ({ inventoryId, physicalQuantity, countDate, notes }, user = {}) => {
  const item = await getProductById(inventoryId);
  const physicalQty = Number(physicalQuantity);

  if (isNaN(physicalQty) || physicalQty < 0) {
    const error = new Error("Physical quantity must be a non-negative number");
    error.statusCode = 400;
    throw error;
  }

  const systemQty = item.stock;
  const variance = physicalQty - systemQty;

  const record = {
    id: nextStockTakingId++,
    inventoryId: item.id,
    itemName: item.name,
    itemCode: item.sku,
    systemQuantity: systemQty,
    physicalQuantity: physicalQty,
    variance,
    countedBy: user.userId || 1,
    countedByName: user.name || "Storekeeper",
    approvedBy: null,
    approvedByName: null,
    status: "pending",
    notes: notes || "",
    countDate: countDate || new Date().toISOString().split("T")[0],
    approvedAt: null,
    createdAt: new Date().toISOString(),
  };

  stockTakings.unshift(record);

  await recordAuditLog({
    userId: user.userId,
    action: "SUBMIT_STOCK_TAKING",
    entityType: "stock_taking",
    entityId: record.id,
    newValues: {
      item: item.name,
      systemQuantity: systemQty,
      physicalQuantity: physicalQty,
      variance,
    },
  });

  return record;
};

export const getStockTakings = async ({ status = "", page = 1, limit = 20 } = {}) => {
  let list = [...stockTakings];
  if (status) {
    list = list.filter((st) => st.status.toLowerCase() === status.toLowerCase());
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit);

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getStockTakingById = async (id) => {
  const record = stockTakings.find((st) => st.id === Number(id));
  if (!record) {
    const error = new Error("Stock taking record not found");
    error.statusCode = 404;
    throw error;
  }
  return record;
};

export const approveStockTaking = async (id, { notes }, user = {}) => {
  const record = await getStockTakingById(id);

  if (record.status !== "pending") {
    const error = new Error(`Stock taking record already ${record.status}`);
    error.statusCode = 422;
    throw error;
  }

  // Create adjustment transaction if variance != 0
  let adjustmentTx = null;
  if (record.variance !== 0) {
    adjustmentTx = await createAdjustment(
      {
        inventoryId: record.inventoryId,
        variance: record.variance,
        notes: notes || `Stock taking reconciliation: ${record.variance > 0 ? "+" : ""}${record.variance}`,
      },
      user
    );
  }

  record.status = "approved";
  record.approvedBy = user.userId || 2;
  record.approvedByName = user.name || "PAO Officer";
  record.approvedAt = new Date().toISOString();
  if (notes) record.notes = `${record.notes ? record.notes + " | " : ""}PAO: ${notes}`;

  await recordAuditLog({
    userId: user.userId,
    action: "APPROVE_STOCK_TAKING",
    entityType: "stock_taking",
    entityId: record.id,
    newValues: {
      status: "approved",
      variance: record.variance,
      newQuantity: record.physicalQuantity,
    },
  });

  return {
    stockTaking: record,
    newQuantity: record.physicalQuantity,
    adjustmentTransaction: adjustmentTx,
  };
};

export const rejectStockTaking = async (id, { notes }, user = {}) => {
  const record = await getStockTakingById(id);

  if (record.status !== "pending") {
    const error = new Error(`Stock taking record already ${record.status}`);
    error.statusCode = 422;
    throw error;
  }

  record.status = "rejected";
  record.approvedBy = user.userId || 2;
  record.approvedByName = user.name || "PAO Officer";
  record.approvedAt = new Date().toISOString();
  record.notes = `${record.notes ? record.notes + " | " : ""}PAO Rejection: ${notes || "Count rejected, requires re-count"}`;

  await recordAuditLog({
    userId: user.userId,
    action: "REJECT_STOCK_TAKING",
    entityType: "stock_taking",
    entityId: record.id,
    newValues: {
      status: "rejected",
      reason: notes,
    },
  });

  return record;
};
