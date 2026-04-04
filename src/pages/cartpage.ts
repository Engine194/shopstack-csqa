import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";
import { CartResponse } from "../types";

export class CartPage extends BasePage {
  readonly page: Page;
  

  constructor(page: Page) {
    super(page);
    this.page = page;
    
  }

  // --- ACTIONS & API ---

  /**
   * Lấy trạng thái giỏ hàng hiện tại qua API
   * Sử dụng Date.now() để chống cache của Shopify
   */
  async getCartDataAPI(): Promise<CartResponse> {
    const response = await this.page.request.get(`/cart.js?t=${Date.now()}`);
    return await response.json();
  }

  /**
   * Điều hướng tới trang giỏ hàng
   */
  async navigateToCart() {
    await this.navigate("/cart");
    await this.waitForUrlMatch(/\/cart/);
  }
}