import { useNavigate } from 'react-router-dom';
import { EmptyState, Page } from '../components/ui';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Page className="pt-20">
      <EmptyState title="페이지를 찾을 수 없어요" desc="주소가 바뀌었거나 없는 화면이에요." action={<button className="btn-primary" onClick={() => navigate('/', { replace: true })}>홈으로</button>} />
    </Page>
  );
}
