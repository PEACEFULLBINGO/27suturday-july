/**
 * E2E smoke test — written for Playwright, intentionally excluded from
 * `tsconfig`/`vitest` so CI doesn't need browser binaries just to type-check
 * or run unit tests.
 *
 * To run this locally:
 *   npm i -D @playwright/test
 *   npx playwright install --with-deps chromium
 *   npx playwright test tests/e2e
 *
 * @ts-nocheck
 */
import { test, expect } from '@playwright/test';

test('dashboard loads and the Perfect Day widget renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('StudyFlow Orbit')).toBeVisible();
  await expect(page.getByText('Perfect Day')).toBeVisible();
});

test('can add a timetable block and see it on the dashboard', async ({ page }) => {
  await page.goto('/#/timetable');
  await page.getByRole('button', { name: '+ Add block' }).click();
  await page.getByPlaceholder('e.g. Science revision').fill('Algebra practice');
  await page.getByRole('button', { name: 'Save block' }).click();
  await expect(page.getByText('Algebra practice')).toBeVisible();

  await page.goto('/');
  await expect(page.getByText('Algebra practice')).toBeVisible();
});
