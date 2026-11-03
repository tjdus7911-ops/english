import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import type { Level } from '../types';

/** 히스토리가 있으면 뒤로, 없으면(직접 진입) 상위 화면으로 */
export function useBack(fallback: string) {
  const navigate = useNavigate();
  return useCallback(() => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  }, [navigate, fallback]);
}

export function Header({ title, back, onBack, right, sub }: { title: string; back?: string; onBack?: () => void; right?: ReactNode; sub?: string }) {
  const goBack = useBack(back ?? '/home');
  const showBack = back !== undefined || onBack;
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-line">
      <div className="flex items-center h-14 px-2 gap-1">
        {showBack ? (
          <button type="button" onClick={onBack ?? goBack} className="w-11 h-11 flex items-center justify-center rounded-full active:bg-surface" aria-label="뒤로 가기">
            <Icon name="back" size={22} />
          </button>
        ) : (
          <span className="w-3" />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-[17px] font-bold truncate">{title}</h1>
          {sub && <p className="text-xs text-ink-sub truncate -mt-0.5">{sub}</p>}
        </div>
        {right && <div className="flex items-center pr-1">{right}</div>}
      </div>
    </header>
  );
}

export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`px-4 pt-4 pb-28 space-y-4 ${className}`}>{children}</main>;
}

export function ProgressBar({ value, max = 100, className = '', label }: { value: number; max?: number; className?: string; label?: string }) {
  const p = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`h-2 bg-surface rounded-full overflow-hidden ${className}`} role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${p}%` }} />
    </div>
  );
}

export function LevelBadge({ level, className = '' }: { level: Level; className?: string }) {
  return <span className={`chip bg-brand-soft text-brand-dark ${className}`}>{level}</span>;
}

export function EmptyState({ icon = 'info', title, desc, action }: { icon?: string; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="card p-8 text-center flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-ink-sub">
        <Icon name={icon} size={24} />
      </div>
      <p className="font-semibold mt-1">{title}</p>
      {desc && <p className="text-sm text-ink-sub">{desc}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function Modal({ open, title, children, onClose, actions }: { open: boolean; title: string; children?: ReactNode; onClose: () => void; actions: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-app bg-white rounded-t-3xl sm:rounded-3xl p-6 safe-bottom outline-none" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold">{title}</h2>
        {children && <div className="mt-2 text-sm text-ink-sub">{children}</div>}
        <div className="mt-6 flex gap-2">{actions}</div>
      </div>
    </div>
  );
}

const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div aria-live="polite" className="fixed left-0 right-0 bottom-24 z-50 flex justify-center pointer-events-none px-4">
        {msg && <div className="max-w-app bg-ink text-white text-sm rounded-full px-4 py-2.5 shadow-lg">{msg}</div>}
      </div>
    </ToastCtx.Provider>
  );
}

const NAV = [
  { to: '/home', label: '홈', icon: 'home' },
  { to: '/course', label: '학습코스', icon: 'course' },
  { to: '/free', label: '자유학습', icon: 'free' },
  { to: '/stats', label: '실력분석', icon: 'chart' },
  { to: '/my', label: 'MY', icon: 'user' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-line safe-bottom" aria-label="주요 메뉴">
      <ul className="max-w-app mx-auto grid grid-cols-5">
        {NAV.map((n) => (
          <li key={n.to}>
            <NavLink to={n.to} className={({ isActive }) => `flex flex-col items-center justify-center h-16 gap-0.5 text-[11px] font-semibold ${isActive ? 'text-brand' : 'text-ink-mute'}`}>
              {({ isActive }) => (
                <>
                  <Icon name={n.icon} size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{n.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Segmented<T extends string | number>({ value, options, onChange, ariaLabel }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; ariaLabel: string }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex bg-surface rounded-full p-1 gap-1">
      {options.map((o) => (
        <button
          type="button"
          role="radio"
          aria-checked={o.value === value}
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className={`flex-1 min-h-[40px] rounded-full text-sm font-semibold transition-colors ${o.value === value ? 'bg-white text-ink shadow-sm' : 'text-ink-sub'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ListRow({ title, desc, right, onClick, icon }: { title: ReactNode; desc?: ReactNode; right?: ReactNode; onClick?: () => void; icon?: string }) {
  const inner = (
    <>
      {icon && (
        <span className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-ink shrink-0">
          <Icon name={icon} size={20} />
        </span>
      )}
      <span className="flex-1 min-w-0 text-left">
        <span className="block font-semibold">{title}</span>
        {desc && <span className="block text-sm text-ink-sub mt-0.5">{desc}</span>}
      </span>
      {right ?? (onClick && <Icon name="chevron" size={18} className="text-ink-mute shrink-0" />)}
    </>
  );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[56px] active:bg-surface">
        {inner}
      </button>
    );
  return <div className="w-full flex items-center gap-3 px-4 py-3.5">{inner}</div>;
}

export function Stat({ label, value, unit }: { label: string; value: ReactNode; unit?: string }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs text-ink-sub">{label}</p>
      <p className="text-xl font-bold mt-0.5">
        {value}
        {unit && <span className="text-sm font-semibold text-ink-sub ml-0.5">{unit}</span>}
      </p>
    </div>
  );
}
