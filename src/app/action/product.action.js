import { productByIdService, productService } from "../../service/product.service";

export async function getProductsAction(accessToken) {
  return productService(accessToken);
}

export async function getProductByIdAction(productId, accessToken) {
  return productByIdService(productId, accessToken);
}
