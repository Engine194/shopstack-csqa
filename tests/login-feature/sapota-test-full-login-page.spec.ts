import test, { expect } from "@playwright/test";
import { LoginPage } from "../pages/loginpage";
import { ENV } from "../../config_env";

test.describe('1. Login Functionality', () => {

  let loginPage: LoginPage;

  // ── beforeEach: giữ nguyên logic ──────────────────
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // ===========================================================================
  // TC01 - UI Overview
  
  test('TC01 - UI Overview', async ({ page }) => {
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
    await loginPage.login(ENV.USER_UID!, ENV.USER_PWD!);
    await expect(page).toHaveURL(/.*\/account/);
  });
 
  // =========================================================================
  // TC03 - Login thất bại: email không tồn tại trong hệ thống
  // (giữ nguyên comment theo bạn)

  /*
  test('TC03 - Email does not exist', async ({ page }) => {
    await loginPage.login(process.env.INVALID_EMAIL!, process.env.USER_PWD!);
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    await expect(page).toHaveURL(/.*account\/login/);
  });
  */
 
  // =========================================================================
  // TC04 - Login thất bại: sai mật khẩu

  test('TC04 - Login failed with invalid password', async ({ page }) => {
    await loginPage.login(process.env.USER_UID!, process.env.INVALID_PWD!);
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    await expect(page).toHaveURL(/.*account\/login/);
  });
 
  // ========================================================================
  // TC05 - Login thất bại: để trống cả email và password

  test('TC05 - Login failed with empty email and password', async ({ page }) => {
    await loginPage.clickSignIn();
    await expect(page).toHaveURL(/.*account\/login/);
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  });
 
  // =====================================================================
  // TC06 - Login thất bại: bỏ trống email, có password

  test('TC06 - Login failed when email is empty', async ({ page }) => {
    await loginPage.fillPassword(process.env.USER_PWD!);
    await loginPage.clickSignIn();
    await expect(page).toHaveURL(/.*account\/login/);
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  });
 
  // ====================================================================
  // TC07 - Login thất bại: bỏ trống password, có email

  test('TC07 - Login failed when password is empty', async ({ page }) => {
    await loginPage.fillEmail(process.env.USER_UID!);
    await loginPage.clickSignIn();
    await expect(page).toHaveURL(/.*account\/login/);
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  });
 
  // ==================================================================
  // TC08 - Login thất bại: email sai định dạng

  test('TC08 - Login failed when email has invalid format', async ({ page }) => {
    await loginPage.fillEmail('notanemail');
    await loginPage.fillPassword(process.env.USER_PWD!);
    await loginPage.clickSignIn();
    await expect(page).toHaveURL(/.*account\/login/);
    await loginPage.verifyErrorVisible('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  });
 
  // ======================================================================
  // TC09 - Điều hướng tới trang Forgot Password

  test('TC09 - Click Forgot Password link', async ({ page }) => {
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/.*#recover/);
    await expect(page.locator('#RecoverEmail')).toBeVisible();
  });
 
  // =====================================================================
  // TC10 - Điều hướng tới trang Register (Đăng ký)

  test('TC10 - Click Register link', async ({ page }) => {
    await loginPage.registerLink.click();
    await page.waitForURL(/.*account\/register/, { timeout: 5000 });
    await expect(page).toHaveURL(/.*account\/register/);
    await expect(page.locator('#create_customer, form[action*="register"]')).toBeVisible();
  });
  
});