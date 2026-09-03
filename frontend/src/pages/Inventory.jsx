import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService.js";
import { getCategories } from "../services/categoryService.js";
import { getWarehouses } from "../services/warehouseService.js";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: "",
    sku: "",
    categoryId: "",
    warehouseId: "1",
    unit: "pcs",
    price: "",
    stock: "0",
    minimumLevel: "10",
    maximumLevel: "500",
    reorderLevel: "20",
    safetyStock: "5",
    description: "",
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [itemsData, catsData, whsData] = await Promise.all([
        getProducts(),
        getCategories(),
        getWarehouses(),
      ]);
      setItems(itemsData || []);
      setCategories(catsData || []);
      setWarehouses(whsData || []);
    } catch (err) {
      setError(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setFormData(initialForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || "",
      sku: item.sku || item.itemCode || "",
      categoryId: String(item.categoryId || ""),
      warehouseId: String(item.warehouseId || "1"),
      unit: item.unit || "pcs",
      price: item.price !== undefined ? String(item.price) : "",
      stock: item.stock !== undefined ? String(item.stock) : "0",
      minimumLevel: String(item.minimumLevel || "10"),
      maximumLevel: String(item.maximumLevel || "500"),
      reorderLevel: String(item.reorderLevel || "20"),
      safetyStock: String(item.safetyStock || "5"),
      description: item.description || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.categoryId) {
      setError("Please complete all required fields (*)");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateProduct(editingId, {
          name: formData.name,
          sku: formData.sku,
          categoryId: Number(formData.categoryId),
          warehouseId: Number(formData.warehouseId),
          unit: formData.unit,
          price: Number(formData.price || 0),
          stock: Number(formData.stock || 0),
          minimumLevel: Number(formData.minimumLevel || 10),
          maximumLevel: Number(formData.maximumLevel || 500),
          reorderLevel: Number(formData.reorderLevel || 20),
          safetyStock: Number(formData.safetyStock || 5),
          description: formData.description,
        });
        setSuccess("Item updated successfully");
      } else {
        await createProduct({
          name: formData.name,
          sku: formData.sku,
          categoryId: Number(formData.categoryId),
          warehouseId: Number(formData.warehouseId),
          unit: formData.unit,
          price: Number(formData.price || 0),
          stock: Number(formData.stock || 0),
          minimumLevel: Number(formData.minimumLevel || 10),
          maximumLevel: Number(formData.maximumLevel || 500),
          reorderLevel: Number(formData.reorderLevel || 20),
          safetyStock: Number(formData.safetyStock || 5),
          description: formData.description,
        });
        setSuccess("New inventory item registered");
      }

      closeModal();
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
      await deleteProduct(id);
      setSuccess(`"${name}" removed from inventory`);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete item");
    }
  };

  // Filtered List
  const filteredItems = items.filter((item) => {
    const s = search.toLowerCase();
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(s) ||
      (item.sku && item.sku.toLowerCase().includes(s));

    const matchesCat = !selectedCategory || String(item.categoryId) === selectedCategory;

    const isLow = (item.stock || 0) <= (item.minimumLevel || 10);
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "low" && isLow) ||
      (selectedStatus === "ok" && !isLow);

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inventory Catalogue
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Official university stock items, classifications, and safety thresholds.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-md shadow-blue-500/20 transition"
        >
          <span>+</span>
          <span>Add New Item</span>
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Search Items</label>
          <input
            type="text"
            placeholder="Search by name or code (e.g. 4401-001)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.code ? `[${cat.code}] ` : ""}{cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Stock Level Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ok">Sufficient (OK)</option>
            <option value="low">Low Stock Alert</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading inventory catalogue...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-3xl mb-2">📦</div>
            <div className="font-semibold text-slate-700 text-base">No inventory items found</div>
            <p className="text-slate-400 text-sm mt-1">Try adjusting search or add a new stock item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Item Code</th>
                  <th className="px-4 py-3.5">Item Name</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Unit</th>
                  <th className="px-4 py-3.5 text-right">Available Qty</th>
                  <th className="px-4 py-3.5 text-right">Min Level</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isLow = (item.stock || 0) <= (item.minimumLevel || 10);
                  const cat = categories.find((c) => c.id === item.categoryId);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition ${isLow ? "bg-amber-50/30" : ""}`}
                    >
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-700">
                        {item.sku || item.itemCode}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        {item.name}
                        {item.description && (
                          <div className="text-xs text-slate-400 font-normal truncate max-w-xs">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 text-xs">
                        {cat?.name || "General"}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 text-xs font-medium">
                        {item.unit || "pcs"}
                      </td>
                      <td
                        className={`px-4 py-3.5 text-right font-bold ${
                          isLow ? "text-amber-600 text-base" : "text-slate-900"
                        }`}
                      >
                        {(item.stock || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right text-slate-500 text-xs">
                        {item.minimumLevel || 10}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            ⚠ Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ OK
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/inventory/${item.id}/bin-card`}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition"
                            title="Digital Bin Card"
                          >
                            Bin Card
                          </Link>
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingId ? "Edit Inventory Item" : "Register New Stock Item"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inventory Classification & Stock Threshold Details
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. A4 Photocopy Paper"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Item Code / SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    required
                    placeholder="e.g. 4401-001"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.code ? `[${cat.code}] ` : ""}{cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Warehouse *
                  </label>
                  <select
                    name="warehouseId"
                    value={formData.warehouseId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit of Measure *
                  </label>
                  <input
                    type="text"
                    name="unit"
                    placeholder="e.g. Ream, pcs, Box"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Standard Cost (ETB)
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 450"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Stock Qty
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Safety Levels Grid */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Inventory Control Levels (BR-14)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Min Level (Alert)
                    </label>
                    <input
                      type="number"
                      name="minimumLevel"
                      value={formData.minimumLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Reorder Level
                    </label>
                    <input
                      type="number"
                      name="reorderLevel"
                      value={formData.reorderLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Safety Stock
                    </label>
                    <input
                      type="number"
                      name="safetyStock"
                      value={formData.safetyStock}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Max Level
                    </label>
                    <input
                      type="number"
                      name="maximumLevel"
                      value={formData.maximumLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  placeholder="Optional item specifications, brand, model..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;