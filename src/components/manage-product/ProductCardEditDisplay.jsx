"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { StarRow } from "../ProductCardComponent";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function ProductCardEdit1({
  product,
  categoryLabel,
  href,
  rating,
  onEdit,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const productName = product?.productName ?? "Product";
  const price = product?.price ?? 0;
  const imageUrl = product?.imageUrl;
  const displayRating = rating ?? product?.star ?? product?.rating ?? 0;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <article className="group relative flex w-full max-w-70 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="absolute right-4 top-4 z-20" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-500 shadow-sm backdrop-blur-sm transition hover:bg-gray-50 hover:text-gray-900"
        >
          <MoreHorizontal size={18} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white/90 p-1 shadow-xl backdrop-blur-md animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setIsOpen(false);
                onEdit?.(product);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              <Pencil size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onDelete?.(product);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
          
        )}
      </div>

      <div className="relative aspect-square w-full overflow-hidden mb-2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-4"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gray-50 text-4xl text-gray-300 rounded-xl">
            ◇
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 pr-12">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <StarRow rating={displayRating} />
        </div>
        <h3 className="font-semibold leading-snug text-gray-900 mt-1">
          {productName}
        </h3>
        <p className="mt-2 text-lg font-bold tabular-nums text-gray-900">
          ${price}
        </p>
      </div>

      <button
        type="button"
        className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-lime-400 text-2xl font-light leading-none text-gray-900 transition hover:bg-lime-500"
      >
        +
      </button>
    </article>
  );
}
