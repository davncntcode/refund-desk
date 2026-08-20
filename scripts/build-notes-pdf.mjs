import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const source = resolve("docs/notes.html");
const out = resolve("public/refund-desk-notes.pdf");

mkdirSync(resolve("public"), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(pathToFileURL(source).href, { waitUntil: "networkidle" });
// webfonts must be in before the pdf is laid out
await page.evaluate(() => document.fonts.ready);

const sections = await page.locator(".page").count();

// nothing may overflow its page, or the layout silently clips
const overflowing = await page.evaluate(() =>
  Array.from(document.querySelectorAll(".page"))
    .map((el, i) => ({ page: i + 1, over: el.scrollHeight - el.clientHeight }))
    .filter((p) => p.over > 1),
);

if (overflowing.length) {
  throw new Error(
    `content overflows its page: ${overflowing.map((p) => `page ${p.page} by ${p.over}px`).join(", ")}`,
  );
}

await page.pdf({
  path: out,
  format: "A4",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});

await browser.close();

// a stray blank page is easy to introduce and easy to miss
const pdf = readFileSync(out, "latin1");
const pages = [...pdf.matchAll(/\/Type\s*\/Page\b(?!s)/g)].length;

if (pages !== sections) {
  throw new Error(`expected ${sections} pages, the pdf has ${pages}`);
}

console.log(`wrote ${out} — ${pages} pages`);
