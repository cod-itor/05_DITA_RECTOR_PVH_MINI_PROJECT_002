"use client";

import React, { useMemo, useState } from "react";
import ProductCardEdit1 from "./ProductCardEdit1";
import { getCategoryLabel } from "../../data/mockData";

export default function ProductCardEdit({
  initialItems = [],
  categoryList = [],
}) {
  const [openCreate, setOpenCreate] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [items, setItems] = useState(initialItems);

  const [form, setForm] = useState({
    productName: "",
    price: "",
    categoryId: categoryList[0]?.categoryId ?? 1,
    imageUrl: "",
    description: "",
    colors: [],
    sizes: [],
  });

  const sortedItems = useMemo(() => {
    const list = [...items];
    if (sortBy === "name") {
      return list.sort((a, b) => a.productName.localeCompare(b.productName));
    }
    if (sortBy === "priceAsc") {
      return list.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortBy === "priceDesc") {
      return list.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return list;
  }, [items, sortBy]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleToken = (key, token) => {
    setForm((prev) => {
      const current = prev[key];
      const next = current.includes(token)
        ? current.filter((value) => value !== token)
        : [...current, token];
      return { ...prev, [key]: next };
    });
  };

  const closeModal = () => {
    setOpenCreate(false);
    setForm({
      productName: "",
      price: "",
      categoryId: categoryList[0]?.categoryId ?? 1,
      imageUrl: "",
      description: "",
      colors: [],
      sizes: [],
    });
  };

  const createProduct = () => {
    if (!form.productName.trim() || !form.price) return;

    const newProduct = {
      productId: Date.now(),
      brand: "Custom",
      productName: form.productName.trim(),
      description: form.description.trim() || "Custom product",
      price: Number(form.price),
      categoryId: Number(form.categoryId),
      imageUrl: form.imageUrl.trim() || null,
      colors: form.colors,
      sizes: form.sizes,
    };

    setItems((prev) => [newProduct, ...prev]);
    closeModal();
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-end gap-4">
        <div className="flex items-center gap-3">
          <span className="text-lg text-gray-500">Sort</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-s text-gray-700 outline-none"
          >
            <option value="name">Name (A-Z)</option>
            <option value="priceAsc">Price (Low to High)</option>
            <option value="priceDesc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="rounded-full bg-lime-400 px-6 py-3 text-s font-semibold text-gray-900 transition hover:bg-lime-300"
          >
            + Create product
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {sortedItems.map((product) => (
            <ProductCardEdit1
              key={product.productId}
              product={product}
              categoryLabel={getCategoryLabel(product.categoryId)}
              href={`/dashboard/products/${product.productId}`}
              rating={product.rating ?? 4}
            />
          ))}
        </div>
      </div>

      {openCreate && (
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
                onClick={closeModal}
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
                    onChange={(event) =>
                      updateField("price", event.target.value)
                    }
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
                      updateField("categoryId", Number(event.target.value))
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-lime-400"
                  >
                    {categoryList.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
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
                onClick={closeModal}
                className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createProduct}
                className="rounded-full bg-lime-400 px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-lime-300"
              >
                Create product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
