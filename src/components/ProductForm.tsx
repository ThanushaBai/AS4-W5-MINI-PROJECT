"use client";

import { useEffect, useState } from "react";

interface Props {
  onProductSaved: () => void;
  editingProduct: any;
  clearEdit: () => void;
}

export default function ProductForm({
  onProductSaved,
  editingProduct,
  clearEdit,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  // ✅ Safe editing fill
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name ?? "",
        price: editingProduct.price?.toString() ?? "",
        description: editingProduct.description ?? "",
        image: editingProduct.image ?? "",
      });
    } else {
      // clear form if edit cancelled
      setForm({
        name: "",
        price: "",
        description: "",
        image: "",
      });
    }
  }, [editingProduct]);

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result?.toString() ?? "",
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
    };

    if (editingProduct) {
      await fetch(`/api/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
    });

    clearEdit();
    onProductSaved();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-rose-600">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>

        {editingProduct && (
          <button
            type="button"
            onClick={clearEdit}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Name */}
      <input
        className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        placeholder="Product Name"
        value={form.name}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, name: e.target.value ?? "" }))
        }
        required
      />

      {/* Price */}
      <input
        type="number"
        className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        placeholder="Price"
        value={form.price}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, price: e.target.value ?? "" }))
        }
        required
      />

      {/* Description */}
      <textarea
        className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, description: e.target.value ?? "" }))
        }
      />

      {/* Image URL Input */}
      <input
        type="text"
        placeholder="Paste Image URL (optional)"
        className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        value={
          form.image && !form.image.startsWith("data:")
            ? form.image
            : ""
        }
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            image: e.target.value ?? "",
          }))
        }
      />

      <div className="text-center text-sm text-slate-400">OR</div>

      {/* File Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="text-sm"
      />

      {/* Preview */}
      {form.image && (
        <img
          src={form.image}
          className="h-28 object-cover rounded-lg border border-slate-200"
          alt="Preview"
        />
      )}

      <button
        type="submit"
        className="bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg w-full transition"
      >
        {editingProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}