import { useEffect, useState } from "react";
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../services/warehouseService.js";
import { getProducts } from "../services/productService.js";

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const [selectedWarehouseDetail, setSelectedWarehouseDetail] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [whsData, prodsData] = await Promise.all([
        getWarehouses(),
        getProducts(),
      ]);
      setWarehouses(whsData || []);
      setProducts(prodsData || []);
    } catch (err) {
      setError(err.message || "Failed to load warehouses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", location: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (wh) => {
    setEditingId(wh.id);
    setFormData({
      name: wh.name,
      location: wh.location || "",
      description: wh.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Warehouse name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateWarehouse(editingId, formData);
        setSuccess("Warehouse details updated");
      } else {
        await createWarehouse(formData);
        setSuccess("New warehouse storage facility registered");
      }

      setIsModalOpen(false);
      setFormData({ name: "", location: "", description: "" });
      await loadData();
    } catch (err) {
      setError(err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setError("");
      setSuccess("");
      await deleteWarehouse(id);
      setSuccess(`Warehouse "${name}" deleted`);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete warehouse");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Warehouses & Storage Facilities
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Physical store locations, building blocks, and per-warehouse inventory breakdown.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-md transition"
        >
          <span>+</span>
          <span>Add Warehouse</span>
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

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warehouses.map((wh) => {
          const storedItems = products.filter(
            (p) => p.warehouseId === wh.id || (!p.warehouseId && wh.id === 1)
          );
          const totalUnits = storedItems.reduce((acc, p) => acc + (p.stock || 0), 0);

          return (
            <div
              key={wh.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                    🏢
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Active Store
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{wh.name}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                  <span>📍</span>
                  <span>{wh.location || "Main Campus"}</span>
                </div>
                <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                  {wh.description || "General university inventory storage facility."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-3 font-semibold">
                  <span className="text-slate-500">Catalogued Items:</span>
                  <span className="text-slate-900">{storedItems.length} types ({totalUnits} units)</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedWarehouseDetail(wh)}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-center"
                  >
                    View Stock
                  </button>
                  <button
                    onClick={() => openEditModal(wh)}
                    className="py-1.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(wh.id, wh.name)}
                    className="py-1.5 px-3 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warehouse Detail Drawer / Table */}
      {selectedWarehouseDetail && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Stock Levels — {selectedWarehouseDetail.name}
              </h3>
              <p className="text-xs text-slate-500">{selectedWarehouseDetail.location}</p>
            </div>
            <button
              onClick={() => setSelectedWarehouseDetail(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Close ✕
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-200 uppercase">
                <tr>
                  <th className="px-4 py-3">Item Code</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3 text-right">Available Qty</th>
                  <th className="px-4 py-3 text-right">Min Level</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {products
                  .filter(
                    (p) =>
                      p.warehouseId === selectedWarehouseDetail.id ||
                      (!p.warehouseId && selectedWarehouseDetail.id === 1)
                  )
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{item.sku}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {item.stock} {item.unit || "pcs"}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">{item.minimumLevel || 10}</td>
                      <td className="px-4 py-3 text-center">
                        {(item.stock || 0) <= (item.minimumLevel || 10) ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingId ? "Edit Warehouse Facility" : "Register Storage Facility"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warehouse Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Complex Store"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location / Campus Block
                </label>
                <input
                  type="text"
                  placeholder="e.g. Block B, Ground Floor Room 102"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Purpose of storage facility..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
                >
                  {saving ? "Saving..." : editingId ? "Update" : "Save Warehouse"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouses;
