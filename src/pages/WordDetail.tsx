import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WordCard } from '../components/WordCard';
import { EmptyState, Header, Page } from '../components/ui';
import { getWord, vocabulary } from '../data';
import { useStore } from '../store/useStore';

export default function WordDetail() {
  const { wordId = '' } = useParams();
  const navigate = useNavigate();
  const w = getWord(wordId);
  const markWordsSeen = useStore((s) => s.markWordsSeen);

  useEffect(() => {
    if (w) markWordsSeen([w.id]);
  }, [w, markWordsSeen]);

  if (!w)
    return (
      <>
        <Header title="단어" back="/free" />
        <Page>
          <EmptyState title="단어를 찾을 수 없어요" />
        </Page>
      </>
    );

  const list = vocabulary.filter((x) => x.level === w.level);
  const i = list.findIndex((x) => x.id === w.id);
  const prev = list[i - 1];
  const next = list[i + 1];

  return (
    <>
      <Header title={w.word} back={`/free/words?level=${w.level}`} sub={`${w.level} 단어 ${i + 1}/${list.length}`} />
      <Page>
        <WordCard w={w} />
        <div className="flex gap-2">
          <button type="button" className="btn-secondary flex-1" disabled={!prev} onClick={() => prev && navigate(`/free/words/${prev.id}`, { replace: true })}>
            이전 단어
          </button>
          <button type="button" className="btn-secondary flex-1" disabled={!next} onClick={() => next && navigate(`/free/words/${next.id}`, { replace: true })}>
            다음 단어
          </button>
        </div>
      </Page>
    </>
  );
}
