import { test, expect } from '@playwright/test';

// Navigate to Login page
test.describe('TC00 - Navigation', () => {
  test('TC00 - Navigate to Login Page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*account\/login/);
  });
});