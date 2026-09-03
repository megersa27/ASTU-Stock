import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBinCard } from "../services/stockService.js";

const BinCard = () => {
  const { id } = useParams();
  const [binData, setBinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBinCard(id, { from: fromDate, to: toDate });
      setBinData(data);
    } catch (err) {
      setError(err.message || "Failed to load bin card");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const handleFilter = (e) => {
    e.preventDefault();
    loadData();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !binData) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-slate-500 font-medium">Loading Digital Bin Card...</div>
      </div>
    );
  }

  const item = binData?.item || {};
  const entries = binData?.entries || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/inventory"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            ← Back
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              ASTU Digital Bin Card
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous stock balance register and transaction verification ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            <span>🖨️</span>
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Item Metadata Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Item Code / SKU</span>
            <div className="text-base font-bold font-mono text-slate-800 mt-1">
              {item.itemCode || "N/A"}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Item Name</span>
            <div className="text-base font-bold text-slate-800 mt-1">{item.name || "Item"}</div>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Unit of Measure</span>
            <div className="text-base font-bold text-slate-800 mt-1">{item.unit || "pcs"}</div>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Current Ledger Balance</span>
            <div className="text-xl font-extrabold text-blue-600 mt-0.5">
              {(binData?.currentBalance || 0).toLocaleString()} {item.unit || "units"}
            </div>
          </div>
        </div>
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
          Filter Range
        </button>
        {(fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setFromDate("");
              setToDate("");
              loadData();
            }}
            className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700"
          >
            Clear Filter
          </button>
        )}
      </form>

      {/* Bin Card Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="font-bold text-slate-800 text-sm">
            Stock Movement Register (Chronological Ledger)
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Entries: {entries.length}
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No stock movements recorded for this item yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 border-r border-slate-200">Date</th>
                  <th className="px-4 py-3 border-r border-slate-200">Ref. Voucher #</th>
                  <th className="px-4 py-3 border-r border-slate-200">Type</th>
                  <th className="px-4 py-3 text-right border-r border-slate-200 text-emerald-700">
                    Qty In (+)
                  </th>
                  <th className="px-4 py-3 text-right border-r border-slate-200 text-rose-700">
                    Qty Out (-)
                  </th>
                  <th className="px-4 py-3 text-right border-r border-slate-200 text-blue-800 font-extrabold">
                    Balance
                  </th>
                  <th className="px-4 py-3 border-r border-slate-200">Department / Party</th>
                  <th className="px-4 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {entries.map((entry) => {
                  const isIn = entry.quantityIn !== null;
                  const isOut = entry.quantityOut !== null;

                  return (
                    <tr
                      key={entry.id}
                      className={`hover:bg-slate-50 transition ${
                        isIn ? "bg-emerald-50/20" : isOut ? "bg-rose-50/20" : ""
                      }`}
                    >
                      <td className="px-4 py-3 border-r border-slate-100 text-slate-700 font-sans">
                        {entry.date}
                      </td>
                      <td className="px-4 py-3 border-r border-slate-100 font-bold text-slate-800">
                        {entry.referenceNumber}
                      </td>
                      <td className="px-4 py-3 border-r border-slate-100 font-sans">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            isIn
                              ? "bg-emerald-100 text-emerald-800"
                              : isOut
                              ? "bg-rose-100 text-rose-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {entry.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right border-r border-slate-100 font-bold text-emerald-600">
                        {entry.quantityIn ? `+${entry.quantityIn}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right border-r border-slate-100 font-bold text-rose-600">
                        {entry.quantityOut ? `-${entry.quantityOut}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right border-r border-slate-100 font-bold text-blue-700 bg-slate-50/50">
                        {entry.balance}
                      </td>
                      <td className="px-4 py-3 border-r border-slate-100 font-sans text-slate-700">
                        {entry.department || entry.recipient || "—"}
                      </td>
                      <td className="px-4 py-3 font-sans text-slate-500">
                        {entry.remarks || "—"}
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

export default BinCard;
