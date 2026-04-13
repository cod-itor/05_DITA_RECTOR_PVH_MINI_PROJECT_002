"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ButtonAddComponent from "./ButtonAddComponent";

function isValidImageSrc(value) {
  if (typeof value !== "string" || value.trim().length === 0) return false;

  const src = value.trim();

  if (src.startsWith("/") || src.startsWith("data:image/")) {
    return true;
  }

  try {
    const url = new URL(src);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function StarRow({ rating = 4.8 }) {
  const numericRating = Number(rating);
  const safeRating =
    Number.isFinite(numericRating) && numericRating > 0 ? numericRating : 0;
  const filledStars = Math.max(0, Math.min(5, Math.round(safeRating)));

  return (
    <p
      className="flex items-center gap-0.5 text-amber-400"
      aria-label={`${safeRating} stars`}
    >
      <span className="text-sm" aria-hidden>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={index < filledStars ? "text-amber-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </span>
      <span className="ml-1 text-xs tabular-nums text-gray-500">
        {safeRating}
      </span>
    </p>
  );
}

export default function ProductCardComponent({ product }) {
  const { productId, productName, price, imageUrl, star } = product;
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [imageUrl]);

  const canUseImageUrl = isValidImageSrc(imageUrl) && !hasImageError;
  const resolvedImageSrc = canUseImageUrl ? imageUrl : "/fallback-product.svg";

  return (
    <article className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <Link href={`/dashboard/products/${productId}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={resolvedImageSrc}
            alt={productName ?? "Product image"}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-[1.02]"
            onError={() => setHasImageError(true)}
          />
        </div>
      </Link>
      <div className="relative mt-4 pr-14">
        <StarRow rating={star} />
        <Link href={`/dashboard/products/${productId}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 hover:text-lime-700">
            {productName}
          </h3>
        </Link>
        <p className="mt-2 text-base font-semibold tabular-nums text-gray-900">
          ${price}
        </p>
      </div>
      <div className="absolute bottom-4 right-4">
        <ButtonAddComponent productId={productId} productName={productName} />
      </div>
    </article>
  );
}
