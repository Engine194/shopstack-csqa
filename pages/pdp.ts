import { Page, Locator, expect } from '@playwright/test';
 
export class pdp {
    readonly page: Page;
    readonly addToCartButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.addToCartButton = page.getByRole('button', { name: 'เพิ่มลงในรถเข็น' });
        // locator: #footer-atc
    }
    //lấy variant ID của option đã select (thẻ ngầm của Shopify <input type="hidden" name="id">)
    async getSelectedVariantId(): Promise<string> {
        return await this.page.locator('form[action^="/cart/add"] input[name="id"]:not([disabled])').first().inputValue();
    }
    async getCartDataAPI(): Promise<any> {
        const response = await this.page.request.get(`/cart.js?t=${Date.now()}`);
        return await response.json();
    }
    // add product to cart và chờ response của API cart.js
    async clickAddToCartAndWaitForCartAPI(): Promise<any> {
        const [addResponse] = await Promise.all([
            this.page.waitForResponse(res =>  res.url().includes('/cart/add') && res.status() === 200),
            this.addToCartButton.click()
        ]);
        const cartResponse = await this.page.request.get(`/cart.js?t=${Date.now()}`);
        return await cartResponse.json();
    }
    // tìm item trong cart
    getItemFromCartData(cartData: any, productHandle=process.env.PRODUCT_HANDLE): any {
        return cartData.items.find((item: any) => item.handle === productHandle);
    }
    
}




