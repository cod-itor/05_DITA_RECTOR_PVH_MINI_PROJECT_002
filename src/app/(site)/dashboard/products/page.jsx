"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import ShopCardComponent from "../../../../components/shop/ShopCardComponent";
import { getProductsAction } from "../../../action/product.action";

const defaultMaxPrice = 300;
const quickPrice = [50, 100, 150];

function getUniqueCategories(products) {
  const map = new Map();

  products.forEach((product) => {
    if (!product?.categoryId || map.has(product.categoryId)) return;
    map.set(product.categoryId, {
      categoryId: product.categoryId,
      categoryName: product.categoryName || "Category",
    });
  });

  return [...map.values()];
}

function getCategoryCounts(products) {
  const counts = {};

  products.forEach((product) => {
    if (!product?.categoryId) return;
    counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1;
  });

  return counts;
}

export default function Page() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(defaultMaxPrice);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.accessToken) {
      setProducts([]);
      setError("Please login to view products");
      setLoading(false);
      return;
    }

    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const list = await getProductsAction(session.accessToken);
        if (!active) return;
        setProducts(list ?? []);
      } catch (err) {
        if (!active) return;
        setProducts([]);
        setError(err?.message || "Failed to load products");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [session?.accessToken, status]);

  const categories = useMemo(() => getUniqueCategories(products), [products]);
  const categoryCounts = useMemo(() => getCategoryCounts(products), [products]);

  const getCategoryLabel = (categoryId) => {
    const category = categories.find((item) => item.categoryId === categoryId);
    return category?.categoryName ?? "Category";
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const hitName = `${item.productName ?? ""} ${item.brand ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const hitPrice = Number(item.price) <= maxPrice;
      const hitCategory =
        selectedCategoryIds.length === 0
          ? true
          : selectedCategoryIds.includes(item.categoryId);
      return hitName && hitPrice && hitCategory;
    });
  }, [products, search, maxPrice, selectedCategoryIds]);

  const toggleCategory = (categoryId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const resetFilters = () => {
    setSearch("");
    setMaxPrice(defaultMaxPrice);
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
            </p>
            <input
              type="range"
              min="0"
              max={defaultMaxPrice}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="mt-4 w-full accent-slate-900"
            />
            <div className="mt-1 flex items-center justify-between text-sm text-gray-400">
              <span>$0</span>
              <span>${defaultMaxPrice}</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Quick select
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickPrice.map((price) => (
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
                onClick={() => setMaxPrice(defaultMaxPrice)}
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

          {loading && (
            <p className="text-sm text-gray-500">Loading products...</p>
          )}
          {!loading && error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((item) => (
              <ShopCardComponent
                key={item.productId}
                product={item}
                categoryLabel={getCategoryLabel(item.categoryId)}
                href={`/dashboard/products/${item.productId}`}
                rating={item.star}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
