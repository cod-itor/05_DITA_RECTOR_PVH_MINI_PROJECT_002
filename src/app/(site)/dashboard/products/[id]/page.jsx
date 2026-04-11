"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { StarRow } from "../../../../../components/ProductCardComponent";
import { getProductById, products } from "../../../../../data/mockData";

function getFallbackOptions(list, fallback) {
  return Array.isArray(list) && list.length > 0 ? list : fallback;
}

function getNextProducts(currentProductId, count = 3) {
  const currentIndex = products.findIndex(
    (item) => item.productId === currentProductId,
  );
  if (currentIndex < 0) return products.slice(0, count);

  const rotated = [
    ...products.slice(currentIndex + 1),
    ...products.slice(0, currentIndex),
  ];
  return rotated.slice(0, count);
}

export default function Page() {
  const params = useParams();
  const productId = Number(params?.id);

  const product = useMemo(
    () => getProductById(productId) ?? products[0],
    [productId],
  );

  const colorOptions = getFallbackOptions(product?.colors, ["green", "gray"]);
  const sizeOptions = getFallbackOptions(product?.sizes, ["s", "m", "l"]);
  const nextProducts = useMemo(
    () => getNextProducts(product?.productId, 3),
    [product?.productId],
  );

  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [quantity, setQuantity] = useState(1);

  const discountPrice = Number(product?.price ?? 0);
  const originalPrice = (discountPrice * 1.14).toFixed(2);
  const rating = Number.isFinite(Number(product?.star))
    ? Number(product?.star)
    : 4;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-gray-800">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/dashboard/products" className="hover:text-gray-800">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-700">
          {product?.productName}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
            {product?.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.productName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-10"
                priority
              />
            ) : (
              <div className="flex size-full items-center justify-center text-6xl text-gray-300">
                ◇
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              className="size-10 rounded-full border border-gray-200 text-lg text-gray-400"
              aria-label="Previous thumbnails"
            >
              ‹
            </button>

            {nextProducts.map((item) => (
              <Link
                key={item.productId}
                href={`/dashboard/products/${item.productId}`}
                className="relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 transition hover:border-blue-400"
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-gray-300">
                    ◇
                  </div>
                )}
              </Link>
            ))}

            <button
              type="button"
              className="size-10 rounded-full border border-gray-200 text-lg text-gray-500"
              aria-label="Next thumbnails"
            >
              ›
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {product?.productName}
            </h1>
            <StarRow rating={rating} />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <p className="text-4xl font-semibold text-blue-900">
              ${discountPrice.toFixed(2)}
            </p>
            <p className="text-2xl text-gray-400 line-through">
              ${originalPrice}
            </p>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-lg font-semibold text-gray-800">
              Choose a color
            </p>
            <div className="flex gap-3">
              {colorOptions.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border px-5 py-2 text-base font-medium capitalize transition ${
                      isSelected
                        ? "border-emerald-300 bg-emerald-300 text-emerald-900"
                        : "border-gray-200 bg-white text-gray-500"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Selected: {selectedColor}
            </p>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-lg font-semibold text-gray-800">
              Choose a size
            </p>
            <div className="flex gap-3">
              {sizeOptions.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-6 py-2 text-base font-medium lowercase transition ${
                      isSelected
                        ? "border-blue-300 bg-blue-50 text-blue-800"
                        : "border-gray-200 bg-white text-gray-500"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-8 text-xl leading-relaxed text-gray-600">
            {product?.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-5 py-3 text-lg text-gray-500"
              >
                -
              </button>
              <span className="px-4 text-lg font-semibold text-gray-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-5 py-3 text-lg text-gray-500"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="rounded-full bg-blue-950 px-12 py-3 text-lg font-semibold text-white transition hover:bg-blue-900"
            >
              🛍️ Add to cart
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-2xl font-semibold text-gray-800">
              ↩︎ Free 30-day returns
            </p>
            <p className="mt-2 text-base text-gray-500">
              See return policy details in cart.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
