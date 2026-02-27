import { expect, test } from "@playwright/test";

test("introduction page is reachable", async ({ page }) => {
  await page.goto("/introduction/vision-attn");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
