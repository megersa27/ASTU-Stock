import { getProductById, updateProduct } from "./productService.js";
import { getSupplierById } from "./supplierService.js";
import { getWarehouseById } from "./warehouseService.js";
import { recordAuditLog } from "./auditService.js";

// Stock Transactions Store
let stockTransactions = [
  {
    id: 1,
    transactionType: "RECEIVE",
    inventoryId: 1,
    quantity: 100,
    remainingQuantity: 80,
    unitCost: 450,
    totalValue: 45000,
    supplierId: 1,
    referenceNumber: "GRN-20260801-001",
    department: null,
    recipientName: null,
    sourceWarehouseId: null,
    destWarehouseId: 1,
    performedBy: 1,
    performedByName: "Megersa Tekalign",
    transactionDate: "2026-08-01",
    notes: "Initial stock batch received from Ethio Stationery",
    createdAt: new Date("2026-08-01T08:30:00Z").toISOString(),
  },
  {
    id: 2,
    transactionType: "ISSUE",
    inventoryId: 1,
    quantity: 20,
    unitCost: 450,
    totalValue: 9000,
    referenceNumber: "IV-20260805-001",
    department: "Computer Science & Engineering",
    recipientName: "Dr. Abebe W.",
    sourceWarehouseId: 1,
    destWarehouseId: null,
    performedBy: 1,
    performedByName: "Megersa Tekalign",
    transactionDate: "2026-08-05",
    notes: "Office printing paper requisition for semester exams",
    createdAt: new Date("2026-08-05T10:15:00Z").toISOString(),
  },
  {
    id: 3,
    transactionType: "RECEIVE",
    inventoryId: 1,
    quantity: 40,
    remainingQuantity: 40,
    unitCost: 460,
    totalValue: 18400,
    supplierId: 1,
    referenceNumber: "GRN-20260815-002",
    department: null,
    recipientName: null,
    sourceWarehouseId: null,
    destWarehouseId: 1,
    performedBy: 1,
    performedByName: "Megersa Tekalign",
    transactionDate: "2026-08-15",
    notes: "Replenishment batch",
    createdAt: new Date("2026-08-15T09:00:00Z").toISOString(),
  },
];
let nextTransId = 4;
let grnCounter = 3;
let ivCounter = 2;
let trCounter = 1;

export const receiveStock = async ({
  inventoryId,
  supplierId,
  quantity,
  unitCost,
  transactionDate,
  referenceNumber,
  warehouseId,
  notes,
}, user = {}) => {
  const item = await getProductById(inventoryId);
  const qty = Number(quantity);
  const cost = Number(unitCost);

  if (!qty || qty <= 0) {
    const error = new Error("Quantity must be a positive number");
    error.statusCode = 400;
    throw error;
  }

  if (cost === undefined || cost < 0) {
    const error = new Error("Unit cost is required for FIFO batch tracking");
    error.statusCode = 400;
    throw error;
  }

  const dateStr = transactionDate || new Date().toISOString().split("T")[0];
  const dateFormatted = dateStr.replace(/-/g, "");
  const grn = referenceNumber || `GRN-${dateFormatted}-${String(grnCounter++).padStart(3, "0")}`;

  const newStock = item.stock + qty;
  await updateProduct(item.id, { stock: newStock });

  const transaction = {
    id: nextTransId++,
    transactionType: "RECEIVE",
    inventoryId: item.id,
    itemName: item.name,
    itemCode: item.sku,
    quantity: qty,
    remainingQuantity: qty,
    unitCost: cost,
    totalValue: qty * cost,
    supplierId: supplierId ? Number(supplierId) : null,
    referenceNumber: grn,
    department: null,
    recipientName: null,
    sourceWarehouseId: null,
    destWarehouseId: warehouseId ? Number(warehouseId) : (item.warehouseId || 1),
    performedBy: user.userId || 1,
    performedByName: user.name || "Storekeeper",
    transactionDate: dateStr,
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };

  stockTransactions.push(transaction);

  await recordAuditLog({
    userId: user.userId,
    action: "RECEIVE_STOCK",
    entityType: "stock_transaction",
    entityId: transaction.id,
    newValues: {
      item: item.name,
      quantity: qty,
      unitCost: cost,
      referenceNumber: grn,
      newStock,
    },
  });

  return {
    transactionId: transaction.id,
    grnNumber: grn,
    newQuantity: newStock,
    transaction,
  };
};

