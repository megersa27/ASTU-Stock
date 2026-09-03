import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getInventoryReport,
  getStockMovementReport,
  getLowStockReport,
  getFifoValuationReport,
  getDamagedReport,
  getStockTakingReport,
  getAuditReport,
} from "../services/reportService.js";

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeReport = searchParams.get("type") || "inventory";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");
      let data = null;

      if (activeReport === "inventory") {
        data = await getInventoryReport({ from: fromDate, to: toDate });
      } else if (activeReport === "stock-movement") {
        data = await getStockMovementReport({ from: fromDate, to: toDate });
      } else if (activeReport === "low-stock") {
        data = await getLowStockReport();
      } else if (activeReport === "fifo") {
        data = await getFifoValuationReport();
      } else if (activeReport === "damaged") {
        data = await getDamagedReport({ from: fromDate, to: toDate });
      } else if (activeReport === "stock-taking") {
        data = await getStockTakingReport();
      } else if (activeReport === "audit") {
        data = await getAuditReport({ from: fromDate, to: toDate });
      }

      setReportData(data);
    } catch (err) {
      setError(err.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [activeReport]);

  const switchReport = (type) => {
    setSearchParams({ type });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    loadReport();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Reports & Stock Valuation
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            ASTU inventory compliance reports, FIFO valuation ledgers, and audit documentation.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow transition"
        >
          <span>🖨️</span>
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl overflow-x-auto print:hidden">
        {[
          { id: "inventory", label: "📦 Inventory Summary" },
          { id: "fifo", label: "💰 FIFO Valuation" },
          { id: "low-stock", label: "⚠️ Low Stock Alerts" },
          { id: "stock-movement", label: "🔄 Stock Movement" },
          { id: "damaged", label: "🏚️ Damaged & Obsolete" },
          { id: "stock-taking", label: "📋 Stock Reconciliation" },
          { id: "audit", label: "📜 Audit Activity" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchReport(tab.id)}
            className={`px-4 py-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition ${
              activeReport === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Filter Bar */}
      <form
        onSubmit={handleFilter}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-end gap-4 print:hidden"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
        >
          Generate Report
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Report Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400 font-medium">
            Generating report data...
          </div>
        ) : (
          <div>
            {/* 1. Inventory Summary Report */}
            {activeReport === "inventory" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Inventory Summary Report</h3>
                    <div className="text-xs text-slate-500">
                      Total Items Catalogued: {reportData?.totalItems || 0}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-semibold">Total Asset Valuation:</span>
                    <div className="text-2xl font-extrabold text-blue-700">
                      {(reportData?.totalValuation || 0).toLocaleString()} ETB
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
                      <tr>
                        <th className="px-4 py-3">Item Code</th>
                        <th className="px-4 py-3">Item Name</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Warehouse</th>
                        <th className="px-4 py-3 text-right">Available Qty</th>
                        <th className="px-4 py-3 text-right">Unit Price</th>
                        <th className="px-4 py-3 text-right font-bold text-slate-900">Total Valuation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {(reportData?.items || []).map((i) => (
                        <tr key={i.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono font-bold text-slate-700">{i.sku}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{i.name}</td>
                          <td className="px-4 py-3 text-slate-600">{i.categoryName}</td>
                          <td className="px-4 py-3 text-slate-600">{i.warehouseName}</td>
                          <td className="px-4 py-3 text-right font-bold">{i.stock} {i.unit || "pcs"}</td>
                          <td className="px-4 py-3 text-right font-mono">{i.price?.toLocaleString()} ETB</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-blue-700">
                            {((i.stock || 0) * (i.price || 0)).toLocaleString()} ETB
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. FIFO Valuation Report */}
            {activeReport === "fifo" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      First-In, First-Out (FIFO) Valuation Ledger
                    </h3>
                    <p className="text-xs text-slate-500">
                      Calculates inventory value based on chronological inbound batch purchase costs (Rule BR-08).
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-semibold">Total FIFO Valuation:</span>
                    <div className="text-2xl font-extrabold text-emerald-700">
                      {(reportData?.totalInventoryValuation || 0).toLocaleString()} ETB
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {(reportData?.items || []).map((item) => (
                    <div key={item.itemId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mr-2">
                            {item.itemCode}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                        </div>
                        <div className="text-sm font-bold text-emerald-700 font-mono">
                          Valuation: {item.totalValuation.toLocaleString()} ETB
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 mb-3">
                        Total Stock: <span className="font-bold text-slate-800">{item.currentStock} {item.unit}</span>
                      </div>

                      {item.batches?.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                              <tr>
                                <th className="px-3 py-2">Batch Date</th>
                                <th className="px-3 py-2">GRN Ref</th>
                                <th className="px-3 py-2 text-right">Remaining Qty</th>
                                <th className="px-3 py-2 text-right">Unit Batch Cost</th>
                                <th className="px-3 py-2 text-right">Batch Total Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {item.batches.map((b) => (
                                <tr key={b.batchId}>
                                  <td className="px-3 py-2 font-sans text-slate-600">{b.dateReceived}</td>
                                  <td className="px-3 py-2 font-bold text-slate-800">{b.referenceNumber}</td>
                                  <td className="px-3 py-2 text-right font-bold">{b.remainingQuantity}</td>
                                  <td className="px-3 py-2 text-right">{b.unitCost} ETB</td>
                                  <td className="px-3 py-2 text-right font-bold text-emerald-600">
                                    {b.batchValuation.toLocaleString()} ETB
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic bg-white p-2.5 rounded border border-slate-100">
                          Valued at standard initial catalog cost ({item.currentStock} × standard unit price).
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Low Stock Report */}
            {activeReport === "low-stock" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-amber-900 text-base">Low Stock & Reorder Alert Report</h3>
                    <p className="text-xs text-amber-700">
                      Items that have fallen below university minimum stock thresholds (Rule BR-14).
                    </p>
                  </div>
                  <div className="text-xl font-extrabold text-amber-900">
                    {reportData?.count || 0} Critical Items
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
                      <tr>
                        <th className="px-4 py-3">Item Code</th>
                        <th className="px-4 py-3">Item Name</th>
                        <th className="px-4 py-3 text-right">Available Stock</th>
                        <th className="px-4 py-3 text-right">Minimum Level</th>
                        <th className="px-4 py-3 text-right">Reorder Level</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {(reportData?.items || []).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 bg-amber-50/20">
                          <td className="px-4 py-3 font-mono font-bold text-slate-700">{item.sku}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                          <td className="px-4 py-3 text-right font-bold text-amber-600 text-sm">
                            {item.stock} {item.unit || "pcs"}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500 font-medium">
                            {item.minimumLevel || 10}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500 font-medium">
                            {item.reorderLevel || 20}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Low Stock
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Stock Movement Report */}
            {activeReport === "stock-movement" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Stock Movement Register</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Ref No.</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3 text-right">Quantity</th>
                        <th className="px-4 py-3">Department / Party</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-xs">
                      {(reportData?.transactions || []).map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-sans text-slate-600">{t.transactionDate}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">{t.referenceNumber}</td>
                          <td className="px-4 py-3 font-sans">
                            <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-slate-100 text-slate-700">
                              {t.transactionType}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-sans font-medium text-slate-900">{t.itemName}</td>
                          <td className="px-4 py-3 text-right font-bold text-slate-900">{t.quantity}</td>
                          <td className="px-4 py-3 font-sans text-slate-600">
                            {t.department || t.recipientName || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. Damaged Items Report */}
            {activeReport === "damaged" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Damaged & Obsolete Items Report</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
                      <tr>
                        <th className="px-4 py-3">Item Code</th>
                        <th className="px-4 py-3">Item Name</th>
                        <th className="px-4 py-3">Condition</th>
                        <th className="px-4 py-3 text-right">Qty</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {(reportData || []).map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono font-bold text-slate-700">{d.itemCode}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{d.itemName}</td>
                          <td className="px-4 py-3 uppercase font-bold text-amber-700">{d.condition}</td>
                          <td className="px-4 py-3 text-right font-bold text-rose-600">{d.quantityAffected}</td>
                          <td className="px-4 py-3 capitalize font-semibold">{d.status}</td>
                          <td className="px-4 py-3 text-slate-500">{d.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. Stock Taking Report */}
            {activeReport === "stock-taking" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Stock Taking & Reconciliation Report</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
                      <tr>
                        <th className="px-4 py-3">Count Date</th>
                        <th className="px-4 py-3">Item Code</th>
                        <th className="px-4 py-3">Item Name</th>
                        <th className="px-4 py-3 text-right">System Qty</th>
                        <th className="px-4 py-3 text-right">Physical Count</th>
                        <th className="px-4 py-3 text-right">Variance</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-xs">
                      {(reportData || []).map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-sans text-slate-600">{st.countDate}</td>
                          <td className="px-4 py-3 font-bold text-slate-700">{st.itemCode}</td>
                          <td className="px-4 py-3 font-sans font-medium text-slate-900">{st.itemName}</td>
                          <td className="px-4 py-3 text-right font-bold">{st.systemQuantity}</td>
                          <td className="px-4 py-3 text-right font-bold">{st.physicalQuantity}</td>
                          <td
                            className={`px-4 py-3 text-right font-bold ${
                              st.variance < 0 ? "text-rose-600" : st.variance > 0 ? "text-emerald-600" : "text-slate-400"
                            }`}
                          >
                            {st.variance > 0 ? `+${st.variance}` : st.variance}
                          </td>
                          <td className="px-4 py-3 text-center font-sans capitalize font-bold">
                            {st.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. Audit Activity Report */}
            {activeReport === "audit" && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">System Audit Activity Report</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
                      <tr>
                        <th className="px-4 py-3">Timestamp</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3">Entity</th>
                        <th className="px-4 py-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-mono">
                      {(reportData || []).map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500 font-sans">{new Date(a.createdAt).toLocaleString()}</td>
                          <td className="px-4 py-3 font-bold text-blue-700">{a.action}</td>
                          <td className="px-4 py-3 text-slate-600">{a.entityType} #{a.entityId || ""}</td>
                          <td className="px-4 py-3 font-sans text-slate-600">
                            {a.newValues ? JSON.stringify(a.newValues) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;