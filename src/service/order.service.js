const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders(accessToken) {
	return {
		"Content-Type": "application/json",
		...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
	};
}

function mapOrderDetail(detail) {
	return {
		name: detail?.productName ?? "Product",
		quantity: Number(detail?.orderQty ?? 0),
		price: Number(detail?.orderTotal ?? 0),
	};
}

function mapOrder(order) {
	const products = Array.isArray(order?.orderDetailsResponse)
		? order.orderDetailsResponse.map(mapOrderDetail)
		: [];

	return {
		orderId: order?.orderId,
		userId: order?.appUserId ?? "-",
		orderDate: order?.orderDate
			? new Date(order.orderDate).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
			: "-",
		lineItems: products.length,
		total: Number(order?.totalAmount ?? 0),
		products,
	};
}

export async function getOrdersService(accessToken) {
	const response = await fetch(`${apiBaseUrl}/api/v1/orders`, {
		method: "GET",
		headers: getAuthHeaders(accessToken),
		cache: "no-store",
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data?.message || "Failed to fetch orders");
	}

	const payload = Array.isArray(data?.payload) ? data.payload : [];
	return payload.map(mapOrder);
}
