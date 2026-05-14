import { expect, test } from "@playwright/test";

test("homepage renders and shows docs title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/attn/i);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
