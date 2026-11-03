import { useEffect, useRef, useState } from 'react';
import { compareSentence, type CompareResult } from '../lib/voice/compare';
import { PRONUNCIATION_FEATURES, pronunciationAssessor } from '../lib/voice/pronunciation';
import { MIC_ERROR, startRecording, type MicError, type Recording } from '../lib/voice/recorder';
import { recognizeOnce, STT_ERROR, sttSupported } from '../lib/voice/recognition';
import { useStore } from '../store/useStore';
import type { SpeakingSentence } from '../types';
import { AudioButton } from './AudioPlayer';
import { Icon } from './Icon';
import { Modal } from './ui';

const MAX_SEC = 10;

/** 녹음·음성 인식 동의 안내 (처음 한 번, MY에서 철회 가능) */
export function VoiceConsentModal({ open, onClose, onAgree }: { open: boolean; onClose: () => void; onAgree: () => void }) {
  return (
    <Modal
      open={open}
      title="마이크 사용 동의"
      onClose={onClose}
      actions={
        <>
          <button type="button" className="btn-secondary flex-1" onClick={onClose}>
            나중에
          </button>
          <button type="button" className="btn-primary flex-1" onClick={onAgree}>
            동의하고 시작
          </button>
        </>
      }
    >
      <ul className="space-y-1.5 list-disc pl-4">
        <li>녹음 버튼을 누를 때만 마이크를 켜고, 녹음 종료 버튼을 누르거나 {MAX_SEC}초가 지나면 끕니다.</li>
        <li>녹음 파일은 이 화면에서 다시 듣기용으로만 쓰고, 앱 서버로 보내거나 기기에 저장하지 않아요. 화면을 떠나면 사라져요.</li>
        <li>음성 인식은 브라우저 기능을 써요. Chrome 등 일부 브라우저는 인식을 위해 음성을 브라우저 회사 서버(Google 등)로 보낼 수 있어요.</li>
        <li>앱에는 인식된 문장(텍스트)과 비교 결과만 학습 기록으로 저장돼요.</li>
      </ul>
    </Modal>
  );
}

type Phase = 'idle' | 'starting' | 'recording' | 'processing' | 'done';

