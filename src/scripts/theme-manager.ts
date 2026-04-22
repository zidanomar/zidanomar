export type Theme =
  | 'ayu-dark'
  | 'ayu-mirage'
  | 'ayu-light'
  | 'monokai'
  | 'dracula'
  | 'nord'
  | 'solarized-dark'
  | 'github-dark'
  | 'night-owl'
  | 'one-dark-pro';

export const THEMES: Theme[] = [
  'ayu-dark',
  'ayu-mirage',
  'ayu-light',
  'monokai',
  'dracula',
  'nord',
  'solarized-dark',
  'github-dark',
  'night-owl',
  'one-dark-pro',
];

export const THEME_LABELS: Record<Theme, string> = {
  'ayu-dark': 'Ayu Dark',
  'ayu-mirage': 'Ayu Mirage',
  'ayu-light': 'Ayu Light',
  monokai: 'Monokai',
  dracula: 'Dracula',
  nord: 'Nord',
  'solarized-dark': 'Solarized Dark',
  'github-dark': 'GitHub Dark',
  'night-owl': 'Night Owl',
  'one-dark-pro': 'One Dark Pro',
};
const DEFAULT_THEME: Theme = 'github-dark';
const STORAGE_KEY = 'theme';

export class ThemeManager {
  private currentTheme: Theme;
  private themeSelect: HTMLSelectElement | null;
  private themeToggle: HTMLButtonElement | null;
  private announcer: HTMLElement | null;
  private metaThemeColor: HTMLMetaElement | null;
  private awaitingChord = false;
  private chordTimeout: number | null = null;

  constructor() {
    this.currentTheme = this.loadTheme();
    this.themeSelect = document.getElementById(
      'themeSelect',
    ) as HTMLSelectElement;
    this.themeToggle = document.getElementById(
      'themeToggle',
    ) as HTMLButtonElement;
    this.announcer = document.getElementById('themeAnnouncer');
    this.metaThemeColor = document.getElementById(
      'metaThemeColor',
    ) as HTMLMetaElement | null;

    this.init();
  }

  private init(): void {
    this.applyTheme(this.currentTheme, { announce: false });

    if (this.themeSelect) {
      this.themeSelect.value = this.currentTheme;
      this.themeSelect.addEventListener('change', (e) =>
        this.handleThemeSelect(e),
      );
    }

    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.cycleTheme());
      this.syncToggleLabel();
    }

    this.setupKeyboardShortcuts();
  }

  private loadTheme(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved && THEMES.includes(saved as Theme)
        ? (saved as Theme)
        : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  }

  private saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore (private mode, etc.)
    }
  }

  private applyTheme(theme: Theme, opts: { announce?: boolean } = {}): void {
    document.body.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.saveTheme(theme);
    this.syncMetaThemeColor();
    this.syncToggleLabel();
    if (opts.announce !== false) {
      this.announce(`Theme: ${THEME_LABELS[theme]}`);
    }
  }

  private syncMetaThemeColor(): void {
    if (!this.metaThemeColor) return;
    // Read the resolved background color from the themed body
    const bg = getComputedStyle(document.body)
      .getPropertyValue('--bg-primary')
      .trim();
    if (bg) this.metaThemeColor.setAttribute('content', bg);
  }

  private syncToggleLabel(): void {
    if (!this.themeToggle) return;
    const currentLabel = THEME_LABELS[this.currentTheme];
    const nextIndex = (THEMES.indexOf(this.currentTheme) + 1) % THEMES.length;
    const nextLabel = THEME_LABELS[THEMES[nextIndex]];
    this.themeToggle.setAttribute(
      'aria-label',
      `Current theme: ${currentLabel}. Activate to switch to ${nextLabel}.`,
    );
    this.themeToggle.setAttribute(
      'title',
      `${currentLabel} — click to cycle (Ctrl+K, T)`,
    );
  }

  private announce(message: string): void {
    if (!this.announcer) return;
    // Force re-announcement by clearing first
    this.announcer.textContent = '';
    // Microtask delay lets screen readers pick up the change
    requestAnimationFrame(() => {
      if (this.announcer) this.announcer.textContent = message;
    });
  }

  private handleThemeSelect(e: Event): void {
    const target = e.target as HTMLSelectElement;
    const theme = target.value as Theme;
    this.applyTheme(theme);
  }

  private cycleTheme(): void {
    const currentIndex = THEMES.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const nextTheme = THEMES[nextIndex];

    this.applyTheme(nextTheme);

    if (this.themeSelect) {
      this.themeSelect.value = nextTheme;
    }
  }

  private isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    return (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      target.isContentEditable
    );
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Never intercept keys while the user is typing
      if (this.isTypingTarget(e.target)) return;

      // Ctrl/Cmd + K enters chord mode; the next keypress completes the shortcut.
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.awaitingChord = true;
        if (this.chordTimeout) window.clearTimeout(this.chordTimeout);
        this.chordTimeout = window.setTimeout(() => {
          this.awaitingChord = false;
        }, 1200);
        return;
      }

      if (this.awaitingChord) {
        if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          this.cycleTheme();
        }
        this.awaitingChord = false;
        if (this.chordTimeout) {
          window.clearTimeout(this.chordTimeout);
          this.chordTimeout = null;
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        // Let the browser handle print; we intentionally don't preventDefault
        // so users keep their native print dialog shortcuts. If we wanted to
        // trigger print ourselves we'd do window.print() here, but the default
        // already handles it.
      }
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ThemeManager());
  } else {
    new ThemeManager();
  }
}
