import ProductCardEdit from "../../../../components/manage-product/ProductCardEdit";
import React from "react";
import { categories, products } from "../../../../data/mockData";

export default function Page() {
  const initialItems = products.slice(0, 3);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Manage Products
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Create, update, and delete products in this demo (local state only).
        </p>
      </div>

      <ProductCardEdit initialItems={initialItems} categoryList={categories} />
    </section>
  );
}
