"use client";

import React, { useState } from "react";
import Link from "next/link";
import CartItemComponent from "./../../../components/cart/CartItemComponent";
import CartSummaryComponent from "./../../../components/cart/CartSummaryComponent";

// Static mock cart data
const MOCK_CART_ITEMS = [
  {
    productId: 105,
    productName: "Tea-Trica BHA Foam",
    price: 100,
    quantity: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout... (Demo only)");
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const itemCount = cartItems.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
          <p className="mt-2 text-gray-600">
            Cart is stored in memory for this visit — refreshing the page clears
            it.
          </p>
        </div>

        {cartItems.length > 0 ? (
          <>
            {/* Product Count */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700">
                {itemCount} product{itemCount !== 1 ? "s" : ""} in cart
              </p>
            </div>

            {/* Main Layout - Flex with items on left and summary on right */}
            <div className="flex flex-col gap-6">
              {/* Cart Items */}
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

              {/* Cart Summary - Full Width */}
              <CartSummaryComponent
                subtotal={subtotal}
                onCheckout={handleCheckout}
                onClearCart={handleClearCart}
              />
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-900 text-2xl font-semibold">
              Your cart is empty
            </p>
            <p className="text-gray-600 mt-2">
              Open a product, set quantity, then tap "Add to cart".
            </p>
            <Link href="/products">
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
