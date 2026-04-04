//login page dùng để mô tả các element của Login page ở đâu, thao tác với các element đó như thế nào, ví dụ: click, nhập text, lấy text, v.v.
// Lợi ích: Khi UI thay đổi selector, chỉ sửa 1 chỗ ở file này,
//           thay vì sửa rải rác trong tất cả các test.
// ============================================================

// POM - PAGE OBJECT MODEL -> Chuan POM

import { Page, Locator, expect } from "@playwright/test";

export class ProductDetailPage {
  // ── Tham chiếu đến page object của Playwright ─────────────
  // Page là "trình duyệt ảo" - đại diện cho 1 tab trình duyệt
  readonly page: Page;

  // ── CSS SELECTORS ────────────────────────────────────────
  // Khai báo các Locator (cách Playwright tìm element trên DOM)
  get toCartButton(): Locator {
    return this.page.locator("#footer-atc");
  }

  // ── CONSTRUCTOR ───────────────────────────────────────────
  // Nhận page từ test, khởi tạo tất cả locator
  constructor(page: Page) {
    this.page = page;
  }

  // ── NAVIGATION ────────────────────────────────────────────

  /**
   * Điều hướng tới trang login.
   * page.goto() = mở URL, mặc định chờ đến khi trang load xong (networkidle)
   */
  async navigate(url: string) {
    await this.page.goto(url);
  }

  // ── ACTIONS ───────────────────────────────────────────────
}
