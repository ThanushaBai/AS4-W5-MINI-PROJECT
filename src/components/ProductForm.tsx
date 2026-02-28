"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/types";

interface Props {
  onProductSavedAction: () => void;
  editingProduct: Product | null;
  clearEditAction: () => void;
}

export default function ProductForm({
  onProductSavedAction,
  editingProduct,
  clearEditAction,
}: Props) {
  type FormState = {
    name: string;
    price: string;
    description: string;
    image: string;
  };

  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  // update form when editing product changes
  useEffect(() => {
    // defer state update to next tick to avoid React warning about
    // synchronous setState inside effect
    const t = setTimeout(() => {
      setForm({
        name: editingProduct?.name ?? "",
        price: editingProduct?.price?.toString() ?? "",
        description: editingProduct?.description ?? "",
        image: editingProduct?.image ?? "",
      });
    }, 0);
    return () => clearTimeout(t);
  }, [editingProduct]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    clearEditAction();
    onProductSavedAction();
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
            onClick={clearEditAction}
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
        <Image
          src={form.image}
          alt="Product Preview"
          width={112}
          height={112}
          className="h-28 object-cover rounded-lg border border-slate-200"
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