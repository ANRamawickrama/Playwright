import { Page, Locator } from '@playwright/test';

export class CartPage {
  private page: Page;
  readonly cartBadge: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartItems = page.locator('.cart_item');
  }

  async addFirstProduct() {
    await this.page.locator('.inventory_item').first().locator('button').click();
  }

  async addProductByName(name: string) {
    await this.page.locator('.inventory_item', { hasText: name }).locator('button').click();
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async getCartCount() {
    return this.cartBadge.innerText();
  }
}