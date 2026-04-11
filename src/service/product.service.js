const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders(accessToken) {
    return {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
}

function requireAccessToken(accessToken) {
    if (!accessToken) {
        throw new Error("Access token is required");
    }
}

function mapProduct(item, categoryName) {
    return {
        productId: item?.productId,
        productName: item?.name ?? "Product",
        description: item?.description ?? "",
        colors: item?.colors ?? [],
        sizes: item?.sizes ?? [],
        star: item?.star ?? 0,
        imageUrl: item?.imageUrl ?? null,
        price: Number(item?.price ?? 0),
        categoryId: item?.categoryId,
        categoryName: categoryName ?? "Category",
    };
}

async function getCategoryName(categoryId, accessToken) {
    if (!categoryId) return "Category";

    try {
        const categoryRes = await fetch(`${apiBaseUrl}/api/v1/categories/${categoryId}`, {
            method: "GET",
            headers: getAuthHeaders(accessToken),
            cache: "no-store",
        });

        if (!categoryRes.ok) {
            return "Category";
        }

        const categoryData = await categoryRes.json();
        return categoryData?.payload?.name ?? "Category";
    } catch {
        return "Category";
    }
}

export async function productService(accessToken) {
    const res = await fetch(`${apiBaseUrl}/api/v1/products`, {
        method: "GET",
        headers: getAuthHeaders(accessToken),
        cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch products");
    }

    const payload = data?.payload ?? [];
    const uniqueCategoryIds = [...new Set(payload.map((item) => item?.categoryId).filter(Boolean))];
    const categoryEntries = await Promise.all(
        uniqueCategoryIds.map(async (categoryId) => [categoryId, await getCategoryName(categoryId, accessToken)]),
    );
    const categoryMap = new Map(categoryEntries);

    return payload.map((item) => mapProduct(item, categoryMap.get(item?.categoryId)));
}

export async function productByIdService(productId, accessToken) {
    const res = await fetch(`${apiBaseUrl}/api/v1/products/${productId}`, {
        method: "GET",
        headers: getAuthHeaders(accessToken),
        cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch product");
    }

    const payload = data?.payload ?? null;

    if (!payload) {
        return null;
    }

    const categoryName = await getCategoryName(payload?.categoryId, accessToken);
    return mapProduct(payload, categoryName);
}

export async function topSellingProductsService(accessToken) {
    const endpoint = `${apiBaseUrl}/api/v1/products/top-selling?limit=10`;

    return fetchTopSellingProducts(endpoint, accessToken);
}

export async function topSellingMiniProductsService(accessToken) {
    const endpoint = `${apiBaseUrl}/api/v1/products/top-selling?limit=3`;

    return fetchTopSellingProducts(endpoint, accessToken);
}

export async function categoryService(accessToken) {
    requireAccessToken(accessToken);

    const res = await fetch(`${apiBaseUrl}/api/v1/categories`, {
        method: "GET",
        headers: getAuthHeaders(accessToken),
        cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch categories");
    }

    const payload = Array.isArray(data?.payload) ? data.payload : [];

    return payload.map((category) => ({
        categoryId: category?.categoryId,
        categoryName: category?.name ?? "Category",
    }));
}

export async function createProductService(requestBody, accessToken) {
    requireAccessToken(accessToken);

    const res = await fetch(`${apiBaseUrl}/api/v1/products`, {
        method: "POST",
        headers: getAuthHeaders(accessToken),
        body: JSON.stringify(requestBody),
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        throw new Error(data?.message || "Failed to create product");
    }

    const payload = data?.payload;

    if (payload) {
        const categoryName = await getCategoryName(payload?.categoryId, accessToken);
        return mapProduct(payload, categoryName);
    }

    const categoryName = await getCategoryName(requestBody?.categoryId, accessToken);

    return {
        productId: data?.payload?.productId ?? data?.productId ?? Date.now(),
        productName: requestBody?.name ?? "Product",
        description: requestBody?.description ?? "",
        colors: requestBody?.colors ?? [],
        sizes: requestBody?.sizes ?? [],
        star: 0,
        imageUrl: requestBody?.imageUrl ?? null,
        price: Number(requestBody?.price ?? 0),
        categoryId: requestBody?.categoryId,
        categoryName,
    };
}

export async function updateProductService(productId, requestBody, accessToken) {
    requireAccessToken(accessToken);

    if (!productId) {
        throw new Error("Product ID is required");
    }

    const res = await fetch(`${apiBaseUrl}/api/v1/products/${productId}`, {
        method: "PUT",
        headers: getAuthHeaders(accessToken),
        body: JSON.stringify(requestBody),
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        throw new Error(data?.message || "Failed to update product");
    }

    const latestProduct = await productByIdService(productId, accessToken);

    if (latestProduct) {
        return latestProduct;
    }

    const payload = data?.payload;

    if (payload) {
        const categoryName = await getCategoryName(payload?.categoryId, accessToken);
        return mapProduct(payload, categoryName);
    }

    const categoryName = await getCategoryName(requestBody?.categoryId, accessToken);

    return {
        productId,
        productName: requestBody?.name ?? "Product",
        description: requestBody?.description ?? "",
        colors: requestBody?.colors ?? [],
        sizes: requestBody?.sizes ?? [],
        star: 0,
        imageUrl: requestBody?.imageUrl ?? null,
        price: Number(requestBody?.price ?? 0),
        categoryId: requestBody?.categoryId,
        categoryName,
    };
}

export async function deleteProductService(productId, accessToken) {
    requireAccessToken(accessToken);

    if (!productId) {
        throw new Error("Product ID is required");
    }

    const res = await fetch(`${apiBaseUrl}/api/v1/products/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders(accessToken),
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        throw new Error(data?.message || "Failed to delete product");
    }

    return true;
}

export async function rateProductService(productId, star, accessToken) {
    requireAccessToken(accessToken);

    if (!productId) {
        throw new Error("Product ID is required");
    }

    const numericStar = Number(star);

    if (!Number.isInteger(numericStar) || numericStar < 1 || numericStar > 5) {
        throw new Error("Star must be an integer between 1 and 5");
    }

    const params = new URLSearchParams({ star: String(numericStar) });
    const res = await fetch(`${apiBaseUrl}/api/v1/products/${productId}/rating?${params.toString()}`, {
        method: "PATCH",
        headers: getAuthHeaders(accessToken),
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        throw new Error(data?.message || "Failed to rate product");
    }

    const payloadStar = Number(data?.payload?.star);
    if (Number.isFinite(payloadStar)) {
        return payloadStar;
    }

    const latestProduct = await productByIdService(productId, accessToken);
    if (latestProduct && Number.isFinite(Number(latestProduct?.star))) {
        return Number(latestProduct.star);
    }

    return numericStar;
}

async function fetchTopSellingProducts(endpoint, accessToken) {

    const res = await fetch(endpoint, {
        method: "GET",
        headers: getAuthHeaders(accessToken),
        cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch top selling products");
    }

    const payload = Array.isArray(data?.payload) ? data.payload : [];
    const uniqueCategoryIds = [...new Set(payload.map((item) => item?.categoryId).filter(Boolean))];
    const categoryEntries = await Promise.all(
        uniqueCategoryIds.map(async (categoryId) => [categoryId, await getCategoryName(categoryId, accessToken)]),
    );
    const categoryMap = new Map(categoryEntries);

    return payload.map((item) => mapProduct(item, categoryMap.get(item?.categoryId)));
}