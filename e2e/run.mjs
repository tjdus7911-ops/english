/**
 * 주요 사용자 플로우 E2E 테스트 (Playwright, 모바일 뷰포트).
 * 실행: npm run build && npm run test:e2e
 * 결과 스크린샷: e2e/screens/
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;
mkdirSync('e2e/screens', { recursive: true });

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
await new Promise((res, rej) => {
  server.stdout.on('data', (d) => d.toString().includes(String(PORT)) && res());
  server.on('exit', () => rej(new Error('preview server exited')));
  setTimeout(() => rej(new Error('preview timeout')), 20000);
});

const results = [];
const errors = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, locale: 'ko-KR' });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
// 외부 웹폰트(CDN) 로딩 실패는 네트워크 제한 환경 탓이므로 제외
page.on('console', (m) => m.type() === 'error' && !m.text().includes('ERR_TUNNEL') && !m.text().includes('ERR_NAME') && errors.push(`console: ${m.text()}`));

const shot = (n) => page.screenshot({ path: `e2e/screens/${n}.png`, fullPage: false });
const btn = (name) => page.getByRole('button', { name, exact: false });
const noOverflow = async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

/** 화면에 나온 문항을 끝까지 풀기 (정답 여부와 상관없이 흐름 검증) */
async function solveAll(limit = 40) {
  let n = 0;
  while (n < limit && (await btn('정답 확인').count()) > 0) {
    const text = page.locator('textarea, input[aria-label="빈칸 답안"]');
    if (await text.count()) await text.first().fill('test answer');
    else if (await page.getByLabel('내가 만든 문장').count()) {
      // 남은 단어 버튼을 모두 누르기
      for (let i = 0; i < 15; i++) {
        const tok = page.locator('div.flex.flex-wrap.gap-2 > button.en:not([disabled])').last();
        if ((await btn('정답 확인').isDisabled()) === false) break;
        if (!(await tok.count())) break;
        await tok.click();
      }
    } else if (await page.getByText('틀린 부분을 눌러 선택하세요.').count()) {
      await page.locator('.card button.en').first().click();
    } else {
      await page.locator('ul li button[aria-pressed]').first().click();
    }
    await btn('정답 확인').click();
    await page.getByRole('status').first().waitFor();
    await page.locator('button.btn-primary').last().click();
    n++;
  }
  return n;
}

