import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
  approveUser,
} from "../services/userService.js";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "storekeeper",
    department: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data?.data || data || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "storekeeper",
      department: "",
      phone: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u) => {
    setEditingId(u.id);
    setFormData({
      fullName: u.fullName || u.name || "",
      email: u.email || "",
      password: "",
      role: u.role || "storekeeper",
      department: u.department || "",
      phone: u.phone || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || (!editingId && !formData.password)) {
      setError("Please complete all required fields (*)");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateUser(editingId, {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          phone: formData.phone,
        });
        setSuccess("User account updated");
      } else {
        await createUser(formData);
        setSuccess("New system user account created");
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Deactivate access for user "${name}"?`)) return;

    try {
      setError("");
      setSuccess("");
      await deactivateUser(id);
      setSuccess(`User "${name}" deactivated`);
      await loadData();
    } catch (err) {
      setError(err.message || "Deactivation failed");
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Reject registration for user "${name}"? This will keep the account inactive.`)) return;

    try {
      setError("");
      setSuccess("");
      await deactivateUser(id);
      setSuccess(`Registration request for "${name}" rejected`);
      await loadData();
    } catch (err) {
      setError(err.message || "Rejection failed");
    }
  };

  const handleApprove = async (id, name) => {
    if (!window.confirm(`Approve access for user "${name}"?`)) return;

    try {
      setError("");
      setSuccess("");
      await approveUser(id);
      setSuccess(`User "${name}" approved and can now log in`);
      await loadData();
    } catch (err) {
      setError(err.message || "Approval failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            User Accounts & Role Access
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage university inventory officers, role permissions, and access privileges (BR-15).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-md transition"
        >
          <span>+</span>
          <span>Create New User</span>
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

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="font-bold text-slate-800 text-sm">System Users</div>
          <div className="text-xs text-slate-500 font-medium">Total: {users.length}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-xs border-b border-slate-200 uppercase">
              <tr>
                <th className="px-4 py-3.5">Full Name</th>
                <th className="px-4 py-3.5">Email Address</th>
                <th className="px-4 py-3.5">System Role</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5 font-bold text-slate-900">{u.fullName || u.name}</td>
                  <td className="px-4 py-3.5 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3.5 font-sans">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 capitalize">
                      {u.role || "Storekeeper"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{u.department || "Administration"}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-600">{u.phone || "—"}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        u.status === "inactive"
                          ? "bg-rose-100 text-rose-800"
                          : u.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {u.status || "active"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                      >
                        Edit
                      </button>
                      {u.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(u.id, u.fullName || u.name)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(u.id, u.fullName || u.name)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {u.status !== "inactive" && u.status !== "pending" && (
                        <button
                          onClick={() => handleDeactivate(u.id, u.fullName || u.name)}
                          className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingId ? "Edit User Account" : "Create New User Account"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Megersa Tekalign"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@astu.edu.et"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {!editingId && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    System Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="storekeeper">Storekeeper</option>
                    <option value="pao">PAO Officer</option>
                    <option value="admin">Administrator</option>
                    <option value="stock_clerk">Stock Clerk</option>
                    <option value="accountant">Accountant</option>
                    <option value="dept_head">Department Head</option>
                    <option value="security_officer">Security Officer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+251 911 000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Office
                </label>
                <input
                  type="text"
                  placeholder="e.g. Property & Stock Administration"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                />
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
                  {saving ? "Saving..." : editingId ? "Update User" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
