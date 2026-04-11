import { productService } from "../../service/product.service";

export async function getProductsAction(accessToken) {
  return productService(accessToken);
}
