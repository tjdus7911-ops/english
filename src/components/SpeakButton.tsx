import { speak, speechSupported } from '../lib/speech';
import { Icon } from './Icon';
import { useToast } from './ui';

export function SpeakButton({ text, label = '발음 듣기', size = 'md' }: { text: string; label?: string; size?: 'sm' | 'md' }) {
  const toast = useToast();
  const onClick = () => {
    if (!speechSupported() || !speak(text)) toast('이 기기·브라우저에서는 발음 듣기를 지원하지 않아요. 발음기호와 한글 발음을 참고하세요.');
  };
  const dim = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  return (
    <button type="button" onClick={onClick} aria-label={`${label}: ${text}`} className={`${dim} shrink-0 rounded-full bg-surface text-ink flex items-center justify-center active:bg-line`}>
      <Icon name="speaker" size={size === 'sm' ? 18 : 20} />
    </button>
  );
}
