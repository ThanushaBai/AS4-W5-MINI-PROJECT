"use client";

import Image from "next/image";
import { Product } from "@/types";

interface Props {
  product: Product;
  onDeleteAction: (id: string) => void;
  onEditAction: (product: Product) => void;
}

export default function ProductCard({ product, onDeleteAction, onEditAction }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-5">
      {product.image && (
        <Image
          src={product.image}
          alt={product.name || ""}
          width={400}
          height={240}
          className="h-40 w-full object-cover rounded-xl mb-4 transition-transform duration-300 hover:scale-105"
        />
      )}

      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-red-500 font-bold">₹{product.price}</p>
      <p className="text-sm text-gray-600">{product.description}</p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onEditAction(product)}
          className="bg-red-100 text-red-600 px-3 py-1 rounded w-full"
        >
          Edit
        </button>

        <button
          onClick={() => onDeleteAction(product._id)}
          className="bg-red-500 text-white px-3 py-1 rounded w-full"
        >
          Delete
        </button>
      </div>
    </div>
  );
}