export const issueStock = async ({
  inventoryId,
  quantity,
  department,
  recipientName,
  transactionDate,
  referenceNumber,
  notes,
}, user = {}) => {
  const item = await getProductById(inventoryId);
  const qty = Number(quantity);

  if (!qty || qty <= 0) {
    const error = new Error("Quantity must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  if (qty > item.stock) {
    const error = new Error(`Insufficient stock for ${item.name}. Available: ${item.stock}`);
    error.statusCode = 422;
    throw error;
  }

  // Apply FIFO deduction logic
  const receiveBatches = stockTransactions
    .filter(
      (t) =>
        t.inventoryId === item.id &&
        t.transactionType === "RECEIVE" &&
        (t.remainingQuantity || 0) > 0
    )
    .sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate) || a.id - b.id);

  let needed = qty;
  let totalCost = 0;

  for (const batch of receiveBatches) {
    if (needed <= 0) break;
    const take = Math.min(batch.remainingQuantity, needed);
    batch.remainingQuantity -= take;
    totalCost += take * (batch.unitCost || item.price || 0);
    needed -= take;
  }

  const costOfGoodsIssued = totalCost > 0 ? totalCost : qty * (item.price || 0);
  const newStock = item.stock - qty;
  await updateProduct(item.id, { stock: newStock });

  const dateStr = transactionDate || new Date().toISOString().split("T")[0];
  const dateFormatted = dateStr.replace(/-/g, "");
  const voucher = referenceNumber || `IV-${dateFormatted}-${String(ivCounter++).padStart(3, "0")}`;

  const transaction = {
    id: nextTransId++,
    transactionType: "ISSUE",
    inventoryId: item.id,
    itemName: item.name,
    itemCode: item.sku,
    quantity: qty,
    unitCost: qty > 0 ? costOfGoodsIssued / qty : 0,
    totalValue: costOfGoodsIssued,
    referenceNumber: voucher,
    department: department || "General",
    recipientName: recipientName || "Requisitioner",
    sourceWarehouseId: item.warehouseId || 1,
    destWarehouseId: null,
    performedBy: user.userId || 1,
    performedByName: user.name || "Storekeeper",
    transactionDate: dateStr,
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };

  stockTransactions.push(transaction);

  await recordAuditLog({
    userId: user.userId,
    action: "ISSUE_STOCK",
    entityType: "stock_transaction",
    entityId: transaction.id,
    newValues: {
      item: item.name,
      quantity: qty,
      department,
      recipientName,
      referenceNumber: voucher,
      newStock,
      costOfGoodsIssued,
    },
  });

  return {
    transactionId: transaction.id,
    voucherNumber: voucher,
    newQuantity: newStock,
    costOfGoodsIssued,
    transaction,
  };
};

