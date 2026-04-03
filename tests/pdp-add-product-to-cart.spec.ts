import { test, expect } from '@playwright/test';
import { pdp } from '../pages/pdp';

test.describe('Add product to cart from PDP', () => {
  test('Add product to cart from PDP', async ({ page }) => {
    const pdpPage = new pdp(page);
    const productHandle = process.env.PRODUCT_HANDLE;
    await page.goto(`/products/${productHandle}`);
    
    // lấy variant ID của option đã select
    const selectedVariantId = await pdpPage.getSelectedVariantId();
    expect(selectedVariantId, 'Phải đọc được variant ID').toBeTruthy(); //k undefined, null, ''

    // check cart trước khi add
    const cartBefore = await pdpPage.getCartDataAPI();
    const itemBefore = pdpPage.getItemFromCartData(cartBefore, productHandle);
        expect(itemBefore, 'Sản phẩm CHƯA tồn tại trong giỏ hàng').toBeUndefined();

    // add product to cart
    const cartAfter = await pdpPage.clickAddToCartAndWaitForCartAPI();
    
    // kiểm tra sp có nằm trong cart không
    const handlesInCart = cartAfter.items.map((item: any) => item.handle);
    expect(handlesInCart).toContain(productHandle);
    
    // check qty
    const itemAfter = cartAfter.items.find((item: any) => item.handle === productHandle);
    expect(itemAfter.quantity).toBe(1);
    // Kiểm tra variant ID của item trong cart khớp với variant ID đã chọn trên PDP
    expect(itemAfter.variant_id.toString()).toBe(selectedVariantId);
    
    });

});