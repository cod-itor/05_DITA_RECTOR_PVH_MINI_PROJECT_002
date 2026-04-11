"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getOrdersAction } from "../../../action/order.action";
import OrderCardComponent from "../../../../components/orders/OrderCardComponent";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.accessToken) {
      setError("Please login to view orders");
      setLoading(false);
      setOrders([]);
      return;
    }

    let active = true;

    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getOrdersAction(session.accessToken);
        if (!active) return;
        setOrders(data ?? []);
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Failed to load orders");
        setOrders([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      active = false;
    };
  }, [session?.accessToken, status]);

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

        {loading && (
          <p className="mb-6 text-sm text-gray-500">Loading orders...</p>
        )}

        {!loading && error && (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && orders.length > 0 ? (
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
