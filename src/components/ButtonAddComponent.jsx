"use client";

import { Button } from "@heroui/react";
import React from "react";
import { addProductToCartStorage } from "../lib/cart.storage";

export default function ButtonAddComponent({ productId, quantity = 1 }) {
  const handleAddToCart = () => {
    if (!productId) return;
    addProductToCartStorage(productId, quantity);
  };

  return (
    <Button
      isIconOnly
      aria-label="Add to cart"
      onPress={handleAddToCart}
      className={`size-11 rounded-full bg-lime-400 text-xl font-light text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95}`}
    >
      +
    </Button>
  );
}
