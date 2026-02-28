"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";
import ProductCard from "@/components/ProductCard";
import Toast from "@/components/Toast";
import { Product } from "@/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data: Product[] = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    // perform fetch within effect body to avoid direct setState warning
    async function load() {
      const res = await fetch("/api/products");
      const data: Product[] = await res.json();
      setProducts(data);
    }
    load();
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
              clearEditAction={() => setEditingProduct(null)}
              onProductSavedAction={() => {
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
                  onDeleteAction={deleteProduct}
                  onEditAction={(p) => setEditingProduct(p)}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}