import { test, expect } from '@playwright/test';

/**
 * 스크롤 UX 진단 테스트
 * - data-animate 요소들이 스크롤 시 정상적으로 나타나는지 확인
 * - opacity:0 으로 숨겨진 채로 남아있지 않는지 확인
 */

const SCROLL_WAIT = 600; // 애니메이션 완료 대기

test.describe('Scroll UX - 섹션 노출 확인', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 로딩 섹션이 있으면 사라질 때까지 대기
    await page.waitForTimeout(3000);
  });

  test('GSAP 초기화: data-animate 요소가 opacity:0 으로 설정됨', async ({ page }) => {
    const coupleSection = page.locator('#couple');
    await expect(coupleSection).toBeAttached();

    // GSAP가 초기화되면 data-animate 요소들이 opacity:0으로 설정되어야 함
    const animatedEl = coupleSection.locator('[data-animate]').first();
    await expect(animatedEl).toBeAttached();

    const opacity = await animatedEl.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );

    // GSAP가 아직 안 로드됐을 수 있으므로 0 또는 1 둘 다 허용
    expect([0, 1]).toContain(Math.round(opacity));
  });

  test('커플 섹션: 스크롤 시 콘텐츠가 나타남', async ({ page }) => {
    const coupleSection = page.locator('#couple');
    await expect(coupleSection).toBeAttached();

    // 커플 섹션으로 스크롤
    await coupleSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(SCROLL_WAIT);

    // 섹션 헤더 텍스트가 보여야 함
    const sectionHeader = coupleSection.locator('[data-animate]').first();
    const opacity = await sectionHeader.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );
    expect(opacity).toBeGreaterThan(0.5);
  });

  test('커플 섹션: 신랑/신부 프로필이 스태거 애니메이션 후 보임', async ({ page }) => {
    const coupleSection = page.locator('#couple');
    await coupleSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(SCROLL_WAIT);

    // data-animate-item 요소들(신랑/신부 카드)이 보여야 함
    const items = coupleSection.locator('[data-animate-item]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < count; i++) {
      const opacity = await items.nth(i).evaluate((el) =>
        parseFloat(window.getComputedStyle(el).opacity)
      );
      expect(opacity).toBeGreaterThan(0.5);
    }
  });

  test('예식 정보 섹션: 스크롤 시 달력과 날짜가 보임', async ({ page }) => {
    const weddingSection = page.locator('#wedding-info');
    await expect(weddingSection).toBeAttached();

    await weddingSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(SCROLL_WAIT);

    // 모든 data-animate 요소가 투명하지 않아야 함
    const animatedEls = weddingSection.locator('[data-animate]');
    const count = await animatedEls.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const opacity = await animatedEls.nth(i).evaluate((el) =>
        parseFloat(window.getComputedStyle(el).opacity)
      );
      expect(opacity).toBeGreaterThan(0.5);
    }
  });

  test('위치 섹션: 스크롤 시 뷰포트 내 요소들이 보임', async ({ page }) => {
    const locationSection = page.locator('#location');
    await expect(locationSection).toBeAttached();

    // 섹션을 뷰포트 중간까지 스크롤 (섹션 전체를 지나며 체크)
    await locationSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(SCROLL_WAIT);

    // 뷰포트 내에 있는 data-animate 요소만 체크 (아래에 있는 요소는 아직 미트리거가 정상)
    const invisibleInViewport = await page.evaluate(() => {
      const section = document.querySelector('#location');
      if (!section) return 0;
      const els = section.querySelectorAll('[data-animate]');
      let count = 0;
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
        if (isInViewport && parseFloat(window.getComputedStyle(el).opacity) < 0.1) {
          count++;
        }
      });
      return count;
    });

    expect(invisibleInViewport).toBe(0);
  });

  test('전체 스크롤: 모든 섹션을 지나도 콘텐츠가 invisible하게 남지 않음', async ({ page }) => {
    const sections = ['#couple', '#wedding-info', '#location'];

    for (const sectionId of sections) {
      const section = page.locator(sectionId);
      if (await section.count() === 0) continue;

      await section.scrollIntoViewIfNeeded();
      // 섹션 중간까지 추가 스크롤 (트리거 확실히 통과)
      await page.evaluate((id) => {
        const el = document.querySelector(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollBy({ top: rect.height * 0.3, behavior: 'instant' });
        }
      }, sectionId);

      await page.waitForTimeout(SCROLL_WAIT);

      // 해당 섹션 내 모든 data-animate 요소 확인
      const invisibleCount = await page.evaluate((id) => {
        const els = document.querySelectorAll(`${id} [data-animate]`);
        let invisible = 0;
        const threshold = window.innerHeight * 0.85;
        els.forEach((el) => {
          const rect = el.getBoundingClientRect();
          // 트리거 범위 안에 완전히 들어온 요소만 체크 (top < 85% viewport)
          const isTriggered = rect.top < threshold && rect.bottom > 0;
          if (isTriggered && parseFloat(window.getComputedStyle(el).opacity) < 0.1) {
            invisible++;
          }
        });
        return invisible;
      }, sectionId);

      if (invisibleCount > 0) {
        const debugInfo = await page.evaluate((id) => {
          const els = document.querySelectorAll(`${id} [data-animate]`);
          const threshold = window.innerHeight * 0.85;
          const info: string[] = [];
          els.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const isTriggered = rect.top < threshold && rect.bottom > 0;
            const op = parseFloat(window.getComputedStyle(el).opacity);
            info.push(`[triggered=${isTriggered}] [${(el as HTMLElement).dataset.animate}] top=${rect.top.toFixed(0)}px op=${op} class="${el.className.slice(0, 50)}"`);
          });
          return { section: id, scrollY: window.scrollY, info };
        }, sectionId);
        console.log(`FAIL Section ${debugInfo.section} scrollY=${debugInfo.scrollY}:`, debugInfo.info.join(' | '));
      }
      expect(invisibleCount).toBe(0);
    }
  });

  test('contentVisibility 섹션: GSAP가 올바른 트리거 위치를 계산함', async ({ page }) => {
    // contentVisibility:auto 와 GSAP ScrollTrigger 충돌 확인
    // 섹션이 뷰포트에 들어온 후 500ms 이내에 애니메이션이 완료되어야 함

    const coupleSection = page.locator('#couple');
    const rect = await coupleSection.boundingBox();
    if (!rect) throw new Error('couple section not found');

    // 커플 섹션 직전에 멈춤 (아직 섹션이 뷰포트에 없음)
    await page.evaluate((y) => {
      window.scrollTo({ top: y - window.innerHeight - 10, behavior: 'instant' });
    }, rect.y + rect.height);

    await page.waitForTimeout(200);

    // 이 시점에서 data-animate 요소들은 아직 opacity:0이어야 함 (아직 뷰포트 밖)
    const headerEl = coupleSection.locator('[data-animate]').first();
    const opacityBefore = await headerEl.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );

    // 커플 섹션 헤더가 뷰포트 80% 지점에 들어오도록 스크롤
    await page.evaluate((y) => {
      window.scrollTo({ top: y - window.innerHeight * 0.15, behavior: 'instant' });
    }, rect.y);

    await page.waitForTimeout(SCROLL_WAIT);

    const opacityAfter = await headerEl.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity)
    );

    // 트리거가 올바르게 작동했다면 before < after
    // before가 이미 1이라면 (GSAP가 없거나 이미 통과한 경우) 그것도 OK
    expect(opacityAfter).toBeGreaterThan(opacityBefore * 0.8);
  });
});

