import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FILTER_KEYS, parseFilters } from '../lib/filters';

export type View = 'dashboard' | 'all' | 'today' | 'completed';
export type Stat = 'today' | 'overdue' | 'all' | 'done';

/** Which task is open ("new" for the create form) and which sidebar view is active — both live in the URL. */
export function useUrlState() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const set = useCallback(
    (updates: Record<string, string | null>, replace = false, state?: unknown) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(updates)) {
            if (v) next.set(k, v);
            else next.delete(k);
          }
          return next;
        },
        { replace, state },
      );
    },
    [setParams],
  );

  return {
    params,
    set,
    task: params.get('task'),
    stat: params.get('stat') as Stat | null,
    filters: parseFilters(params),
    setFilter: (key: (typeof FILTER_KEYS)[number], value: string | null) =>
      set({ [key]: value && !(key === 'sort' && value === 'dueDate') ? value : null }, true),
    clearFilters: () => set(Object.fromEntries(FILTER_KEYS.map((k) => [k, null])), true),
    view: (params.get('view') as View | null) ?? 'dashboard',
    // Opening from the list pushes one history entry (so mobile Back returns to the list). Switching
    // between tasks, or turning "new" into the saved task, replaces it instead of stacking entries.
    openTask: (id: string) => {
      const switching = !!params.get('task');
      set({ task: id }, switching, switching ? window.history.state?.usr : { fromList: true });
    },
    // Undo that one entry if we pushed it; otherwise (deep link) just drop the param.
    closeTask: () => (window.history.state?.usr?.fromList ? navigate(-1) : set({ task: null }, true)),
    setView: (view: View) => set({ view: view === 'dashboard' ? null : view, stat: null, task: null }, true),
    setStat: (stat: Stat | null) => set({ stat, view: null, task: null }, true),
  };
}
