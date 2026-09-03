import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { getDashboardReport } from "../services/reportService.js";

const Dashboard = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboardReport();
      setReport(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading ASTU Stock Dashboard...</p>
        </div>
      </div>
    );
  }

  const isPAOOrAdmin = user?.role === "pao" || user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
              <span>🏛️</span>
              <span>Adama Science and Technology University</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || "Officer"}!
            </h2>
            <p className="mt-1 text-slate-300 text-sm max-w-xl">
              Stock management, inventory movement, and institutional valuation dashboard.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/stock?tab=receive"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition"
            >
              <span>+</span>
              <span>Receive Stock</span>
            </Link>
            <Link
              to="/stock?tab=issue"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition"
            >
              <span>-</span>
              <span>Issue Stock</span>
            </Link>
            <Link
              to="/inventory"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur transition"
            >
              <span>📦</span>
              <span>All Items</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Items */}
        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Total Items</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              📦
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {report?.totalProducts || 0}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Registered in the ASTU inventory catalogue</div>
          </div>
        </div>

        {/* Total Stock Quantity */}
        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Total Stock Qty</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              📊
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {(report?.totalStock || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Units available across stores</div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Low Stock Alert</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              ⚠️
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-600 tracking-tight">
              {report?.lowStockCount || report?.lowStockProducts?.length || 0}
            </div>
            <div className="text-xs text-amber-600/80 mt-1 font-medium">
              Items at or below reorder level
            </div>
          </div>
        </div>

        {/* Total Valuation */}
        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">
              {isPAOOrAdmin ? "Pending Approvals" : "Inventory Valuation"}
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              {isPAOOrAdmin ? "⏳" : "ETB"}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isPAOOrAdmin
                ? `${report?.pendingApprovalsCount || 0} pending`
                : `${(report?.totalValuation || 0).toLocaleString()} ETB`}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {isPAOOrAdmin ? "Stock taking & disposal actions" : "Based on active unit costs"}
            </div>
          </div>
        </div>
      </div>

            {/* Financial KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

{/* Total Sales */}
<div className="rounded-xl bg-white p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition">
  <div className="flex items-center justify-between">
    <span className="text-sm font-semibold text-slate-500">
      Total Sales
    </span>
    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
      🧾
    </div>
  </div>

  <div className="mt-3">
    <div className="text-3xl font-extrabold text-slate-900">
      {(report?.totalSales || 0).toLocaleString()}
    </div>
    <div className="text-xs text-slate-400 mt-1">
      Completed sales transactions
    </div>
  </div>
</div>

{/* Revenue */}
<div className="rounded-xl bg-white p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition">
  <div className="flex items-center justify-between">
    <span className="text-sm font-semibold text-slate-500">
      Total Revenue
    </span>
    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
      💰
    </div>
  </div>

  <div className="mt-3">
    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
      {(report?.totalRevenue || 0).toLocaleString()} ETB
    </div>
    <div className="text-xs text-slate-400 mt-1">
      Revenue from sales
    </div>
  </div>
</div>

{/* Expenses */}
<div className="rounded-xl bg-white p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition">
  <div className="flex items-center justify-between">
    <span className="text-sm font-semibold text-slate-500">
      Total Expenses
    </span>
    <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
      💸
    </div>
  </div>

  <div className="mt-3">
    <div className="text-2xl sm:text-3xl font-extrabold text-red-600">
      {(report?.totalExpenses || 0).toLocaleString()} ETB
    </div>
    <div className="text-xs text-slate-400 mt-1">
      Recorded business expenses
    </div>
  </div>
</div>

{/* Net Profit */}
<div className="rounded-xl bg-white p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition">
  <div className="flex items-center justify-between">
    <span className="text-sm font-semibold text-slate-500">
      Net Profit
    </span>
    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
      📈
    </div>
  </div>

  <div className="mt-3">
    <div
      className={`text-2xl sm:text-3xl font-extrabold ${
        (report?.netProfit || 0) >= 0
          ? "text-purple-600"
          : "text-red-600"
      }`}
    >
      {(report?.netProfit || 0).toLocaleString()} ETB
    </div>
    <div className="text-xs text-slate-400 mt-1">
      Revenue minus expenses
    </div>
  </div>
</div>

</div>

      {/* Main Grid: Low Stock Alert & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="font-bold text-slate-800 text-base">Low Stock Items</h3>
            </div>
            <Link
              to="/reports?type=low-stock"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All →
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {(!report?.lowStockProducts || report.lowStockProducts.length === 0) ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                🎉 All stock levels are sufficient above minimum thresholds.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Item Code</th>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3 text-right">Available</th>
                    <th className="px-4 py-3 text-right">Min Level</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.lowStockProducts.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">
                        {item.sku || item.itemCode}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                      <td className="px-4 py-3 text-right font-bold text-amber-600">
                        {item.stock} {item.unit || "pcs"}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">
                        {item.minimumLevel || 10}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          Low Stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h3 className="font-bold text-slate-800 text-base">Recent Stock Movements</h3>
            </div>
            <Link
              to="/stock?tab=history"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Full History →
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {(!report?.recentTransactions || report.recentTransactions.length === 0) ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No recent stock movements recorded.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Ref No.</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.recentTransactions.slice(0, 5).map((tx) => {
                    const isReceive = tx.transactionType === "RECEIVE";
                    const isIssue = tx.transactionType === "ISSUE";
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 text-xs text-slate-500">{tx.transactionDate}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-700 font-semibold">
                          {tx.referenceNumber || `#${tx.id}`}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
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
                        <td className="px-4 py-3 font-medium text-slate-800 truncate max-w-[140px]">
                          {tx.itemName || `Item #${tx.inventoryId}`}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-bold ${
                            isReceive ? "text-emerald-600" : isIssue ? "text-blue-600" : "text-slate-800"
                          }`}
                        >
                          {isReceive ? `+${tx.quantity}` : isIssue ? `-${tx.quantity}` : tx.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;