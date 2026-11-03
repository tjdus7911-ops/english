export const DAY_MS = 24 * 60 * 60 * 1000;

export function uid(prefix = ''): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** 로컬 날짜 키 YYYY-MM-DD */
export function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function endOfDay(ts: number): number {
  return startOfDay(ts) + DAY_MS - 1;
}

/** 시드 기반 셔플 (같은 문항은 같은 순서로 섞여 재렌더링에도 흔들리지 않음) */
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const rand = () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function formatMinutes(sec: number): string {
  const m = Math.round(sec / 60);
  if (m < 60) return `${m}분`;
  return `${Math.floor(m / 60)}시간 ${m % 60}분`;
}

export function pct(n: number, d: number): number {
  return d === 0 ? 0 : Math.round((n / d) * 100);
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
