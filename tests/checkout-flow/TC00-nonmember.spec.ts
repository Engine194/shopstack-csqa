import test, { expect } from "@playwright/test";
import { ProductDetailPage } from "../pages";
import jsonData from "../data/TC00-nonmember.json";


// Test suite
test.describe("TC00-checkout-nonmember-flow", () => {
  /**
     * 1.1. Go to a product detail url
     * 1.2. Test format of url: https://ss-plus-store.myshopify.com/products/2022-apple-watch-ocean-band-mqec3fe-a
     * 1.3. Extract product sku from url
     * 1.4. Extract response from product detail api, extract product info:
     * 1.5. Check button add to cart enable, click it
     * 1.6. Wait for cart api to get previous qty of product if any
     * 1.7. Wait for add cart api to get response
     * 1.8. Extract payload of add to cart api -> get variantId
     * 1.9. Extract current cart to check product qty + 1 or not
     * 1.10. Extract cart item infor to check variant id must match
     * 1.11. Navigate to cart page.
    */
  test("[TC00] Checkout Success", async ({ page }) => {
    const productUrl = jsonData.productDetailUrl;
    expect(productUrl).not.toBeNull();
    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.navigate(productUrl);
    

  });
});
