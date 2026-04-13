"use client";

import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import ProductCardEdit1 from "./ProductCardEditDisplay";
import FormCreateProduct from "./FormCreateProduct";
import FormEditProduct from "./FormEditProduct";
import FormDeleteProduct from "./FormDeleteProduct";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "../../app/action/product.action";
import { sileo } from "sileo";

const sileoBlackTheme = {
  fill: "black",
  styles: {
    title: "text-white!",
    description: "text-white/75!",
  },
};

export default function ProductCardEdit({
  initialItems = [],
  categoryList = [],
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}) {
  const { data: session } = useSession();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [actionError, setActionError] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [items, setItems] = useState(initialItems);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const [form, setForm] = useState({
    productName: "",
    price: "",
    categoryId: categoryList[0]?.categoryId ?? "",
    imageUrl: "",
    description: "",
    colors: [],
    sizes: [],
  });

  const sortedItems = useMemo(() => {
    const list = [...items];
    if (sortBy === "name") {
      return list.sort((a, b) => a.productName.localeCompare(b.productName));
    }
    if (sortBy === "priceAsc") {
      return list.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortBy === "priceDesc") {
      return list.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return list;
  }, [items, sortBy]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleToken = (key, token) => {
    setForm((prev) => {
      const current = prev[key];
      const next = current.includes(token)
        ? current.filter((value) => value !== token)
        : [...current, token];
      return { ...prev, [key]: next };
    });
  };

  const resetForm = () => {
    setForm({
      productName: "",
      price: "",
      categoryId: categoryList[0]?.categoryId ?? "",
      imageUrl: "",
      description: "",
      colors: [],
      sizes: [],
    });
  };

  const closeModal = () => {
    setOpenCreate(false);
    setActionError("");
    resetForm();
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setSelectedProductId(null);
    setActionError("");
    resetForm();
  };

  const closeDeleteModal = () => {
    setOpenDelete(false);
    setProductToDelete(null);
    setActionError("");
  };

  const createProduct = async () => {
    if (!form.productName.trim() || !form.price || !form.categoryId) return;

    const requestBody = {
      name: form.productName.trim(),
      description: form.description.trim() || "",
      colors: form.colors,
      sizes: form.sizes,
      imageUrl: form.imageUrl.trim() || "",
      price: Number(form.price),
      categoryId: String(form.categoryId),
    };

    setActionError("");

    try {
      if (onCreateProduct) {
        const createdProduct = await onCreateProduct(requestBody);
        if (createdProduct) {
          setItems((prev) => [createdProduct, ...prev]);
        }
        sileo.success({
          title: "Product created",
          description: "New product has been added successfully.",
          ...sileoBlackTheme,
        });
        closeModal();
        return;
      }

      if (!session?.accessToken) {
        throw new Error("Access token is required");
      }

      const createdProduct = await createProductAction(
        requestBody,
        session.accessToken,
      );

      setItems((prev) => [createdProduct, ...prev]);
      sileo.success({
        title: "Product created",
        description: "New product has been added successfully.",
        ...sileoBlackTheme,
      });
      closeModal();
    } catch (error) {
      const message = error?.message || "Failed to create product";
      setActionError(message);
      sileo.error({
        title: "Create failed",
        description: message,
        ...sileoBlackTheme,
      });
    }
  };

  const startEditProduct = (product) => {
    setSelectedProductId(product.productId);
    setForm({
      productName: product.productName ?? "",
      price: product.price ?? "",
      categoryId: product.categoryId ?? categoryList[0]?.categoryId ?? "",
      imageUrl: product.imageUrl ?? "",
      description: product.description ?? "",
      colors: product.colors ?? [],
      sizes: product.sizes ?? [],
    });
    setOpenEdit(true);
  };

  const saveEditProduct = async () => {
    if (
      !selectedProductId ||
      !form.productName.trim() ||
      !form.price ||
      !form.categoryId
    )
      return;

    const requestBody = {
      name: form.productName.trim(),
      description: form.description.trim() || "",
      colors: form.colors,
      sizes: form.sizes,
      imageUrl: form.imageUrl.trim() || "",
      price: Number(form.price),
      categoryId: String(form.categoryId),
    };

    const selectedCategoryName =
      categoryList.find(
        (category) => category.categoryId === requestBody.categoryId,
      )?.categoryName ?? "Category";

    setActionError("");

    try {
      if (onUpdateProduct) {
        const updatedProduct = await onUpdateProduct({
          productId: selectedProductId,
          ...requestBody,
        });
        if (updatedProduct) {
          setItems((prev) =>
            prev.map((item) =>
              item.productId === selectedProductId
                ? {
                    ...item,
                    ...updatedProduct,
                    categoryId: requestBody.categoryId,
                    categoryName: selectedCategoryName,
                  }
                : item,
            ),
          );
        }
        sileo.success({
          title: "Product updated",
          description: "Product changes saved successfully.",
          ...sileoBlackTheme,
        });
        closeEditModal();
        return;
      }

      if (!session?.accessToken) {
        throw new Error("Access token is required");
      }

      const updatedProduct = await updateProductAction(
        selectedProductId,
        requestBody,
        session.accessToken,
      );

      setItems((prev) =>
        prev.map((item) =>
          item.productId === selectedProductId
            ? {
                ...item,
                ...updatedProduct,
                categoryId: requestBody.categoryId,
                categoryName: selectedCategoryName,
              }
            : item,
        ),
      );

      sileo.success({
        title: "Product updated",
        description: "Product changes saved successfully.",
        ...sileoBlackTheme,
      });
      closeEditModal();
    } catch (error) {
      const message = error?.message || "Failed to update product";
      setActionError(message);
      sileo.error({
        title: "Update failed",
        description: message,
        ...sileoBlackTheme,
      });
    }
  };

  const requestDeleteProduct = (product) => {
    if (!product?.productId) return;
    setActionError("");
    setProductToDelete(product);
    setOpenDelete(true);
  };

  const deleteProduct = async () => {
    if (!productToDelete?.productId) return;

    setActionError("");

    try {
      if (onDeleteProduct) {
        const success = await onDeleteProduct(productToDelete);
        if (!success) return;
      } else {
        if (!session?.accessToken) {
          throw new Error("Access token is required");
        }

        await deleteProductAction(
          productToDelete.productId,
          session.accessToken,
        );
      }

      setItems((prev) =>
        prev.filter((item) => item.productId !== productToDelete.productId),
      );

      sileo.success({
        title: "Product deleted",
        description: "Product was removed successfully.",
        ...sileoBlackTheme,
      });
      closeDeleteModal();
    } catch (error) {
      const message = error?.message || "Failed to delete product";
      setActionError(message);
      sileo.error({
        title: "Delete failed",
        description: message,
        ...sileoBlackTheme,
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-end gap-4">
        <div className="flex items-center gap-3">
          <span className="text-lg text-gray-500">Sort</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-s text-gray-700 outline-none"
          >
            <option value="name">Name (A-Z)</option>
            <option value="priceAsc">Price (Low to High)</option>
            <option value="priceDesc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <button
            type="button"
            onClick={() => setOpenCreate(true)}
            className="rounded-full bg-lime-400 px-6 py-3 text-s font-semibold text-gray-900 transition hover:bg-lime-300"
          >
            + Create product
          </button>
        </div>

        {actionError && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {actionError}
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          {sortedItems.map((product) => (
            <ProductCardEdit1
              key={product.productId}
              product={product}
              categoryLabel={product.categoryName ?? "Category"}
              href={`/dashboard/products/${product.productId}`}
              rating={product.star ?? product.rating ?? 0}
              onEdit={startEditProduct}
              onDelete={requestDeleteProduct}
            />
          ))}
        </div>
      </div>

      {openCreate && (
        <FormCreateProduct
          form={form}
          categoryList={categoryList}
          updateField={updateField}
          toggleToken={toggleToken}
          onClose={closeModal}
          onSubmit={createProduct}
        />
      )}

      {openEdit && (
        <FormEditProduct
          form={form}
          categoryList={categoryList}
          updateField={updateField}
          toggleToken={toggleToken}
          onClose={closeEditModal}
          onSubmit={saveEditProduct}
        />
      )}

      {openDelete && (
        <FormDeleteProduct
          productName={productToDelete?.productName ?? "this product"}
          onClose={closeDeleteModal}
          onDelete={deleteProduct}
        />
      )}
    </>
  );
}
