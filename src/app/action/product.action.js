import {
  productByIdService,
  productService,
  topSellingMiniProductsService,
  topSellingProductsService,
} from "../../service/product.service";

export async function getProductsAction(accessToken) {
  return productService(accessToken);
}

export async function getProductByIdAction(productId, accessToken) {
  return productByIdService(productId, accessToken);
}

export async function getTopSellingProductsAction(accessToken) {
  return topSellingProductsService(accessToken);
}

export async function getTopSellingMiniProductsAction(accessToken) {
  return topSellingMiniProductsService(accessToken);
}
