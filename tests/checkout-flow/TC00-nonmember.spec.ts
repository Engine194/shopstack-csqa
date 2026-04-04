import test, { expect } from "@playwright/test";
import { ProductDetailPage } from "../../src/pages";
import jsonData from "../../src/data/TC00-nonmember.json";
import { CartResponse, ShopifyProductResponse, AddCartResponse } from "../../src/types";
import { CartPage } from "../../src/pages/cartpage";

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
    const cartPage = new CartPage(page);

    await productDetailPage.navigate(productUrl);
    await productDetailPage.waitForReady();

    const url = productDetailPage.getUrl();
    const handleRegex: RegExp = /\/products\/([a-zA-Z0-9-]+)/;
    const hasMatched = handleRegex.test(url);
    expect(hasMatched).toBe(true);
    let handleUrl = "";
    const match = url.match(handleRegex);
    if (match && match[1]) {
      handleUrl = match[1];
    }
    expect(handleUrl).not.toBeFalsy();
    const responsePromise = productDetailPage.waitForResponse({
        urlPart: url + ".json",
        statusCode: 200,
        method: "GET"
    })
    const response = await responsePromise;
    expect(response.ok()).toBe(true);
    const productData: ShopifyProductResponse = await response.json();
    expect(productData.product.handle).not.toBeFalsy();
    expect(productData.product.handle).toEqual(handleUrl);


    await test.step('Check add to cart and quantity calculation', async () => {
      // Lấy Variant ID của chính Option đang chọn trên UI
      const selectedVariantId = await productDetailPage.getSelectedVariantId();
      expect(selectedVariantId).toBeTruthy();

      // Check số lượng trong giỏ hàng TRƯỚC KHI add
      const cartBefore: CartResponse = await cartPage.getCartDataAPI();
      const previousItem = cartBefore.items.find(item => item.variant_id === selectedVariantId);
      
      // Nếu sản phẩm đã có trong giỏ, lấy số lượng cũ. Nếu chưa có, gán là 0.
      const previousQty = previousItem ? previousItem.quantity : 0; 
      console.log(`Số lượng trước khi add: ${previousQty}`); // Log ra để dễ debug

      // 4. Click Add và bắt API Add
      const addCartResponse: AddCartResponse = await productDetailPage.addProductToCartAndWait();
      
      // Đảm bảo API add lên server đúng cái Variant ID đang chọn
      const addedVariantId = addCartResponse.items[0].variant_id;
      expect(addedVariantId, 'Variant ID add lên API phải khớp UI').toEqual(selectedVariantId);

      // Kiểm tra giỏ hàng SAU KHI add
      const cartAfter: CartResponse = await cartPage.getCartDataAPI();
      const currentItem = cartAfter.items.find(item => item.variant_id === selectedVariantId);

      expect(currentItem, 'Sản phẩm phải tồn tại trong giỏ hàng').toBeDefined();
      
      // Số lượng mới phải bằng số lượng cũ + 1
      expect(currentItem!.quantity, 'Số lượng sản phẩm trong giỏ phải cộng dồn thêm 1').toEqual(previousQty + 1);
    });

    await test.step('Navigate to Cart via Mini-cart', async () => {
      await productDetailPage.goToCartViaMiniCart();
      
      
    });

  });

});
