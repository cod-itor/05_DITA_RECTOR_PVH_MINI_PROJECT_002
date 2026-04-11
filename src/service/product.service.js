export async function productService(accessToken) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const authHeader = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    const res = await fetch(`${apiBaseUrl}/api/v1/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...authHeader,
        },
        cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch products");
    }

    const payload = data?.payload ?? [];
    const uniqueCategoryIds = [...new Set(payload.map((item) => item?.categoryId).filter(Boolean))];

    const categoryEntries = await Promise.all(
        uniqueCategoryIds.map(async (categoryId) => {
            try {
                const categoryRes = await fetch(
                    `${apiBaseUrl}/api/v1/categories/${categoryId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            ...authHeader,
                        },
                        cache: "no-store",
                    },
                );

                if (!categoryRes.ok) {
                    return [categoryId, "Category"];
                }

                const categoryData = await categoryRes.json();
                const categoryName = categoryData?.payload?.name ?? "Category";

                return [categoryId, categoryName];
            } catch {
                return [categoryId, "Category"];
            }
        }),
    );

    const categoryMap = new Map(categoryEntries);

    return payload.map((item) => ({
        productId: item?.productId,
        productName: item?.name ?? "Product",
        description: item?.description ?? "",
        colors: item?.colors ?? [],
        sizes: item?.sizes ?? [],
        star: item?.star ?? 0,
        imageUrl: item?.imageUrl ?? null,
        price: Number(item?.price ?? 0),
        categoryId: item?.categoryId,
        categoryName: categoryMap.get(item?.categoryId) ?? "Category",
    }));
}