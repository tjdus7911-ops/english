/**
 * 발음 평가 확장 인터페이스 (미구현 — 준비 중).
 * 일반 STT 결과만으로는 발음 정확도를 판단할 수 없으므로, 전용 발음 평가 엔진(예: 음소 단위 GOP 기반 서비스)
 * 을 연결할 때 이 인터페이스를 구현한다. 현재 앱은 '인식 일치도'만 보여 주고 발음 점수는 만들지 않는다.
 */
export interface PronunciationAssessment {
  overall?: number;
  words: { word: string; accuracy: number; errorType?: 'mispronunciation' | 'omission' | 'insertion' }[];
  stress?: { word: string; expected: number; detected: number }[];
  intonation?: { score: number; note: string };
  fluency?: { score: number; wordsPerMinute: number; pauses: number };
  feedback: string[];
}

export interface PronunciationAssessor {
  readonly available: boolean;
  readonly features: { wordAccuracy: boolean; stress: boolean; intonation: boolean; fluency: boolean; sentenceFeedback: boolean; aiCoaching: boolean };
  assess(audio: Blob, referenceText: string): Promise<PronunciationAssessment>;
}

export const pronunciationAssessor: PronunciationAssessor = {
  available: false,
  features: { wordAccuracy: false, stress: false, intonation: false, fluency: false, sentenceFeedback: false, aiCoaching: false },
  async assess() {
    throw new Error('발음 평가는 준비 중이에요.');
  },
};

export const PRONUNCIATION_FEATURES = ['단어별 발음 정확도', '강세 평가', '억양 평가', '유창성 평가', '문장별 발음 피드백', 'AI 발음 코칭'];
