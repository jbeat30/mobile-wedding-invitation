import { test, expect } from '@playwright/test';

test.describe('Visual Inspection - Door Animation', () => {
  test('capture door animation stages', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // 1. 초기 상태
    await page.screenshot({ path: 'visual-test-1-initial.png', fullPage: true });
    console.log('1. Initial state - Intro content visible');

    // 2. 작은 스크롤 (200px)
    await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'visual-test-2-scroll-200.png', fullPage: true });
    console.log('2. Scrolled 200px');

    // 3. 중간 스크롤 (400px)
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'visual-test-3-scroll-400.png', fullPage: true });
    console.log('3. Scrolled 400px');

    // 4. 도어가 화면에 들어오기 시작 (600px)
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'visual-test-4-scroll-600.png', fullPage: true });
    console.log('4. Scrolled 600px');

    // 5. 도어 하단이 화면에 들어옴 (800px)
    await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'visual-test-5-scroll-800.png', fullPage: true });
    console.log('5. Scrolled 800px - Door bottom entering viewport');

    // 6. 애니메이션 진행 중 (1000px)
    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'visual-test-6-scroll-1000.png', fullPage: true });
    console.log('6. Scrolled 1000px - Animation should be active');

    // 7. 애니메이션 더 진행 (1500px)
    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'visual-test-7-scroll-1500.png', fullPage: true });
    console.log('7. Scrolled 1500px - Animation in progress');

    // 8. 애니메이션 거의 완료 (2000px)
    await page.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'visual-test-8-scroll-2000.png', fullPage: true });
    console.log('8. Scrolled 2000px - Animation almost complete');

    // 9. 애니메이션 완료 후 (2500px)
    await page.evaluate(() => window.scrollTo({ top: 2500, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'visual-test-9-scroll-2500.png', fullPage: true });
    console.log('9. Scrolled 2500px - After animation');

    // 도어의 현재 rotation 확인
    const leftDoor = page.locator('[style*="preserve-3d"]').first();
    const rotation = await leftDoor.evaluate((el) => {
      const transform = window.getComputedStyle(el).transform;
      if (transform.includes('matrix3d')) {
        const values = transform.match(/matrix3d?\(([^)]+)\)/)?.[1].split(', ');
        if (values) {
          const m11 = parseFloat(values[0]);
          const m13 = parseFloat(values[2]);
          return Math.abs(Math.atan2(m13, m11) * (180 / Math.PI));
        }
      }
      return 0;
    });

    console.log(`\nFinal door rotation: ${rotation.toFixed(2)} degrees`);
    console.log('\nScreenshots saved. Check the project root for visual-test-*.png files');
  });
});
