import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const origin = process.env.TEST_ORIGIN || "http://localhost:5173";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL
    ? { channel: process.env.PLAYWRIGHT_CHANNEL }
    : {}),
});
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (e) => errors.push(e.message));
const base = [
  "home",
  "about",
  "services",
  "training",
  "courses",
  "course",
  "checkout",
  "learn",
  "blog",
  "resources",
  "events",
  "register",
  "media",
  "contact",
  "event/family-dialogue",
  "resource/reflection",
  "resource/family-listening",
  "article/emotions",
  "article/parenting",
  "article/boundaries",
];
const programs = ["individual", "family", "youth", "professional", "group"].map(
  (x) => "program/" + x,
);
const topics = [
  "confiance",
  "emotions",
  "dialogue-interieur",
  "ecoute",
  "conflits",
  "limites",
  "leadership",
  "parole",
  "equipe",
  "mariage",
  "dialogue-couple",
  "respect",
  "parentalite",
  "education",
  "autonomie",
  "orientation",
  "confiance-jeunes",
  "transition",
].map((x) => "topic/" + x);
const routes = [
  ...base,
  ...programs,
  ...topics,
  ...Array.from({ length: 6 }, (_, i) => "service/" + i),
];
const goto = async (route, lang = "fr") => {
  await page.goto(`${origin}/${lang}/${route}`);
  await page.locator("main h1").waitFor();
};
try {
  await mkdir(".qa", { recursive: true });
  for (const size of [
    { width: 1440, height: 1000 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    for (const lang of ["fr", "ar"])
      for (const route of routes) {
        await goto(route, lang);
        assert.equal(
          await page.evaluate(() => document.documentElement.dir),
          lang === "ar" ? "rtl" : "ltr",
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `overflow ${size.width} ${lang}/${route}`,
        );
        assert.equal(
          await page.locator("main h1").count(),
          1,
          `missing page ${route}`,
        );
        assert.ok(
          !(await page.locator("main h1").innerText()).includes("introuvable"),
        );
      }
    console.log(
      `PASS ${routes.length * 2} bilingual routes at ${size.width}px`,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await goto("home");
  await page.screenshot({ path: ".qa/desktop.png" });
  await page.locator("#communication-tree").scrollIntoViewIfNeeded();
  await page.locator(".branch-controls button").nth(4).click();
  assert.equal(await page.locator(".fruit").count(), 3);
  assert.ok(
    (await page.locator(".fruit").first().getAttribute("href")).includes(
      "parentalite",
    ),
  );
  await page.locator(".language").click();
  assert.equal(new URL(page.url()).searchParams.get("branch"), "4");
  assert.ok(page.url().includes("/ar/home"));
  assert.equal(
    await page.locator(".branch-controls [aria-pressed=true]").count(),
    1,
  );
  await page.locator(".fruit").first().click();
  assert.ok(page.url().includes("/ar/topic/parentalite"));
  await goto("home");
  await page.locator("#communication-tree").scrollIntoViewIfNeeded();
  await page.screenshot({ path: ".qa/tree.png" });
  await page.locator(".petal").nth(2).click();
  assert.ok(
    (await page.locator(".dimension-panel").innerText()).includes("sens"),
  );
  await page.locator(".language").click();
  assert.equal(new URL(page.url()).searchParams.get("dimension"), "2");
  await goto("program/professional");
  await page.locator(".day-leaves button").nth(1).click();
  assert.ok(
    (await page.locator(".day-description").innerText()).includes("Pratiquer"),
  );
  await goto("program/individual");
  await page.locator(".journey-tabs button").nth(2).click();
  assert.ok(
    (await page.locator(".journey-detail").innerText()).includes(
      "quatre dimensions",
    ),
  );
  await goto("training");
  await page.locator(".filters button").nth(3).click();
  assert.equal(await page.locator(".training-card").count(), 3);
  await goto("blog");
  await page.locator("input[type=search]").fill("émotions");
  assert.equal(await page.locator(".editorial-card").count(), 1);
  await page.locator("input[type=search]").fill("zzzz");
  await page.locator("[role=status]").waitFor();
  await page.locator("input[type=search]").fill("");
  await page.locator(".library-controls select").selectOption("4");
  assert.equal(await page.locator(".editorial-card").count(), 1);
  await goto("resources");
  await page.locator("input[type=search]").fill("famille");
  assert.equal(await page.locator(".editorial-card").count(), 1);
  await goto("resource/reflection");
  assert.equal(await page.locator("a[download]").count(), 0);
  assert.ok(
    (await page.locator("main").innerText()).includes("pas encore de fichier"),
  );
  await goto("courses");
  await page.locator(".library-controls select").first().selectOption("fr");
  await page.locator("[role=status]").waitFor();
  await page.locator(".library-controls select").first().selectOption("ar");
  await page.locator(".catalog-course .button").click();
  await page.locator('a[href="/fr/checkout"]').click();
  await page.locator("form button").click();
  assert.equal(await page.locator("[role=status]").count(), 0);
  await page.locator("input[autocomplete=name]").fill("Test");
  await page.locator("input[type=email]").fill("test@example.com");
  await page.locator("input[type=checkbox]").check();
  await page.locator("form button").click();
  await page.locator("[role=status]").waitFor();
  await page.locator('a[href="/fr/learn"]').first().click();
  await page.locator(".text-button").click();
  await page.locator(".learner .button").click();
  await page.reload();
  assert.ok(
    (await page.locator(".learner aside").innerText()).includes("1 / 4"),
  );
  await page.locator(".learner .button").click();
  assert.ok(
    (await page.locator(".learner aside").innerText()).includes("1 / 4"),
  );
  await page.locator(".text-button").click();
  for (const route of ["register", "contact"]) {
    await goto(route);
    await page.locator("form button").click();
    assert.equal(await page.locator("form [role=status]").count(), 0);
    await page.locator("input[autocomplete=name]").fill("Test");
    await page.locator("input[type=email]").fill("test@example.com");
    await page.locator("input[type=checkbox]").check();
    await page.locator("form button").click();
    await page.locator("form [role=status]").waitFor();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await goto("home");
  await page.locator(".menu-toggle").click();
  assert.ok(await page.locator("nav").isVisible());
  await page.locator('nav a[href="/fr/events"]').click();
  assert.ok(page.url().endsWith("/fr/events"));
  await goto("home", "ar");
  await page.screenshot({ path: ".qa/mobile-arabic.png" });
  await page.locator("#communication-tree").scrollIntoViewIfNeeded();
  await page.screenshot({ path: ".qa/mobile-tree.png" });
  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const fallback = await reduced.newPage();
  await fallback.route("**/botanical-tree.png", (route) => route.abort());
  await fallback.goto(origin + "/fr/home");
  await fallback.locator("#communication-tree").scrollIntoViewIfNeeded();
  await fallback.locator(".branch-controls button").nth(2).click();
  assert.equal(await fallback.locator(".tree-webgl canvas").count(), 0);
  assert.ok(await fallback.locator(".tree-fallback").isVisible());
  await fallback.locator(".fruit").first().click();
  assert.ok(fallback.url().includes("/topic/leadership"));
  await reduced.close();
  const noGL = await browser.newContext();
  await noGL.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === "webgl2" || type === "webgl") return null;
      return original.call(this, type, ...args);
    };
  });
  const noGLPage = await noGL.newPage();
  await noGLPage.goto(origin + "/fr/home");
  await noGLPage.locator("#communication-tree").scrollIntoViewIfNeeded();
  assert.equal(await noGLPage.locator(".tree-webgl canvas").count(), 0);
  await noGLPage.locator(".fruit").first().click();
  assert.ok(noGLPage.url().includes("/topic/confiance"));
  await noGL.close();
  await goto("home");
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").getAttribute("href"), "#main");
  assert.deepEqual(errors, []);
  console.log(
    "PASS tree navigation, dimensions, language state, programs, filters/search, unavailable downloads, checkout, forms, persistent progress, mobile navigation, reduced-motion/artwork failure, WebGL fallback, keyboard skip link; no page errors.",
  );
} finally {
  await browser.close();
}
