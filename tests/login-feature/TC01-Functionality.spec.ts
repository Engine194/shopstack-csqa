import test, { expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/loginpage";
import { ENV } from "../../config_env";

test.describe('1. Login Functionality', () => {

  // ── beforeEach: chạy TRƯỚC MỖI test case ──────────────────
  // Đây là "setup" bước chung: khởi tạo LoginPage và navigate tới trang login
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    // Điều hướng tới /account/login trước mỗi test
    // Đảm bảo mỗi test bắt đầu ở trạng thái clean state
    await loginPage.navigate();
  });

  // ===========================================================================
  // TC01 - Kiểm tra UI cơ bản của trang login
  
  test('TC01 - UI Overview', async ({ page }) => {
    // Bước 1: Khởi tạo LoginPage với page hiện tại
    const loginPage = new LoginPage(page);
 
    // Bước 2: Gọi hàm kiểm tra các element cơ bản
    await expect(page.locator('#login')).toContainText('การเข้าสู่ระบบ');
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });

  // ========================================================================
  // TC02 - Login thành công với email và password hợp lệ

  test('TC02 Successful Login with Valid Credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
 
    // Bước 1: Thực hiện đăng nhập với thông tin từ .env
    // login() = fillEmail() + fillPassword() + clickSignIn()
    await loginPage.login(ENV.USER_UID!, ENV.USER_PWD!);
 
    // Bước 2: Chờ và kiểm tra redirect về trang account
    await expect(page).toHaveURL(/.*\/account/);

    
  });
 
  // =========================================================================
  // TC03 - Login thất bại: email không tồn tại trong hệ thống

  // Chỉ test case này khi site MGT on (https://mgt-istudio-api-pwa-dev.vinobe.com/rest/V1/shopify/customers)
  // Luồng hiện tại: user nhập thông tin ở Shopify, Shopify sẽ validate thông tin
  // nếu user không tồn tại ở Shopify -> gọi lên CS, CS gọi API MGT để validate customer
  // nếu API trả ra lỗi -> báo lỗi ngoài FE, không login được
  // nếu API không trả ra lỗi -> có thể login thành công
  // Hiện tại nếu site MGT down thì API không trả ra lỗi
  
  //test('TC03 - Email does not exist', async ({ page }) => {
    //const loginPage = new LoginPage(page);
 
    // Bước 1: Đăng nhập với email không tồn tại, password bất kỳ
    //await loginPage.login(process.env.INVALID_EMAIL!, process.env.USER_PWD!);
 
    // Bước 2: Chờ và kiểm tra thông báo lỗi xuất hiện
    // Shopify hiển thị lỗi trong .errors sau khi submit
    //await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
 
    // Bước 3: Vẫn phải ở trang login (không redirect)
    //await expect(page).toHaveURL(/.*account\/login/);
  //});
 
  // =========================================================================
  // TC04 - Login thất bại: sai mật khẩu
  test('TC04 - Login failed with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
 
    // Bước 1: Đăng nhập với email đúng nhưng password sai
    await loginPage.login(process.env.USER_UID!, process.env.INVALID_PWD!);
 
    // Bước 2: Kiểm tra thông báo lỗi
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
 
    // Bước 3: Vẫn ở trang login
    await expect(page).toHaveURL(/.*account\/login/);
  });
 
  // ========================================================================
  // TC05 - Login thất bại: để trống cả email và password

  test('TC05 - Login failed with empty email and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
 
    // Bước 1: Click Sign In ngay mà KHÔNG điền gì
    await loginPage.clickSignIn();
 
    // Bước 2: Kiểm tra vẫn ở trang login (không submit được)
    await expect(page).toHaveURL(/.*account\/login/);
 
    // Bước 3: Verify error message hiển thị
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  });
 
  // =====================================================================
  // TC06 - Login thất bại: bỏ trống email, có password

  test('TC06 - Login failed when email is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
 
    // Bước 1: Chỉ điền password, email để trống
    await loginPage.fillPassword(process.env.USER_PWD!);
    await loginPage.clickSignIn();
 
    // Bước 2: Vẫn ở trang login
    await expect(page).toHaveURL(/.*account\/login/);
 
    // Bước 3: Verify error message hiển thị
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  });
 
  // ====================================================================
  // TC07 - Login thất bại: bỏ trống password, có email

  test('TC07 - Login failed when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
 
    // Bước 1: Chỉ điền email, password để trống
    await loginPage.fillEmail(process.env.USER_UID!);
    await loginPage.clickSignIn();
 
    // Bước 2: Vẫn ở trang login
    await expect(page).toHaveURL(/.*account\/login/);
 
    // Bước 3: Verify error message hiển thị
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  });
 
  // ==================================================================
  // TC08 - Login thất bại: email sai định dạng

  test('TC08 - Login failed when email has invalid format', async ({ page }) => {
    const loginPage = new LoginPage(page);
 
    // Bước 1: Điền email không có @
    await loginPage.fillEmail('notanemail');
    await loginPage.fillPassword(process.env.USER_PWD!);
    await loginPage.clickSignIn();
 
    // Bước 2: Vẫn ở trang login
    await expect(page).toHaveURL(/.*account\/login/);
 
    // Bước 3: Verify error message hiển thị
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  });
 
  // ======================================================================
  // TC09 - Điều hướng tới trang Forgot Password

  test('TC09 - Click Forgot Password link', async ({ page }) => {
    const loginPage = new LoginPage(page);
 
    // Bước 1: Click link "ลืมรหัสผ่านหรือไม่" (Forgot Password?)
    // href="#recover" = scroll/show section recover trên cùng trang
    await loginPage.forgotPasswordLink.click();
 
    // Bước 2: Chờ URL thay đổi thành #recover (hash change)
    await expect(page).toHaveURL(/.*#recover/);
 
    // Bước 3: Kiểm tra có input email
    // #RecoverEmail là field email riêng trong form forgot password
    await expect(page.locator('#RecoverEmail')).toBeVisible();
  });
 
  // =====================================================================
  // TC10 - Điều hướng tới trang Register (Đăng ký)

  test('TC10 - Click Register link', async ({ page }) => {
    const loginPage = new LoginPage(page);
 
    // Bước 1: Click link "สร้างบัญชีผู้ใช้" (Create Account)
    await loginPage.registerLink.click();
 
    // Bước 2: Chờ chuyển trang, kiểm tra URL mới
    await page.waitForURL(/.*account\/register/, { timeout: 5_000 });
 
    // Bước 3: Kiểm tra đang ở trang đăng ký
    await expect(page).toHaveURL(/.*account\/register/);
 
    // Bước 4: Kiểm tra có form đăng ký trên trang mới
    await expect(page.locator('#create_customer, form[action*="register"]')).toBeVisible();
  });
  
});