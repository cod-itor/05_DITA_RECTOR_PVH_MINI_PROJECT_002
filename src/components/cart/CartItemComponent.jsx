"use client";

import Image from "next/image";
import React from "react";

export default function CartItemComponent({
  item,
  onQuantityChange,
  onRemove,
}) {
  const { productId, productName, price, imageUrl, quantity } = item;
  const totalPrice = price * quantity;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="h-24 w-24 shrink-0 rounded-lg bg-gray-100 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={productName}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
              ◇
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm md:text-base">
              {productName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ${price.toFixed(2)} each
            </p>
          </div>

          {/* Quantity Controls */}
          
        </div>

        {/* Price and Remove */}
        <div className="flex flex-col items-end justify-between">
            <div className="flex items-center gap-3 bg-gray-400 rounded-2xl w-20 py-1 px-2">
            <button
              onClick={() => onQuantityChange(productId, quantity - 1)}
              disabled={quantity <= 1}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 transition"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center font-medium text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(productId, quantity + 1)}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            ${totalPrice.toFixed(2)}
          </p>
          <button
            onClick={() => onRemove(productId)}
            className="text-sm text-red-600 hover:text-red-700 transition font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
