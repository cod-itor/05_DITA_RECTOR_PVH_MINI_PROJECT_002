import React from "react";
import { X } from "lucide-react";

export default function FormDeleteProduct({ productName, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in relative w-full max-w-md overflow-hidden rounded-[28px] bg-white p-8 shadow-2xl duration-300">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 transition hover:text-gray-600"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Delete product?</h2>

          <p className="text-lg text-gray-500">
            This will remove{" "}
            <span className="font-semibold text-gray-800">{productName}</span>.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-gray-100 px-8 py-3 text-lg font-semibold text-gray-900 transition hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full bg-pink-50 px-8 py-3 text-lg font-semibold text-rose-600 transition hover:bg-pink-100"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
