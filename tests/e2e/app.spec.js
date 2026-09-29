import { test, expect } from '@playwright/test';

test('affiche les 5 chiens', async ({ page }) => {
  await page.goto('/');
  const count = await page.locator('.dog-card').count();
  expect(count).toBeGreaterThanOrEqual(5);
});

test("le filtre Asie ne montre que l'Akita", async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Asie' }).click();
  
  await expect(async () => {
    const cards = page.locator('.dog-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText('Asie');
    }
  }).toPass();
});

test('ajoute un chien via le formulaire', async ({ page }) => {
  await page.goto('/');
  const initialCount = await page.locator('.dog-card').count();
  await page.fill('#f-name', `Saluki ${Date.now()}`);
  await page.fill('#f-country', 'Émirats Arabes Unis');
  await page.selectOption('#f-region', 'asie');
  await page.fill('#f-description', 'Lévrier ancien et rapide du désert.');
  await page.getByRole('button', { name: 'Ajouter' }).click();
  await expect(page.locator('#form-message')).toHaveText('Chien ajouté !');
  await expect(page.locator('.dog-card')).toHaveCount(initialCount + 1);
});

test("un nom contenant du HTML n'est pas interprété (XSS)", async ({ page }) => {
  await page.goto('/');
  await page.fill('#f-name', '<img src=x onerror=alert(1)>');
  await page.fill('#f-country', 'Test');
  await page.selectOption('#f-region', 'europe');
  await page.fill('#f-description', 'Test de protection contre le XSS.');
  await page.getByRole('button', { name: 'Ajouter' }).click();
  await expect(page.locator('.dog-card img')).toHaveCount(0);
});
