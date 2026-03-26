//login page dùng để mô tả các element của Login page ở đâu, thao tác với các element đó như thế nào, ví dụ: click, nhập text, lấy text, v.v.
// Lợi ích: Khi UI thay đổi selector, chỉ sửa 1 chỗ ở file này,
//           thay vì sửa rải rác trong tất cả các test.
// ============================================================

import { Page, Locator, expect } from '@playwright/test';
 
export class LoginPage {
  // ── Tham chiếu đến page object của Playwright ─────────────
  // Page là "trình duyệt ảo" - đại diện cho 1 tab trình duyệt
  readonly page: Page;
 
  // ── CSS SELECTORS ────────────────────────────────────────
  // Khai báo các Locator (cách Playwright tìm element trên DOM)
 
  // Input email trong form đăng nhập (id="CustomerEmail")
  // ⚠️ Trang có 2 input email: #CustomerEmail (login) và #RecoverEmail (forgot pwd)
  //    Dùng đúng selector để tránh nhầm
  readonly emailInput: Locator;
 
  // Input password (id="CustomerPassword", type="password")
  readonly passwordInput: Locator;
 
  // Nút "ลงชื่อเข้าใช้" / Sign In (id="customerLogin")
  readonly signInButton: Locator;
 
  // Thông báo lỗi - Shopify hiển thị dạng list: <ul class="errors"><li>...</li></ul>
  // Ta lấy phần tử cha .errors để check visibility, rồi lấy .errors li để check text
  readonly errorMessage: Locator;
 
  // Link "Quên mật khẩu" → dẫn tới #recover section
  readonly forgotPasswordLink: Locator;
 
  // Link "Đăng ký tài khoản mới"
  readonly registerLink: Locator;

  // ── CONSTRUCTOR ───────────────────────────────────────────
  // Nhận page từ test, khởi tạo tất cả locator
  constructor(page: Page) {
    this.page = page;
 
    // page.locator(selector) = tạo locator nhưng CHƯA tìm element ngay
    // Element chỉ được tìm khi thực sự tương tác (lazy evaluation)
    this.emailInput      = page.locator('#CustomerEmail');
    this.passwordInput   = page.locator('#CustomerPassword');
    this.signInButton    = page.locator('#customerLogin');
    this.errorMessage    = page.locator('.errors');          // container lỗi
    this.forgotPasswordLink = page.locator('a[href="#recover"]');
    this.registerLink    = page.locator('a[href="/account/register"]');
  }
 
  // ── NAVIGATION ────────────────────────────────────────────
 
  /**
   * Điều hướng tới trang login.
   * page.goto() = mở URL, mặc định chờ đến khi trang load xong (networkidle)
   */
  async navigate() {
    await this.page.goto('/account/login');
  }
 
  // ── ACTIONS ───────────────────────────────────────────────
 
  /**
   * Điền email vào ô input.
   * fill() = xóa nội dung cũ rồi gõ text mới (khác với type() gõ từng ký tự)
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }
 
  /**
   * Điền password vào ô input.
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }
 
  /**
   * Click nút Sign In để submit form.
   * click() = mô phỏng click chuột vào element
   */
  async clickSignIn() {
    await this.signInButton.click();
  }
 
  /**
   * Hàm tổng hợp: điền thông tin + click Sign In trong 1 bước.
   * Dùng cho các test case cần đăng nhập nhanh.
   *
   * @param email    - địa chỉ email
   * @param password - mật khẩu
   */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }
 
  // ── ASSERTIONS (các hàm kiểm tra trạng thái) ─────────────
 
  /**
   * Kiểm tra thông báo lỗi xuất hiện và chứa text mong muốn.
   *
   * @param expectedText - đoạn text mong đợi trong error message
   *                       Để trống ('') nếu chỉ cần kiểm tra error có hiển thị
   */
  async verifyErrorVisible(expectedText: string = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง') {
    // Chờ .errors xuất hiện trong DOM (tối đa 5s)
    await expect(this.errorMessage).toBeVisible();
 
    // Nếu có text cần kiểm tra thêm
    if (expectedText) {
      await expect(this.errorMessage).toContainText(expectedText);
    }
  }

}