import { expect, test } from "@playwright/test";

test("users can navigate to mechanics overview from home", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Mechanics/i }).first().click();
  await expect(page).toHaveURL(/\/mechanics\/architecture-overview/);
});
