/**
 * 듣기·말하기 E2E (Playwright Chromium, 가짜 마이크 장치).
 * - 음성 재생: 실제 mp3 파일을 디코딩·재생해 다음 줄로 넘어가는지 확인
 * - 녹음: --use-fake-device-for-media-stream 으로 실제 MediaRecorder 녹음 시작·종료
 * - 음성 인식(STT): 헤드리스 Chromium에는 Google 음성 인식 서버 연결이 없으므로 SpeechRecognition을 모의 객체로 대체
 *   (실제 브라우저 STT 품질은 실기기 테스트 필요)
 * 실행: npm run build && node e2e/voice.mjs
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const PORT = 4178;
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

const FAKE_STT = `
  window.__fakeTranscript = "I'm a student";
  class FakeSR {
    constructor(){ this.lang='en-US'; this.onresult=null; this.onerror=null; this.onend=null; }
    start(){ window.__sttStarted = (window.__sttStarted||0)+1; this._t = setTimeout(()=>this._finish(), 1200); }
    _finish(){ const t = window.__fakeTranscript; const alt=[{transcript:t, confidence:0.9}]; alt.isFinal=true; this.onresult && this.onresult({results:[alt]}); this.onend && this.onend(); }
    stop(){ clearTimeout(this._t); this._finish(); this.stop=()=>{}; }
    abort(){ clearTimeout(this._t); this.onend && this.onend(); }
  }
  Object.defineProperty(window, 'webkitSpeechRecognition', { value: FakeSR, configurable: true, writable: true });
  Object.defineProperty(window, 'SpeechRecognition', { value: FakeSR, configurable: true, writable: true });`;
const NO_STT = `delete window.webkitSpeechRecognition; delete window.SpeechRecognition; Object.defineProperty(window,'webkitSpeechRecognition',{value:undefined}); Object.defineProperty(window,'SpeechRecognition',{value:undefined});`;
const DENY_MIC = `navigator.mediaDevices.getUserMedia = () => Promise.reject(Object.assign(new Error('denied'), { name: 'NotAllowedError' }));`;

const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });

async function newPage(init) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, permissions: ['microphone'] });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME|ERR_FAILED|net::/.test(m.text()) && errors.push(m.text()));
  // 온보딩 건너뛰기
  await page.goto(BASE);
  await page.getByRole('button', { name: '시작하기' }).click();
  await page.getByRole('radio', { name: /^일상 회화/ }).click();
  await page.getByRole('button', { name: '다음' }).click();
  await page.getByRole('button', { name: '다음' }).click();
  await page.getByRole('radio', { name: /^A1 입문/ }).click();
  await page.getByRole('button', { name: '다음' }).click();
  await page.getByRole('button', { name: /건너뛰고/ }).click();
  await page.waitForURL(/#\/home/);
  return { ctx, page };
}

async function solveAll(page, limit = 10) {
  let n = 0;
  while (n < limit && (await page.getByRole('button', { name: '정답 확인' }).count()) > 0) {
    const text = page.locator('textarea, input[aria-label="빈칸 답안"]');
    if (await text.count()) await text.first().fill('meet');
    else await page.locator('ul li button[aria-pressed]').first().click();
    await page.getByRole('button', { name: '정답 확인' }).click();
    await page.getByRole('status').first().waitFor();
    await page.locator('button.btn-primary').last().click();
    n++;
  }
  return n;
}

try {
  // ───────── A. 듣기 ─────────
  const { page } = await newPage(FAKE_STT);
  await page.goto(BASE + '#/free/listening?level=A1');
  const count = await page.locator('main ul > li').count();
  check('듣기 목록: A1 대화 10편', count === 10, `${count}편`);
  await page.goto(BASE + '#/free/listening?level=B1');
  check('미제작 레벨은 준비 중 표시', (await page.getByText('B1 듣기는 준비 중이에요').count()) === 1);

  await page.goto(BASE + '#/listening/l-a1-01');
  await page.getByRole('button', { name: '대화 전체 재생' }).click();
  await page.getByText(/재생 중 · 1\/6줄/).waitFor({ timeout: 5000 });
  check('음성 재생 시작', true);
  await page.getByText(/재생 중 · 2\/6줄/).waitFor({ timeout: 8000 });
  check('음성 파일 끝까지 재생 → 다음 줄 자동 재생', true);
  await page.getByRole('button', { name: '일시정지' }).click();
  check('일시정지', (await page.getByText('일시정지됨').count()) === 1);
  await page.getByRole('radio', { name: '0.75x' }).click();
  check('재생 속도 변경 (0.75x)', (await page.getByRole('radio', { name: '0.75x' }).getAttribute('aria-checked')) === 'true');
  await page.getByRole('button', { name: /반복 듣기/ }).click();
  check('반복 듣기 켜기', (await page.getByRole('button', { name: /반복 듣기 켜짐/ }).count()) === 1);
  await page.getByRole('button', { name: '스크립트 숨기기' }).click();
  check('스크립트 숨기기', (await page.getByText("Hi, I'm Jisu. What's your name?").count()) === 0 && (await page.getByText('스크립트 숨김', { exact: false }).count()) === 6);
  await page.getByRole('button', { name: '스크립트 보기' }).click();
  await page.getByRole('button', { name: '해석 보기' }).click();
  check('한국어 해석 표시', (await page.getByText('안녕, 나는 지수야. 너는 이름이 뭐야?').count()) === 1);
  await page.getByRole('button', { name: '3번째 줄 듣기' }).click();
  await page.getByText(/재생 중 · 3\/6줄/).waitFor({ timeout: 5000 });
  check('한 줄만 다시 듣기', true);
  await page.screenshot({ path: 'e2e/screens/v01-listening.png' });

  await page.getByRole('button', { name: /듣기 문제 풀기/ }).click();
  await page.getByRole('button', { name: '대화 듣기' }).first().waitFor();
  check('듣기 문제에 음성 버튼', true);
  const n = await solveAll(page, 5);
  await page.getByText('듣기 결과').waitFor();
  check('듣기 문제 3개 풀이 · 정답/오답 확인', n === 3);
  await page.screenshot({ path: 'e2e/screens/v02-listening-result.png' });

  // 받아쓰기 오답 → 오답노트·복습
  await page.goto(BASE + '#/listening/l-a1-03');
  await page.getByRole('button', { name: /듣기 문제 풀기/ }).click();
  await solveAll(page, 5); // 받아쓰기에 'meet' 입력 → 오답
  await page.goto(BASE + '#/wrong-notes');
  await page.getByRole('tab', { name: '전체' }).click();
  check('듣기 오답노트 연동', (await page.getByText(/듣기/).count()) > 0);
  const hasItem = await page.evaluate(() => !!JSON.parse(localStorage.getItem('honja-english/v1')).state.reviews['l:l-a1-03']);
  await page.goto(BASE + '#/home');
  check('듣기 오답 → 복습(재청취) 항목 등록 · 홈 복습에 표시', hasItem && (await page.getByText('문법·듣기').count()) === 1);

  // 음성 재생 오류 처리
  await page.route('**/l-a1-02-1.mp3', (r) => r.abort());
  await page.goto(BASE + '#/listening/l-a1-02');
  await page.getByRole('button', { name: '대화 전체 재생' }).click();
  await page.getByText('음성 파일을 불러오지 못했어요', { exact: false }).waitFor({ timeout: 5000 });
  check('음성 재생 오류 안내', true);

  // ───────── B. 말하기 (가짜 마이크 + 모의 STT) ─────────
  await page.goto(BASE + '#/speaking?ids=s-a1-01,s-a1-23');
  await page.getByRole('button', { name: '녹음 시작' }).click();
  check('녹음 전 동의 요청 (동의 없으면 마이크 안 켬)', (await page.getByRole('dialog', { name: '마이크 사용 동의' }).count()) === 1 && (await page.evaluate(() => window.__sttStarted ?? 0)) === 0);
  await page.getByRole('button', { name: '동의하고 시작' }).click();
  await page.getByRole('button', { name: '녹음 시작' }).click();
  await page.getByRole('button', { name: '녹음 종료' }).waitFor({ timeout: 5000 });
  check('마이크 권한 요청 → 녹음 시작', true);
  await page.getByText(/인식 일치도 100%/).waitFor({ timeout: 8000 });
  check('음성 인식 → 목표 문장 비교 (일치)', true);
  check('녹음 종료 → 내 녹음 다시 듣기', (await page.locator('audio[controls]').count()) === 1);
  check('발음 점수 아님 안내 · 발음 평가 준비 중 표시', (await page.getByText('발음 정확도 점수가 아니에요', { exact: false }).count()) === 1 && (await page.getByText('발음 평가 · 준비 중').count()) === 1);
  await page.screenshot({ path: 'e2e/screens/v03-speaking-ok.png' });

  await page.getByRole('button', { name: '다음 문장' }).click();
  await page.evaluate(() => (window.__fakeTranscript = 'she study Japanese'));
  await page.getByRole('button', { name: '녹음 시작' }).click();
  await page.getByText(/인식 일치도 \d+%/).waitFor({ timeout: 8000 });
  const cmp = await page.locator('main').innerText();
  check('다르게 인식된 단어 표시', cmp.includes('studies') && cmp.includes('→ study'));
  await page.screenshot({ path: 'e2e/screens/v04-speaking-diff.png' });
  await page.getByRole('button', { name: '다시 말하기' }).click();
  await page.getByText(/인식 일치도/).waitFor({ timeout: 8000 });
  check('다시 말하기', (await page.getByText('이 문장 연습 2회').count()) === 1);

  // 기록 저장 · 재실행 후 유지 · 복습 반영
  await page.reload();
  await page.goto(BASE + '#/free/speaking?level=A1');
  check('말하기 기록 저장 (새로고침 후 유지)', (await page.getByText('인식 100%').count()) >= 1);
  await page.goto(BASE + '#/review');
  check('말하기 누락/다른 단어 → 재연습 복습 등록', (await page.getByText(/따라 말하기 재연습 \d문장/).count()) === 1);
  await page.goto(BASE + '#/free/listening?level=A1');
  check('듣기 학습 기록 유지 (완료 표시)', (await page.getByText(/최근 \d\/3/).count()) >= 2);

  // 커리큘럼 연동
  await page.goto(BASE + '#/course/lesson/a1-u1-d1');
  const intro = await page.locator('main').innerText();
  check('추천 커리큘럼(DAY)에 대화 듣기·따라 말하기 포함', intro.includes('대화 듣기') && intro.includes('따라 말하기'));

  // ───────── C. 마이크 권한 거부 ─────────
  const denied = await newPage(DENY_MIC);
  await denied.page.goto(BASE + '#/speaking?ids=s-a1-02');
  await denied.page.getByRole('button', { name: '녹음 시작' }).click();
  await denied.page.getByRole('button', { name: '동의하고 시작' }).click();
  await denied.page.getByRole('button', { name: '녹음 시작' }).click();
  await denied.page.getByText('마이크 권한이 거부됐어요', { exact: false }).waitFor({ timeout: 5000 });
  check('마이크 권한 거부 처리 (안내 + 앱 정상)', (await denied.page.getByRole('button', { name: '예시 음성 듣기' }).count()) === 1);
  await denied.page.screenshot({ path: 'e2e/screens/v05-mic-denied.png' });

  // ───────── D. 음성 인식 미지원 브라우저 ─────────
  const nostt = await newPage(NO_STT);
  await nostt.page.goto(BASE + '#/speaking?ids=s-a1-03');
  check('STT 미지원 안내', (await nostt.page.getByText('이 브라우저는 음성 인식을 지원하지 않아요', { exact: false }).count()) === 1);
  await nostt.page.getByRole('button', { name: '녹음 시작' }).click();
  await nostt.page.getByRole('button', { name: '동의하고 시작' }).click();
  await nostt.page.getByRole('button', { name: '녹음 시작' }).click();
  await nostt.page.getByRole('button', { name: '녹음 종료' }).waitFor({ timeout: 5000 });
  await nostt.page.waitForTimeout(800);
  await nostt.page.getByRole('button', { name: '녹음 종료' }).click();
  await nostt.page.locator('audio[controls]').waitFor({ timeout: 5000 });
  check('STT 미지원 시 녹음 → 자가 확인', true);

  // 320px
  await page.setViewportSize({ width: 320, height: 640 });
  for (const p of ['#/listening/l-a1-05', '#/speaking?ids=s-a1-25', '#/free/speaking']) {
    await page.goto(BASE + p);
    await page.waitForTimeout(200);
    check(`320px 레이아웃: ${p}`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  }
  await page.goto(BASE + '#/listening/l-a1-05');
  await page.screenshot({ path: 'e2e/screens/v06-listening-320.png' });
} catch (e) {
  check('E2E 실행 중 예외', false, String(e).slice(0, 400));
  for (const pg of browser.contexts().flatMap((c) => c.pages())) await pg.screenshot({ path: `e2e/screens/zz-${Math.random().toString(36).slice(2, 6)}.png` }).catch(() => {});
} finally {
  check('페이지 오류 없음', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close();
  server.kill();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}
