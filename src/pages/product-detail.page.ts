//login page dùng để mô tả các element của Login page ở đâu, thao tác với các element đó như thế nào, ví dụ: click, nhập text, lấy text, v.v.
// Lợi ích: Khi UI thay đổi selector, chỉ sửa 1 chỗ ở file này,
//           thay vì sửa rải rác trong tất cả các test.
// ============================================================

// POM - PAGE OBJECT MODEL -> Chuan POM

import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { AddCartResponse } from "../types";

export class ProductDetailPage extends BasePage {
  // ── Tham chiếu đến page object của Playwright ─────────────
  // Page là "trình duyệt ảo" - đại diện cho 1 tab trình duyệt
  readonly page: Page;

  // ── CSS SELECTORS ────────────────────────────────────────
  // Khai báo các Locator (cách Playwright tìm element trên DOM)
  get toCartButton(): Locator {
    return this.page.locator("#footer-atc");
  }
  // Element chứa Variant ID đang được select ngầm trên UI
  get selectedVariantInput(): Locator {
    return this.page.locator('form[action*="/cart/add"] input[name="id"]:not([disabled])').first();
  }

  // Các Element của Mini-cart (Header)
  get miniCartIcon(): Locator {
    return this.page.locator('#cart-icon-bubble, .header__icon--cart'); 
  }

  get viewMyCartButton(): Locator {
    return this.page.locator('a[href="/cart"], .cart-notification__view-cart, .mini-cart__view-cart').first();
  }

  // ── CONSTRUCTOR ───────────────────────────────────────────
  // Nhận page từ test, khởi tạo tất cả locator
  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  // ── NAVIGATION ────────────────────────────────────────────

  async waitForReady() {
    await this.page.waitForURL("**/products/*");
  }

  getUrl() {
    return this.page.url();
  }

  // ── ACTIONS ───────────────────────────────────────────────
  /**
   * Đọc Variant ID của sản phẩm đang được chọn trên màn hình
   */
  async getSelectedVariantId(): Promise<number> {
    const variantIdStr = await this.selectedVariantInput.inputValue();
    return parseInt(variantIdStr, 10);
  }

  async addProductToCartAndWait(): Promise<AddCartResponse> {
    await expect(this.toCartButton, 'Nút Add to Cart phải ở trạng thái Enable').toBeEnabled();

    const responsePromise = this.waitForResponse({
      urlPart: "/cart/add.js",
      statusCode: 200,
      method: "POST"
    });

    await this.waitAndClick(this.toCartButton);

    const response = await responsePromise;
    return await response.json();
  }

  /**
   * Action mở Mini-cart và đi đến trang Cart
   */
  async goToCartViaMiniCart() {
    // Dùng isVisible để check, nếu chưa mở thì mới click Icon
    const isViewCartVisible = await this.isElementVisible('a[href="/cart"]');
    if (!isViewCartVisible) {
      await this.waitAndClick(this.miniCartIcon);
    }
    
    // Click đi tới trang giỏ hàng
    await this.waitAndClick(this.viewMyCartButton);
    await this.page.waitForURL('**/cart');
  }
}
