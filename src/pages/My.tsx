import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, ListRow, Modal, Page, Segmented, useToast } from '../components/ui';
import { POLICY } from '../config/policy';
import { LEVEL_LABEL } from '../data';
import { NOTIF_LABEL, nextFireTime } from '../lib/notifications';
import { useStore } from '../store/useStore';
import { LEVELS, type DailyMinutes, type NotifType } from '../types';

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${on ? 'bg-brand' : 'bg-line'}`}>
      <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

function Row({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div className="px-4 py-3.5 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[15px]">{title}</p>
        {desc && <p className="text-xs text-ink-sub mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

const WORD_GOALS = [3, 5, 8, 10, 12, 15, 20];

export default function My() {
  const navigate = useNavigate();
  const toast = useToast();
  const s = useStore();
  const { profile, notifSettings: ns } = s;
  const [reset, setReset] = useState(false);
  const next = new Date(nextFireTime(ns, Date.now()));

  return (
    <>
      <Header title="MY" />
      <Page>
        <section className="card p-5">
          <p className="text-sm text-ink-sub">현재 학습 레벨</p>
          <p className="text-xl font-bold mt-0.5">{LEVEL_LABEL[profile.courseLevel]}</p>
          <p className="text-xs text-ink-sub mt-1">
            레벨 진단: 어휘 {profile.vocabLevel} · 문법 {profile.grammarLevel}
            {profile.placementDone ? '' : ' (테스트 전)'} · CEFR 레벨은 공인 등급이 아닌 앱 내부 추정 기준이에요.
          </p>
        </section>

        <section className="card divide-y divide-line" aria-label="학습 설정">
          <h2 className="px-4 pt-4 pb-2 font-bold border-none">학습 설정</h2>
          <div className="px-4 py-3.5 space-y-2">
            <p className="font-semibold text-[15px]">학습 레벨</p>
            <Segmented ariaLabel="학습 레벨" value={profile.courseLevel} options={LEVELS.map((l) => ({ value: l, label: l }))} onChange={(l) => (s.updateProfile({ courseLevel: l }), toast(`학습 레벨을 ${l}(으)로 바꿨어요.`))} />
          </div>
          <div className="px-4 py-3.5 space-y-2">
            <p className="font-semibold text-[15px]">하루 학습 시간</p>
            <Segmented<DailyMinutes> ariaLabel="하루 학습 시간" value={profile.dailyMinutes} options={[10, 20, 30].map((m) => ({ value: m as DailyMinutes, label: `${m}분` }))} onChange={(m) => s.updateProfile({ dailyMinutes: m })} />
          </div>
          <Row title="하루 신규 단어 목표" desc="복습 결과에 따른 추천을 무시하고 직접 정할 수 있어요.">
            <select aria-label="하루 신규 단어 목표" value={profile.dailyWordGoal} onChange={(e) => (s.updateProfile({ dailyWordGoal: Number(e.target.value) }), toast('하루 단어 목표를 바꿨어요.'))} className="h-10 rounded-xl border border-line bg-white px-3 text-sm font-semibold">
              {[...new Set([...WORD_GOALS, profile.dailyWordGoal])]
                .sort((a, b) => a - b)
                .map((g) => (
                  <option key={g} value={g}>
                    {g}개
                  </option>
                ))}
            </select>
          </Row>
          <Row title="복습 일정 사용" desc="학습 당일·1·3·7·14·30일 간격으로 복습해요.">
            <Toggle label="복습 일정 사용" on={profile.reviewEnabled} onChange={(v) => s.updateProfile({ reviewEnabled: v })} />
          </Row>
          <Row title="하루 복습량" desc="넘치는 복습은 다음 날로 나눠요.">
            <select aria-label="하루 복습량" value={profile.reviewPerDay} disabled={!profile.reviewEnabled} onChange={(e) => s.updateProfile({ reviewPerDay: Number(e.target.value) })} className="h-10 rounded-xl border border-line bg-white px-3 text-sm font-semibold disabled:opacity-40">
              {POLICY.review.perDayOptions.map((n) => (
                <option key={n} value={n}>
                  {n}개
                </option>
              ))}
            </select>
          </Row>
        </section>

        <section className="card divide-y divide-line" aria-label="알림 설정">
          <h2 className="px-4 pt-4 pb-2 font-bold border-none">알림 설정</h2>
          <Row title="알림 받기" desc="동의한 경우에만 알림을 보여 드려요.">
            <Toggle label="알림 받기" on={ns.enabled} onChange={(v) => (s.updateNotifSettings({ enabled: v }), toast(v ? '알림을 켰어요.' : '알림을 껐어요.'))} />
          </Row>
          <Row title="알림 시간" desc={ns.enabled ? `다음 확인 시각: ${next.getMonth() + 1}/${next.getDate()} ${ns.time}` : undefined}>
            <input type="time" aria-label="알림 시간" value={ns.time} disabled={!ns.enabled} onChange={(e) => e.target.value && s.updateNotifSettings({ time: e.target.value })} className="h-10 rounded-xl border border-line bg-white px-3 text-sm font-semibold disabled:opacity-40" />
          </Row>
          {(Object.keys(NOTIF_LABEL) as NotifType[]).map((t) => (
            <Row key={t} title={NOTIF_LABEL[t].title} desc={NOTIF_LABEL[t].desc}>
              <Toggle label={NOTIF_LABEL[t].title} on={ns.enabled && ns.types[t]} onChange={(v) => ns.enabled && s.updateNotifSettings({ types: { ...ns.types, [t]: v } })} />
            </Row>
          ))}
          <div className="px-4 py-3.5 text-xs text-ink-sub space-y-1">
            <p>
              <b className="text-ink">웹앱(현재)</b>: 앱을 열어 둔 동안 설정 시간 이후 앱 내부 알림함·배너로 알려 드려요. 같은 복습 항목은 같은 날 한 번만 알려요.
            </p>
            <p>
              <b className="text-ink">앱이 닫혀 있을 때의 푸시 알림</b>: 아직 지원하지 않아요. Android 앱 전환 시 기기 로컬 알림으로 제공할 예정이에요.
            </p>
          </div>
        </section>

        <section className="card divide-y divide-line" aria-label="음성 설정">
          <h2 className="px-4 pt-4 pb-2 font-bold border-none">음성 · 마이크</h2>
          <Row title="녹음·음성 인식 사용 동의" desc={s.voiceConsentAt ? '동의함 · 끄면 다음 녹음 때 다시 물어봐요.' : '동의 전에는 마이크를 켜지 않아요.'}>
            <Toggle label="녹음·음성 인식 사용 동의" on={!!s.voiceConsentAt} onChange={(v) => s.setVoiceConsent(v)} />
          </Row>
          <div className="px-4 py-3.5 text-xs text-ink-sub space-y-1">
            <p>· 녹음 파일은 연습 화면에서 다시 듣기용으로만 쓰고 저장·전송하지 않아요.</p>
            <p>· 음성 인식은 브라우저 기능이며, Chrome 등은 음성을 브라우저 회사 서버로 보내 인식할 수 있어요. 앱에는 인식된 텍스트와 비교 결과만 저장돼요.</p>
            <p>· 듣기·예시 음성은 오픈 라이선스 TTS(Piper, LibriTTS 모델 · CC BY 4.0)로 만든 합성 음성이에요.</p>
          </div>
        </section>

        <section className="card divide-y divide-line">
          <ListRow icon="bell" title="알림함" onClick={() => navigate('/notifications')} />
          <ListRow icon="check" title="레벨 테스트 다시 보기" desc="어휘·문법 레벨을 다시 진단해요." onClick={() => navigate('/placement')} />
          <ListRow icon="bookmark" title="저장한 단어" desc={`${s.progress.savedWords.length}개`} onClick={() => navigate('/my/saved-words')} />
          <ListRow icon="note" title="오답노트" onClick={() => navigate('/wrong-notes')} />
          <ListRow icon="settings" title="온보딩 다시 하기" desc="학습 목적·시간을 다시 설정해요." onClick={() => navigate('/onboarding')} />
        </section>

        <section className="card p-4 text-xs text-ink-sub space-y-1.5">
          <p className="font-semibold text-ink text-sm">콘텐츠 안내</p>
          <p>· 단어·문법 설명·문항은 자체 제작했고, 정답·보기·참조 무결성은 자동 테스트로 검증했어요. 교육 전문가의 최종 검수는 아직 받지 않았어요.</p>
          <p>· 한글 발음은 참고용이에요. 실제 영어 발음은 발음기호와 음성으로 확인하세요.</p>
          <p>· 영작은 정답형 채점이에요. 허용 답안 외의 자연스러운 표현이 오답으로 나올 수 있어요. 자유 영작 첨삭은 아직 지원하지 않아요.</p>
          <p>· 듣기(대화 10편)·말하기(30문장)는 A1만 제공해요. 발음 평가와 독해 지문은 준비 중이에요.</p>
        </section>

        <section className="card p-4">
          <p className="font-semibold">학습 기록 저장</p>
          <p className="text-xs text-ink-sub mt-1">회원가입 없이 이 기기의 브라우저에만 저장돼요. 브라우저 데이터를 지우거나 다른 기기에서 열면 기록이 보이지 않아요.</p>
          <button type="button" className="btn-secondary w-full mt-3 !text-bad" onClick={() => setReset(true)}>
            학습 기록 초기화
          </button>
        </section>
        <p className="text-center text-xs text-ink-mute">혼자영어 MVP v0.1</p>
      </Page>

      <Modal
        open={reset}
        title="학습 기록을 모두 지울까요?"
        onClose={() => setReset(false)}
        actions={
          <>
            <button type="button" className="btn-secondary flex-1" onClick={() => setReset(false)}>
              취소
            </button>
            <button
              type="button"
              className="btn-primary flex-1 !bg-bad"
              onClick={() => {
                s.resetAll();
                setReset(false);
                navigate('/onboarding', { replace: true });
              }}
            >
              모두 지우기
            </button>
          </>
        }
      >
        진도, 답안, 오답노트, 복습 일정, 알림, 설정이 모두 삭제되고 되돌릴 수 없어요.
      </Modal>
    </>
  );
}
