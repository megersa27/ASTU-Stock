import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.js";
import {
  getStockTakings,
  createStockTaking,
  approveStockTaking,
  rejectStockTaking,
} from "../services/stockTakingService.js";
import { getProducts } from "../services/productService.js";

const StockTaking = () => {
  const { user } = useAuth();
  const [takings, setTakings] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [inventoryId, setInventoryId] = useState("");
  const [physicalQuantity, setPhysicalQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isPAOOrAdmin = user?.role === "pao" || user?.role === "admin";

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [takingsData, prodsData] = await Promise.all([
        getStockTakings(),
        getProducts(),
      ]);
      setTakings(takingsData?.data || takingsData || []);
      setProducts(prodsData || []);
    } catch (err) {
      setError(err.message || "Failed to load stock taking data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inventoryId || physicalQuantity === "") {
      setError("Please select an item and enter physical count");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createStockTaking({
        inventoryId: Number(inventoryId),
        physicalQuantity: Number(physicalQuantity),
        notes,
      });

      setSuccess("Physical stock count recorded and submitted for PAO approval");
      setInventoryId("");
      setPhysicalQuantity("");
      setNotes("");

      await loadData();
    } catch (err) {
      setError(err.message || "Failed to submit stock count");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    const reason = window.prompt("Approval Remarks (Optional):", "Stock reconciliation approved");
    if (reason === null) return;

    try {
      setError("");
      setSuccess("");
      await approveStockTaking(id, reason);
      setSuccess("Stock adjustment approved and ledger updated");
      await loadData();
    } catch (err) {
      setError(err.message || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection:", "Requires physical recount");
    if (!reason) return;

    try {
      setError("");
      setSuccess("");
      await rejectStockTaking(id, reason);
      setSuccess("Stock taking adjustment rejected");
      await loadData();
    } catch (err) {
      setError(err.message || "Rejection failed");
    }
  };

  const selectedItem = products.find((p) => String(p.id) === inventoryId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Stock Taking & Physical Reconciliation
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Perform routine or annual physical inventory verification and PAO discrepancy reconciliation (BR-09, BR-12).
        </p>
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

      {/* Stock Count Entry Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Record Physical Inventory Count
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Enter verified actual stock found on store shelves to compare against system balance.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Item *
            </label>
            <select
              required
              value={inventoryId}
              onChange={(e) => setInventoryId(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Choose item...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.sku || p.itemCode}] {p.name} (Sys: {p.stock})
                </option>
              ))}
            </select>
            {selectedItem && (
              <div className="mt-1 text-xs text-slate-500 font-medium">
                System Qty: <span className="font-bold text-slate-800">{selectedItem.stock}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Physical Count Qty *
            </label>
            <input
              type="number"
              min="0"
              required
              placeholder="Verified actual count..."
              value={physicalQuantity}
              onChange={(e) => setPhysicalQuantity(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
            />
            {selectedItem && physicalQuantity !== "" && (
              <div className="mt-1 text-xs font-bold">
                Variance:{" "}
                <span
                  className={
                    Number(physicalQuantity) - selectedItem.stock < 0
                      ? "text-rose-600"
                      : Number(physicalQuantity) - selectedItem.stock > 0
                      ? "text-emerald-600"
                      : "text-slate-600"
                  }
                >
                  {Number(physicalQuantity) - selectedItem.stock > 0 ? "+" : ""}
                  {Number(physicalQuantity) - selectedItem.stock}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks / Discrepancy Reason
            </label>
            <input
              type="text"
              placeholder="e.g. Broken packaging found..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Physical Count for PAO Verification"}
            </button>
          </div>
        </form>
      </div>

      {/* Stock Takings History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="font-bold text-slate-800 text-sm">
            Stock Taking Verification & Approval Register
          </div>
          <div className="text-xs text-slate-500 font-medium">Total: {takings.length}</div>
        </div>

        {takings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No stock taking sessions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
                <tr>
                  <th className="px-4 py-3.5">Count Date</th>
                  <th className="px-4 py-3.5">Item Code</th>
                  <th className="px-4 py-3.5">Item Name</th>
                  <th className="px-4 py-3.5 text-right">System Qty</th>
                  <th className="px-4 py-3.5 text-right">Physical Count</th>
                  <th className="px-4 py-3.5 text-right">Variance</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5">Notes</th>
                  <th className="px-4 py-3.5 text-right">PAO Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {takings.map((st) => {
                  const isPending = st.status === "pending";
                  const isApproved = st.status === "approved";

                  return (
                    <tr key={st.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3.5 text-slate-600 font-sans">{st.countDate}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-700">{st.itemCode}</td>
                      <td className="px-4 py-3.5 font-sans font-medium text-slate-900">
                        {st.itemName}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-600 font-bold">
                        {st.systemQuantity}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-900 font-bold">
                        {st.physicalQuantity}
                      </td>
                      <td
                        className={`px-4 py-3.5 text-right font-bold ${
                          st.variance < 0
                            ? "text-rose-600"
                            : st.variance > 0
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        {st.variance > 0 ? `+${st.variance}` : st.variance}
                      </td>
                      <td className="px-4 py-3.5 text-center font-sans">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            isPending
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : isApproved
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-sans text-slate-500 max-w-xs truncate">
                        {st.notes || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-sans">
                        {isPending && isPAOOrAdmin ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(st.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(st.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            {st.approvedByName ? `Reviewed by ${st.approvedByName}` : "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockTaking;