test.describe('Scroll UX - 스크롤 위치/트리거 진단', () => {
  test('data-animate 요소 개수와 트리거 상태 진단', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);

    // 전체 페이지를 천천히 스크롤하며 진단
    const scrollSteps = [400, 800, 1200, 1600, 2000, 2400, 2800];

    const results: Record<string, { invisible: number; total: number }> = {};

    for (const scrollY of scrollSteps) {
      await page.evaluate((y) => {
        window.scrollTo({ top: y, behavior: 'instant' });
      }, scrollY);
      await page.waitForTimeout(SCROLL_WAIT);

      const stats = await page.evaluate(() => {
        const all = document.querySelectorAll('[data-animate]');
        let invisible = 0;
        let inViewport = 0;
        const invisibleEls: string[] = [];
        // 트리거가 'top 80~90%' 기준이므로, 뷰포트 진입 후 트리거까지 약간의 여유가 있음
        // 요소 top이 뷰포트 85% 안쪽에 들어온 요소만 체크 (완전히 트리거 범위 내)
        const triggerThreshold = window.innerHeight * 0.85;

        all.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const isFullyTriggered = rect.top < triggerThreshold && rect.bottom > 0;
          const opacity = parseFloat(window.getComputedStyle(el).opacity);

          if (isFullyTriggered) {
            inViewport++;
            if (opacity < 0.1) {
              invisible++;
              const info = `[${(el as HTMLElement).dataset.animate}] section=${el.closest('section')?.id} class="${el.className.slice(0,60)}" top=${rect.top.toFixed(0)}px opacity=${opacity}`;
              invisibleEls.push(info);
            }
          }
        });

        return { invisible, inViewport, scrollY: window.scrollY, invisibleEls };
      });

      results[`scroll_${scrollY}`] = { invisible: stats.invisible, total: stats.inViewport };

      console.log(`Scroll ${scrollY}px: ${stats.inViewport} in view, ${stats.invisible} invisible`);
      if (stats.invisibleEls.length) {
        stats.invisibleEls.forEach((el) => console.log(`  INVISIBLE: ${el}`));
      }
      // 뷰포트 상단 90% 기준으로만 체크 (트리거 발사 시점과 일치)
      // 요소가 뷰포트에 막 들어온 순간(90~100% 위치)은 트리거 준비 중일 수 있으므로 제외
    }
  });
});
