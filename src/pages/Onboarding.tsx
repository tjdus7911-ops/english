import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProgressBar } from '../components/ui';
import { useStore } from '../store/useStore';
import type { DailyMinutes, Level, StudyGoal } from '../types';

const GOALS: { value: StudyGoal; label: string; desc: string }[] = [
  { value: 'conversation', label: '일상 회화', desc: '자연스럽게 말하고 싶어요' },
  { value: 'travel', label: '여행', desc: '해외에서 불편 없이 지내고 싶어요' },
  { value: 'work', label: '업무', desc: '메일·회의에서 영어를 써요' },
  { value: 'exam', label: '시험 준비', desc: '문법과 어휘를 탄탄히 하고 싶어요' },
  { value: 'hobby', label: '자기계발', desc: '꾸준히 실력을 쌓고 싶어요' },
];

const MINUTES: { value: DailyMinutes; label: string; desc: string }[] = [
  { value: 10, label: '10분', desc: '단어 + 핵심 문법 + 짧은 테스트' },
  { value: 20, label: '20분 (추천)', desc: '복습 → 단어 → 문법 → 영작 → 미니 테스트' },
  { value: 30, label: '30분', desc: '20분 코스 + 단어 퀴즈 + 복습 확대' },
];

const SELF: { value: Level; label: string; desc: string }[] = [
  { value: 'A1', label: 'A1 입문', desc: '간단한 자기소개와 인사 정도 할 수 있어요' },
  { value: 'A2', label: 'A2 초급', desc: '일상적인 짧은 대화는 이해해요' },
  { value: 'B1', label: 'B1 중급 입문', desc: '익숙한 주제로 경험과 의견을 말할 수 있어요' },
  { value: 'B2', label: 'B2 중급', desc: '복잡한 글의 요지를 이해하고 논리적으로 말해요' },
];

function Choice<T>({ items, value, onPick }: { items: { value: T; label: string; desc: string }[]; value: T | null; onPick: (v: T) => void }) {
  return (
    <ul className="space-y-2" role="radiogroup">
      {items.map((it) => {
        const on = it.value === value;
        return (
          <li key={String(it.value)}>
            <button
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onPick(it.value)}
              className={`w-full text-left rounded-2xl border-2 px-4 py-3.5 flex items-center gap-3 min-h-[64px] ${on ? 'border-brand bg-brand-soft' : 'border-line bg-white'}`}
            >
              <span className="flex-1">
                <span className="block font-semibold">{it.label}</span>
                <span className="block text-sm text-ink-sub">{it.desc}</span>
              </span>
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${on ? 'border-brand bg-brand text-white' : 'border-line'}`}>{on && <Icon name="check" size={14} strokeWidth={3} />}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<StudyGoal | null>(profile.goal);
  const [minutes, setMinutes] = useState<DailyMinutes>(profile.dailyMinutes);
  const [self, setSelf] = useState<Level | null>(profile.onboarded ? profile.selfLevel : null);

  const finish = (takeTest: boolean) => {
    const lv = self ?? 'A1';
    completeOnboarding({ goal, dailyMinutes: minutes, selfLevel: lv, ...(takeTest ? {} : { courseLevel: lv, vocabLevel: lv, grammarLevel: lv }) });
    navigate(takeTest ? '/placement' : '/home', { replace: true });
  };

  if (step === 0)
    return (
      <div className="min-h-screen bg-white flex flex-col px-6 pt-16 pb-8 safe-bottom">
        <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center text-xl font-extrabold">En</div>
        <h1 className="text-[26px] font-extrabold leading-snug mt-6">
          혼자 공부해도
          <br />
          다음에 할 공부를 알려주는
          <br />
          <span className="text-brand">혼자영어</span>
        </h1>
        <ul className="mt-8 space-y-4">
          {[
            ['진단 → 추천 커리큘럼', '내 레벨에 맞는 DAY별 학습을 순서대로 안내해요.'],
            ['오답의 이유까지', '틀린 문제는 왜 틀렸는지 설명하고 복습 일정을 만들어요.'],
            ['단어 · 문법 · 영작 연결', '배운 단어를 문법 패턴과 영작으로 바로 써 봐요.'],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="check" size={15} strokeWidth={2.6} />
              </span>
              <span>
                <span className="block font-semibold">{t}</span>
                <span className="block text-sm text-ink-sub">{d}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="flex-1" />
        <p className="text-xs text-ink-sub mb-3 text-center">회원가입 없이 바로 시작해요. 학습 기록은 이 기기의 브라우저에 저장돼요.</p>
        <button type="button" className="btn-primary w-full" onClick={() => setStep(1)}>
          시작하기
        </button>
      </div>
    );

  const titles = ['', '영어를 공부하는 목적은 무엇인가요?', '하루에 얼마나 공부할까요?', '지금 내 영어 실력은 어느 정도인가요?', '레벨 테스트로 시작할 레벨을 정할까요?'];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center h-14 px-2 gap-2">
        <button type="button" onClick={() => setStep(step - 1)} className="w-11 h-11 flex items-center justify-center rounded-full active:bg-surface" aria-label="이전 단계">
          <Icon name="back" size={22} />
        </button>
        <ProgressBar value={step} max={4} className="flex-1 mr-4" label="온보딩 진행률" />
      </div>
      <div className="px-6 pt-4 flex-1 flex flex-col pb-8 safe-bottom">
        <p className="text-sm text-brand font-semibold">{step} / 4</p>
        <h1 className="text-[22px] font-bold mt-1 mb-6">{titles[step]}</h1>

        {step === 1 && <Choice items={GOALS} value={goal} onPick={setGoal} />}
        {step === 2 && (
          <>
            <Choice items={MINUTES} value={minutes} onPick={setMinutes} />
            <p className="text-xs text-ink-sub mt-3">MY &gt; 학습 설정에서 언제든 바꿀 수 있어요.</p>
          </>
        )}
        {step === 3 && <Choice items={SELF} value={self} onPick={setSelf} />}
        {step === 4 && (
          <div className="space-y-3">
            <div className="card p-5 bg-surface border-none">
              <p className="font-semibold">레벨 테스트 · 18문항 · 약 5분</p>
              <p className="text-sm text-ink-sub mt-1">어휘 8, 문법 8, 기초 영작 2문항으로 어휘와 문법 레벨을 따로 진단해요.</p>
            </div>
            <p className="text-sm text-ink-sub">건너뛰면 선택한 레벨({self})로 시작하고, 나중에 MY에서 테스트를 볼 수 있어요.</p>
          </div>
        )}

        <div className="flex-1" />
        {step < 4 ? (
          <button type="button" className="btn-primary w-full mt-6" disabled={(step === 1 && !goal) || (step === 3 && !self)} onClick={() => setStep(step + 1)}>
            다음
          </button>
        ) : (
          <div className="space-y-2 mt-6">
            <button type="button" className="btn-primary w-full" onClick={() => finish(true)}>
              레벨 테스트 시작
            </button>
            <button type="button" className="btn-ghost w-full" onClick={() => finish(false)}>
              건너뛰고 {self}부터 시작
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
