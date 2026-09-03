import { useEffect, useState } from "react";

import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseService.js";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      setError(error.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (amount === "" || Number(amount) < 0) {
      setError("Amount must be a valid positive number");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const expenseData = {
        title: title.trim(),
        amount: Number(amount),
        description: description.trim(),
      };

      if (editingId) {
        const updatedExpense = await updateExpense(
          editingId,
          expenseData
        );

        setExpenses((currentExpenses) =>
          currentExpenses.map((expense) =>
            expense.id === editingId
              ? updatedExpense
              : expense
          )
        );
      } else {
        const newExpense = await createExpense(expenseData);

        setExpenses((currentExpenses) => [
          newExpense,
          ...currentExpenses,
        ]);
      }

      resetForm();
    } catch (error) {
      setError(error.message || "Failed to save expense");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setDescription(expense.description || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteExpense(id);

      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      setError(error.message || "Failed to delete expense");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Expenses
          </h1>

          <p className="mt-2 text-gray-600">
            Manage business expenses.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Expense Form */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {editingId ? "Edit Expense" : "Add Expense"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Transportation"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="e.g. 500"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Optional description"
                rows="3"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Expense"
                    : "Add Expense"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-gray-500 px-5 py-2 font-medium text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Expense Table */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Expense List
          </h2>

          {loading ? (
            <p className="text-gray-600">
              Loading expenses...
            </p>
          ) : expenses.length === 0 ? (
            <p className="text-gray-600">
              No expenses found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="p-3">Title</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b"
                    >
                      <td className="p-3 font-medium">
                        {expense.title}
                      </td>

                      <td className="p-3">
                        {expense.amount}
                      </td>

                      <td className="p-3">
                        {expense.description || "-"}
                      </td>

                      <td className="p-3">
                        {new Date(
                          expense.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleEdit(expense)
                            }
                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(expense.id)
                            }
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Expenses;