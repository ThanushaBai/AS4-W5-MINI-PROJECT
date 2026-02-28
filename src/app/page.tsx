"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";
import ProductCard from "@/components/ProductCard";
import Toast from "@/components/Toast";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const deleteProduct = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    setProducts((prev) => prev.filter((p) => p._id !== id));
    showSuccessToast("Product deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast message={toastMessage} show={showToast} />

      <div className="max-w-7xl mx-auto px-6 py-5">
        <h1 className="text-xl font-semibold text-center text-rose-600 mb-6">
          Homemade Bakery Store
        </h1>

        {/* Side-by-side layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Form */}
          <div className="lg:col-span-1">
            <ProductForm
              editingProduct={editingProduct}
              clearEdit={() => setEditingProduct(null)}
              onProductSaved={() => {
                fetchProducts();
                showSuccessToast(
                  editingProduct
                    ? "Product updated successfully!"
                    : "Product added successfully!"
                );
              }}
            />
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">
              Our Products
            </h2>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={deleteProduct}
                  onEdit={(product) => setEditingProduct(product)}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}