import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { IconButton } from './Button';

/** Icon button for the mobile header. */
export function ThemeIconButton() {
  const { theme, toggle } = useTheme();
  const Icon = theme === 'dark' ? Sun : Moon;
  return (
    <IconButton
      label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className="h-11 w-11 bg-surface"
    >
      <Icon size={20} strokeWidth={2} aria-hidden="true" />
    </IconButton>
  );
}

/** Full-width button pinned to the bottom of the sidebar. */
export function ThemeSidebarButton({ collapsed }: { collapsed: boolean }) {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const Icon = dark ? Sun : Moon;
  const label = dark ? 'Light mode' : 'Dark mode';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={`flex min-h-[44px] items-center gap-3 rounded-ctl border border-line-input bg-subtle text-[15px] font-extrabold text-ink hover:bg-page ${
        collapsed ? 'w-11 justify-center' : 'w-full px-3'
      }`}
    >
      <Icon size={20} strokeWidth={2} aria-hidden="true" />
      {!collapsed && label}
    </button>
  );
}
