"use client";

import React from "react";

export default function OrderCardComponent({ order }) {
  const { orderId, userId, orderDate, lineItems, total, products } = order;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">Order</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">#{orderId}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase text-gray-500">Total</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 border-b border-gray-200 pb-6 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold text-gray-500">User ID</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{userId}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Order date</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{orderDate}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Line items</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{lineItems}</p>
        </div>
      </div>

      <div>
        <p className="mb-4 text-xs font-semibold uppercase text-gray-500">
          Order Details
        </p>
        <div className="space-y-3">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-t border-gray-100 pt-3 first:border-t-0 first:pt-0"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Product{" "}
                  <span className="font-medium text-gray-900">
                    {product.name}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-8 text-right">
                <p className="text-sm text-gray-600">
                  Qty{" "}
                  <span className="font-medium text-gray-900">
                    {product.quantity}
                  </span>
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
