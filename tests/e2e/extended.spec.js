import { test, expect } from '@playwright/test';

test.describe('Dog World E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the home page with title and initial dogs', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Chiens du Monde');
    const dogCards = page.locator('.dog-card');
    const count = await dogCards.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('should filter dogs by region', async ({ page }) => {
    // Filter by Europe
    await page.getByRole('button', { name: 'Europe' }).click();
    await expect(async () => {
      const cards = page.locator('.dog-card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toContainText('Europe');
      }
    }).toPass();

    // Filter by Asie
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

  test('should add a new dog successfully', async ({ page }) => {
    const dogName = `Border Collie ${Date.now()}`;
    const initialCount = await page.locator('.dog-card').count();
    
    await page.fill('#f-name', dogName);
    await page.fill('#f-country', 'Royaume-Uni');
    await page.selectOption('#f-region', 'europe');
    await page.fill('#f-description', 'Chien de berger très intelligent et énergique.');
    await page.click('button[type="submit"]');

    await expect(page.locator('#form-message')).toHaveText('Chien ajouté !');
    await expect(page.locator('.dog-card')).toHaveCount(initialCount + 1);
    await expect(page.locator('#dog-grid')).toContainText(dogName);
  });

  test('should show error when description is too short', async ({ page }) => {
    await page.fill('#f-name', 'Test Dog');
    await page.fill('#f-country', 'Test Country');
    await page.selectOption('#f-region', 'asie');
    await page.fill('#f-description', 'Short'); // Less than 10 chars
    await page.click('button[type="submit"]');

    await expect(page.locator('#form-message')).not.toHaveText('Chien ajouté !');
    await expect(page.locator('#form-message')).toContainText('description doit contenir entre 10 et 300 caractères');
  });

  test('should escape HTML to prevent XSS', async ({ page }) => {
    const uniqueId = Date.now();
    const xssPayload = `<img src=x onerror=alert(${uniqueId})>`;
    await page.fill('#f-name', xssPayload);
    await page.fill('#f-country', 'Test');
    await page.selectOption('#f-region', 'oceanie');
    await page.fill('#f-description', 'Testing XSS protection in name field.');
    await page.click('button[type="submit"]');

    await expect(page.locator('#form-message')).toHaveText('Chien ajouté !');
    
    // Check that no img tag with the unique alert exists
    const xssImage = page.locator(`img[onerror*="alert(${uniqueId})"]`);
    await expect(xssImage).toHaveCount(0);
    
    // Check that the text is rendered literally
    await expect(page.locator('.dog-card h2', { hasText: xssPayload }).first()).toBeVisible();
  });
});
