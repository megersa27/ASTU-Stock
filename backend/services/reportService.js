import prisma from "../config/db.js";
import { getAllProducts } from "./productService.js";
import { getStockHistory } from "./stockService.js";
import { getDamagedItems } from "./damagedService.js";
import { getStockTakings } from "./stockTakingService.js";
import { getAuditLogs } from "./auditService.js";
import { getAllCategories } from "./categoryService.js";
import { getAllWarehouses } from "./warehouseService.js";

export const getDashboardReport = async () => {
  const [
    products,
    history,
    pendingTakings,
    pendingDamaged,
    salesSummary,
    expensesSummary,
  ] = await Promise.all([
    getAllProducts(),
    getStockHistory({ limit: 5 }),
    getStockTakings({ status: "pending" }),
    getDamagedItems({ status: "pending" }),

    prisma.sale.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    }),

    prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
    }),
  ]);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (acc, p) => acc + (p.stock || 0),
    0
  );

  const totalValuation = products.reduce(
    (acc, p) => acc + (p.stock || 0) * (p.price || 0),
    0
  );

  const lowStockProducts = products.filter(
    (p) =>
      (p.stock || 0) <=
      (p.minimumLevel !== undefined ? p.minimumLevel : 10)
  );

  const totalSales = salesSummary._count.id || 0;

  const totalRevenue = salesSummary._sum.totalAmount || 0;

  const totalExpenses = expensesSummary._sum.amount || 0;

  const netProfit = totalRevenue - totalExpenses;

  const pendingApprovalsCount =
    (pendingTakings.data?.length || 0) +
    (pendingDamaged.data?.length || 0);

  return {
    totalProducts,
    totalStock,
    totalValuation,

    totalSales,
    totalRevenue,
    totalExpenses,
    netProfit,

    lowStockCount: lowStockProducts.length,
    lowStockProducts,

    pendingApprovalsCount,

    recentTransactions: history.data || [],
  };
};
export const getInventoryReport = async ({ categoryId, warehouseId, from, to } = {}) => {
  let products = await getAllProducts();
  const categories = await getAllCategories();
  const warehouses = await getAllWarehouses();

  if (categoryId) {
    products = products.filter((p) => p.categoryId === Number(categoryId));
  }
  if (warehouseId) {
    products = products.filter((p) => p.warehouseId === Number(warehouseId));
  }

  const items = products.map((p) => {
    const cat = categories.find((c) => c.id === p.categoryId);
    const wh = warehouses.find((w) => w.id === p.warehouseId);
    return {
      ...p,
      categoryName: cat?.name || "General",
      categoryCode: cat?.code || "4401",
      warehouseName: wh?.name || "Main Central Store",
      valuation: (p.stock || 0) * (p.price || 0),
    };
  });

  const totalValuation = items.reduce((acc, i) => acc + i.valuation, 0);
  const totalQuantity = items.reduce((acc, i) => acc + i.stock, 0);

  return {
    totalItems: items.length,
    totalQuantity,
    totalValuation,
    items,
  };
};

export const getStockMovementReport = async ({ from, to, type } = {}) => {
  const result = await getStockHistory({ from, to, type, limit: 100 });
  return {
    totalTransactions: result.pagination.total,
    transactions: result.data,
  };
};

export const getLowStockReport = async () => {
  const products = await getAllProducts();
  const lowStockItems = products.filter(
    (p) => (p.stock || 0) <= (p.minimumLevel !== undefined ? p.minimumLevel : 10)
  );

  return {
    count: lowStockItems.length,
    items: lowStockItems,
  };
};

export const getFifoValuationReport = async () => {
  const products = await getAllProducts();
  const history = await getStockHistory({ type: "RECEIVE", limit: 200 });

  const breakdown = products.map((p) => {
    const receiveBatches = (history.data || [])
      .filter((t) => t.inventoryId === p.id && (t.remainingQuantity || 0) > 0)
      .map((t) => ({
        batchId: t.id,
        referenceNumber: t.referenceNumber,
        dateReceived: t.transactionDate,
        remainingQuantity: t.remainingQuantity || 0,
        unitCost: t.unitCost || p.price || 0,
        batchValuation: (t.remainingQuantity || 0) * (t.unitCost || p.price || 0),
      }));

    const batchTotalValuation = receiveBatches.reduce(
      (acc, b) => acc + b.batchValuation,
      0
    );

    const totalValuation =
      batchTotalValuation > 0 ? batchTotalValuation : (p.stock || 0) * (p.price || 0);

    return {
      itemId: p.id,
      itemCode: p.sku,
      name: p.name,
      currentStock: p.stock,
      unit: p.unit || "pcs",
      batches: receiveBatches,
      totalValuation,
    };
  });

  const totalInventoryValuation = breakdown.reduce(
    (acc, b) => acc + b.totalValuation,
    0
  );

  return {
    totalInventoryValuation,
    totalItems: breakdown.length,
    items: breakdown,
  };
};