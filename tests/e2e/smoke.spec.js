import { expect, test } from "@playwright/test";

test("docs home and introduction load", async ({ page }) => {
  const homeResponse = await page.goto("/");
  expect(homeResponse?.ok()).toBeTruthy();
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("a[href]").first()).toBeVisible();

  const introResponse = await page.goto("/introduction");
  expect(introResponse?.ok()).toBeTruthy();
  await expect(page.locator("main")).toBeVisible();
});
