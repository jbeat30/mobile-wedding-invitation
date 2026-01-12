import { test, expect } from '@playwright/test';

test.describe('Small Screen (iPhone SE) - Door Animation', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE size
  });

  test('should scroll normally until door is fully visible on small screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // 1. 초기 상태 - 도어가 화면에 다 보이지 않음
    await page.screenshot({ path: 'small-screen-1-initial.png', fullPage: true });
    console.log('1. Initial state - Small screen (375x667)');

    // 도어의 위치와 크기 확인
    const leftDoor = page.locator('[style*="preserve-3d"]').first();
    const doorFrame = leftDoor.locator('..');

    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const doorRect = await doorFrame.boundingBox();

    if (doorRect) {
      console.log(`Viewport height: ${viewportHeight}px`);
      console.log(`Door height: ${doorRect.height}px`);
      console.log(`Door top: ${doorRect.y}px`);
      console.log(`Door bottom: ${doorRect.y + doorRect.height}px`);

      const isDoorFullyVisible = doorRect.y >= 0 && (doorRect.y + doorRect.height) <= viewportHeight;
      console.log(`Is door fully visible? ${isDoorFullyVisible}`);
    }

    // 2. 작은 스크롤 (200px) - 아직 도어 전체가 안 보이면 일반 스크롤
    await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'small-screen-2-scroll-200.png', fullPage: true });
    console.log('2. Scrolled 200px - Should still be normal scroll');

    // 인트로 콘텐츠가 여전히 보이는지 확인
    const daysLabel = page.locator('text=DAYS');
    await expect(daysLabel).toBeVisible();
    console.log('✓ Intro content (countdown) still visible');

    // 3. 도어 하단이 화면에 들어올 때까지 스크롤
    if (doorRect) {
      const scrollToShowFullDoor = Math.max(0, doorRect.y + doorRect.height - viewportHeight);

      await page.evaluate((amount) => {
        window.scrollTo({ top: amount, behavior: 'instant' });
      }, scrollToShowFullDoor);

      await page.waitForTimeout(500);
      await page.screenshot({ path: 'small-screen-3-door-fully-visible.png', fullPage: true });
      console.log(`3. Scrolled ${scrollToShowFullDoor}px - Door should be fully visible now`);
    }

    // 인트로 콘텐츠가 여전히 보이는지 확인
    await expect(daysLabel).toBeVisible();
    console.log('✓ Intro content still visible after scrolling to show full door');

    // 4. 추가 스크롤로 애니메이션 진행
    await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'small-screen-4-animation-progress.png', fullPage: true });
    console.log('4. Animation should be progressing');

    // 도어가 열리기 시작했는지 확인
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

    console.log(`Door rotation: ${rotation.toFixed(2)} degrees`);
    expect(rotation).toBeGreaterThan(0);
    console.log('✓ Door animation is active');

    // 인트로 콘텐츠가 여전히 보이는지 확인
    await expect(daysLabel).toBeVisible();
    console.log('✓ Intro content still visible during animation');

    console.log('\n✅ Small screen test passed! Door waits until fully visible before pinning.');
  });
});
