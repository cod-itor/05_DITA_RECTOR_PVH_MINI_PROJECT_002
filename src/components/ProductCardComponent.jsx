"use client";

import Image from "next/image";
import Link from "next/link";
import ButtonAddComponent from "./ButtonAddComponent";

export function StarRow({ rating = 4.8 }) {
  const numericRating = Number(rating);
  const safeRating = Number.isFinite(numericRating) && numericRating > 0 ? numericRating : 0;
  const filledStars = Math.max(0, Math.min(5, Math.round(safeRating)));

  return (
    <p className="flex items-center gap-0.5 text-amber-400" aria-label={`${safeRating} stars`}>
      <span className="text-sm" aria-hidden>
        {[...Array(5)].map((_, index) => (
          <span key={index} className={index < filledStars ? "text-amber-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </span>
      <span className="ml-1 text-xs tabular-nums text-gray-500">{safeRating}</span>
    </p>
  );
}

export default function ProductCardComponent({ product }) {
  const { productId, productName, price, imageUrl, star } = product;

  return (
    <article className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <Link href={`/products/${productId}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-gray-100 to-lime-50/30 text-gray-400">
              ◇
            </div>
          )}
        </div>
      </Link>
      <div className="relative mt-4 pr-14">
        <StarRow rating={star} />
        <Link href={`/products/${productId}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 hover:text-lime-700">
            {productName}
          </h3>
        </Link>
        <p className="mt-2 text-base font-semibold tabular-nums text-gray-900">${price}</p>
      </div>
      <div className="absolute bottom-4 right-4">
        <ButtonAddComponent productId={productId} />
      </div>
    </article>
  );
}
