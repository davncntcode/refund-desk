import { expect, test, type Page } from "@playwright/test";

const CUSTOMER = "Priya Raghavan";
const EMAIL = "priya.raghavan@example.com";
const AMOUNT = "249.50";
const REASON = "Charged twice for the same order, only one confirmation email arrived.";

test.describe.configure({ mode: "serial" });

// the toast repeats the timeline wording, so scope history assertions to the page
const history = (page: Page) => page.getByRole("main");

async function logRequest(page: Page, name: string, email: string, amount: string) {
  await page.getByRole("button", { name: /new request/i }).click();

  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Customer name").fill(name);
  await dialog.getByLabel("Customer email").fill(email);
  await dialog.getByLabel("Refund amount").fill(amount);
  await dialog.getByLabel("What happened").fill(REASON);
  await dialog.getByRole("button", { name: /log request/i }).click();
  await expect(dialog).toBeHidden();
}

async function confirmStep(page: Page, action: string, note?: string) {
  await page.getByRole("button", { name: action, exact: true }).click();
  const dialog = page.getByRole("dialog");
  if (note !== undefined) await dialog.getByLabel(/note/i).fill(note);
  await dialog.getByRole("button", { name: "Confirm" }).click();
}

test("logs a refund, finds it by filter and search, then walks it to refunded", async ({ page }) => {
  await page.goto("/refunds");
  await expect(page.getByText("No refund requests yet")).toBeVisible();

  await page.getByRole("button", { name: /new request/i }).click();

  // an empty form never reaches the server
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: /log request/i }).click();
  await expect(dialog.getByText(/enter the customer's name/i)).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel" }).click();

  await logRequest(page, CUSTOMER, EMAIL, AMOUNT);
  await expect(page.getByText(/RF-\d{4}-0001 logged/)).toBeVisible();

  const row = page.getByRole("row").filter({ hasText: CUSTOMER });
  await expect(row).toContainText("$249.50");
  await expect(row).toContainText("Pending");
  await expect(row).toContainText("Duplicate charge");

  await expect(page.getByRole("tab", { name: /^Pending/ })).toContainText("1");
  await page.getByRole("tab", { name: /^Pending/ }).click();
  await expect(page).toHaveURL(/status=pending/);
  await expect(page.getByRole("row").filter({ hasText: CUSTOMER })).toBeVisible();

  await page.getByRole("tab", { name: /^Refunded/ }).click();
  await expect(page.getByText("No requests match this view")).toBeVisible();

  await page.getByRole("searchbox").fill("priya.raghavan");
  await page.getByRole("searchbox").press("Enter");
  await expect(page.getByRole("row").filter({ hasText: CUSTOMER })).toBeVisible();

  await page.getByRole("link", { name: /RF-\d{4}-0001/ }).first().click();
  await expect(history(page).getByText("Request logged")).toBeVisible();

  // pending may only start a review or be rejected
  await expect(page.getByRole("button", { name: "Approve" })).toBeHidden();
  await confirmStep(page, "Start review");
  await expect(history(page).getByText("Moved to in review")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start review" })).toBeHidden();

  await confirmStep(page, "Approve", "Duplicate confirmed in the payment log.");
  await expect(history(page).getByText("Moved to approved")).toBeVisible();
  await expect(history(page).getByText("Duplicate confirmed in the payment log.")).toBeVisible();

  await confirmStep(page, "Mark refunded");
  await expect(history(page).getByText("Moved to refunded")).toBeVisible();
  await expect(page.getByText(/refunded is final/i)).toBeVisible();
});

test("refuses to reject without a reason", async ({ page }) => {
  await page.goto("/refunds");
  await logRequest(page, "Omar Farouk", "omar.farouk@example.com", "80.00");

  await page.getByRole("link", { name: /RF-\d{4}-0002/ }).first().click();

  await page.getByRole("button", { name: "Reject", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Confirm" }).click();
  await expect(dialog.getByText(/say why it was rejected/i)).toBeVisible();

  await dialog.getByLabel(/note/i).fill("Outside the 30 day refund window.");
  await dialog.getByRole("button", { name: "Confirm" }).click();

  await expect(history(page).getByText("Moved to rejected")).toBeVisible();
  await expect(history(page).getByText("Outside the 30 day refund window.")).toBeVisible();
  await expect(page.getByText(/rejected is final/i)).toBeVisible();
});

test("exports the filtered queue as csv", async ({ request }) => {
  const all = await request.get("/api/refunds/export");
  expect(all.status()).toBe(200);
  expect(all.headers()["content-disposition"]).toContain("refund-requests");

  const body = await all.text();
  expect(body).toContain("Reference,Customer name,Customer email,Amount");
  expect(body).toContain(EMAIL);
  expect(body).toContain("249.50");

  const rejected = await request.get("/api/refunds/export?status=rejected");
  const rejectedBody = await rejected.text();
  expect(rejected.headers()["content-disposition"]).toContain("refund-requests-rejected");
  expect(rejectedBody).toContain("omar.farouk@example.com");
  expect(rejectedBody).not.toContain(EMAIL);
});
