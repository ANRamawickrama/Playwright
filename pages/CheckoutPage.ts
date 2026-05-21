import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  private page: Page;
  readonly successHeader: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successHeader = page.locator('.complete-header');
    this.successMessage = page.locator('.complete-text');
  }

  async proceedToCheckout() {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }

  async fillShippingInfo(firstName: string, lastName: string, zip: string) {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.page.getByPlaceholder('Zip/Postal Code').fill(zip);
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async confirmOrder() {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }

  async getSuccessHeaderText() {
    return this.successHeader.innerText();
  }
}