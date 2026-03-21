import { test, expect } from '@playwright/test';

test.describe('1. Login Functionality', () => {
  test('1.1 Successful Login with Valid Credentials', async ({ page }) => {
    // Enter homepage
    await page.goto("/");
    // Tìm kiếm theo địa chỉ đã cho để tới được button Login
    const loginButton = page.locator('a.header__icon:nth-child(2)');
    // Click tự động vào button Login 
    await loginButton.click();

    // Chờ một url có format là /account/login xuất hiện trên thanh địa chỉ
    await page.waitForURL('**/account/login');

    // Kiểm tra heading của page
    const heading = page.locator("#login");
    await expect(heading).toHaveText("การเข้าสู่ระบบ ");
    // Todos: Tương tác với các ô input, nhập username, password
    const emailInput = page.locator('#CustomerEmail');
    await emailInput.fill('asdfasdfasdfa');

    await page.pause();
  });
});