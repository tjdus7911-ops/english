/** 음성 생성 대상 목록 출력: npx vite-node scripts/audio-manifest.ts > manifest.json */
import { existsSync } from 'node:fs';
import { expressions } from '../src/data/expressions';
import { dialogues } from '../src/data/listening';
import { speakingSentences } from '../src/data/speaking';

const all = [
  ...dialogues.flatMap((d) => d.lines.map((l) => ({ path: l.audio, text: l.en, voice: d.speakers[l.speaker].voice }))),
  ...speakingSentences.map((s, i) => ({ path: s.audio, text: s.en, voice: i % 2 === 0 ? 'female' : 'male' })),
  ...expressions.flatMap((e, i) => [
    { path: e.audio, text: e.en.replace(/,?\s*$/, ''), voice: i % 2 === 0 ? 'female' : 'male' },
    { path: e.dialogue[0].audio, text: e.dialogue[0].en, voice: 'female' },
    { path: e.dialogue[1].audio, text: e.dialogue[1].en, voice: 'male' },
  ]),
];
// --missing: 아직 없는 파일만
const items = process.argv.includes('--missing') ? all.filter((x) => !existsSync(`public/${x.path}`)) : all;
console.log(JSON.stringify(items, null, 1));
