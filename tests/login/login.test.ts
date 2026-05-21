import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

// Override storageState — login tests must test the actual login flow
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login flow', () => {

  test('valid credentials redirect to inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // Assert user lands on the inventory/products page
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('invalid credentials show error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('wrong_user', 'wrong_pass');

    // Assert error message is displayed
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Username and password do not match');
  });

  test('locked out user sees locked error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('locked out');
  });

  test('empty credentials show required error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', '');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

});