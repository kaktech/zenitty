import { useSyncExternalStore } from 'react';

// laptop (1024-1279) keeps the full sidebar but shows task detail as a modal; desktop (1280+) has three columns.
export type Breakpoint = 'mobile' | 'tablet' | 'laptop' | 'desktop';

const queries = ['(min-width: 768px)', '(min-width: 1024px)', '(min-width: 1280px)'];

function subscribe(cb: () => void) {
  const lists = queries.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener('change', cb));
  return () => lists.forEach((l) => l.removeEventListener('change', cb));
}

function snapshot(): Breakpoint {
  if (window.matchMedia(queries[2]).matches) return 'desktop';
  if (window.matchMedia(queries[1]).matches) return 'laptop';
  if (window.matchMedia(queries[0]).matches) return 'tablet';
  return 'mobile';
}

export const useBreakpoint = () => useSyncExternalStore(subscribe, snapshot, () => 'desktop');
