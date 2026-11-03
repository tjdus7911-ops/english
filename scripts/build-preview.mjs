/**
 * 미리보기(claude.ai 아티팩트)용 빌드.
 * - 파일 수 제한 때문에 mp3를 약 1.5MB 단위 묶음(audio-packs/pack-N.mp3)으로 합치고 위치 정보를 index.json에 기록
 * - CSS는 페이지에 인라인, 외부 웹폰트 링크는 제거 (허용되지 않는 호스트)
 * 결과: dist-preview/ (index.html = 아티팩트 페이지 본문)
 * 실행: node scripts/build-preview.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = 'dist-preview';
rmSync(OUT, { recursive: true, force: true });
execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--outDir', OUT], { stdio: 'inherit', env: { ...process.env, VITE_AUDIO_PACK: '1' } });

// 1) 음성 묶기
const audioDir = join(OUT, 'audio');
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const mp3s = walk(audioDir).filter((f) => f.endsWith('.mp3')).sort();
const LIMIT = 1.5 * 1024 * 1024;
const packs = [];
const files = {};
let cur = [];
let size = 0;
const flush = () => {
  if (!cur.length) return;
  const name = `pack-${packs.length + 1}.mp3`;
  writeFileSync(join(OUT, 'audio-packs', name), Buffer.concat(cur));
  packs.push(name);
  cur = [];
  size = 0;
};
mkdirSync(join(OUT, 'audio-packs'), { recursive: true });
for (const f of mp3s) {
  const buf = readFileSync(f);
  if (size + buf.length > LIMIT) flush();
  files[relative(OUT, f).split('\\').join('/')] = [packs.length, size, buf.length];
  cur.push(buf);
  size += buf.length;
}
flush();
writeFileSync(join(OUT, 'audio-packs', 'index.json'), JSON.stringify({ packs, files }));
rmSync(audioDir, { recursive: true, force: true });

// 2) 아티팩트 페이지 본문 만들기
const html = readFileSync(join(OUT, 'index.html'), 'utf8');
const cssHref = html.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"/)[1];
const jsSrc = html.match(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"/)[1];
const css = readFileSync(join(OUT, cssHref), 'utf8');
rmSync(join(OUT, cssHref));
const page = `<title>혼자영어</title>
<meta name="theme-color" content="#ffffff">
<style>
:root { color-scheme: light; }
html, body { background: #F6F6F7; }
${css}
</style>
<div id="root"></div>
<script type="module" src="./${jsSrc}"></script>
`;
writeFileSync(join(OUT, 'index.html'), page);

const all = walk(OUT);
const total = all.reduce((s, f) => s + statSync(f).size, 0);
console.log(`preview: ${all.length} files, ${(total / 1024 / 1024).toFixed(1)}MB, packs ${packs.length}, audio ${mp3s.length}`);
console.log(all.map((f) => relative(OUT, f)).join('\n'));
