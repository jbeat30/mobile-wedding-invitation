import { test, expect } from '@playwright/test';

test.describe('Main Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page', async ({ page }) => {
    await expect(page).toHaveTitle('모바일 청첩장');
  });

  test('should render intro section', async ({ page }) => {
    const introSection = page.locator('#intro');
    await expect(introSection).toBeVisible();
  });

  test('should display countdown timer', async ({ page }) => {
    // 카운트다운 타이머의 DAYS 레이블이 표시되는지 확인
    const daysLabel = page.locator('text=DAYS');
    await expect(daysLabel).toBeVisible();

    // 결혼식 날짜 메시지가 표시되는지 확인
    const dateMessage = page.locator('text=/결혼식이.*남았습니다|우리 오늘 결혼해요/');
    await expect(dateMessage).toBeVisible();
  });

  test('should render door scene', async ({ page }) => {
    // 좌측 문과 우측 문이 렌더링되는지 확인
    const doorScene = page.locator('[style*="preserve-3d"]');
    await expect(doorScene.first()).toBeVisible();
    await expect(doorScene.last()).toBeVisible();
  });
});

test.describe('GSAP Door Animation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // GSAP ScrollTrigger가 초기화될 때까지 대기
    await page.waitForTimeout(1000);
  });

  test('should NOT start animation when intro content is visible', async ({ page }) => {
    // 초기 상태에서 도어가 아직 열리지 않았는지 확인
    const leftDoor = page.locator('[style*="preserve-3d"]').first();

    // 초기 rotateY 값 확인 (0에 가까워야 함)
    const initialRotation = await leftDoor.evaluate((el) => {
      const transform = window.getComputedStyle(el).transform;
      // matrix3d에서 rotation 값 추출
      if (transform.includes('matrix3d')) {
        const values = transform.match(/matrix3d?\(([^)]+)\)/)?.[1].split(', ');
        if (values) {
          const m11 = parseFloat(values[0]);
          const m13 = parseFloat(values[2]);
          return Math.atan2(m13, m11) * (180 / Math.PI);
        }
      }
      return 0;
    });

    // 작은 스크롤 (인트로 영역만 스크롤)
    await page.evaluate(() => {
      window.scrollTo({ top: 200, behavior: 'instant' });
    });

    await page.waitForTimeout(300);

    // 작은 스크롤 후 rotateY 값 확인
    const afterSmallScrollRotation = await leftDoor.evaluate((el) => {
      const transform = window.getComputedStyle(el).transform;
      if (transform.includes('matrix3d')) {
        const values = transform.match(/matrix3d?\(([^)]+)\)/)?.[1].split(', ');
        if (values) {
          const m11 = parseFloat(values[0]);
          const m13 = parseFloat(values[2]);
          return Math.atan2(m13, m11) * (180 / Math.PI);
        }
      }
      return 0;
    });

    // rotation이 거의 변하지 않았는지 확인 (5도 이내)
    expect(Math.abs(afterSmallScrollRotation - initialRotation)).toBeLessThan(5);
  });

  test('should start animation when door is fully visible', async ({ page }) => {
    // 도어가 화면에 전체가 보일 때까지 스크롤
    const leftDoor = page.locator('[style*="preserve-3d"]').first();
    const doorFrame = leftDoor.locator('..');

    // 도어의 위치와 크기 확인
    const doorBox = await doorFrame.boundingBox();
    if (!doorBox) throw new Error('Door not found');

    // 도어 하단이 뷰포트 하단에 도달할 때까지 스크롤
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollAmount = doorBox.y + doorBox.height - viewportHeight;

    await page.evaluate((amount) => {
      window.scrollTo({ top: Math.max(0, amount), behavior: 'instant' });
    }, scrollAmount);

    await page.waitForTimeout(500);

    // 추가 스크롤로 애니메이션 진행
    await page.evaluate(() => {
      window.scrollBy({ top: 500, behavior: 'instant' });
    });

    await page.waitForTimeout(500);

    // rotateY 값이 변경되었는지 확인 (애니메이션 진행 중)
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

    // rotation이 5도 이상 변경되었는지 확인 (애니메이션 진행됨)
    expect(rotation).toBeGreaterThan(5);
  });

  test('should keep door pinned during animation', async ({ page }) => {
    // 도어가 화면에 전체가 보일 때까지 스크롤
    const leftDoor = page.locator('[style*="preserve-3d"]').first();
    const doorFrame = leftDoor.locator('..');
    const doorBox = await doorFrame.boundingBox();
    if (!doorBox) throw new Error('Door not found');

    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollAmount = doorBox.y + doorBox.height - viewportHeight;

    await page.evaluate((amount) => {
      window.scrollTo({ top: Math.max(0, amount) + 100, behavior: 'instant' });
    }, scrollAmount);

    await page.waitForTimeout(500);

    // 도어의 초기 위치 저장
    const initialDoorBox = await doorFrame.boundingBox();
    if (!initialDoorBox) throw new Error('Door not found');

    // 스크롤 진행
    await page.evaluate(() => {
      window.scrollBy({ top: 300, behavior: 'instant' });
    });

    await page.waitForTimeout(300);

    // 도어의 위치가 고정되어 있는지 확인 (pin 효과)
    const afterScrollDoorBox = await doorFrame.boundingBox();
    if (!afterScrollDoorBox) throw new Error('Door not found');

    // Y 위치가 거의 변하지 않아야 함 (pin으로 고정됨)
    const yDifference = Math.abs(afterScrollDoorBox.y - initialDoorBox.y);
    expect(yDifference).toBeLessThan(50); // 50px 이내의 차이만 허용
  });

  test('should allow scrolling to next section after animation completes', async ({ page }) => {
    // 도어 애니메이션을 완전히 진행
    const leftDoor = page.locator('[style*="preserve-3d"]').first();
    const doorFrame = leftDoor.locator('..');
    const doorBox = await doorFrame.boundingBox();
    if (!doorBox) throw new Error('Door not found');

    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollAmount = doorBox.y + doorBox.height - viewportHeight;

    // 도어가 보일 때까지 스크롤
    await page.evaluate((amount) => {
      window.scrollTo({ top: Math.max(0, amount), behavior: 'instant' });
    }, scrollAmount);

    await page.waitForTimeout(500);

    // 현재 스크롤 위치 저장
    const scrollBeforeAnimation = await page.evaluate(() => window.scrollY);

    // 애니메이션을 완료하기 위해 충분히 스크롤
    await page.evaluate(() => {
      window.scrollBy({ top: window.innerHeight * 2, behavior: 'instant' });
    });

    await page.waitForTimeout(500);

    // 스크롤이 실제로 진행되었는지 확인 (pin이 해제되어 스크롤 가능)
    const scrollAfterAnimation = await page.evaluate(() => window.scrollY);

    // 애니메이션 완료 후 스크롤이 증가했는지 확인
    expect(scrollAfterAnimation).toBeGreaterThan(scrollBeforeAnimation);
  });

  test('should open doors on scroll', async ({ page }) => {
    // 초기 상태: 문이 닫혀있는지 확인 (rotateY가 0에 가까운 값)
    const leftDoor = page.locator('[style*="preserve-3d"]').first();
    const rightDoor = page.locator('[style*="preserve-3d"]').last();

    await expect(leftDoor).toBeVisible();
    await expect(rightDoor).toBeVisible();

    // 초기 transform 값 확인 (애니메이션 전)
    const initialLeftTransform = await leftDoor.evaluate((el) =>
      window.getComputedStyle(el).transform
    );
    const initialRightTransform = await rightDoor.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    // 스크롤 실행
    await page.evaluate(() => {
      window.scrollTo({ top: 1000, behavior: 'instant' });
    });

    // 애니메이션이 적용될 시간을 기다림
    await page.waitForTimeout(500);

    // 스크롤 후 transform 값 확인 (애니메이션 후)
    const scrolledLeftTransform = await leftDoor.evaluate((el) =>
      window.getComputedStyle(el).transform
    );
    const scrolledRightTransform = await rightDoor.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    // transform 값이 변경되었는지 확인
    expect(scrolledLeftTransform).not.toBe(initialLeftTransform);
    expect(scrolledRightTransform).not.toBe(initialRightTransform);
  });

  test('should reveal welcome content after scrolling', async ({ page }) => {
    // 문 뒤 이미지 콘텐츠 찾기
    const welcomeImage = page.locator('img[alt="Wedding Main Image"]');

    // 이미지가 존재하는지 확인 (처음에는 opacity 0일 수 있음)
    await expect(welcomeImage).toBeAttached();

    // 스크롤 실행
    await page.evaluate(() => {
      window.scrollTo({ top: 1500, behavior: 'instant' });
    });

    // 애니메이션이 적용될 시간을 기다림
    await page.waitForTimeout(800);

    // 이미지 콘텐츠의 opacity가 증가했는지 확인
    const imageOpacity = await welcomeImage.evaluate((el) => {
      const contentContainer = el.closest('[class*="opacity"]');
      return contentContainer ? window.getComputedStyle(contentContainer).opacity : '0';
    });

    // opacity가 0보다 크면 애니메이션이 작동한 것
    expect(parseFloat(imageOpacity)).toBeGreaterThan(0);
  });

  test('should handle scroll animations smoothly', async ({ page }) => {
    // 여러 단계로 스크롤하면서 애니메이션 확인
    const scrollSteps = [0, 300, 600, 900, 1200];

    for (const scrollPosition of scrollSteps) {
      await page.evaluate((pos) => {
        window.scrollTo({ top: pos, behavior: 'instant' });
      }, scrollPosition);

      // 각 단계에서 애니메이션이 적용될 시간 대기
      await page.waitForTimeout(300);

      // 문이 여전히 렌더링되어 있는지 확인
      const leftDoor = page.locator('[style*="preserve-3d"]').first();
      await expect(leftDoor).toBeVisible();
    }
  });

  test('should maintain animation on window resize', async ({ page }) => {
    // 초기 뷰포트 크기
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 size
    await page.waitForTimeout(500);

    // 스크롤
    await page.evaluate(() => {
      window.scrollTo({ top: 800, behavior: 'instant' });
    });
    await page.waitForTimeout(300);

    // 뷰포트 크기 변경
    await page.setViewportSize({ width: 428, height: 926 }); // iPhone 14 Pro Max size
    await page.waitForTimeout(500);

    // 애니메이션이 여전히 작동하는지 확인
    const leftDoor = page.locator('[style*="preserve-3d"]').first();
    await expect(leftDoor).toBeVisible();

    // transform이 적용되어 있는지 확인
    const transform = await leftDoor.evaluate((el) =>
      window.getComputedStyle(el).transform
    );
    expect(transform).not.toBe('none');
  });
});
