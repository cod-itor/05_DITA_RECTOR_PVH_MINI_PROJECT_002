const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders(accessToken) {
    return {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
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