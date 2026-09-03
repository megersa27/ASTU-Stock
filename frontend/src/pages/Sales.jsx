import { useEffect, useState } from "react";
import { getProducts } from "../services/productService.js";
import {
  createSale,
  getSales,
} from "../services/saleService.js";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [cart, setCart] = useState([]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [productsData, salesData] = await Promise.all([
        getProducts(),
        getSales(),
      ]);

      setProducts(productsData);
      setSales(salesData);
    } catch (err) {
      setError(err.message || "Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addToCart = () => {
    setError("");
    setSuccess("");

    const selectedProduct = products.find(
      (product) => product.id === Number(productId)
    );

    if (!selectedProduct) {
      setError("Please select a product");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      setError("Quantity must be a positive integer");
      return;
    }

    if (parsedQuantity > selectedProduct.stock) {
      setError("Insufficient stock");
      return;
    }

    const existingItem = cart.find(
      (item) => item.productId === selectedProduct.id
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + parsedQuantity;

      if (newQuantity > selectedProduct.stock) {
        setError("Insufficient stock");
        return;
      }

      setCart(
        cart.map((item) =>
          item.productId === selectedProduct.id
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: parsedQuantity,
        },
      ]);
    }

    setProductId("");
    setQuantity("");
  };

  const removeFromCart = (id) => {
    setCart(
      cart.filter((item) => item.productId !== id)
    );
  };

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const handleSale = async () => {
    setError("");
    setSuccess("");

    if (cart.length === 0) {
      setError("Please add at least one product");
      return;
    }

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await createSale(items);

      setSuccess("Sale created successfully");
      setCart([]);

      await loadData();
    } catch (err) {
      setError(err.message || "Failed to create sale");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-gray-600">
            Loading sales...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-6 rounded-lg bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900">
            Sales
          </h1>

          <p className="mt-2 text-gray-600">
            Create sales and view sales history.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded bg-green-100 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* Create Sale */}
        <div className="mb-6 rounded-lg bg-white p-8 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Create Sale
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="rounded border border-gray-300 p-3"
            >
              <option value="">
                Select product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                  disabled={product.stock === 0}
                >
                  {product.name} — Stock: {product.stock}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="rounded border border-gray-300 p-3"
            />

            <button
              onClick={addToCart}
              className="rounded bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              Add Product
            </button>

          </div>
        </div>

        {/* Cart */}
        <div className="mb-6 rounded-lg bg-white p-8 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Current Sale
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              No products added yet.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3">Product</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Subtotal</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map((item) => (
                      <tr
                        key={item.productId}
                        className="border-b"
                      >
                        <td className="p-3">
                          {item.name}
                        </td>

                        <td className="p-3">
                          {item.price}
                        </td>

                        <td className="p-3">
                          {item.quantity}
                        </td>

                        <td className="p-3">
                          {item.price * item.quantity}
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() =>
                              removeFromCart(
                                item.productId
                              )
                            }
                            className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-xl font-bold">
                  Total: {cartTotal}
                </p>

                <button
                  onClick={handleSale}
                  className="rounded bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
                >
                  Complete Sale
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sales History */}
        <div className="rounded-lg bg-white p-8 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Sales History
          </h2>

          {sales.length === 0 ? (
            <p className="text-gray-500">
              No sales found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Sale ID</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {sales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="border-b"
                    >
                      <td className="p-3">
                        #{sale.id}
                      </td>

                      <td className="p-3 font-medium">
                        {sale.totalAmount}
                      </td>

                      <td className="p-3">
                        {sale.items.length}
                      </td>

                      <td className="p-3">
                        {new Date(
                          sale.createdAt
                        ).toLocaleString()}
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

export default Sales;