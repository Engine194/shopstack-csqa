import { Page, Locator, expect } from '@playwright/test';
export class CartPage {
    readonly page: Page;
    // mini cart
    readonly miniCartIcon: Locator;
    readonly viewMyCartButton: Locator;
    // cart page
    readonly cartTotalPrice: Locator;
    readonly appleCareSection: Locator;
    readonly appleCareAddBtn: Locator;
    readonly checkoutButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.miniCartIcon = page.locator('#cart-icon-bubble');
        this.viewMyCartButton = page.locator ('a [href="/cart"], .#cart-notification-button');
        this.cartTotalPrice = page.locator('.cart-total__price');
        this.appleCareSection = page.locator('[class*="applecare"]');
        this.appleCareAddBtn = page.locator('[id^="add-cart-apple-care"]');
        this.checkoutButton = page.locator('#checkout');
    }
    
    async goToCartPage() {
        await this.miniCartIcon.click();
        await expect(this.viewMyCartButton.first()).toBeVisible();
        await this.viewMyCartButton.first().click();
        await this.page.waitForURL('**/cart');
    }
    // get data
    async getCartDataAPI() {
        const response = await this.page.request.get(`/cart.js?t=${Date.now()}`);
        return await response.json();
    }
    getItemRow(handle: string = process.env.PRODUCT_HANDLE!): Locator {
        return this.page.locator(`.cart-item:has(a[href*="/products/${handle}"])`);
    }
    async getItemUI(handle: string) {
        const row = this.getItemRow(handle);
        return {
            title: row.locator('.cart-item__name a'),
            image: row.locator('.cart-item__image'),
            price: row.locator('.cart-item__price'),
            qtyInput: row.locator('.cart-item__quantity input'),
            plusBtn: row.locator('.cart-item__quantity button:has-text("+")'),
            minusBtn: row.locator('.cart-item__quantity button:has-text("-")'),
        };
    }

    // Actions
    // tăng qty
    async increaseQtyAndWait(handle: string): Promise<any> {
        const itemUI = await this.getItemUI(handle);
        const waitResponse = this.page.waitForResponse(res => 
            res.url().includes('/cart/change') && res.status() === 200);  
        await itemUI.plusBtn.click();
        const response = await waitResponse;
        return await response.json();
    }
    // get total price
    async getTotalPriceFromUI(): Promise<number> {
        const priceText = await this.cartTotalPrice.innerText();
        return parseInt(priceText.replace(/[^0-9]/g, ''));
    }
    // add AppleCare
    async addAppleCareAndWait(): Promise<any> {
        const waitResponse = this.page.waitForResponse(res => 
            res.url().includes('/cart/add') && res.status() === 200);    
        await this.appleCareAddBtn.click();
        const response = await waitResponse;
        return await response.json();
    }
    //remove item
    async removeItemAndWait(handle: string): Promise<any> {
        const row = this.getItemRow(handle);
        const waitResponse = this.page.waitForResponse(res => 
            res.url().includes('/cart/change') && res.status() === 200);
        await row.locator('.cart-item__remove').click();
        
        const response = await waitResponse;
        return await response.json();
    }
    
    async clickCheckoutButton() {
        await this.checkoutButton.click();
        await this.page.waitForURL('**/checkout');
    }
    

}

