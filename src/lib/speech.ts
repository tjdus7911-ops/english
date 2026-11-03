export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined';
}

/** 브라우저 음성 합성으로 영어 발음 재생. 지원하지 않으면 false 반환 */
export function speak(text: string, rate = 0.9): boolean {
  if (!speechSupported()) return false;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate;
    const voice = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith('en'));
    if (voice) u.voice = voice;
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}
