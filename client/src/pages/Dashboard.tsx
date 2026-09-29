import { Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { DetailPanel } from '../components/DetailPanel';
import { Greeting, Avatar } from '../components/Greeting';
import { Modal } from '../components/Modal';
import { Sidebar } from '../components/Sidebar';
import { StatCards } from '../components/StatCards';
import { TaskList } from '../components/TaskList';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useStats } from '../hooks/useStats';
import { useUrlState } from '../hooks/useUrlState';
import { listQuery, statTitle, viewTitle } from '../lib/views';
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

function MobileHome() {
  const url = useUrlState();
  const title = url.stat ? statTitle[url.stat] : viewTitle[url.view];
  return (
    <div className="min-h-screen bg-page px-5 pb-28 pt-5">
      <header className="flex items-center gap-3">
        <Avatar />
        <div className="flex-1">
          <Greeting short />
        </div>
      </header>

      <div className="mt-5">
        <StatCards active={url.stat} onSelect={url.setStat} />
      </div>

      <section className="mt-6" aria-labelledby="list-title">
        <h2 id="list-title" className="mb-3 text-[18px] font-extrabold text-ink">
          {title}
        </h2>
        <TaskList query={listQuery(url.view, url.stat)} selectedId={null} short onOpen={url.openTask} />
      </section>

      <button
        type="button"
        onClick={() => url.openTask('new')}
        aria-label="Add task"
        className="fixed bottom-6 right-5 flex h-[60px] w-[60px] items-center justify-center rounded-fab bg-primary text-primary-fg shadow-fab"
      >
        <Plus size={28} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}

function WideLayout() {
  const bp = useBreakpoint();
  const url = useUrlState();
  const desktop = bp === 'desktop';
  const { data: stats } = useStats();
  const title = url.stat ? statTitle[url.stat] : viewTitle[url.view];
  const dueToday = stats ? ` · ${stats.today} ${stats.today === 1 ? 'task' : 'tasks'} due today` : '';

  const panel = url.task && (
    <DetailPanel key={url.task} taskId={url.task} onClose={url.closeTask} onSaved={url.openTask} />
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar view={url.view} onView={url.setView} collapsed={!desktop} />

      <main className="min-w-0 flex-1 p-6 lg:p-8">
        <header className="flex flex-wrap items-center gap-4">
          <Avatar />
          <Greeting subtitle={dueToday} />
          <div className="ml-auto flex items-center gap-3">
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
          <h2 id="list-title" className="mb-4 text-[20px] font-extrabold text-ink">
            {title}
          </h2>
          <TaskList query={listQuery(url.view, url.stat)} selectedId={url.task} onOpen={url.openTask} />
        </section>
      </main>

      {desktop ? (
        <aside
          aria-label="Task detail"
          className="sticky top-0 h-screen w-[360px] shrink-0 overflow-y-auto border-l border-line bg-surface p-7"
        >
          {panel || (
            <p className="mt-16 text-center text-meta-lg text-muted">Select a task to see its details.</p>
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
