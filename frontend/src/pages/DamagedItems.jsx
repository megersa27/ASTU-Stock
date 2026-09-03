import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.js";
import {
  getDamagedItems,
  reportDamagedItem,
  approveDisposal,
  rejectDisposal,
} from "../services/damagedService.js";
import { getProducts } from "../services/productService.js";

const DamagedItems = () => {
  const { user } = useAuth();
  const [damagedList, setDamagedList] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [inventoryId, setInventoryId] = useState("");
  const [condition, setCondition] = useState("damaged");
  const [quantityAffected, setQuantityAffected] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isPAOOrAdmin = user?.role === "pao" || user?.role === "admin";

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dmgData, prodsData] = await Promise.all([
        getDamagedItems(),
        getProducts(),
      ]);
      setDamagedList(dmgData?.data || dmgData || []);
      setProducts(prodsData || []);
    } catch (err) {
      setError(err.message || "Failed to load damaged items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inventoryId || !quantityAffected || !description.trim()) {
      setError("Please fill all required fields (*)");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await reportDamagedItem({
        inventoryId: Number(inventoryId),
        condition,
        quantityAffected: Number(quantityAffected),
        description: description.trim(),
      });

      setSuccess("Damaged / Obsolete report submitted for PAO inspection (BR-10)");
      setInventoryId("");
      setQuantityAffected("");
      setDescription("");

      await loadData();
    } catch (err) {
      setError(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve item disposal? This will permanently deduct units from active inventory.")) return;

    try {
      setError("");
      setSuccess("");
      await approveDisposal(id, "Disposal verified and authorized under ASTU disposal policy");
      setSuccess("Item disposal approved and stock adjusted");
      await loadData();
    } catch (err) {
      setError(err.message || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejecting disposal:", "Item can be repaired / retained");
    if (!reason) return;

    try {
      setError("");
      setSuccess("");
      await rejectDisposal(id, reason);
      setSuccess("Disposal request rejected");
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
          Damaged & Obsolete Items Management
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Inspection, reporting, quarantine, and PAO disposal approval lifecycle under ASTU policy.
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

      {/* Report Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Report Damaged or Obsolete Item
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Flags items for technical inspection before PAO approves write-off or disposal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Item *
              </label>
              <select
                required
                value={inventoryId}
                onChange={(e) => setInventoryId(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-amber-500 focus:outline-none"
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
                Condition *
              </label>
              <div className="flex items-center gap-4 mt-2">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value="damaged"
                    checked={condition === "damaged"}
                    onChange={(e) => setCondition(e.target.value)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>⚠️ Damaged</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value="obsolete"
                    checked={condition === "obsolete"}
                    onChange={(e) => setCondition(e.target.value)}
                    className="text-slate-600 focus:ring-slate-500"
                  />
                  <span>⏳ Obsolete</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity Affected *
              </label>
              <input
                type="number"
                min="1"
                max={selectedItem?.stock || undefined}
                required
                placeholder="e.g. 5"
                value={quantityAffected}
                onChange={(e) => setQuantityAffected(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inspection Details & Cause of Damage *
            </label>
            <textarea
              rows="2"
              required
              placeholder="Describe physical damage, leak, shelf expiration, malfunction details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-amber-500 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-lg shadow-md transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit for Inspection & Disposal Approval"}
          </button>
        </form>
      </div>

      {/* Damaged List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="font-bold text-slate-800 text-sm">
            Damaged & Obsolete Items Register
          </div>
          <div className="text-xs text-slate-500 font-medium">Total: {damagedList.length}</div>
        </div>

        {damagedList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No damaged or obsolete items reported.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
                <tr>
                  <th className="px-4 py-3.5">Report Date</th>
                  <th className="px-4 py-3.5">Item Code</th>
                  <th className="px-4 py-3.5">Item Name</th>
                  <th className="px-4 py-3.5">Condition</th>
                  <th className="px-4 py-3.5 text-right">Qty Affected</th>
                  <th className="px-4 py-3.5">Description</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">PAO Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {damagedList.map((item) => {
                  const isPending = item.status === "pending";
                  const isDisposed = item.status === "disposed";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3.5 text-slate-500 font-sans">
                        {item.createdAt ? item.createdAt.split("T")[0] : "—"}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-700">{item.itemCode}</td>
                      <td className="px-4 py-3.5 font-sans font-medium text-slate-900">
                        {item.itemName}
                      </td>
                      <td className="px-4 py-3.5 font-sans">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            item.condition === "damaged"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {item.condition}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-rose-600 text-sm">
                        {item.quantityAffected}
                      </td>
                      <td className="px-4 py-3.5 font-sans text-slate-600 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="px-4 py-3.5 text-center font-sans">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            isPending
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : isDisposed
                              ? "bg-slate-100 text-slate-700 border border-slate-300"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-sans">
                        {isPending && isPAOOrAdmin ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition"
                            >
                              Approve Disposal
                            </button>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            {item.approvedByName ? `Reviewed by ${item.approvedByName}` : "—"}
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

export default DamagedItems;
