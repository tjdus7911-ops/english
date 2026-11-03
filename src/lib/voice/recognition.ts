/**
 * 브라우저 음성 인식(Web Speech API) 래퍼.
 * - 지원: Chrome·Edge(데스크톱/Android), Safari 14.1+ (webkitSpeechRecognition). Firefox 미지원.
 * - Chrome은 인식을 위해 음성을 Google 서버로 보낼 수 있다 (브라우저 정책). 앱은 음성을 저장·전송하지 않는다.
 * - HTTPS(또는 localhost)에서만 마이크를 쓸 수 있다.
 */
interface SRAlternative { transcript: string; confidence: number }
interface SREvent { results: ArrayLike<ArrayLike<SRAlternative> & { isFinal: boolean }> }
interface SRErrorEvent { error: string }
export interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type Ctor = new () => SpeechRecognitionLike;

export function recognitionCtor(): Ctor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const sttSupported = () => recognitionCtor() !== null;
export const recordingSupported = () => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof window.MediaRecorder !== 'undefined';
export const secureContext = () => typeof window !== 'undefined' && window.isSecureContext;

export const STT_ERROR: Record<string, string> = {
  'not-allowed': '마이크 권한이 거부됐어요. 브라우저 주소창의 권한 설정에서 마이크를 허용해 주세요.',
  'service-not-allowed': '이 브라우저에서 음성 인식 서비스를 사용할 수 없어요.',
  'no-speech': '말소리가 들리지 않았어요. 마이크 가까이에서 다시 말해 보세요.',
  'audio-capture': '마이크를 찾을 수 없어요. 마이크 연결을 확인해 주세요.',
  network: '음성 인식 서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.',
  aborted: '음성 인식이 중단됐어요.',
  'language-not-supported': '이 브라우저는 영어(en-US) 음성 인식을 지원하지 않아요.',
};

/** 한 번 듣고 결과(최상위 후보)를 돌려준다 */
export function recognizeOnce(onInterim?: (t: string) => void): { promise: Promise<string>; stop: () => void } {
  const C = recognitionCtor();
  if (!C) return { promise: Promise.reject(new Error('unsupported')), stop: () => {} };
  const r = new C();
  r.lang = 'en-US';
  r.interimResults = true;
  r.maxAlternatives = 1;
  r.continuous = false;
  let finalText = '';
  let latest = '';
  const promise = new Promise<string>((resolve, reject) => {
    r.onresult = (e) => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText = t;
      }
      latest = t;
      onInterim?.(t);
    };
    r.onerror = (e) => reject(new Error(e.error));
    r.onend = () => resolve((finalText || latest).trim());
  });
  try {
    r.start();
  } catch (e) {
    return { promise: Promise.reject(e), stop: () => {} };
  }
  return { promise, stop: () => r.stop() };
}
