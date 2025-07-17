const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Yassine Riahi/);
});

test('has LinkedIn link in the body', async ({ page }) => {
  await page.goto('/');

  const isVisible = await page.locator('a:has-text("Connect with me on LinkedIn")').isVisible();
  expect(isVisible).toBeTruthy();
});

test('has expected app version', async ({ page }) => {
  await page.goto('/');

  const expectedAppVersion = process.env.REACT_APP_VERSION ? process.env.REACT_APP_VERSION : '1';

  const isVisible = await page.locator(`footer p:has-text("Application version: ${expectedAppVersion}")`).isVisible();
  expect(isVisible).toBeTruthy();
});