import { test, expect }      from '@playwright/test';
import { CartPage } from '../pages/cartpage';

test.describe('Cart Page', () => { 
    const productHandle = process.env.PRODUCT_HANDLE!;
    const appleCareHandle = process.env.APPLECARE_HANDLE!;

    test.beforeEach(async ({ page }) => {
    const cartPage = new CartPage(page);

    // lấy variantID
    const productResponse = await page.request.get(`/products/${productHandle}.js`);
    expect(productResponse.ok()).toBeTruthy();
    const productData = await productResponse.json();
    const firstVariantId = productData.variants[0].id;
    // add variantID vào cart bằng API
    const cartResponse = await page.request.post('/cart/add.js', {
        data: {items: [{id: firstVariantId, quantity: 1}]}});    
    expect(cartResponse.ok()).toBeTruthy();
    await page.goto('/cart');
    });

    test('Display correct product info in cart', async ({ page }) => {
        const cartPage = new CartPage(page);
        const cartData = await cartPage.getCartDataAPI();
        const apiItem = cartData.items.find((i: { handle: string }) => i.handle === productHandle);
        const uiItem = await cartPage.getItemUI(productHandle);
        
        const uiPriceText = await uiItem.price.innerText();
        const uiPriceNumber = parseInt(uiPriceText.replace(/[^0-9]/g, ''));
        expect(uiPriceNumber).toBe(apiItem.final_line_price);
        await expect(uiItem.qtyInput).toHaveValue(apiItem.quantity.toString());
    });

    test('Redirect to PDP when click product name or image', async ({ page }) => {
        const cartPage = new CartPage(page);
        const uiItem = await cartPage.getItemUI(productHandle);
        await uiItem.title.click();
        await expect(page).toHaveURL(new RegExp(`/products/${productHandle}`));
        await page.goBack();
    });

    test('Increase product quantity', async ({ page }) => {
        const cartPage = new CartPage(page);
        const cart = await cartPage.getCartDataAPI();
        const currentQty = cart.items.find((i: { handle: string }) => i.handle === productHandle);
        
        const cartAfter = await cartPage.increaseQtyAndWait(productHandle);
        const itemAfter = cartAfter.items.find((i: { handle: string }) => i.handle === productHandle);
        expect(itemAfter.quantity).toBe(currentQty + 1);
        
        const uiTotalPrice = await cartPage.getTotalPriceFromUI();
        expect(uiTotalPrice, 'Tổng tiền UI phải khớp với API sau khi tăng Qty').toBe(cartAfter.total_price);
    });

    test('Add AppleCare to cart', async ({ page }) => {
        const cartPage = new CartPage(page);
        
        const cart = await cartPage.getCartDataAPI();
        const appleCareBefore = cart.items.find((i: { handle: string }) => i.handle === appleCareHandle);
        expect(appleCareBefore).toBeUndefined();
        
        const cartAfter = await cartPage.addAppleCareAndWait();
        const appleCareAfter = cartAfter.items.find((i: { handle: string }) => i.handle === appleCareHandle);
        expect(appleCareAfter).toBeDefined();
        expect(appleCareAfter.quantity).toBe(1);
     });

    test('Redirect to Checkout page', async ({ page }) => {
        const cartPage = new CartPage(page);
        await expect(cartPage.checkoutButton).toBeVisible();
        await cartPage.clickCheckoutButton();
        await expect(page).toHaveURL(/.*checkout/);
    });
});