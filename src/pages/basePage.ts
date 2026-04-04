import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- NHÓM HÀM ĐIỀU HƯỚNG ---

  /**
   * Đi tới một URL cụ thể
   */
  async navigate(url?: string) {
    await this.page.goto(url ? url : "/", { waitUntil: "domcontentloaded" });
  }

  // --- NHÓM HÀM TƯƠNG TÁC ---

  /**
   * Đợi phần tử hiển thị rồi mới Click
   */
  async waitAndClick(selector: string | Locator) {
    const element =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await element.waitFor({ state: "visible" });
    await element.click();
  }

  /**
   * Đợi phần tử và điền text (Fill)
   */
  async waitAndFill(selector: string | Locator, text: string) {
    const element =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await element.waitFor({ state: "visible" });
    await element.fill(text);
  }

  /**
   * Lấy text nội dung của một phần tử
   */
  async getElementText(selector: string | Locator): Promise<string> {
    const element =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    return (await element.innerText()).trim();
  }

  // --- NHÓM HÀM CHỜ ĐỢI & VALIDATION ---

  /**
   * Chờ cho đến khi URL khớp với một Pattern (Regex)
   */
  async waitForUrlMatch(pattern: RegExp) {
    await this.page.waitForURL(pattern);
  }

  /**
   * Chờ một network response cụ thể (Hữu ích khi test API đi kèm UI)
   */
  async waitForResponse({
    urlPart,
    statusCode = 200,
    method = "GET",
  }: {
    urlPart: string;
    statusCode?: number;
    method?: string;
  }) {
    const responsePromise = this.page.waitForResponse((response) => {
      const hasMatchUrl = response.url() === urlPart;
      const hasMatchMethod = response.request().method() === method;
      const hasMatchStatus = response.status() === statusCode;
      return hasMatchUrl && hasMatchMethod && hasMatchStatus;
    });
    return responsePromise;
  }

  /**
   * Kiểm tra nhanh xem element có hiển thị không (trả về boolean)
   */
  async isElementVisible(
    selector: string,
    timeout: number = 5000,
  ): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: "visible", timeout });
      return true;
    } catch {
      return false;
    }
  }
}
