"use client";

import React, { useState } from "react";
import OrderCardComponent from "../../../../components/orders/OrderCardComponent";

const mockOrders = [
  {
    orderId: "983d13b0-460a-40ef-b1be-5da3d86393cb",
    userId: "0c4b2fb4-16d0-4d48-b9a2-f309590782f9",
    orderDate: "Apr 3, 2026",
    lineItems: 1,
    total: 36.0,
    products: [
      {
        name: "Tea-Trica B5 Cream",
        quantity: 3,
        price: 36.0,
      },
    ],
  },
  {
    orderId: "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
    userId: "0c4b2fb4-16d0-4d48-b9a2-f309590782f9",
    orderDate: "Apr 2, 2026",
    lineItems: 2,
    total: 150.0,
    products: [
      {
        name: "Revitalizing Night Serum",
        quantity: 1,
        price: 89.0,
      },
      {
        name: "Hydra Glow Moisturizer",
        quantity: 2,
        price: 62.0,
      },
    ],
  },
  {
    orderId: "p7q8r9s0-t1u2-43v4-w5x6-y7z8a9b0c1d",
    userId: "0c4b2fb4-16d0-4d48-b9a2-f309590782f9",
    orderDate: "Mar 28, 2026",
    lineItems: 1,
    total: 45.99,
    products: [
      {
        name: "Luxe Lip Tint",
        quantity: 1,
        price: 45.99,
      },
    ],
  },
];

export default function OrdersPage() {
  const [orders] = useState(mockOrders);
  const orderCount = orders.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ordered products</h1>
          <p className="mt-2 text-gray-600">
            {orderCount} order{orderCount !== 1 ? "s" : ""} from your account.
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <OrderCardComponent key={order.orderId} order={order} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-900 text-2xl font-semibold">
              No orders yet
            </p>
            <p className="text-gray-600 mt-2">
              You haven&apos;t placed any orders yet. Start shopping to place
              your first order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
