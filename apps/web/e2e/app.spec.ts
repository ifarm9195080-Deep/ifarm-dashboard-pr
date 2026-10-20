import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

test('sign-in validates and completes the mocked login flow', async ({ page }) => {
  await page.goto('/dashboard/login');
  await expect(page.locator('.app-shell')).toBeVisible();
  await page.getByLabel('Username').fill('client');
  await page.getByPlaceholder('Enter your password').fill('sample-password');
  await page.getByLabel('Account ID').fill('external-id');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /Your Farm/ })).toBeVisible();
});

test('language switch updates the document direction', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.app-shell')).toBeVisible();
  await page.getByRole('button', { name: 'العربية' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
});

test('unknown routes render the translated not-found page', async ({ page }) => {
  await page.goto('/route-that-does-not-exist');
  await expect(page.locator('.app-shell')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('keyboard navigation exposes a visible focus ring', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.app-shell')).toBeVisible();
  await page.keyboard.press('Tab');
  const active = page.locator(':focus');
  await expect(active).toBeVisible();
  await expect(active).toHaveCSS('outline-width', '2px');
});

test('all primary routes have no serious or critical axe violations', async ({ page }) => {
  for (const route of ['/', '/dashboard', '/dashboard/login', '/unknown-route']) {
    await page.goto(route);
    await expect(page.locator('.app-shell')).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    const severe = results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    );
    expect(severe, `axe violations on ${route}`).toEqual([]);
  }
});

const baselineRoutes = [
  { route: '/', name: 'home' },
  { route: '/dashboard', name: 'dashboard' },
  { route: '/dashboard/login', name: 'dashboard-login' },
];

for (const { route, name } of baselineRoutes) {
  for (const locale of ['en', 'ar']) {
    for (const width of [375, 1440]) {
      test(`baseline pixel diff ${name} ${locale} ${width}px`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript((value) => localStorage.setItem('ifarm-locale', value), locale);
        await page.goto(route);
        await expect(page.locator('.app-shell')).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() =>
          Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {}))),
        );
        const current = PNG.sync.read(await page.screenshot({ fullPage: true }));
        const baselinePath = path.join(
          testInfo.project.testDir,
          '__baseline__',
          `${name}-${locale}-${width}.png`,
        );
        const baseline = PNG.sync.read(await readFile(baselinePath));
        expect(current.width).toBe(baseline.width);
        const comparisonHeight = Math.min(current.height, baseline.height);
        const comparisonLength = current.width * comparisonHeight * 4;
        const differentPixels = pixelmatch(
          baseline.data.subarray(0, comparisonLength),
          current.data.subarray(0, comparisonLength),
          null,
          current.width,
          comparisonHeight,
          { threshold: 0.15 },
        );
        const difference = differentPixels / (current.width * comparisonHeight);
        testInfo.annotations.push({
          type: 'visual-diff',
          description: `${(difference * 100).toFixed(3)}% different pixels; height delta ${current.height - baseline.height}px`,
        });
        expect(difference).toBeLessThan(0.02);
      });
    }
  }
}
