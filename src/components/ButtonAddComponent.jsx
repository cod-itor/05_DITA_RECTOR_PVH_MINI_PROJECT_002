"use client";

import { Button } from "@heroui/react";
import React from "react";
import { addProductToCartStorage } from "../lib/cart.storage";
import { sileo } from "sileo";

const sileoBlackTheme = {
  fill: "black",
  styles: {
    title: "text-white!",
    description: "text-white/75!",
  },
};

export default function ButtonAddComponent({
  productId,
  productName,
  quantity = 1,
}) {
  const handleAddToCart = () => {
    if (!productId) return;
    addProductToCartStorage(productId, quantity);
    const safeProductName = productName?.trim() || "Product";
    sileo.success({
      title: "Added to cart",
      description: `${safeProductName} added to cart (${quantity} item${quantity > 1 ? "s" : ""}).`,
      ...sileoBlackTheme,
    });
  };

  return (
    <Button
      isIconOnly
      aria-label="Add to cart"
      onPress={handleAddToCart}
      className="size-11 rounded-full bg-lime-400 text-xl font-light text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95"
    >
      +
    </Button>
  );
}
