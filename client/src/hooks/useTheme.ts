import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const KEY = 'zenitty-theme';
const listeners = new Set<() => void>();
// The <meta name="theme-color"> tag can't read CSS variables, so these mirror --page in index.css.
const themeColor: Record<Theme, string> = { light: '#E3F1EA', dark: '#0F1A16' };

const current = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

function apply(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor[theme]);
  listeners.forEach((l) => l());
}

function saved(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Until the user picks a theme, keep following the system setting.
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystem = (e: MediaQueryListEvent) => {
    if (!saved()) apply(e.matches ? 'dark' : 'light');
  };
  mql.addEventListener('change', onSystem);
  return () => {
    listeners.delete(cb);
    mql.removeEventListener('change', onSystem);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, current, () => 'light' as Theme);
  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable: the choice just won't persist */
    }
    apply(next);
  };
  return { theme, toggle };
}
