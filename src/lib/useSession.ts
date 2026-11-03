import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import type { Level, SessionType } from '../types';

/**
 * 학습 세션 기록 훅. 화면 진입 시 시작하고, 화면을 떠나거나 finish() 호출 시 종료한다.
 * lazy: 첫 답안 기록 시점에 시작 (둘러보기만 하는 화면용)
 * (StrictMode의 가짜 unmount에도 세션이 중복·조기 종료되지 않도록 지연 종료)
 */
export function useLearningSession(type: SessionType, label: string, level?: Level, opts: { lazy?: boolean } = {}) {
  const startSession = useStore((s) => s.startSession);
  const finishSession = useStore((s) => s.finishSession);
  const idRef = useRef<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const getId = useCallback(() => {
    if (!idRef.current) idRef.current = startSession(type, label, level);
    return idRef.current;
  }, [startSession, type, label, level]);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!opts.lazy) getId();
    return () => {
      const id = idRef.current;
      timer.current = window.setTimeout(() => id && finishSession(id), 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getId, finishSession]);

  const finish = useCallback(() => {
    if (idRef.current) finishSession(idRef.current);
  }, [finishSession]);

  return { getId, finish };
}
