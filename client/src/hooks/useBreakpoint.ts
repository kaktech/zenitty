import { useSyncExternalStore } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const queries = ['(min-width: 768px)', '(min-width: 1024px)'];

function subscribe(cb: () => void) {
  const lists = queries.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener('change', cb));
  return () => lists.forEach((l) => l.removeEventListener('change', cb));
}

function snapshot(): Breakpoint {
  if (window.matchMedia(queries[1]).matches) return 'desktop';
  if (window.matchMedia(queries[0]).matches) return 'tablet';
  return 'mobile';
}

export const useBreakpoint = () => useSyncExternalStore(subscribe, snapshot, () => 'desktop');
