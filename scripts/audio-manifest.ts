/** 음성 생성 대상 목록 출력: npx vite-node scripts/audio-manifest.ts > manifest.json */
import { dialogues } from '../src/data/listening';
import { speakingSentences } from '../src/data/speaking';

const items = [
  ...dialogues.flatMap((d) => d.lines.map((l) => ({ path: l.audio, text: l.en, voice: d.speakers[l.speaker].voice }))),
  ...speakingSentences.map((s, i) => ({ path: s.audio, text: s.en, voice: i % 2 === 0 ? 'female' : 'male' })),
];
console.log(JSON.stringify(items, null, 1));
