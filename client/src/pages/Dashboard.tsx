import { MousePointerClick, Plus, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button, IconButton } from '../components/Button';
import { DetailPanel } from '../components/DetailPanel';
import { FilterFields, FilterPopover, SortSelect, StatusChips } from '../components/FilterControls';
import { Avatar, Greeting } from '../components/Greeting';
import { Modal } from '../components/Modal';
import { SearchInput } from '../components/SearchInput';
import { Sidebar } from '../components/Sidebar';
import { StatCards } from '../components/StatCards';
import { ThemeIconButton } from '../components/ThemeToggle';
import { TaskList } from '../components/TaskList';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useStats } from '../hooks/useStats';
import { useUrlState } from '../hooks/useUrlState';
import { hasActiveFilters } from '../lib/filters';
import { fullQuery, statTitle, viewTitle } from '../lib/views';
import { AddTaskPage } from './AddTaskPage';
import { TaskDetailPage } from './TaskDetailPage';

export default function Dashboard() {
  const bp = useBreakpoint();
  const url = useUrlState();

  if (bp === 'mobile') {
    if (url.task === 'new') {
      return <AddTaskPage onBack={url.closeTask} onCreated={() => url.closeTask()} />;
    }
    if (url.task) return <TaskDetailPage id={url.task} onBack={url.closeTask} />;
    return <MobileHome />;
  }
  return <WideLayout />;
}

function useListState() {
  const url = useUrlState();
  const title = url.filters.q
    ? `Results for "${url.filters.q}"`
    : url.stat
      ? statTitle[url.stat]
      : viewTitle[url.view];
  return {
    url,
    title,
    query: fullQuery(url.view, url.stat, url.filters),
    onClearFilters: hasActiveFilters(url.filters) ? url.clearFilters : undefined,
  };
}

function MobileHome() {
  const { url, title, query, onClearFilters } = useListState();
  const [sheet, setSheet] = useState(false);
  const activeCount = Number(!!url.filters.status) + Number(!!url.filters.priority) + Number(!!url.filters.category);

  return (
    <div className="min-h-screen bg-page px-5 pb-28 pt-5">
      <header className="flex items-center gap-3">
        <Avatar />
        <div className="flex-1">
          <Greeting short />
        </div>
        <ThemeIconButton />
      </header>

      <SearchInput className="mt-4" value={url.filters.q} onChange={(v) => url.setFilter('q', v || null)} />

      <div className="mt-5">
        <StatCards active={url.stat} onSelect={url.setStat} />
      </div>

      <section className="mt-6" aria-labelledby="list-title">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="list-title" className="text-[18px] font-extrabold text-ink">
            {title}
          </h2>
          <IconButton
            label={activeCount ? `Filters (${activeCount} active)` : 'Filters'}
            onClick={() => setSheet(true)}
            className="bg-surface"
          >
            <SlidersHorizontal size={18} strokeWidth={2} aria-hidden="true" />
          </IconButton>
        </div>
        <TaskList query={query} selectedId={null} short onOpen={url.openTask} onClearFilters={onClearFilters} />
      </section>

      <button
        type="button"
        onClick={() => url.openTask('new')}
        aria-label="Add task"
        className="fixed bottom-6 right-5 flex h-[60px] w-[60px] items-center justify-center rounded-fab bg-primary text-primary-fg shadow-fab"
      >
        <Plus size={28} strokeWidth={2} aria-hidden="true" />
      </button>

      {sheet && (
        <Modal title="Filters and sort" variant="sheet" onClose={() => setSheet(false)}>
          <h2 className="mb-4 text-[18px] font-extrabold text-ink">Filters and sort</h2>
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-label uppercase text-muted">Status</p>
              <StatusChips filters={url.filters} onChange={url.setFilter} />
            </div>
            <FilterFields filters={url.filters} onChange={url.setFilter} />
            <div>
              <p className="mb-2 text-label uppercase text-muted">Sort</p>
              <SortSelect filters={url.filters} onChange={url.setFilter} />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={url.clearFilters}>
              Reset
            </Button>
            <Button className="flex-1" onClick={() => setSheet(false)}>
              Done
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function WideLayout() {
  const bp = useBreakpoint();
  const { url, title, query, onClearFilters } = useListState();
  const inlinePanel = bp === 'desktop';
  const { data: stats } = useStats();
  const dueToday = stats ? ` · ${stats.today} ${stats.today === 1 ? 'task' : 'tasks'} due today` : '';

  const panel = url.task && (
    <DetailPanel key={url.task} taskId={url.task} onClose={url.closeTask} onSaved={url.openTask} />
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar
        view={url.view}
        onView={url.setView}
        collapsed={bp === 'tablet'}
        category={url.filters.category}
        onCategory={(c) => url.setFilter('category', c)}
      />

      <main className="min-w-0 flex-1 p-6 lg:p-8">
        <header className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Avatar />
          <div className="min-w-[200px] flex-1">
            <Greeting subtitle={dueToday} />
          </div>
          <div className="ml-auto flex items-center gap-3 max-sm:w-full">
            <SearchInput
              className="w-[300px] max-w-full max-sm:flex-1"
              value={url.filters.q}
              onChange={(v) => url.setFilter('q', v || null)}
            />
            <Button onClick={() => url.openTask('new')}>
              <Plus size={20} strokeWidth={2} aria-hidden="true" />
              Add task
            </Button>
          </div>
        </header>

        <div className="mt-6">
          <StatCards active={url.stat} onSelect={url.setStat} />
        </div>

        <section aria-labelledby="list-title" className="mt-6 rounded-card bg-surface p-6">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-3">
            <h2 id="list-title" className="whitespace-nowrap text-[20px] font-extrabold text-ink">
              {title}
            </h2>
            <StatusChips filters={url.filters} onChange={url.setFilter} />
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <FilterPopover
                filters={url.filters}
                onChange={url.setFilter}
                onClear={() => url.set({ priority: null, category: null }, true)}
              />
              <SortSelect filters={url.filters} onChange={url.setFilter} />
            </div>
          </div>
          <TaskList query={query} selectedId={url.task} onOpen={url.openTask} onClearFilters={onClearFilters} />
        </section>
      </main>

      {inlinePanel ? (
        <aside
          aria-label="Task detail"
          className="sticky top-0 h-screen w-[360px] shrink-0 overflow-y-auto border-l border-line bg-surface p-7"
        >
          {panel || (
            <div className="mt-24 flex flex-col items-center gap-3 px-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-subtle text-muted">
                <MousePointerClick size={26} strokeWidth={2} aria-hidden="true" />
              </span>
              <p className="text-title text-ink">No task selected</p>
              <p className="text-meta-lg text-muted">Pick a task from the list to view or edit it.</p>
            </div>
          )}
        </aside>
      ) : (
        url.task && (
          <Modal title="Task detail" onClose={url.closeTask}>
            {panel}
          </Modal>
        )
      )}
    </div>
  );
}
