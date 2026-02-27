import { expect, test } from "@playwright/test";

test("tokenomics overview page loads", async ({ page }) => {
  await page.goto("/tokenomics/tokenomics-overview");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
