import ProductCardEdit from "../../../../components/manage-product/ProductCardEdit";
import React from "react";
import { getServerSession } from "next-auth";
import { getProductsAction } from "../../../action/product.action";
import { authOptions } from "../../../../lib/auth";

function getCategoriesFromProducts(products) {
  const categoryMap = new Map();

  products.forEach((item) => {
    if (!item?.categoryId || categoryMap.has(item.categoryId)) return;

    categoryMap.set(item.categoryId, {
      categoryId: item.categoryId,
      categoryName: item.categoryName || "Category",
    });
  });

  return [...categoryMap.values()];
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  let initialItems = [];

  try {
    const products = await getProductsAction(session?.accessToken);
    initialItems = Array.isArray(products) ? products : [];
  } catch {
    initialItems = [];
  }

  const categoryList = getCategoriesFromProducts(initialItems);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Manage Products
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Create, update, and delete products from your product list.
        </p>
      </div>

      <ProductCardEdit
        initialItems={initialItems}
        categoryList={categoryList}
      />
    </section>
  );
}
