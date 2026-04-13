"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CartItemComponent from "../../../../components/cart/CartItemComponent";
import CartSummaryComponent from "../../../../components/cart/CartSummaryComponent";
import { getProductsAction } from "../../../action/product.action";
import { createOrderAction } from "../../../action/order.action";
import {
  clearCartStorage,
  getCartPayloadFromStorage,
  removeProductFromCartStorage,
  setProductQtyInCartStorage,
} from "../../../../lib/cart.storage";
import { sileo } from "sileo";

const sileoBlackTheme = {
  fill: "black",
  styles: {
    title: "text-white!",
    description: "text-white/75!",
  },
};

export default function CartPage() {
  const { data: session, status } = useSession();
  const [orderDetailRequests, setOrderDetailRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const refreshCart = () => {
    const payload = getCartPayloadFromStorage();
    setOrderDetailRequests(payload.orderDetailRequests ?? []);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.accessToken) {
      setProducts([]);
      return;
    }

    let active = true;

    const loadProducts = async () => {
      try {
        const list = await getProductsAction(session.accessToken);
        if (!active) return;
        setProducts(Array.isArray(list) ? list : []);
      } catch {
        if (!active) return;
        setProducts([]);
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [session?.accessToken, status]);

  const cartItems = useMemo(() => {
    return orderDetailRequests.map((detail) => {
      const matched = products.find(
        (product) => String(product.productId) === String(detail.productId),
      );

      return {
        productId: detail.productId,
        productName: matched?.productName ?? "Product",
        price: Number(matched?.price ?? 0),
        quantity: Number(detail.orderQty ?? 1),
        imageUrl: matched?.imageUrl ?? null,
      };
    });
  }, [orderDetailRequests, products]);

  const handleQuantityChange = (productId, newQuantity) => {
    setCheckoutError("");
    setCheckoutSuccess("");
    setProductQtyInCartStorage(productId, newQuantity);
    refreshCart();
  };

  const handleRemoveItem = (productId) => {
    setCheckoutError("");
    setCheckoutSuccess("");
    removeProductFromCartStorage(productId);
    refreshCart();
  };

  const handleClearCart = () => {
    setCheckoutError("");
    setCheckoutSuccess("");
    clearCartStorage();
    refreshCart();
  };

  const handleCheckout = async () => {
    if (orderDetailRequests.length === 0) {
      const message = "Your cart is empty";
      setCheckoutError(message);
      sileo.error({
        title: "Checkout failed",
        description: message,
        ...sileoBlackTheme,
      });
      return;
    }

    if (!session?.accessToken) {
      const message = "Please login before checkout";
      setCheckoutError(message);
      sileo.error({
        title: "Checkout failed",
        description: message,
        ...sileoBlackTheme,
      });
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError("");
    setCheckoutSuccess("");

    try {
      const payload = { orderDetailRequests };
      await createOrderAction(payload, session.accessToken);
      clearCartStorage();
      refreshCart();
      setCheckoutSuccess("Checkout successful");
      sileo.success({
        title: "Order successful",
        description: "Your order has been placed.",
        ...sileoBlackTheme,
      });
    } catch (error) {
      const message = error?.message || "Failed to checkout";
      setCheckoutError(message);
      sileo.error({
        title: "Checkout failed",
        description: message,
        ...sileoBlackTheme,
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const itemCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
          <p className="mt-2 text-gray-600">
            Cart is stored in memory for this visit — refreshing the page clears
            it.
          </p>
        </div>

        {checkoutError && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {checkoutError}
          </p>
        )}

        {checkoutSuccess && (
          <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {checkoutSuccess}
          </p>
        )}

        {cartItems.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700">
                {itemCount} product{itemCount !== 1 ? "s" : ""} in cart
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="space-y-4 flex-1">
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={item.productId}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              <CartSummaryComponent
                subtotal={subtotal}
                onCheckout={handleCheckout}
                onClearCart={handleClearCart}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-900 text-2xl font-semibold">
              Your cart is empty
            </p>
            <p className="text-gray-600 mt-2">
              Open a product, set quantity, then tap &quot;Add to cart&quot;.
            </p>
            <Link href="/dashboard/products">
              <button className="mt-8 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-full transition duration-200">
                Shop products
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