try {
  // 1. 온보딩
  await page.goto(BASE);
  await page.waitForURL(/#\/onboarding/);
  await shot('01-onboarding');
  await btn('시작하기').click();
  await page.getByRole('radio', { name: /^일상 회화/ }).click();
  await btn('다음').click();
  await page.getByRole('radio', { name: /^20분/ }).click();
  await btn('다음').click();
  await page.getByRole('radio', { name: /^A1 입문/ }).click();
  await btn('다음').click();
  await btn('레벨 테스트 시작').click();
  check('온보딩 완료 → 레벨 테스트 진입', /#\/placement/.test(page.url()));

  // 2. 레벨 테스트
  const solved = await solveAll(30);
  await page.getByText('추천 학습 레벨').waitFor();
  await shot('02-placement-result');
  check('레벨 테스트 18문항 진행 · 결과 표시', solved === 18, `${solved}문항`);
  await page.getByRole('radio', { name: 'A1' }).click();
  await btn('A1 코스로 시작하기').click();
  await page.waitForURL(/#\/home/);

  // 3. 하단 탭 이동
  for (const [label, re] of [
    ['학습코스', /#\/course/],
    ['자유학습', /#\/free/],
    ['실력분석', /#\/stats/],
    ['MY', /#\/my/],
    ['홈', /#\/home/],
  ]) {
    await page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: label }).click();
    await page.waitForURL(re);
    check(`하단 탭: ${label}`, re.test(page.url()) && (await noOverflow()), (await noOverflow()) ? '' : '가로 넘침');
  }
  await shot('03-home-before');
  check('홈: 복습 없음 → 신규 학습 바로 추천', (await page.getByText('오늘은 복습할 내용이 없어요').count()) === 1);

  // 4. A1 DAY 1 학습
  await btn('신규 학습 시작').click();
  await page.waitForURL(/#\/course\/lesson\/a1-u1-d1/);
  await btn('학습 시작').click();
  for (let i = 0; i < 10; i++) {
    if (i === 0) {
      await btn('단어 저장').first().click();
      await btn('암기 완료').click();
      await shot('04-word-card');
    }
    await page.locator('button.btn-primary').last().click();
  }
  await page.getByText('오늘 배울 문법의 목적').waitFor();
  check('단어 10개 학습 → 문법 강의 진입', true);

  // 문법 강의 설명 단계 전환
  const helpChecks = [
    ['쉽게 설명하기', '이퀄'],
    ['자세히 설명하기', '축약형'],
    ['예문 더 보기', "I'm not hungry right now."],
    ['아직 이해가 안 돼요', '한 번에 이해되지 않는 게 정상'],
  ];
  for (const [b, expectText] of helpChecks) {
    await btn(b).click();
    const ok = (await page.getByText(expectText, { exact: false }).count()) > 0;
    check(`문법 강의 설명 전환: ${b}`, ok);
  }
  await btn('비슷한 문법 비교').click();
  check('문법 강의 설명 전환: 비슷한 문법 비교', (await page.getByText('be동사 vs 일반동사').count()) > 0);
  await shot('05-grammar-lecture');
  await btn('어휘 연습으로').click();
  await solveAll(2); // 어휘 연습
  const nCheck = await solveAll(3); // 확인 문제
  await page.getByText(/확인 문제 \d\/3/).waitFor();
  await shot('06-understanding');
  check('확인 문제 → 이해도 판정 표시', nCheck === 3);
  // 판정에 따라 다음 행동
  if (await btn('다음 학습 진행').count()) await btn('다음 학습 진행').click();
  else if (await btn('일단 계속 진행').count()) await btn('일단 계속 진행').click();
  else await btn('다음 학습으로').click();
  await solveAll(4); // 영작 + 마무리 테스트
  await page.getByText('DAY 1 완료!').waitFor();
  await shot('07-lesson-done');
  check('DAY 1 완료 (영작·마무리 테스트 포함)', true);
  await btn('홈으로').click();

  // 5. 홈: 오늘의 복습 우선
  await page.waitForURL(/#\/home/);
  const words = await page.locator('section[aria-label="오늘의 복습"] .grid > div').first().innerText();
  await shot('08-home-review');
  check('단어·문법 학습 후 오늘의 복습 생성', /영단어\s*\n?\s*\d+/.test(words) && !/영단어\s*\n?\s*0$/.test(words), words.replace(/\n/g, ' '));

  // 6. 오답노트 자동 반영
  await page.getByRole('button', { name: /오답노트/ }).click();
  await page.waitForURL(/#\/wrong-notes/);
  const wrongCount = await page.locator('ul > li.card').count();
  check('오답노트 자동 저장', wrongCount > 0, `${wrongCount}개`);
  await shot('09-wrong-notes');
  if (wrongCount > 0) {
    await page.locator('ul > li.card button[aria-expanded]').first().click();
    await btn('복습 완료').first().click();
    await page.getByRole('radio', { name: '복습 완료' }).click();
    check('오답 복습 완료 처리', (await page.locator('ul > li.card').count()) >= 1);
    await page.getByRole('radio', { name: '미해결' }).click();
  }

  // 7. 뒤로가기
  await page.goBack();
  await page.waitForURL(/#\/home/);
  check('브라우저 뒤로가기', /#\/home/.test(page.url()));

  // 8. 복습 재응시
  await btn('복습 시작').click();
  await page.waitForURL(/#\/review/);
  const nRev = await solveAll(20);
  await page.getByText('항목별 다음 복습').waitFor();
  await shot('10-review-result');
  check('복습 문제 풀이 · 결과 저장', nRev > 0, `${nRev}문제`);
  await btn('신규 학습하러 가기').click();

  // 9. 실력 분석 갱신
  await page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: '실력분석' }).click();
  const statsText = await page.locator('main').innerText();
  check('실력분석 데이터 갱신', /푼 문제\s*\n?\s*[1-9]/.test(statsText) && statsText.includes('장기 기억 현황'));
  await shot('11-stats');

  // 10. 알림 설정 → 새로고침 후 알림함
  await page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: 'MY' }).click();
  await page.getByLabel('알림 시간').fill('00:00');
  await page.getByRole('switch', { name: '미완료 학습 안내' }).click();
  await shot('12-my-settings');
  await page.reload();
  check('알림 설정 저장 (새로고침 후 유지)', (await page.getByLabel('알림 시간').inputValue()) === '00:00' && (await page.getByRole('switch', { name: '미완료 학습 안내' }).getAttribute('aria-checked')) === 'false');
  await page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: '홈' }).click();
  await page.waitForTimeout(300);
  const bell = await page.getByRole('button', { name: /알림함/ }).getAttribute('aria-label');
  check('앱 내부 알림 생성', /읽지 않은 알림 [1-9]/.test(bell ?? ''), bell ?? '');
  check('새 알림 배너 표시', (await page.getByRole('alert').count()) === 1);
  await shot('12b-banner');
  await page.getByRole('button', { name: '알림 닫기' }).click();
  await page.getByRole('button', { name: /알림함/ }).click();
  await shot('13-inbox');
  const items = await page.locator('main ul li button').count();
  await page.reload();
  await page.waitForTimeout(300);
  check('같은 알림 중복 생성 안 됨 (새로고침 후 개수 동일)', (await page.locator('main ul li button').count()) === items, `${items}개`);
  const reviewNotif = page.locator('main ul li button', { hasText: '복습' }).first();
  if (await reviewNotif.count()) {
    await reviewNotif.click();
    await page.waitForURL(/#\/review/);
    check('알림 선택 → 복습 화면 이동', true);
  } else check('알림 선택 → 복습 화면 이동', false, '복습 알림 없음');

  // 11. 새로고침 후 데이터 유지
  await page.goto(BASE + '#/wrong-notes');
  await page.reload();
  const after = await page.locator('ul > li.card').count();
  check('새로고침 후 오답노트 유지', after > 0, `${after}개`);
  await page.goto(BASE + '#/course/unit/a1-u1');
  check('새로고침 후 진도 유지 (DAY 1 완료 표시)', (await page.getByText(/완료 · 다시 학습 가능/).count()) === 1);

  // 12. 자유학습 · 문법 확인 문제 · 빈/오류 상태
  await page.goto(BASE + '#/grammar/b1-pp-experience');
  await btn('단계별 연습 · 이해도 확인').click();
  await solveAll(5);
  check('자유학습 문법 확인 문제 → 이해도 판정', (await page.getByText(/확인 문제 \d\/3/).count()) > 0);
  await page.goto(BASE + '#/free/words?level=B2');
  await page.getByLabel('단어 검색').fill('zzzz');
  check('빈 상태: 검색 결과 없음', (await page.getByText('조건에 맞는 단어가 없어요').count()) === 1);
  await page.goto(BASE + '#/grammar/unknown-id');
  check('오류 상태: 없는 개념', (await page.getByText('문법 개념을 찾을 수 없어요').count()) === 1);
  await page.goto(BASE + '#/does-not-exist');
  check('오류 상태: 없는 주소', (await page.getByText('페이지를 찾을 수 없어요').count()) === 1);
  await page.goto(BASE + '#/course/lesson/a2-u1-d2');
  check('잠긴 DAY 직접 진입 차단', (await page.getByText('아직 열리지 않은 학습이에요').count()) === 1);

  // 13. 작은 화면(320px) 가로 넘침 검사
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of ['#/home', '#/course', '#/free', '#/stats', '#/my', '#/grammar/a2-verb-to', '#/wrong-notes', '#/notifications']) {
    await page.goto(BASE + path);
    await page.waitForTimeout(150);
    check(`320px 레이아웃: ${path}`, await noOverflow());
  }
  await page.goto(BASE + '#/grammar/a2-verb-to');
  await shot('14-grammar-320');
} catch (e) {
  check('E2E 실행 중 예외', false, String(e).slice(0, 300));
  await shot('zz-error').catch(() => {});
} finally {
  check('콘솔·페이지 오류 없음', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close();
  server.kill();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}
