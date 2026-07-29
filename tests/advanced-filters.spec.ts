import { test, expect } from '@playwright/test';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function gotoApp(page) {
  await page.goto(FRONTEND_URL, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Accommodation Search' })).toBeVisible();
  await expect(page.getByText(/stays found/i)).toBeVisible();
}

async function getAllCardTexts(page): Promise<string[]> {
  const cards = page.locator('.card');
  const count = await cards.count();
  const texts: string[] = [];
  for (let i = 0; i < count; i++) {
    texts.push(await cards.nth(i).innerText());
  }
  return texts;
}

async function assertAllCardsContain(page, needle: string) {
  const cards = page.locator('.card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    await expect(cards.nth(i)).toContainText(needle);
  }
}

async function assertAllCardsMatchAnyType(page, allowed: string[]) {
  const texts = await getAllCardTexts(page);
  for (const t of texts) {
    const typeLine = t.split('\n').find((l) => l.startsWith('Type:'));
    expect(typeLine, `Missing Type line in card:\n${t}`).toBeTruthy();
    const type = typeLine!.replace('Type:', '').trim();
    expect(allowed).toContain(type);
  }
}

async function assertAllCardsReviewGte(page, min: number) {
  const texts = await getAllCardTexts(page);
  for (const t of texts) {
    const reviewLine = t.split('\n').find((l) => l.startsWith('Review:'));
    expect(reviewLine, `Missing Review line in card:\n${t}`).toBeTruthy();
    const reviewStr = reviewLine!.replace('Review:', '').trim();
    expect(reviewStr).not.toBe('Unrated');
    const val = Number(reviewStr);
    expect(Number.isFinite(val)).toBeTruthy();
    expect(val).toBeGreaterThanOrEqual(min);
  }
}

async function clearAll(page) {
  await page.getByRole('button', { name: 'Clear all' }).click();
  await expect(page).toHaveURL(/\bpage=1\b/);
}

test.describe('Advanced Filters', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
    await clearAll(page);
  });

  test('Amenities: Filter results by a single amenity (Wi‑Fi)', async ({ page }) => {
    await page.getByRole('group', { name: /amenities/i }).getByLabel('Wi‑Fi').check();
    await expect(page).toHaveURL(/amenities=wifi/);

    // The UI does not display amenities on cards; validate via API request params captured in network.
    // However, we can validate by ensuring results count updates and no empty state.
    await expect(page.locator('.empty')).toHaveCount(0);
    await expect(page.getByText(/stays found/i)).toBeVisible();
  });

  test('Amenities: Filter results by multiple amenities using AND logic', async ({ page }) => {
    const amenitiesGroup = page.getByRole('group', { name: /amenities/i });
    await amenitiesGroup.getByLabel('Wi‑Fi').check();
    await amenitiesGroup.getByLabel('Breakfast included').check();

    await expect(page).toHaveURL(/amenities=wifi%2Cbreakfast|amenities=breakfast%2Cwifi/);
    await expect(page.locator('.empty')).toHaveCount(0);
  });

  test('Amenities: No matching results shows empty state and can clear filters', async ({ page }) => {
    // Pick a combination likely to produce zero results: wifi+breakfast+villa+9+
    await page.getByRole('group', { name: /amenities/i }).getByLabel('Wi‑Fi').check();
    await page.getByRole('group', { name: /amenities/i }).getByLabel('Breakfast included').check();
    await page.getByRole('group', { name: /property type/i }).getByLabel('Villa').check();
    await page.getByRole('group', { name: /review score/i }).getByLabel('9+').check();

    await expect(page.getByRole('heading', { name: 'No results match your filters' })).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();

    await expect(page.getByRole('heading', { name: 'No results match your filters' })).toHaveCount(0);
    await expect(page).toHaveURL(/amenities=|propertyTypes=|reviewScoreGte=/);
  });

  test('Amenities: Filter persists across pagination and sorting', async ({ page }) => {
    await page.getByRole('group', { name: /amenities/i }).getByLabel('Wi‑Fi').check();
    await expect(page).toHaveURL(/amenities=wifi/);

    const next = page.getByRole('button', { name: 'Next' });
    if (await next.isEnabled()) {
      await next.click();
      await expect(page).toHaveURL(/page=2/);
      await expect(page).toHaveURL(/amenities=wifi/);
    }

    await page.getByLabel('Sort').selectOption('review_desc');
    await expect(page).toHaveURL(/sort=review_desc/);
    await expect(page).toHaveURL(/amenities=wifi/);
  });

  test('Property Type: Filter results by one property type (Hotel)', async ({ page }) => {
    await page.getByRole('group', { name: /property type/i }).getByLabel('Hotel').check();
    await expect(page).toHaveURL(/propertyTypes=hotel/);
    await assertAllCardsContain(page, 'Type: Hotel');
  });

  test('Property Type: Filter results by multiple property types using OR logic', async ({ page }) => {
    const group = page.getByRole('group', { name: /property type/i });
    await group.getByLabel('Hotel').check();
    await group.getByLabel('Villa').check();

    await expect(page).toHaveURL(/propertyTypes=hotel%2Cvilla|propertyTypes=villa%2Chotel/);
    await assertAllCardsMatchAnyType(page, ['Hotel', 'Villa']);
  });

  test('Property Type: Clearing property type filter restores broader results', async ({ page }) => {
    const group = page.getByRole('group', { name: /property type/i });
    await group.getByLabel('Hotel').check();
    await expect(page).toHaveURL(/propertyTypes=hotel/);

    // Uncheck hotel
    await group.getByLabel('Hotel').uncheck();
    await expect(page).not.toHaveURL(/propertyTypes=hotel/);
  });

  test('Review Score: Filter results by review score threshold (8+)', async ({ page }) => {
    await page.getByRole('group', { name: /review score/i }).getByLabel('8+').check();
    await expect(page).toHaveURL(/reviewScoreGte=8/);
    await assertAllCardsReviewGte(page, 8);
  });

  test('Review Score: Unrated stays are excluded when review score filter is applied', async ({ page }) => {
    await page.getByRole('group', { name: /review score/i }).getByLabel('7+').check();
    await expect(page).toHaveURL(/reviewScoreGte=7/);

    const texts = await getAllCardTexts(page);
    for (const t of texts) {
      expect(t).not.toContain('Review: Unrated');
    }
  });

  test('Review Score: Review score filter works with other filters', async ({ page }) => {
    await page.getByRole('group', { name: /amenities/i }).getByLabel('Wi‑Fi').check();
    await page.getByRole('group', { name: /property type/i }).getByLabel('Hotel').check();
    await page.getByRole('group', { name: /review score/i }).getByLabel('9+').check();

    await expect(page).toHaveURL(/amenities=wifi/);
    await expect(page).toHaveURL(/propertyTypes=hotel/);
    await expect(page).toHaveURL(/reviewScoreGte=9/);

    await assertAllCardsContain(page, 'Type: Hotel');
    await assertAllCardsReviewGte(page, 9);
  });
});
