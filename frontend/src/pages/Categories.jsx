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
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!name.trim()) return;

    try {
      setError("");

      const newCategory = await createCategory(name.trim());

      setCategories((previous) => [...previous, newCategory]);
      setName("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;

    try {
      setError("");

      const updatedCategory = await updateCategory(
        id,
        editingName.trim()
      );

      setCategories((previous) =>
        previous.map((category) =>
          category.id === id ? updatedCategory : category
        )
      );

      setEditingId(null);
      setEditingName("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteCategory(id);

      setCategories((previous) =>
        previous.filter((category) => category.id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Categories
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleCreate}
          className="mb-6 flex gap-3 rounded-lg bg-white p-4 shadow"
        >
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="flex-1 rounded border border-gray-300 px-3 py-2"
          />

          <button
            type="submit"
            className="rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Add Category
          </button>
        </form>

        <div className="rounded-lg bg-white shadow">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">
              Category List
            </h2>
          </div>

          {categories.length === 0 ? (
            <p className="p-6 text-gray-500">
              No categories found.
            </p>
          ) : (
            <div className="divide-y">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(event) =>
                        setEditingName(event.target.value)
                      }
                      className="rounded border border-gray-300 px-3 py-2"
                    />
                  ) : (
                    <div>
                      <p className="font-medium text-gray-900">
                        {category.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        ID: {category.id}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {editingId === category.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="rounded bg-green-600 px-3 py-2 text-sm text-white"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingName("");
                          }}
                          className="rounded bg-gray-500 px-3 py-2 text-sm text-white"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(category.id);
                            setEditingName(category.name);
                          }}
                          className="rounded bg-yellow-500 px-3 py-2 text-sm text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(category.id)}
                          className="rounded bg-red-600 px-3 py-2 text-sm text-white"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;