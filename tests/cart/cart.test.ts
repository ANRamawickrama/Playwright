import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';

// storageState from playwright.config.ts is used — already logged in
test.describe('Cart flow', () => {

  test.beforeEach(async ({ page }) => {
    // Start on the inventory page before each cart test
    await page.goto('/inventory.html');
  });

  test('adding first product updates cart badge to 1', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.addFirstProduct();

    // Badge should show 1 item
    await expect(cart.cartBadge).toHaveText('1');
  });

  test('adding two products updates cart badge to 2', async ({ page }) => {
    const cart = new CartPage(page);

    // Add two products
    const buttons = page.locator('.inventory_item button');
    await buttons.nth(0).click();
    await buttons.nth(1).click();

    await expect(cart.cartBadge).toHaveText('2');
  });

  test('cart page shows added item', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.addFirstProduct();
    await cart.openCart();

    // Assert we are on cart page and item is listed
    await expect(page).toHaveURL(/cart/);
    await expect(cart.cartItems).toHaveCount(1);
  });

  test('removing item from cart clears badge', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.addFirstProduct();
    await expect(cart.cartBadge).toHaveText('1');

    // Remove it
    await page.locator('.inventory_item button').first().click();

    await expect(cart.cartBadge).not.toBeVisible();
  });

  test('cart summary screenshot matches baseline', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.addFirstProduct();
    await cart.openCart();

    // Visual regression check on cart summary
    await expect(page.locator('.cart_list')).toHaveScreenshot('cart-summary.png');
  });

});