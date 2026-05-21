import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

// storageState from playwright.config.ts is used — already logged in
test.describe('Checkout flow', () => {

  test.beforeEach(async ({ page }) => {
    // Add a product and go to cart before each checkout test
    await page.goto('/inventory.html');
    const cart = new CartPage(page);
    await cart.addFirstProduct();
    await cart.openCart();
  });

  test('complete checkout shows order confirmation', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    // Step 1: go to checkout
    await checkout.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one/);

    // Step 2: fill shipping info
    await checkout.fillShippingInfo('Jane', 'Doe', '12345');
    await expect(page).toHaveURL(/checkout-step-two/);

    // Step 3: review order summary then finish
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await checkout.confirmOrder();

    // Assert success
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkout.successHeader).toHaveText('Thank you for your order!');
    await expect(checkout.successMessage).toBeVisible();
  });

  test('order confirmation page visual snapshot matches baseline', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.proceedToCheckout();
    await checkout.fillShippingInfo('Jane', 'Doe', '12345');
    await checkout.confirmOrder();

    // Visual regression check — catches layout shifts, missing elements
    await expect(page.locator('.checkout_complete_container'))
      .toHaveScreenshot('order-success.png');
  });

  test('missing first name shows error on checkout form', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.proceedToCheckout();

    // Submit with empty first name
    await checkout.fillShippingInfo('', 'Doe', '12345');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('cancel checkout returns to cart', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.proceedToCheckout();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL(/cart/);
  });

});