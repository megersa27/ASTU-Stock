import { useEffect, useState } from "react";
import { getAuditLogs, getAuditLog } from "../services/auditService.js";

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const [filterAction, setFilterAction] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAuditLogs({
        action: filterAction,
        from: fromDate,
        to: toDate,
      });
      setLogs(data?.data || data || []);
    } catch (err) {
      setError(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            System Audit Trail & Security Log
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Immutable register of all stock receipts, issues, adjustments, and administrative operations (BR-03, BR-05, BR-15).
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <form
        onSubmit={handleFilter}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-end gap-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Filter Action</label>
          <input
            type="text"
            placeholder="e.g. RECEIVE_STOCK, ISSUE..."
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3.5 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
        >
          Apply Filters
        </button>
      </form>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="font-bold text-slate-800 text-sm">Immutable Audit Log (Read-Only)</div>
          <div className="text-xs text-slate-500 font-medium">Total Entries: {logs.length}</div>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No audit records matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
                <tr>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">Action Performed</th>
                  <th className="px-4 py-3.5">Entity Type</th>
                  <th className="px-4 py-3.5">User ID</th>
                  <th className="px-4 py-3.5">Changes / Snapshot</th>
                  <th className="px-4 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {logs.map((log) => {
                  const isCreate = log.action?.includes("CREATE") || log.action?.includes("RECEIVE");
                  const isDelete = log.action?.includes("DELETE") || log.action?.includes("REJECT");

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3.5 text-slate-600 font-sans">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isCreate
                              ? "bg-emerald-100 text-emerald-800"
                              : isDelete
                              ? "bg-rose-100 text-rose-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-sans">
                        {log.entityType || "system"} #{log.entityId || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 font-sans">
                        {log.userId ? `Officer #${log.userId}` : "System Service"}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate font-sans">
                        {log.newValues ? JSON.stringify(log.newValues) : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-sans">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Audit Log Entry #{selectedLog.id}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedLog.createdAt}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-600">Action:</span>
                <span className="ml-2 font-mono font-bold text-blue-700">{selectedLog.action}</span>
              </div>
              <div>
                <span className="font-bold text-slate-600">Target Entity:</span>
                <span className="ml-2">{selectedLog.entityType} (ID: {selectedLog.entityId})</span>
              </div>
              <div>
                <span className="font-bold text-slate-600">Executed by User ID:</span>
                <span className="ml-2">{selectedLog.userId || "System Action"}</span>
              </div>

              {selectedLog.oldValues && (
                <div className="pt-2">
                  <div className="font-bold text-slate-700 mb-1">State Before Action:</div>
                  <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto">
                    {JSON.stringify(selectedLog.oldValues, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.newValues && (
                <div className="pt-2">
                  <div className="font-bold text-slate-700 mb-1">State After Action:</div>
                  <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto">
                    {JSON.stringify(selectedLog.newValues, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
