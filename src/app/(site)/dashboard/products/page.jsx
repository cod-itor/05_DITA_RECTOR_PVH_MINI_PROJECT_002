"use client";

import { useMemo, useState } from "react";
import ShopCardComponent from "../../../../components/shop/ShopCardComponent";
import {
  products as mockProducts,
  categories,
  getCategoryLabel,
} from "../../../../data/mockData";

export default function Page() {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(300);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const categoryCounts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.categoryId] = mockProducts.filter(
        (p) => p.categoryId === category.categoryId,
      ).length;
      return acc;
    }, {});
  }, []);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((item) => {
      const hitName = `${item.productName} ${item.brand}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const hitPrice = Number(item.price) <= maxPrice;
      const hitCategory =
        selectedCategoryIds.length === 0
          ? true
          : selectedCategoryIds.includes(item.categoryId);
      return hitName && hitPrice && hitCategory;
    });
  }, [search, maxPrice, selectedCategoryIds]);

  const toggleCategory = (categoryId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const resetFilters = () => {
    setSearch("");
    setMaxPrice(300);
    setSelectedCategoryIds([]);
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Luxury beauty products
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Use the filters to narrow by price and brand.
          </p>
        </div>
        <div className="w-full max-w-sm">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="text"
            placeholder="Search by product name..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:w-72 lg:shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
            >
              Reset filters
            </button>
          </div>

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Price range
            </p>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              $0 - ${maxPrice}
              <span className="ml-1 text-base font-normal text-gray-400">
                (no limit)
              </span>
            </p>
            <input
              type="range"
              min="0"
              max="300"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="mt-4 w-full accent-slate-900"
            />
            <div className="mt-1 flex items-center justify-between text-sm text-gray-400">
              <span>$0</span>
              <span>$300</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Quick select
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[50, 100, 150].map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setMaxPrice(price)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                >
                  Under ${price}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setMaxPrice(300)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
              >
                All prices
              </button>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Categories
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {categories.map((category) => (
                <label
                  key={category.categoryId}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 px-3 py-2 hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(
                        category.categoryId,
                      )}
                      onChange={() => toggleCategory(category.categoryId)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    {category.categoryName}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {categoryCounts[category.categoryId] ?? 0}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-400">
              Select none to include all categories.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-1">
          <p className="text-lg font-medium text-gray-500">
            Showing {filteredProducts.length} product
            {filteredProducts.length === 1 ? "" : "s"}
          </p>

          <div className="flex flex-wrap items-start gap-6">
            {filteredProducts.map((item) => (
              <ShopCardComponent
                key={item.productId}
                product={item}
                categoryLabel={getCategoryLabel(item.categoryId)}
                href={`/dashboard/products/${item.productId}`}
                rating={4}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
