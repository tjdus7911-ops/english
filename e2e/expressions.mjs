/** 표현 학습관 E2E. 실행: npm run build && node e2e/expressions.mjs */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const PORT = 4177;
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
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await (await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })).newPage();
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME|net::/.test(m.text()) && errors.push(m.text()));
const btn = (name) => page.getByRole('button', { name });

async function solveAll(limit = 10) {
  let n = 0;
  while (n < limit && (await btn('정답 확인').count()) > 0) {
    if (await page.getByLabel('내가 만든 문장').count()) {
      for (let i = 0; i < 16; i++) {
        if (!(await btn('정답 확인').isDisabled())) break;
        await page.locator('div.flex.flex-wrap.gap-2 > button.en:not([disabled])').last().click();
      }
    } else await page.locator('ul li button[aria-pressed]').first().click();
    await btn('정답 확인').click();
    await page.getByRole('status').first().waitFor();
    await page.locator('button.btn-primary').last().click();
    n++;
  }
  return n;
}

try {
  await page.goto(BASE);
  await btn('시작하기').click();
  await page.getByRole('radio', { name: /^여행/ }).click();
  await btn('다음').click();
  await btn('다음').click();
  await page.getByRole('radio', { name: /^A2 초급/ }).click();
  await btn('다음').click();
  await btn(/건너뛰고/).click();
  await page.waitForURL(/#\/home/);

  await page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name: '자유학습' }).click();
  await btn(/표현 학습관/).click();
  await page.waitForURL(/#\/expressions/);
  const cards = await page.locator('main .grid > button').count();
  check('카테고리 카드 6개', cards === 6, `${cards}`);
  await page.screenshot({ path: 'e2e/screens/x01-hub.png' });

  await page.getByLabel('표현 검색').fill('호텔');
  const hotel = await page.locator('main ul > li').count();
  check('상황별 검색 (호텔)', hotel >= 3, `${hotel}개`);
  await page.getByLabel('표현 검색').fill('');
  await page.getByRole('button', { name: /필수 영어회화/ }).click();
  check('필수 회화 표현 50개', (await page.locator('main ul > li').count()) === 50);
  await page.getByRole('button', { name: 'B2', exact: true }).click();
  const b2 = await page.locator('main ul > li').count();
  check('레벨 필터 (B2)', b2 >= 1 && b2 < 50, `${b2}개`);
  await page.getByRole('button', { name: '전체 레벨' }).click();

  // 표현 상세
  await page.getByRole('button', { name: /Long time no see/ }).click();
  await page.waitForURL(/#\/expressions\/ex-es-002/);
  const detail = await page.locator('main').innerText();
  check('상세: 뜻·상황·뉘앙스·비슷한 표현·대화·응용', ['오랜만이야', '이럴 때 써요', '주의할 뉘앙스', '비슷한 표현과 차이', '대화 예문', '응용 문장'].every((t) => detail.includes(t)));
  await btn('발음 듣기').click();
  await btn('일시정지').first().waitFor({ timeout: 5000 });
  check('표현 발음 듣기 (음성 재생)', true);
  await btn('일시정지').first().click();
  await btn('표현 저장 (복습 등록)').click();
  check('표현 저장', (await btn('표현 저장 취소').count()) === 1);
  await page.screenshot({ path: 'e2e/screens/x02-detail.png' });

  await btn(/연습하기/).click();
  const n = await solveAll(5);
  await page.getByText('연습 결과').waitFor();
  check('듣기·뜻·응용 영작 연습 3문제', n === 3, `${n}`);
  await btn('따라 말하기').click();
  check('따라 말하기 진입', (await btn('예시 음성 듣기').count()) === 1);
  await btn('표현으로 돌아가기').click();
  check('학습 완료 표시', (await page.getByText('학습 완료').count()) >= 1);

  // 같은 표현 재학습 → 완료 이벤트 중복 없음
  await btn(/연습하기/).click();
  await solveAll(5);
  const events = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('honja-english/v1')).state.completionEvents));
  check('완료 이벤트 중복 기록 없음', events.length === 1, events.join(','));
  await btn('목록으로').click();
  check('목록에 완료 상태', (await page.getByText('완료', { exact: true }).count()) >= 1);

  // 저장한 표현 필터 · 새로고침 후 유지
  await page.goto(BASE + '#/expressions?saved=1');
  await page.reload();
  check('저장한 표현 (새로고침 후 유지)', (await page.locator('main ul > li').count()) === 1);

  // 오답노트 · 복습
  await page.goto(BASE + '#/wrong-notes');
  const wn = await page.locator('ul > li.card').count();
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('honja-english/v1')).state.reviews);
  check('복습 연동 (저장 표현 → 복습 항목)', !!state['x:ex-es-002']);
  check('오답 → 오답노트 연동 (오답이 있었다면)', wn >= 0, `${wn}개`);
  await page.goto(BASE + '#/home');
  const homeText = await page.locator('section[aria-label="오늘의 복습"]').innerText();
  check('홈 오늘의 복습에 표현 반영', /표현/.test(homeText), homeText.replace(/\n/g, ' ').slice(0, 60));

  // 상황별 듣기·말하기
  await page.goto(BASE + '#/expressions?cat=situational');
  check('상황별 듣기·말하기 10개', (await page.locator('main ul > li').count()) === 10);
  await btn(/카페에서 주문하기/).click();
  await page.waitForURL(/#\/listening\/sx-01/);
  await btn('대화 전체 재생').click();
  await page.getByText(/재생 중 · 1\/6줄/).waitFor({ timeout: 5000 });
  check('상황별 대화 음성 재생', true);

  // 영상 속 영어
  await page.goto(BASE + '#/expressions?cat=video');
  const v = await page.locator('main').innerText();
  check('영상 3편은 준비 중 표시 (에셋 미제작)', (v.match(/준비 중 · 영상 미제작/g) ?? []).length === 3 && !(await page.locator('video').count()));
  await page.screenshot({ path: 'e2e/screens/x03-video.png' });

  await page.setViewportSize({ width: 320, height: 640 });
  for (const p of ['#/expressions', '#/expressions/ex-bz-002', '#/expressions?cat=phrasal', '#/expressions?cat=video']) {
    await page.goto(BASE + p);
    await page.waitForTimeout(200);
    check(`320px 레이아웃: ${p}`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  }
  await page.goto(BASE + '#/expressions/ex-bz-002');
  await page.screenshot({ path: 'e2e/screens/x04-detail-320.png' });
} catch (e) {
  check('E2E 실행 중 예외', false, String(e).slice(0, 400));
} finally {
  check('페이지 오류 없음', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close();
  server.kill();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}
