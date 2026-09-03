import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  receiveStock,
  issueStock,
  transferStock,
  getStockHistory,
} from "../services/stockService.js";
import { getProducts } from "../services/productService.js";
import { getSuppliers } from "../services/supplierService.js";
import { getWarehouses } from "../services/warehouseService.js";

const StockManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "receive";

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form States
  const [receiveForm, setReceiveForm] = useState({
    inventoryId: "",
    supplierId: "",
    quantity: "",
    unitCost: "",
    warehouseId: "1",
    transactionDate: new Date().toISOString().split("T")[0],
    referenceNumber: "",
    notes: "",
  });

  const [issueForm, setIssueForm] = useState({
    inventoryId: "",
    quantity: "",
    department: "",
    recipientName: "",
    transactionDate: new Date().toISOString().split("T")[0],
    referenceNumber: "",
    notes: "",
  });

  const [transferForm, setTransferForm] = useState({
    inventoryId: "",
    sourceWarehouseId: "1",
    destWarehouseId: "2",
    quantity: "",
    transactionDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      const [prodsData, supsData, whsData, histData] = await Promise.all([
        getProducts(),
        getSuppliers(),
        getWarehouses(),
        getStockHistory({ limit: 50 }),
      ]);
      setProducts(prodsData || []);
      setSuppliers(supsData || []);
      setWarehouses(whsData || []);
      setHistory(histData?.data || histData || []);
    } catch (err) {
      setError(err.message || "Failed to load stock data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const setTab = (tabName) => {
    setError("");
    setSuccess("");
    setSearchParams({ tab: tabName });
  };

  // Receive Submission
  const handleReceiveSubmit = async (e) => {
    e.preventDefault();
    if (!receiveForm.inventoryId || !receiveForm.quantity || !receiveForm.unitCost) {
      setError("Please fill all required fields (*)");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const res = await receiveStock({
        inventoryId: Number(receiveForm.inventoryId),
        supplierId: receiveForm.supplierId ? Number(receiveForm.supplierId) : null,
        quantity: Number(receiveForm.quantity),
        unitCost: Number(receiveForm.unitCost),
        warehouseId: Number(receiveForm.warehouseId),
        transactionDate: receiveForm.transactionDate,
        referenceNumber: receiveForm.referenceNumber || undefined,
        notes: receiveForm.notes,
      });

      setSuccess(`Stock received successfully. ${res.grnNumber || "GRN"} generated.`);
      setReceiveForm({
        inventoryId: "",
        supplierId: "",
        quantity: "",
        unitCost: "",
        warehouseId: "1",
        transactionDate: new Date().toISOString().split("T")[0],
        referenceNumber: "",
        notes: "",
      });

      await loadInitialData();
    } catch (err) {
      setError(err.message || "Failed to receive stock");
    } finally {
      setSubmitting(false);
    }
  };

  // Issue Submission
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!issueForm.inventoryId || !issueForm.quantity || !issueForm.department || !issueForm.recipientName) {
      setError("Please fill all required fields (*)");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const res = await issueStock({
        inventoryId: Number(issueForm.inventoryId),
        quantity: Number(issueForm.quantity),
        department: issueForm.department,
        recipientName: issueForm.recipientName,
        transactionDate: issueForm.transactionDate,
        referenceNumber: issueForm.referenceNumber || undefined,
        notes: issueForm.notes,
      });

      setSuccess(`Stock issued successfully. ${res.voucherNumber || "Issue Voucher"} generated.`);
      setIssueForm({
        inventoryId: "",
        quantity: "",
        department: "",
        recipientName: "",
        transactionDate: new Date().toISOString().split("T")[0],
        referenceNumber: "",
        notes: "",
      });

      await loadInitialData();
    } catch (err) {
      setError(err.message || "Failed to issue stock");
    } finally {
      setSubmitting(false);
    }
  };

  // Transfer Submission
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferForm.inventoryId || !transferForm.quantity) {
      setError("Please fill all required fields (*)");
      return;
    }

    if (transferForm.sourceWarehouseId === transferForm.destWarehouseId) {
      setError("Source and destination warehouses must be different");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const res = await transferStock({
        inventoryId: Number(transferForm.inventoryId),
        sourceWarehouseId: Number(transferForm.sourceWarehouseId),
        destWarehouseId: Number(transferForm.destWarehouseId),
        quantity: Number(transferForm.quantity),
        transactionDate: transferForm.transactionDate,
        notes: transferForm.notes,
      });

      setSuccess(`Stock transferred successfully. ${res.transferNumber || "Transfer Voucher"} generated.`);
      setTransferForm({
        inventoryId: "",
        sourceWarehouseId: "1",
        destWarehouseId: "2",
        quantity: "",
        transactionDate: new Date().toISOString().split("T")[0],
        notes: "",
      });

      await loadInitialData();
    } catch (err) {
      setError(err.message || "Failed to transfer stock");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedIssueItem = products.find((p) => String(p.id) === issueForm.inventoryId);
  const selectedTransferItem = products.find((p) => String(p.id) === transferForm.inventoryId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Operations</h2>
        <p className="text-sm text-slate-500 mt-1">
          Receive deliveries (GRN), issue requisitions (IV), warehouse transfers, and movement history.
        </p>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl">
        <button
          onClick={() => setTab("receive")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "receive"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          📥 + Receive Stock (GRN)
        </button>
        <button
          onClick={() => setTab("issue")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "issue"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          📤 - Issue Stock (Voucher)
        </button>
        <button
          onClick={() => setTab("transfer")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "transfer"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          🔄 Warehouse Transfer
        </button>
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === "history"
              ? "border-slate-800 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          📜 Transaction History
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold">✕</button>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="font-bold">✕</button>
        </div>
      )}

      {/* Tab 1: Receive Stock */}
      {activeTab === "receive" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Goods Receiving Note (GRN) — Inbound Delivery
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Records stock from registered suppliers and establishes batch cost for FIFO valuation.
            </p>

            <form onSubmit={handleReceiveSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Item *
                  </label>
                  <select
                    required
                    value={receiveForm.inventoryId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const p = products.find((prod) => String(prod.id) === id);
                      setReceiveForm((prev) => ({
                        ...prev,
                        inventoryId: id,
                        unitCost: p?.price ? String(p.price) : prev.unitCost,
                      }));
                    }}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Choose item...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.sku || p.itemCode}] {p.name} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivering Supplier
                  </label>
                  <select
                    value={receiveForm.supplierId}
                    onChange={(e) =>
                      setReceiveForm((prev) => ({ ...prev, supplierId: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select Supplier (Optional)</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Received Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 100"
                    value={receiveForm.quantity}
                    onChange={(e) =>
                      setReceiveForm((prev) => ({ ...prev, quantity: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batch Unit Cost (ETB) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="e.g. 450"
                    value={receiveForm.unitCost}
                    onChange={(e) =>
                      setReceiveForm((prev) => ({ ...prev, unitCost: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Receiving Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={receiveForm.transactionDate}
                    onChange={(e) =>
                      setReceiveForm((prev) => ({ ...prev, transactionDate: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Receiving Warehouse
                  </label>
                  <select
                    value={receiveForm.warehouseId}
                    onChange={(e) =>
                      setReceiveForm((prev) => ({ ...prev, warehouseId: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supplier Invoice / Ref No.
                  </label>
                  <input
                    type="text"
                    placeholder="Optional (Auto-generated if empty)"
                    value={receiveForm.referenceNumber}
                    onChange={(e) =>
                      setReceiveForm((prev) => ({ ...prev, referenceNumber: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Receiving Remarks
                </label>
                <textarea
                  rows="2"
                  placeholder="Notes on package condition, delivery vehicle..."
                  value={receiveForm.notes}
                  onChange={(e) =>
                    setReceiveForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-md transition disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Confirm & Generate GRN"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Issue Stock */}
      {activeTab === "issue" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Issue Voucher (IV) — Departmental Outbound Requisition
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Issues stock to campus departments and deducts oldest batches according to the university FIFO policy.
            </p>

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Item *
                </label>
                <select
                  required
                  value={issueForm.inventoryId}
                  onChange={(e) =>
                    setIssueForm((prev) => ({ ...prev, inventoryId: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Choose item...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock === 0}>
                      [{p.sku || p.itemCode}] {p.name} — Available: {p.stock} {p.unit || "pcs"}
                    </option>
                  ))}
                </select>

                {selectedIssueItem && (
                  <div className="mt-2 text-xs font-bold text-blue-700 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                    📦 Live Available Stock: {selectedIssueItem.stock} {selectedIssueItem.unit || "pcs"}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Issue Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedIssueItem?.stock || undefined}
                    required
                    placeholder="e.g. 20"
                    value={issueForm.quantity}
                    onChange={(e) =>
                      setIssueForm((prev) => ({ ...prev, quantity: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={issueForm.transactionDate}
                    onChange={(e) =>
                      setIssueForm((prev) => ({ ...prev, transactionDate: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requisitioning Department *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electrical Engineering Dept"
                    value={issueForm.department}
                    onChange={(e) =>
                      setIssueForm((prev) => ({ ...prev, department: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recipient Name / Staff *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Abebe Kebede"
                    value={issueForm.recipientName}
                    onChange={(e) =>
                      setIssueForm((prev) => ({ ...prev, recipientName: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Purpose / Requisition Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="Purpose of issue, approval reference..."
                  value={issueForm.notes}
                  onChange={(e) =>
                    setIssueForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md transition disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Confirm & Generate Issue Voucher"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Transfer Stock */}
      {activeTab === "transfer" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Inter-Warehouse Stock Transfer
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Transfer verified inventory batches between physical store locations.
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Item *
                </label>
                <select
                  required
                  value={transferForm.inventoryId}
                  onChange={(e) =>
                    setTransferForm((prev) => ({ ...prev, inventoryId: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Choose item...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock === 0}>
                      [{p.sku || p.itemCode}] {p.name} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Source Warehouse *
                  </label>
                  <select
                    value={transferForm.sourceWarehouseId}
                    onChange={(e) =>
                      setTransferForm((prev) => ({ ...prev, sourceWarehouseId: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination Warehouse *
                  </label>
                  <select
                    value={transferForm.destWarehouseId}
                    onChange={(e) =>
                      setTransferForm((prev) => ({ ...prev, destWarehouseId: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Transfer Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTransferItem?.stock || undefined}
                    required
                    placeholder="e.g. 10"
                    value={transferForm.quantity}
                    onChange={(e) =>
                      setTransferForm((prev) => ({ ...prev, quantity: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Transfer Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={transferForm.transactionDate}
                    onChange={(e) =>
                      setTransferForm((prev) => ({ ...prev, transactionDate: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows="2"
                  placeholder="Transfer justification..."
                  value={transferForm.notes}
                  onChange={(e) =>
                    setTransferForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg shadow-md transition disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Confirm Inter-Warehouse Transfer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Stock History */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 font-bold text-sm text-slate-800">
            Full Stock Movement History
          </div>
          {history.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-200 uppercase">
                  <tr>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Ref No.</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">Item</th>
                    <th className="px-4 py-3.5 text-right">Qty</th>
                    <th className="px-4 py-3.5">Destination / Department</th>
                    <th className="px-4 py-3.5">Performed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {history.map((tx) => {
                    const isReceive = tx.transactionType === "RECEIVE";
                    const isIssue = tx.transactionType === "ISSUE";
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3.5 text-slate-600 font-sans">{tx.transactionDate}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-800">
                          {tx.referenceNumber || `#${tx.id}`}
                        </td>
                        <td className="px-4 py-3.5 font-sans">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                              isReceive
                                ? "bg-emerald-100 text-emerald-800"
                                : isIssue
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {tx.transactionType}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-sans font-medium text-slate-800">
                          {tx.itemName || `Item #${tx.inventoryId}`}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-right font-bold ${
                            isReceive ? "text-emerald-600" : isIssue ? "text-blue-600" : "text-slate-800"
                          }`}
                        >
                          {isReceive ? `+${tx.quantity}` : isIssue ? `-${tx.quantity}` : tx.quantity}
                        </td>
                        <td className="px-4 py-3.5 font-sans text-slate-600">
                          {tx.department || tx.recipientName || "Main Store"}
                        </td>
                        <td className="px-4 py-3.5 font-sans text-slate-500">
                          {tx.performedByName || "Officer"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockManagement;
