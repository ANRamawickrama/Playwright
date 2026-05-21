# Playwright E-Commerce Test Framework

A production-grade test automation framework built with Playwright and TypeScript, covering login, cart, and checkout flows for the SauceDemo e-commerce platform.

---

## Prerequisites

Before running the tests, make sure you have the following installed:

- [Node.js](https://nodejs.org/) version 18 or higher
- npm version 9 or higher
- Git

Check your versions:
```bash
node -v
npm -v
```

---

## Project Structure

```
playwright-capstone/
├── .auth/                        # Saved login state (git-ignored)
├── .github/
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI pipeline
├── fixtures/
│   └── global-setup.ts           # Saves login session before tests run
├── pages/
│   ├── LoginPage.ts              # Login page actions and locators
│   ├── CartPage.ts               # Cart page actions and locators
│   └── CheckoutPage.ts           # Checkout page actions and locators
├── tests/
│   ├── login/
│   │   └── login.test.ts         # Login flow tests
│   ├── cart/
│   │   └── cart.test.ts          # Cart flow tests
│   └── checkout/
│       └── checkout.test.ts      # Checkout flow tests + visual snapshot
├── playwright.config.ts          # Playwright configuration
├── package.json
└── README.md
```

---

## Install

Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/playwright-capstone.git
cd playwright-capstone
npm ci
```

Install the Playwright browsers:

```bash
npx playwright install
```

---

## Running Tests

### Run all tests (all browsers)
```bash
npx playwright test
```

### Run on Chromium only
```bash
npx playwright test --project=chromium
```

### Run a specific test file
```bash
npx playwright test tests/cart/cart.test.ts --project=chromium
```

### Run in headed mode (watch the browser)
```bash
npx playwright test --headed --project=chromium
```

---

## Visual Regression Snapshots

The checkout and cart tests include visual regression checks using `toHaveScreenshot()`.

### Generate baselines for the first time
```bash
npx playwright test --update-snapshots --project=chromium
```

### Update snapshots after an intentional UI change
```bash
npx playwright test --update-snapshots
```

Snapshot files are saved inside the tests folder and must be committed to git:
```bash
git add tests/
git commit -m "update visual snapshots"
```

---

## View the HTML Report

After running tests, open the visual report in your browser:

```bash
npx playwright show-report
```

This shows pass/fail status, screenshots, error messages, and traces for every test.

---

## Debug Failing Tests

### Open Playwright UI mode (recommended)
```bash
npx playwright test --ui
```
This gives you a visual interface to run, filter, and step through tests one by one.

### Use the trace viewer
If a test fails in CI, download the `test-results` artifact from GitHub Actions and open it:
```bash
npx playwright show-trace test-results/path-to-trace.zip
```

### Run with verbose output
```bash
npx playwright test --project=chromium --reporter=list
```

---

## CI with GitHub Actions

Tests run automatically on every push to `main` or `master` and on every pull request.

The pipeline:
1. Installs Node.js and dependencies
2. Installs Playwright browsers
3. Runs the full test suite
4. Uploads the HTML report and traces as downloadable artifacts

### View CI results
1. Go to your GitHub repository
2. Click the **Actions** tab
3. Click the latest workflow run
4. Download **playwright-report** or **test-results** from the Artifacts section

---

## Test Credentials

The framework uses the following SauceDemo test accounts:

| Username | Password | Purpose |
|---|---|---|
| standard_user | secret_sauce | Main test account |
| locked_out_user | secret_sauce | Tests locked account error |

---

## Troubleshooting

**Tests timing out**
- Make sure `.auth/user.json` exists — run the tests once to trigger global setup
- Check your internet connection can reach `https://www.saucedemo.com`

**Screenshot tests failing**
- Run `npx playwright test --update-snapshots --project=chromium` to regenerate baselines
- Always generate baselines on the same OS as your CI runner (Linux)

**defineConfig is not defined**
- Make sure your config file is named `playwright.config.ts` not `playwright.config.js`
- Check the first line imports from `@playwright/test`

**browsers not found**
- Run `npx playwright install` to install the browsers

---

## Tech Stack

- [Playwright](https://playwright.dev/) — test automation framework
- TypeScript — type-safe test code
- GitHub Actions — CI/CD pipeline
- SauceDemo — target e-commerce application