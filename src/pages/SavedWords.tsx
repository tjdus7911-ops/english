import { useNavigate } from 'react-router-dom';
import { SpeakButton } from '../components/SpeakButton';
import { EmptyState, Header, Page } from '../components/ui';
import { getWord } from '../data';
import { useStore } from '../store/useStore';

export default function SavedWords() {
  const navigate = useNavigate();
  const saved = useStore((s) => s.progress.savedWords);
  const toggleSaveWord = useStore((s) => s.toggleSaveWord);
  const words = saved.map((id) => getWord(id)).filter((w): w is NonNullable<typeof w> => !!w);

  return (
    <>
      <Header title="저장한 단어" back="/my" sub={`${words.length}개`} />
      <Page>
        {words.length === 0 ? (
          <EmptyState icon="bookmark" title="저장한 단어가 없어요" desc="단어 카드의 북마크 버튼을 누르면 여기에 모여요." action={<button className="btn-secondary" onClick={() => navigate('/free/words')}>단어장 보기</button>} />
        ) : (
          <ul className="card divide-y divide-line">
            {words.map((w) => (
              <li key={w.id} className="flex items-center gap-2 pr-3">
                <button type="button" onClick={() => navigate(`/free/words/${w.id}`)} className="flex-1 min-w-0 text-left px-4 py-3 active:bg-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="en font-semibold">{w.word}</span>
                    <span className="chip bg-surface text-ink-sub">{w.level}</span>
                  </span>
                  <span className="block text-sm text-ink-sub truncate">{w.meaning}</span>
                </button>
                <SpeakButton text={w.word} size="sm" />
                <button type="button" onClick={() => toggleSaveWord(w.id)} className="text-xs text-ink-sub px-2 min-h-[40px]" aria-label={`${w.word} 저장 취소`}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </Page>
    </>
  );
}
