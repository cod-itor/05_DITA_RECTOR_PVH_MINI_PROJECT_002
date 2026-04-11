import { createOrderService, getOrdersService } from "../../service/order.service";

export async function getOrdersAction(accessToken) {
	return getOrdersService(accessToken);
}

export async function createOrderAction(requestBody, accessToken) {
	return createOrderService(requestBody, accessToken);
}
