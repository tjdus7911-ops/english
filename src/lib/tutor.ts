import { getConcept } from '../data';
import type { GrammarConcept } from '../types';

/**
 * 문법 '질문하기' 계층. 설명 데이터(content/lectures.ts)와 분리되어 있어
 * 추후 AI 튜터 구현체로 교체할 수 있다. 현재는 사전 작성·검수한 설명만 돌려준다.
 */
export type HelpMode = 'easy' | 'detailed' | 'examples' | 'compare' | 'confused';

export interface TutorAnswer {
  mode: HelpMode;
  title: string;
  paragraphs: string[];
  examples?: { en: string; ko: string }[];
  prerequisites?: GrammarConcept[];
  source: 'curated' | 'ai';
}

export interface TutorProvider {
  readonly kind: 'curated' | 'ai';
  explain(conceptId: string, mode: HelpMode): TutorAnswer | null;
}

export const curatedTutor: TutorProvider = {
  kind: 'curated',
  explain(conceptId, mode) {
    const c = getConcept(conceptId);
    if (!c) return null;
    switch (mode) {
      case 'easy':
        return { mode, title: '쉽게 설명하기', paragraphs: c.easy, source: 'curated' };
      case 'detailed':
        return { mode, title: '자세히 설명하기', paragraphs: c.detailed, source: 'curated' };
      case 'examples':
        return { mode, title: '예문 더 보기', paragraphs: [], examples: c.moreExamples, source: 'curated' };
      case 'compare':
        return { mode, title: `비슷한 문법 비교: ${c.compare.title}`, paragraphs: [c.compare.tip], source: 'curated' };
      case 'confused': {
        const pre = c.prerequisites.map((id) => getConcept(id)).filter((x): x is GrammarConcept => !!x);
        return {
          mode,
          title: '아직 이해가 안 돼요',
          paragraphs: [
            '괜찮아요. 한 번에 이해되지 않는 게 정상이에요. 가장 쉬운 설명부터 다시 볼게요.',
            ...c.easy.slice(0, 2),
            c.prereqNote ? `먼저 알아 두면 좋은 것: ${c.prereqNote}` : pre.length ? '아래 선행 개념을 먼저 복습하면 훨씬 쉬워져요.' : '이 개념은 선행 개념이 없어요. 예문을 소리 내어 읽으며 구조를 따라가 보세요.',
          ],
          prerequisites: pre,
          source: 'curated',
        };
      }
    }
  },
};

/** 앱 전역에서 사용하는 튜터 (AI 연결 시 이 값만 교체) */
export const tutor: TutorProvider = curatedTutor;
