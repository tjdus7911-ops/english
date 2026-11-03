/**
 * 음성 파일 경로 → 재생 URL.
 * - 기본: public/audio/*.mp3 를 그대로 사용
 * - 미리보기 빌드(VITE_AUDIO_PACK=1): 파일 수 제한이 있는 호스팅용으로 mp3를 몇 개의 묶음 파일에 이어 붙이고,
 *   audio-packs/index.json 의 위치 정보로 잘라 blob URL을 만든다.
 */
const PACKED = import.meta.env.VITE_AUDIO_PACK === '1';
const base = import.meta.env.BASE_URL;

type Index = { packs: string[]; files: Record<string, [number, number, number]> };
let indexP: Promise<Index> | null = null;
const packP = new Map<number, Promise<ArrayBuffer>>();
const urls = new Map<string, string>();

function index(): Promise<Index> {
  if (!indexP) indexP = fetch(`${base}audio-packs/index.json`).then((r) => {
    if (!r.ok) throw new Error('audio index');
    return r.json();
  });
  return indexP;
}

function pack(i: number, name: string): Promise<ArrayBuffer> {
  let p = packP.get(i);
  if (!p) {
    p = fetch(`${base}audio-packs/${name}`).then((r) => {
      if (!r.ok) throw new Error('audio pack');
      return r.arrayBuffer();
    });
    p.catch(() => packP.delete(i));
    packP.set(i, p);
  }
  return p;
}

/** 바로 쓸 수 있는 URL이 있으면 반환 (묶음 모드에서 아직 안 받았으면 null) */
export function syncAudioUrl(path: string): string | null {
  if (!PACKED) return `${base}${path}`;
  return urls.get(path) ?? null;
}

export async function resolveAudioUrl(path: string): Promise<string> {
  const s = syncAudioUrl(path);
  if (s) return s;
  const idx = await index();
  const loc = idx.files[path];
  if (!loc) throw new Error(`audio not found: ${path}`);
  const buf = await pack(loc[0], idx.packs[loc[0]]);
  const url = URL.createObjectURL(new Blob([buf.slice(loc[1], loc[1] + loc[2])], { type: 'audio/mpeg' }));
  urls.set(path, url);
  return url;
}

/** 화면에 나올 음성을 미리 준비 (재생 버튼을 누를 때 바로 재생되도록) */
export function prefetchAudio(paths: string[]) {
  if (!PACKED) return;
  paths.forEach((p) => void resolveAudioUrl(p).catch(() => {}));
}
