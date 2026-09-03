import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService.js";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingCode, setEditingCode] = useState("");
  const [editingDesc, setEditingDesc] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const newCategory = await createCategory({
        name: name.trim(),
        code: code.trim() || undefined,
        description: description.trim() || undefined,
      });

      setCategories((prev) => [...prev, newCategory]);
      setName("");
      setCode("");
      setDescription("");
      setSuccess("Category added successfully");
    } catch (err) {
      setError(err.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setEditingCode(cat.code || "");
    setEditingDesc(cat.description || "");
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;

    try {
      setError("");
      setSuccess("");

      const updated = await updateCategory(id, {
        name: editingName.trim(),
        code: editingCode.trim(),
        description: editingDesc.trim(),
      });

      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );

      setEditingId(null);
      setSuccess("Category updated successfully");
    } catch (err) {
      setError(err.message || "Failed to update category");
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      setError("");
      setSuccess("");
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSuccess(`Category "${catName}" deleted`);
    } catch (err) {
      setError(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          ASTU Inventory Classifications & Categories
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          University stock classification codes for inventory management.
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

      {/* Add Category Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-3">Add Stock Classification</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Classification Code</label>
            <input
              type="text"
              placeholder="e.g. 4401"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Office Supplies & Stationery"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. Paper, pens, toner consumables"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "+ Add Category"}
            </button>
          </div>
        </form>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="font-bold text-slate-800 text-sm">Classification Catalogue</div>
          <div className="text-xs text-slate-500 font-medium">Total: {categories.length}</div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading categories...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
                <tr>
                  <th className="px-4 py-3.5">Code</th>
                  <th className="px-4 py-3.5">Category Name</th>
                  <th className="px-4 py-3.5">Description</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50 transition">
                    {editingId === category.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editingCode}
                            onChange={(e) => setEditingCode(e.target.value)}
                            className="w-20 px-2 py-1 border border-slate-300 rounded font-mono"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={editingDesc}
                            onChange={(e) => setEditingDesc(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdate(category.id)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3.5 font-mono font-bold text-blue-700">
                          {category.code || `44${String(category.id).padStart(2, "0")}`}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{category.name}</td>
                        <td className="px-4 py-3.5 text-slate-500 max-w-sm truncate">
                          {category.description || "—"}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(category)}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category.id, category.name)}
                              className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;