export function SpeakingPractice({ s, asReview = false, onAttempt }: { s: SpeakingSentence; asReview?: boolean; onAttempt?: (passed: boolean) => void }) {
  const consentAt = useStore((x) => x.voiceConsentAt);
  const setVoiceConsent = useStore((x) => x.setVoiceConsent);
  const recordSpeaking = useStore((x) => x.recordSpeaking);
  const attempts = useStore((x) => x.speakingAttempts.filter((a) => a.sentenceId === s.id).length);

  const [phase, setPhase] = useState<Phase>('idle');
  const [consentOpen, setConsentOpen] = useState(false);
  const [interim, setInterim] = useState('');
  const [recognized, setRecognized] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [sttError, setSttError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [sec, setSec] = useState(0);
  const rec = useRef<Recording | null>(null);
  const stt = useRef<{ stop: () => void } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const hasStt = sttSupported();

  useEffect(
    () => () => {
      rec.current?.cancel();
      stt.current?.stop();
      window.clearInterval(timer.current);
    },
    [],
  );
  useEffect(() => () => void (blobUrl && URL.revokeObjectURL(blobUrl)), [blobUrl]);

  const reset = () => {
    setRecognized(null);
    setResult(null);
    setInterim('');
    setSttError(null);
    setMicError(null);
    setBlobUrl(null);
    setPhase('idle');
  };

  const finish = async () => {
    window.clearInterval(timer.current);
    setPhase('processing');
    stt.current?.stop();
    const blob = rec.current ? await rec.current.stop().catch(() => null) : null;
    rec.current = null;
    if (blob && blob.size > 0) setBlobUrl(URL.createObjectURL(blob));
  };

  const start = async () => {
    if (!consentAt) return setConsentOpen(true);
    reset();
    setPhase('starting');
    // 1) 녹음 (다시 듣기용)
    try {
      rec.current = await startRecording();
    } catch (e) {
      const code = (e as { mic?: MicError }).mic ?? 'failed';
      setMicError(MIC_ERROR[code]);
      if (code === 'denied' || code === 'insecure' || !hasStt) {
        setPhase('idle');
        return;
      }
    }
    // 2) 음성 인식 (지원 브라우저)
    if (hasStt) {
      const r = recognizeOnce(setInterim);
      stt.current = r;
      r.promise
        .then((text) => {
          setRecognized(text);
          const c = compareSentence(s.en, text);
          setResult(c);
          recordSpeaking({ sentenceId: s.id, mode: 'stt', recognized: text, matchRate: c.matchRate, missing: c.missing, extra: c.extra, substituted: c.substituted }, asReview);
          onAttempt?.(c.missing.length === 0 && c.substituted.length === 0);
        })
        .catch((err: Error) => setSttError(STT_ERROR[err.message] ?? `음성 인식 오류 (${err.message})`))
        .finally(() => {
          if (rec.current) void finish();
          setPhase('done');
        });
    }
    setPhase('recording');
    setSec(0);
    const t0 = Date.now();
    timer.current = window.setInterval(() => {
      const el = Math.floor((Date.now() - t0) / 1000);
      setSec(el);
      if (el >= MAX_SEC) void stop();
    }, 250);
  };

  const stop = async () => {
    if (hasStt) {
      stt.current?.stop(); // onend → finally에서 녹음도 종료
      window.clearInterval(timer.current);
      setPhase('processing');
    } else {
      await finish();
      recordSpeaking({ sentenceId: s.id, mode: 'self', recognized: '', matchRate: 0, missing: [], extra: [], substituted: [] }, asReview);
      setPhase('done');
    }
  };

  const passed = result && result.missing.length === 0 && result.substituted.length === 0;

  return (
    <div className="space-y-4">
      <section className="card p-5">
        <p className="en text-[22px] font-bold leading-snug">{s.en}</p>
        <p className="text-sm text-ink-sub mt-1">{s.ko}</p>
        {s.tip && (
          <p className="text-xs text-ink-sub mt-2 flex gap-1">
            <Icon name="bulb" size={14} className="text-brand mt-0.5 shrink-0" />
            {s.tip}
          </p>
        )}
        <div className="mt-4">
          <AudioButton files={[s.audio]} label="예시 음성 듣기" />
        </div>
        <p className="text-[11px] text-ink-mute mt-2">예시 음성은 원어민 녹음이 아닌 합성 음성(TTS)이에요.</p>
      </section>

      <section className="card p-5 space-y-3" aria-live="polite">
        {!hasStt && <p className="text-xs rounded-xl bg-warn-soft text-warn p-3">이 브라우저는 음성 인식을 지원하지 않아요(Chrome·Edge·Safari 권장). 녹음해서 예시 음성과 직접 비교해 보세요.</p>}

        {phase === 'recording' || phase === 'starting' ? (
          <button type="button" onClick={() => void stop()} disabled={phase === 'starting'} className="btn w-full bg-bad text-white" aria-label="녹음 종료">
            <Icon name="stop" size={18} />
            {phase === 'starting' ? '마이크 준비 중…' : `녹음 종료 (${sec}s / ${MAX_SEC}s)`}
          </button>
        ) : (
          <button type="button" onClick={() => void start()} disabled={phase === 'processing'} className="btn-primary w-full" aria-label={phase === 'done' ? '다시 말하기' : '녹음 시작'}>
            <Icon name="mic" size={18} />
            {phase === 'processing' ? '인식 중…' : phase === 'done' ? '다시 말하기' : '녹음 시작 후 따라 말하기'}
          </button>
        )}
        {phase === 'recording' && hasStt && <p className="text-sm text-ink-sub">듣는 중… <span className="en">{interim}</span></p>}
        {micError && <p className="text-sm text-bad" role="alert">{micError}</p>}
        {sttError && <p className="text-sm text-bad" role="alert">{sttError}</p>}

        {result && recognized !== null && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-ink-sub">인식된 문장</p>
              <p className="en font-medium">{recognized || '(인식된 말 없음)'}</p>
            </div>
            <div>
              <p className="text-xs text-ink-sub mb-1">목표 문장과 비교</p>
              <p className="flex flex-wrap gap-1.5">
                {result.tokens.map((t, i) => (
                  <span
                    key={i}
                    className={`en rounded-md px-2 py-0.5 text-sm font-semibold ${t.status === 'ok' ? 'bg-ok-soft text-ok' : t.status === 'missing' ? 'bg-bad-soft text-bad line-through' : 'bg-warn-soft text-warn'}`}
                    title={t.status === 'different' ? `"${t.heard}"(으)로 인식됨` : undefined}
                  >
                    {t.status === 'ok' ? '✓ ' : t.status === 'missing' ? '누락 ' : '≠ '}
                    {t.word}
                    {t.status === 'different' && <span className="font-normal"> → {t.heard}</span>}
                  </span>
                ))}
              </p>
              {result.extra.length > 0 && <p className="text-xs text-ink-sub mt-1">추가로 인식된 단어: {result.extra.join(', ')}</p>}
            </div>
            <div className={`rounded-xl p-3 text-sm ${passed ? 'bg-ok-soft text-ok' : 'bg-warn-soft text-warn'}`}>
              <p className="font-semibold">
                인식 일치도 {result.matchRate}% {passed ? '· 모든 단어가 인식됐어요' : '· 표시된 단어를 다시 연습해 보세요'}
              </p>
              <p className="text-xs mt-0.5 opacity-90">음성 인식 결과와 목표 문장의 단어 일치 비율이에요. 발음 정확도 점수가 아니에요.{!passed ? ' 이 문장은 복습 목록(따라 말하기 재연습)에 등록돼요.' : ''}</p>
            </div>
          </div>
        )}

        {blobUrl && (
          <div>
            <p className="text-xs text-ink-sub mb-1">내 녹음 다시 듣기 (저장되지 않음)</p>
            <audio controls src={blobUrl} className="w-full h-10" />
          </div>
        )}
        <p className="text-[11px] text-ink-mute">이 문장 연습 {attempts}회</p>
      </section>

      {!pronunciationAssessor.available && (
        <section className="card p-4 text-xs text-ink-sub">
          <p className="font-semibold text-ink text-sm">발음 평가 · 준비 중</p>
          <p className="mt-1">{PRONUNCIATION_FEATURES.join(' · ')}는 전용 발음 평가 엔진을 연결한 뒤 제공할 예정이에요.</p>
        </section>
      )}

      <VoiceConsentModal
        open={consentOpen}
        onClose={() => setConsentOpen(false)}
        onAgree={() => {
          setVoiceConsent(true);
          setConsentOpen(false);
        }}
      />
    </div>
  );
}
