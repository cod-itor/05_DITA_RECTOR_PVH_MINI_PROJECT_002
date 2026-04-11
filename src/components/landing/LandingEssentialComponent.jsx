"use client";

import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import ProductCardComponent from "../ProductCardComponent";

const pageSize = 8;
const allTab = { categoryId: "ALL", categoryName: "All" };

export default function LandingEssentialsGrid({
  items = [],
  categoryList = [],
}) {
  const [tab, setTab] = useState(allTab.categoryId);
  const [showAll, setShowAll] = useState(false);

  const tabs = useMemo(() => {
    const fromCategories = Array.isArray(categoryList)
      ? categoryList
          .filter((item) => item?.categoryId)
          .map((item) => ({
            categoryId: String(item.categoryId),
            categoryName: item.categoryName ?? "Category",
          }))
      : [];

    if (fromCategories.length > 0) {
      return [allTab, ...fromCategories];
    }

    const categoryMap = new Map();
    items.forEach((product) => {
      if (!product?.categoryId || categoryMap.has(product.categoryId)) return;
      categoryMap.set(product.categoryId, {
        categoryId: String(product.categoryId),
        categoryName: product.categoryName ?? "Category",
      });
    });

    return [allTab, ...categoryMap.values()];
  }, [categoryList, items]);

  const filtered = useMemo(() => {
    if (tab === allTab.categoryId) return items;
    return items.filter((product) => String(product?.categoryId) === tab);
  }, [items, tab]);

  const visible = showAll ? filtered : filtered.slice(0, pageSize);
  const canLoadMore = !showAll && filtered.length > pageSize;

  return (
    <section id="shop" className="mx-auto w-full max-w-7xl py-16 lg:py-20">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Our skincare essentials
        </h2>
        <p className="mt-2 max-w-lg text-gray-500">
          Filter by category to discover products faster.
        </p>
      </div>

      <div
        className="mt-10 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Product categories"
      >
        {tabs.map((item) => {
          const on = tab === item.categoryId;
          return (
            <Button
              key={item.categoryId}
              role="tab"
              aria-selected={on}
              onPress={() => {
                setTab(item.categoryId);
                setShowAll(false);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                on
                  ? "bg-lime-400 text-gray-900 shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.categoryName}
            </Button>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {visible.map((product) => (
          <ProductCardComponent product={product} key={product?.productId} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-gray-500">
          No products in this category — try "All".
        </p>
      )}

      {canLoadMore && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="secondary"
            onPress={() => setShowAll(true)}
            className="rounded-full border border-gray-200 bg-white px-10 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
