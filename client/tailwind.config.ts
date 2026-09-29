import type { Config } from 'tailwindcss';

// Every color resolves to a CSS variable defined in src/index.css (light + dark).
const v = (name: string) => `var(--${name})`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        page: v('page'),
        surface: v('surface'),
        subtle: v('subtle'),
        row: v('row'),
        line: v('line'),
        'line-input': v('line-input'),
        primary: v('primary'),
        'primary-fg': v('primary-fg'),
        'primary-soft': v('primary-soft'),
        ink: v('ink'),
        'ink-2': v('ink-2'),
        muted: v('muted'),
        danger: v('danger'),
        'danger-soft': v('danger-soft'),
        'danger-line': v('danger-line'),
        stat: {
          today: v('stat-today-bg'),
          'today-fg': v('stat-today-fg'),
          overdue: v('stat-overdue-bg'),
          'overdue-fg': v('stat-overdue-fg'),
          all: v('stat-all-bg'),
          'all-fg': v('stat-all-fg'),
          done: v('stat-done-bg'),
          'done-fg': v('stat-done-fg'),
        },
        prio: {
          high: v('prio-high-bg'),
          'high-fg': v('prio-high-fg'),
          'high-line': v('prio-high-line'),
          medium: v('prio-medium-bg'),
          'medium-fg': v('prio-medium-fg'),
          'medium-line': v('prio-medium-line'),
          low: v('prio-low-bg'),
          'low-fg': v('prio-low-fg'),
          'low-line': v('prio-low-line'),
        },
        cat: {
          work: v('cat-work'),
          personal: v('cat-personal'),
          health: v('cat-health'),
          shopping: v('cat-shopping'),
          other: v('cat-other'),
        },
      },
      borderRadius: { card: '20px', row: '16px', ctl: '12px', fab: '20px' },
      boxShadow: { fab: '0 8px 20px -6px var(--fab-shadow)' },
      fontSize: {
        greeting: ['20px', { lineHeight: '1.2', fontWeight: '800' }],
        'greeting-lg': ['26px', { lineHeight: '1.2', fontWeight: '800' }],
        stat: ['52px', { lineHeight: '1', fontWeight: '900' }],
        'stat-lg': ['68px', { lineHeight: '1', fontWeight: '900' }],
        title: ['15px', { lineHeight: '1.3', fontWeight: '800' }],
        meta: ['12px', { lineHeight: '1.3', fontWeight: '700' }],
        'meta-lg': ['13px', { lineHeight: '1.3', fontWeight: '700' }],
        label: ['12px', { lineHeight: '1', fontWeight: '800', letterSpacing: '1px' }],
      },
      screens: { md: '768px', lg: '1024px' },
    },
  },
  plugins: [],
} satisfies Config;