export const transferStock = async ({
  inventoryId,
  sourceWarehouseId,
  destWarehouseId,
  quantity,
  transactionDate,
  notes,
}, user = {}) => {
  const item = await getProductById(inventoryId);
  const qty = Number(quantity);

  if (Number(sourceWarehouseId) === Number(destWarehouseId)) {
    const error = new Error("Source and destination warehouses cannot be the same");
    error.statusCode = 422;
    throw error;
  }

  if (!qty || qty <= 0) {
    const error = new Error("Quantity must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  if (qty > item.stock) {
    const error = new Error(`Insufficient stock to transfer. Available: ${item.stock}`);
    error.statusCode = 422;
    throw error;
  }

  const dateStr = transactionDate || new Date().toISOString().split("T")[0];
  const dateFormatted = dateStr.replace(/-/g, "");
  const transferRef = `TR-${dateFormatted}-${String(trCounter++).padStart(3, "0")}`;

  const transaction = {
    id: nextTransId++,
    transactionType: "TRANSFER",
    inventoryId: item.id,
    itemName: item.name,
    itemCode: item.sku,
    quantity: qty,
    referenceNumber: transferRef,
    sourceWarehouseId: Number(sourceWarehouseId),
    destWarehouseId: Number(destWarehouseId),
    performedBy: user.userId || 1,
    performedByName: user.name || "Storekeeper",
    transactionDate: dateStr,
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };

  stockTransactions.push(transaction);

  await recordAuditLog({
    userId: user.userId,
    action: "TRANSFER_STOCK",
    entityType: "stock_transaction",
    entityId: transaction.id,
    newValues: {
      item: item.name,
      quantity: qty,
      sourceWarehouseId,
      destWarehouseId,
      referenceNumber: transferRef,
    },
  });

  return {
    transactionId: transaction.id,
    transferNumber: transferRef,
    transaction,
  };
};

export const getStockHistory = async ({ inventoryId, type, from, to, page = 1, limit = 20 } = {}) => {
  let list = [...stockTransactions];

  if (inventoryId) {
    list = list.filter((t) => t.inventoryId === Number(inventoryId));
  }

  if (type) {
    list = list.filter((t) => t.transactionType.toUpperCase() === type.toUpperCase());
  }

  if (from) {
    const fromDate = new Date(from);
    list = list.filter((t) => new Date(t.transactionDate) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    list = list.filter((t) => new Date(t.transactionDate) <= toDate);
  }

  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

export const getBinCard = async (inventoryId, { from, to } = {}) => {
  const item = await getProductById(inventoryId);
  let txs = stockTransactions.filter((t) => t.inventoryId === item.id);

  if (from) {
    const fromDate = new Date(from);
    txs = txs.filter((t) => new Date(t.transactionDate) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    txs = txs.filter((t) => new Date(t.transactionDate) <= toDate);
  }

  // Sort chronological for running balance calculation
  txs.sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate) || a.id - b.id);

  let runningBalance = 0;
  const entries = txs.map((t) => {
    let qtyIn = null;
    let qtyOut = null;

    if (t.transactionType === "RECEIVE" || t.transactionType === "TRANSFER_IN") {
      qtyIn = t.quantity;
      runningBalance += t.quantity;
    } else if (t.transactionType === "ISSUE" || t.transactionType === "TRANSFER_OUT" || t.transactionType === "DISPOSAL") {
      qtyOut = t.quantity;
      runningBalance -= t.quantity;
    } else if (t.transactionType === "ADJUSTMENT") {
      if (t.quantity >= 0) {
        qtyIn = t.quantity;
        runningBalance += t.quantity;
      } else {
        qtyOut = Math.abs(t.quantity);
        runningBalance += t.quantity;
      }
    }

    return {
      id: t.id,
      date: t.transactionDate,
      referenceNumber: t.referenceNumber || `TX-${t.id}`,
      type: t.transactionType,
      quantityIn: qtyIn,
      quantityOut: qtyOut,
      balance: runningBalance,
      department: t.department,
      recipient: t.recipientName,
      performedByName: t.performedByName,
      remarks: t.notes || (t.transactionType === "RECEIVE" ? "Goods Received" : `Issued to ${t.department || "Dept"}`),
    };
  });

  return {
    item: {
      id: item.id,
      itemCode: item.sku,
      name: item.name,
      unit: item.unit || "pcs",
      minimumLevel: item.minimumLevel || 10,
    },
    currentBalance: item.stock,
    entries,
  };
};

export const createAdjustment = async ({ inventoryId, variance, notes }, user = {}) => {
  const item = await getProductById(inventoryId);
  const newStock = item.stock + variance;
  await updateProduct(item.id, { stock: newStock });

  const transaction = {
    id: nextTransId++,
    transactionType: "ADJUSTMENT",
    inventoryId: item.id,
    itemName: item.name,
    itemCode: item.sku,
    quantity: variance,
    referenceNumber: `ADJ-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${item.id}`,
    performedBy: user.userId || 1,
    performedByName: user.name || "PAO",
    transactionDate: new Date().toISOString().split("T")[0],
    notes: notes || "Stock count reconciliation adjustment",
    createdAt: new Date().toISOString(),
  };

  stockTransactions.push(transaction);

  return transaction;
};
