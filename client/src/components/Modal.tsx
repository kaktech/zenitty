import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  title: string;
  onClose: () => void;
  /** `center` = dialog, `sheet` = bottom sheet (mobile). */
  variant?: 'center' | 'sheet';
  children: ReactNode;
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Modal({ title, onClose, variant = 'center', children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const el = ref.current!;
    const target = el.querySelector<HTMLElement>('[data-autofocus]') ?? el.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      if (e.key !== 'Tab') return;
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, []);

  const position = variant === 'sheet' ? 'items-end' : 'items-center p-4';
  const shape = variant === 'sheet' ? 'rounded-t-card' : 'rounded-card';

  return createPortal(
    <div className={`fixed inset-0 z-50 flex justify-center ${position}`}>
      <div className="absolute inset-0 animate-fade bg-scrim" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative max-h-[90vh] w-full max-w-md animate-sheet overflow-y-auto bg-surface p-5 text-ink ${shape} ${
          variant === 'sheet' ? 'pb-[max(1.25rem,env(safe-area-inset-bottom))]' : ''
        }`}
      >
        {variant === 'sheet' && (
          <div aria-hidden="true" className="mx-auto -mt-1 mb-4 h-1 w-10 rounded-full bg-line-input" />
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
