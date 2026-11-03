/**
 * 마이크 녹음 (MediaRecorder). 녹음 파일은 이 화면의 메모리에만 두고 다시 듣기용으로만 쓴 뒤 버린다.
 * 서버로 보내거나 기기에 저장하지 않는다.
 */
export type MicError = 'denied' | 'no-device' | 'insecure' | 'unsupported' | 'failed';

export const MIC_ERROR: Record<MicError, string> = {
  denied: '마이크 권한이 거부됐어요. 브라우저 설정에서 이 사이트의 마이크를 허용한 뒤 다시 시도해 주세요. 녹음 없이 원어민 음성 듣기는 계속할 수 있어요.',
  'no-device': '사용할 수 있는 마이크가 없어요. 마이크 연결을 확인해 주세요.',
  insecure: '마이크는 보안 연결(HTTPS)에서만 쓸 수 있어요. https:// 주소로 접속해 주세요.',
  unsupported: '이 브라우저는 녹음을 지원하지 않아요. 최신 Chrome·Edge·Safari를 사용해 주세요.',
  failed: '녹음을 시작하지 못했어요. 다른 앱이 마이크를 쓰고 있지 않은지 확인해 주세요.',
};

export function micErrorOf(e: unknown): MicError {
  const name = (e as { name?: string })?.name;
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied';
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'no-device';
  return 'failed';
}

export interface Recording {
  stop: () => Promise<Blob>;
  cancel: () => void;
}

export async function startRecording(): Promise<Recording> {
  if (!window.isSecureContext) throw Object.assign(new Error('insecure'), { mic: 'insecure' as MicError });
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw Object.assign(new Error('unsupported'), { mic: 'unsupported' as MicError });
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (e) {
    throw Object.assign(new Error('mic'), { mic: micErrorOf(e) });
  }
  const rec = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  rec.start();
  const release = () => stream.getTracks().forEach((t) => t.stop());
  return {
    stop: () =>
      new Promise<Blob>((resolve) => {
        rec.onstop = () => {
          release();
          resolve(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
        };
        if (rec.state !== 'inactive') rec.stop();
        else {
          release();
          resolve(new Blob(chunks));
        }
      }),
    cancel: () => {
      try {
        if (rec.state !== 'inactive') rec.stop();
      } finally {
        release();
      }
    },
  };
}
