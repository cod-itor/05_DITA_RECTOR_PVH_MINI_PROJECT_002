const cartStorageKey = "cart_order_payload";

function getEmptyCart() {
  return { orderDetailRequests: [] };
}

function normalizePayload(payload) {
  if (!payload || !Array.isArray(payload.orderDetailRequests)) {
    return getEmptyCart();
  }

  const orderDetailRequests = payload.orderDetailRequests
    .map((item) => ({
      productId: String(item?.productId ?? "").trim(),
      orderQty: Number(item?.orderQty ?? 0),
    }))
    .filter(
      (item) => item.productId.length > 0 && Number.isFinite(item.orderQty),
    )
    .map((item) => ({
      productId: item.productId,
      orderQty: Math.max(1, Math.floor(item.orderQty)),
    }));

  return { orderDetailRequests };
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getCartPayloadFromStorage() {
  if (!canUseStorage()) return getEmptyCart();

  try {
  const raw = window.localStorage.getItem(cartStorageKey);
    if (!raw) return getEmptyCart();
    const parsed = JSON.parse(raw);
    return normalizePayload(parsed);
  } catch {
    return getEmptyCart();
  }
}

export function saveCartPayloadToStorage(payload) {
  if (!canUseStorage()) return getEmptyCart();

  const safePayload = normalizePayload(payload);
  window.localStorage.setItem(cartStorageKey, JSON.stringify(safePayload));
  return safePayload;
}

export function addProductToCartStorage(productId, qty = 1) {
  const safeProductId = String(productId ?? "").trim();
  const safeQty = Math.max(1, Math.floor(Number(qty) || 1));

  if (!safeProductId) {
    return getCartPayloadFromStorage();
  }

  const current = getCartPayloadFromStorage();
  const next = [...current.orderDetailRequests];
  const index = next.findIndex((item) => item.productId === safeProductId);

  if (index >= 0) {
    next[index] = {
      ...next[index],
      orderQty: next[index].orderQty + safeQty,
    };
  } else {
    next.push({ productId: safeProductId, orderQty: safeQty });
  }

  return saveCartPayloadToStorage({ orderDetailRequests: next });
}

export function setProductQtyInCartStorage(productId, qty) {
  const safeProductId = String(productId ?? "").trim();
  const safeQty = Math.floor(Number(qty) || 0);

  if (!safeProductId) {
    return getCartPayloadFromStorage();
  }

  const current = getCartPayloadFromStorage();
  const next = current.orderDetailRequests
    .map((item) =>
      item.productId === safeProductId ? { ...item, orderQty: safeQty } : item,
    )
    .filter((item) => item.orderQty > 0);

  return saveCartPayloadToStorage({ orderDetailRequests: next });
}

export function removeProductFromCartStorage(productId) {
  const safeProductId = String(productId ?? "").trim();
  const current = getCartPayloadFromStorage();
  const next = current.orderDetailRequests.filter(
    (item) => item.productId !== safeProductId,
  );
  return saveCartPayloadToStorage({ orderDetailRequests: next });
}

export function clearCartStorage() {
  return saveCartPayloadToStorage(getEmptyCart());
}
