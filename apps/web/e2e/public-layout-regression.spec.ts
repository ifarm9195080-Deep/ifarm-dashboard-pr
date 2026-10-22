import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const viewports = [
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;

test('public Welcome Page keeps its layout at desktop, tablet, and mobile widths', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Bring smarter monitoring to your farm.' }),
  ).toBeVisible();
  await expect(page.getByText('Interested in iFarm?')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Client Sign In' })).toBeVisible();

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => {
      const main = document.querySelector<HTMLElement>('main.dashboard-welcome');
      const preview = document.querySelector<HTMLElement>('.dashboard-preview');
      const clientCard = document.querySelector<HTMLElement>('.dashboard-client-card');
      const interestCard = document.querySelector<HTMLElement>('.dashboard-interest__card');
      const formRow = document.querySelector<HTMLElement>(
        '.dashboard-interest__form .interest-form__row',
      );
      if (!main || !preview || !clientCard || !interestCard || !formRow) return null;
      const bounds = (element: HTMLElement) => {
        const { left, right, width } = element.getBoundingClientRect();
        return { left, right, width };
      };
      return {
        mainDisplay: getComputedStyle(main).display,
        main: bounds(main),
        preview: bounds(preview),
        clientCard: bounds(clientCard),
        interestCard: bounds(interestCard),
        formRow: bounds(formRow),
        viewportWidth: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
      };
    });

    expect(layout, `public layout at ${viewport.width}px`).not.toBeNull();
    expect(layout?.mainDisplay).toBe('block');
    expect(layout?.documentWidth).toBeLessThanOrEqual(viewport.width + 1);
    for (const section of [
      layout?.main,
      layout?.preview,
      layout?.clientCard,
      layout?.interestCard,
      layout?.formRow,
    ]) {
      expect(section?.left).toBeGreaterThanOrEqual(-1);
      expect(section?.right).toBeLessThanOrEqual(viewport.width + 1);
      expect(section?.width).toBeGreaterThan(0);
    }

    await page.screenshot({
      path: test.info().outputPath(`welcome-${viewport.width}.png`),
      fullPage: true,
    });
  }
});

test('Welcome Page, Back to iFarm, and successful sign-in preserve the expected navigation', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Client Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard\/login$/);
  await page.getByRole('link', { name: 'Back to iFarm' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByText('Interested in iFarm?')).toBeVisible();

  await page.getByRole('link', { name: 'Client Sign In' }).click();
  await page.getByLabel('Username').fill(`browser-test-${randomUUID()}`);
  await page.getByPlaceholder('Enter your password').fill(randomUUID());
  await page.getByLabel('Account ID').fill(`farm-${randomUUID()}`);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Welcome to your farm' })).toBeVisible();

  await page.getByRole('link', { name: 'Sensors' }).click();
  await expect(page).toHaveURL(/\/dashboard\/sensors$/);
  await expect(page.getByRole('heading', { name: 'Sensors', level: 2 })).toBeVisible();
  await page.getByRole('link', { name: 'Cameras' }).click();
  await expect(page).toHaveURL(/\/dashboard\/cameras$/);
  await expect(page.getByRole('heading', { name: 'Cameras', level: 2 })).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/dashboard\/login$/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await page.goto('/dashboard/reports');
  await expect(page).toHaveURL(/\/dashboard\/login$/);
});

test('development mock sessions end on browser reload without storing tokens', async ({ page }) => {
  await page.goto('/dashboard/login');
  await page.getByLabel('Username').fill(`browser-test-${randomUUID()}`);
  await page.getByPlaceholder('Enter your password').fill(randomUUID());
  await page.getByLabel('Account ID').fill(`farm-${randomUUID()}`);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Welcome to your farm' })).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/dashboard\/login$/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('note')).toContainText('session ends when you reload');
  expect(await page.evaluate(() => Object.keys(localStorage))).not.toContain('accessToken');
  expect(await page.evaluate(() => Object.keys(sessionStorage))).not.toContain('accessToken');
});
