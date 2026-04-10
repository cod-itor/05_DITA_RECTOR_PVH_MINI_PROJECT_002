"use client";

import React from "react";

export default function CartSummaryComponent({
  subtotal,
  onCheckout,
  onClearCart,
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900 font-semibold">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {/* Tax and Shipping Info */}
        <p className="text-xs text-gray-500">
          Tax and shipping calculated at checkout (demo).
        </p>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-lg transition duration-200"
        >
          Checkout
        </button>

        {/* Clear Cart Button */}
        <button
          onClick={onClearCart}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition duration-200"
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}
