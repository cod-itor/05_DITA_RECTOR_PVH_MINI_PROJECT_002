import React from "react";

export default function FormCreateProduct({
  form,
  categoryList,
  updateField,
  toggleToken,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h3 className="text-3xl font-semibold text-gray-900">
              Create product
            </h3>
            <p className="mt-1 text-base text-gray-500">
              Demo CRUD only (local state). Refresh resets changes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-xl text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                value={form.productName}
                onChange={(event) =>
                  updateField("productName", event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-lime-400"
                placeholder="Kérastase"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-lime-400"
                placeholder="64.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={form.categoryId}
                onChange={(event) =>
                  updateField("categoryId", event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-lime-400"
              >
                {categoryList.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image URL (optional)
              </label>
              <input
                value={form.imageUrl}
                onChange={(event) =>
                  updateField("imageUrl", event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-lime-400"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Colors
            </label>
            <div className="flex flex-wrap gap-2">
              {["green", "gray", "red", "blue", "white"].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleToken("colors", color)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    form.colors.includes(color)
                      ? "border-lime-500 bg-lime-50 text-lime-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {["s", "m", "l", "xl", "xxl", "xxxl"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleToken("sizes", size)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    form.sizes.includes(size)
                      ? "border-lime-500 bg-lime-50 text-lime-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-lime-400"
              placeholder="The best relaxed hair products you need now..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-full bg-lime-400 px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-lime-300"
          >
            Create product
          </button>
        </div>
      </div>
    </div>
  );
}
