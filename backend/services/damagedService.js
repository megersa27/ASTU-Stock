import { getProductById, updateProduct } from "./productService.js";
import { recordAuditLog } from "./auditService.js";

let damagedItems = [
  {
    id: 1,
    inventoryId: 4,
    itemName: "LED Ceiling Tube Light 18W",
    itemCode: "4403-001",
    condition: "damaged",
    quantityAffected: 4,
    description: "Shattered during transport from central warehouse to engineering block",
    reportedBy: 1,
    reportedByName: "Megersa Tekalign",
    status: "pending",
    approvedBy: null,
    approvedByName: null,
    approvedAt: null,
    createdAt: new Date("2026-08-22T10:00:00Z").toISOString(),
  },
  {
    id: 2,
    inventoryId: 2,
    itemName: "Ballpoint Pen (Blue, Box of 50)",
    itemCode: "4401-002",
    condition: "obsolete",
    quantityAffected: 2,
    description: "Expired dried out ink batches from 2022 inventory",
    reportedBy: 1,
    reportedByName: "Megersa Tekalign",
    status: "disposed",
    approvedBy: 2,
    approvedByName: "PAO Officer",
    approvedAt: new Date("2026-08-23T11:00:00Z").toISOString(),
    createdAt: new Date("2026-08-22T15:00:00Z").toISOString(),
  },
];
let nextDamagedId = 3;

export const reportDamagedItem = async (
  { inventoryId, condition = "damaged", quantityAffected, description },
  user = {}
) => {
  const item = await getProductById(inventoryId);
  const qty = Number(quantityAffected);

  if (!qty || qty <= 0) {
    const error = new Error("Quantity affected must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  if (qty > item.stock) {
    const error = new Error(`Quantity affected cannot exceed available stock (${item.stock})`);
    error.statusCode = 422;
    throw error;
  }

  const record = {
    id: nextDamagedId++,
    inventoryId: item.id,
    itemName: item.name,
    itemCode: item.sku,
    condition: condition.toLowerCase() === "obsolete" ? "obsolete" : "damaged",
    quantityAffected: qty,
    description: description?.trim() || "Reported damaged / obsolete",
    reportedBy: user.userId || 1,
    reportedByName: user.name || "Storekeeper",
    status: "pending",
    approvedBy: null,
    approvedByName: null,
    approvedAt: null,
    createdAt: new Date().toISOString(),
  };

  damagedItems.unshift(record);

  await recordAuditLog({
    userId: user.userId,
    action: "REPORT_DAMAGED_ITEM",
    entityType: "damaged_item",
    entityId: record.id,
    newValues: {
      item: item.name,
      condition: record.condition,
      quantityAffected: qty,
      description,
    },
  });

  return record;
};

export const getDamagedItems = async ({ status = "", condition = "", page = 1, limit = 20 } = {}) => {
  let list = [...damagedItems];
  if (status) {
    list = list.filter((d) => d.status.toLowerCase() === status.toLowerCase());
  }
  if (condition) {
    list = list.filter((d) => d.condition.toLowerCase() === condition.toLowerCase());
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

export const getDamagedItemById = async (id) => {
  const record = damagedItems.find((d) => d.id === Number(id));
  if (!record) {
    const error = new Error("Damaged item record not found");
    error.statusCode = 404;
    throw error;
  }
  return record;
};

export const approveDisposal = async (id, { notes }, user = {}) => {
  const record = await getDamagedItemById(id);

  if (record.status !== "pending") {
    const error = new Error(`Item disposal already ${record.status}`);
    error.statusCode = 422;
    throw error;
  }

  const item = await getProductById(record.inventoryId);
  const newStock = Math.max(0, item.stock - record.quantityAffected);
  await updateProduct(item.id, { stock: newStock });

  record.status = "disposed";
  record.approvedBy = user.userId || 2;
  record.approvedByName = user.name || "PAO Officer";
  record.approvedAt = new Date().toISOString();
  if (notes) record.description = `${record.description ? record.description + " | " : ""}Disposal Approval: ${notes}`;

  await recordAuditLog({
    userId: user.userId,
    action: "APPROVE_DISPOSAL",
    entityType: "damaged_item",
    entityId: record.id,
    newValues: {
      status: "disposed",
      quantityDisposed: record.quantityAffected,
      newStock,
    },
  });

  return {
    damagedItem: record,
    newQuantity: newStock,
  };
};

export const rejectDisposal = async (id, { notes }, user = {}) => {
  const record = await getDamagedItemById(id);

  if (record.status !== "pending") {
    const error = new Error(`Item disposal already ${record.status}`);
    error.statusCode = 422;
    throw error;
  }

  record.status = "rejected";
  record.approvedBy = user.userId || 2;
  record.approvedByName = user.name || "PAO Officer";
  record.approvedAt = new Date().toISOString();
  if (notes) record.description = `${record.description ? record.description + " | " : ""}Disposal Rejection: ${notes}`;

  await recordAuditLog({
    userId: user.userId,
    action: "REJECT_DISPOSAL",
    entityType: "damaged_item",
    entityId: record.id,
    newValues: {
      status: "rejected",
      reason: notes,
    },
  });

  return record;
};
