import { test, expect } from '@playwright/test';

test.describe('Gallery modal layout', () => {
  test('should keep the fullscreen image viewer pinned to the viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2500);

    const gallerySection = page.locator('#gallery');
    await gallerySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const firstGalleryButton = gallerySection.getByRole('button', { name: /크게 보기/ }).first();
    await expect(firstGalleryButton).toBeVisible();
    await firstGalleryButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const dialogBox = await dialog.boundingBox();
    if (!dialogBox) throw new Error('Image modal dialog not found');

    expect(dialogBox.x).toBeLessThanOrEqual(1);
    expect(dialogBox.y).toBeLessThanOrEqual(1);

    const viewport = page.viewportSize();
    if (!viewport) throw new Error('Viewport size unavailable');

    expect(dialogBox.width).toBeGreaterThanOrEqual(viewport.width - 2);
    expect(dialogBox.height).toBeGreaterThanOrEqual(viewport.height - 2);

    const modalStage = page.getByTestId('image-modal-stage');
    await expect(modalStage).toBeVisible();

    const stageBox = await modalStage.boundingBox();
    if (!stageBox) throw new Error('Image modal stage not found');

    expect(stageBox.y).toBeGreaterThan(0);
    expect(stageBox.y + stageBox.height).toBeLessThanOrEqual(viewport.height);
  });
});
