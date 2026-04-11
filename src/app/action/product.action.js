import {
  categoryService,
  createProductService,
  deleteProductService,
  productByIdService,
  rateProductService,
  productService,
  updateProductService,
  topSellingMiniProductsService,
  topSellingProductsService,
} from "../../service/product.service";

export async function getProductsAction(accessToken) {
  return productService(accessToken);
}

export async function getCategoriesAction(accessToken) {
  return categoryService(accessToken);
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

export async function createProductAction(requestBody, accessToken) {
  return createProductService(requestBody, accessToken);
}

export async function updateProductAction(productId, requestBody, accessToken) {
  return updateProductService(productId, requestBody, accessToken);
}

export async function deleteProductAction(productId, accessToken) {
  return deleteProductService(productId, accessToken);
}

export async function rateProductAction(productId, star, accessToken) {
  return rateProductService(productId, star, accessToken);
}
