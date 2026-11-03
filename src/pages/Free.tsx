import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Header, ListRow, Page, Segmented, useToast } from '../components/ui';
import { concepts, courseQuestions } from '../data';
import { wordsOfLevel } from '../lib/course';
import { useStore } from '../store/useStore';
import { LEVELS, QUESTION_TYPE_LABEL, type Level, type QuestionType } from '../types';

const TYPES: QuestionType[] = ['mcq', 'blank', 'order', 'translate', 'write', 'error'];
const GOALS = [5, 10, 15, 20];

export default function Free() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const profile = useStore((s) => s.profile);
  const progress = useStore((s) => s.progress);
  const updateProfile = useStore((s) => s.updateProfile);
  const p = params.get('level') as Level | null;
  const level: Level = p && LEVELS.includes(p) ? p : profile.courseLevel;
  const words = wordsOfLevel(level);
  const known = words.filter((w) => progress.wordStatus[w.id] === 'known').length;
  const cs = concepts.filter((c) => c.level === level);

  return (
    <>
      <Header title="자유학습" />
      <Page>
        <p className="text-sm text-ink-sub px-1">원하는 레벨과 학습을 골라 공부해요. 자유학습 결과도 실력분석과 오답노트에 함께 반영돼요.</p>
        <Segmented ariaLabel="자유학습 레벨" value={level} options={LEVELS.map((l) => ({ value: l, label: l }))} onChange={(l) => setParams({ level: l }, { replace: true })} />

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">오늘의 단어</h2>
            <span className="text-sm text-ink-sub">
              {level} 암기 {known}/{words.length}
            </span>
          </div>
          <p className="text-sm text-ink-sub mt-1">아직 외우지 않은 단어부터 하루 목표만큼 보여 줘요.</p>
          <p className="text-sm font-semibold mt-4 mb-2">하루 단어 목표</p>
          <div className="flex gap-2" role="radiogroup" aria-label="하루 단어 목표">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                role="radio"
                aria-checked={profile.dailyWordGoal === g}
                onClick={() => {
                  updateProfile({ dailyWordGoal: g });
                  toast(`하루 단어 목표를 ${g}개로 바꿨어요.`);
                }}
                className={`flex-1 min-h-[44px] rounded-xl border-2 font-semibold text-sm ${profile.dailyWordGoal === g ? 'border-brand bg-brand-soft text-brand-dark' : 'border-line'}`}
              >
                {g}개
              </button>
            ))}
          </div>
          <button type="button" className="btn-primary w-full mt-4" onClick={() => navigate(`/free/word-study?level=${level}`)}>
            단어 학습 시작
          </button>
        </section>

        <section className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => navigate(`/free/listening?level=${level}`)} className="card p-4 text-left active:bg-surface min-h-[104px]">
            <Icon name="headphones" size={22} className="text-brand" />
            <p className="font-semibold mt-2">듣기</p>
            <p className="text-xs text-ink-sub">{level === 'A1' ? '실생활 대화 10편 · 받아쓰기' : '준비 중'}</p>
          </button>
          <button type="button" onClick={() => navigate(`/free/speaking?level=${level}`)} className="card p-4 text-left active:bg-surface min-h-[104px]">
            <Icon name="mic" size={22} className="text-brand" />
            <p className="font-semibold mt-2">말하기</p>
            <p className="text-xs text-ink-sub">{level === 'A1' ? '따라 말하기 30문장' : '준비 중'}</p>
          </button>
        </section>

        <section className="card divide-y divide-line">
          <ListRow icon="bookmark" title={`${level} 단어장`} desc={`${words.length}개 단어 · 뜻·발음·예문`} onClick={() => navigate(`/free/words?level=${level}`)} />
          <ListRow icon="check" title="단어 퀴즈" desc="뜻 고르기 · 단어 고르기 10문제" onClick={() => navigate(`/free/word-quiz?level=${level}`)} />
          <ListRow icon="course" title={`${level} 문법 단원`} desc={`${cs.length}개 개념 · 설명과 연습문제`} onClick={() => navigate(`/free/grammar?level=${level}`)} />
        </section>

        <section className="card p-5">
          <h2 className="font-bold">유형별 문제 풀기</h2>
          <p className="text-sm text-ink-sub mt-1">{level} 문제 중 원하는 유형만 골라 풀어요.</p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {TYPES.map((t) => {
              const n = courseQuestions.filter((q) => q.level === level && q.type === t).length;
              return (
                <button key={t} type="button" disabled={n === 0} onClick={() => navigate(`/practice?level=${level}&type=${t}`)} className="rounded-xl bg-surface px-3 py-3 text-left min-h-[60px] active:bg-line disabled:opacity-40">
                  <span className="block font-semibold text-sm">{QUESTION_TYPE_LABEL[t]}</span>
                  <span className="block text-xs text-ink-sub">{n}문제</span>
                </button>
              );
            })}
          </div>
          <button type="button" className="btn-secondary w-full mt-3" onClick={() => navigate(`/practice?level=${level}`)}>
            <Icon name="refresh" size={18} />
            {level} 전체 섞어 풀기
          </button>
        </section>

        <section className="card divide-y divide-line">
          <ListRow icon="bookmark" title="저장한 단어" desc={`${progress.savedWords.length}개`} onClick={() => navigate('/my/saved-words')} />
          <ListRow icon="note" title="오답노트" onClick={() => navigate('/wrong-notes')} />
        </section>
      </Page>
    </>
  );
}
