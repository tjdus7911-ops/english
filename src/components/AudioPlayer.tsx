import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dialogue } from '../types';
import { Icon } from './Icon';
import { useToast } from './ui';
import { prefetchAudio, resolveAudioUrl, syncAudioUrl } from '../lib/audioSource';

const SPEEDS = [0.75, 1, 1.25];

/** 여러 음성 파일을 순서대로 재생하는 훅 (재생·일시정지·반복·속도·오류 처리) */
export function useSequencePlayer(files: string[]) {
  const toast = useToast();
  const audio = useRef<HTMLAudioElement | null>(null);
  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [loop, setLoop] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const state = useRef({ idx: -1, single: false, loop: false, rate: 1 });
  state.current.loop = loop;
  state.current.rate = rate;

  useEffect(() => {
    const a = new Audio();
    a.preload = 'auto';
    audio.current = a;
    return () => {
      a.pause();
      a.src = '';
    };
  }, []);

  const key = files.join('|');
  useEffect(() => {
    prefetchAudio(files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const playAt = useCallback(
    (i: number, single = false) => {
      const a = audio.current;
      if (!a || i < 0 || i >= files.length) return;
      state.current.idx = i;
      state.current.single = single;
      setIdx(i);
      const loadError = () => {
        setPlaying(false);
        setError('음성 파일을 불러오지 못했어요. 네트워크 상태를 확인하고 다시 시도해 주세요.');
        toast('음성을 재생할 수 없어요.');
      };
      const ready = syncAudioUrl(files[i]);
      if (!ready) {
        // 묶음 파일을 아직 받는 중이면 받은 뒤 재생
        resolveAudioUrl(files[i])
          .then(() => state.current.idx === i && playAt(i, single))
          .catch(loadError);
        return;
      }
      a.src = ready;
      a.playbackRate = state.current.rate;
      a.onended = () => {
        const s = state.current;
        if (s.single) {
          setPlaying(false);
          return;
        }
        if (s.idx + 1 < files.length) playAt(s.idx + 1);
        else if (s.loop) playAt(0);
        else {
          setPlaying(false);
          setIdx(-1);
        }
      };
      a.onerror = loadError;
      a.play()
        .then(() => {
          setError(null);
          setPlaying(true);
        })
        .catch((e: unknown) => {
          setPlaying(false);
          const name = (e as { name?: string })?.name;
          if (name === 'AbortError') return;
          if (name === 'NotSupportedError') setError('음성 파일을 불러오지 못했어요. 네트워크 상태를 확인하고 다시 시도해 주세요.');
          else setError('음성을 재생하지 못했어요. 기기의 무음 모드나 볼륨을 확인해 주세요.');
        });
    },
    [files, toast],
  );

  const pause = () => {
    audio.current?.pause();
    setPlaying(false);
  };
  const resume = () => {
    const a = audio.current;
    if (!a || state.current.idx < 0) return playAt(0);
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  const changeRate = (r: number) => {
    setRate(r);
    if (audio.current) audio.current.playbackRate = r;
  };
  return { idx, playing, rate, loop, error, playAt, pause, resume, setLoop, changeRate };
}

/** 문항·문장용 작은 음성 버튼 */
export function AudioButton({ files, label = '음성 듣기' }: { files: string[]; label?: string }) {
  const p = useSequencePlayer(files);
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button type="button" onClick={() => (p.playing ? p.pause() : p.playAt(0))} className="btn-secondary !min-h-[44px] !px-4" aria-label={p.playing ? '일시정지' : label}>
        <Icon name={p.playing ? 'pause' : 'play'} size={16} />
        {p.playing ? '일시정지' : label}
      </button>
      <button type="button" onClick={() => p.changeRate(p.rate === 1 ? 0.75 : 1)} aria-pressed={p.rate !== 1} className={`chip min-h-[36px] px-3 border ${p.rate !== 1 ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-sub'}`}>
        {p.rate === 1 ? '보통 속도' : '0.75배속'}
      </button>
      {p.error && <p className="text-xs text-bad w-full">{p.error}</p>}
    </div>
  );
}

/** 대화 플레이어: 전체/한 줄 재생, 일시정지, 반복, 속도, 스크립트·해석 숨기기 */
export function DialoguePlayer({ d }: { d: Dialogue }) {
  const p = useSequencePlayer(d.lines.map((l) => l.audio));
  const [showScript, setShowScript] = useState(true);
  const [showKo, setShowKo] = useState(false);

  return (
    <section className="card overflow-hidden" aria-label="대화 듣기">
      <div className="p-4 bg-surface border-b border-line space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => (p.playing ? p.pause() : p.idx >= 0 ? p.resume() : p.playAt(0))}
            className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center shrink-0"
            aria-label={p.playing ? '일시정지' : p.idx >= 0 ? '이어서 재생' : '대화 전체 재생'}
          >
            <Icon name={p.playing ? 'pause' : 'play'} size={24} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{p.playing ? `재생 중 · ${p.idx + 1}/${d.lines.length}줄` : p.idx >= 0 ? '일시정지됨' : '대화 전체 듣기'}</p>
            <p className="text-xs text-ink-sub">합성 음성 · 줄을 누르면 그 문장만 다시 들어요</p>
          </div>
          <button type="button" onClick={() => p.playAt(0)} className="w-11 h-11 rounded-full bg-white border border-line flex items-center justify-center" aria-label="처음부터 다시 듣기">
            <Icon name="refresh" size={18} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex bg-white rounded-full p-1 border border-line" role="radiogroup" aria-label="재생 속도">
            {SPEEDS.map((r) => (
              <button key={r} type="button" role="radio" aria-checked={p.rate === r} onClick={() => p.changeRate(r)} className={`px-3 min-h-[32px] rounded-full text-xs font-semibold ${p.rate === r ? 'bg-ink text-white' : 'text-ink-sub'}`}>
                {r}x
              </button>
            ))}
          </div>
          <button type="button" aria-pressed={p.loop} onClick={() => p.setLoop(!p.loop)} className={`chip min-h-[36px] px-3 border ${p.loop ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-sub'}`}>
            <Icon name="refresh" size={12} /> 반복 듣기 {p.loop ? '켜짐' : '꺼짐'}
          </button>
        </div>
        <div className="flex gap-2">
          <button type="button" aria-pressed={showScript} onClick={() => setShowScript(!showScript)} className="btn-secondary !min-h-[40px] flex-1 text-sm">
            스크립트 {showScript ? '숨기기' : '보기'}
          </button>
          <button type="button" aria-pressed={showKo} onClick={() => setShowKo(!showKo)} className="btn-secondary !min-h-[40px] flex-1 text-sm">
            해석 {showKo ? '숨기기' : '보기'}
          </button>
        </div>
        {p.error && <p className="text-sm text-bad">{p.error}</p>}
      </div>
      <ol className="divide-y divide-line" aria-label="대화 스크립트">
        {d.lines.map((l, i) => {
          const active = p.idx === i;
          const sp = d.speakers[l.speaker];
          return (
            <li key={i}>
              <button type="button" onClick={() => p.playAt(i, true)} className={`w-full text-left px-4 py-3 flex gap-3 items-start ${active ? 'bg-brand-soft' : ''}`} aria-current={active ? 'true' : undefined} aria-label={`${i + 1}번째 줄 듣기`}>
                <span className={`w-8 h-8 shrink-0 rounded-full text-xs font-bold flex items-center justify-center ${l.speaker === 'A' ? 'bg-ink text-white' : 'bg-white border border-line'}`}>{sp.name.slice(0, 2)}</span>
                <span className="flex-1 min-w-0">
                  {showScript ? <span className="block en font-medium">{l.en}</span> : <span className="block text-ink-mute text-sm">스크립트 숨김 · 눌러서 이 줄 듣기</span>}
                  {showKo && <span className="block text-sm text-ink-sub mt-0.5">{l.ko}</span>}
                </span>
                <Icon name={active && p.playing ? 'pause' : 'speaker'} size={16} className="text-ink-mute mt-1.5" />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
