import { getOrdersService } from "../../service/order.service";

export async function getOrdersAction(accessToken) {
	return getOrdersService(accessToken);
}
