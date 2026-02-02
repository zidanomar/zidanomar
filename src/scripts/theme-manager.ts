export type Theme = 'ayu-dark' | 'ayu-mirage' | 'ayu-light' | 'monokai' | 'dracula' | 'synthwave-84' | 'nord' | 'solarized-dark' | 'github-dark' | 'night-owl' | 'one-dark-pro';

export const THEMES: Theme[] = ['ayu-dark', 'ayu-mirage', 'ayu-light', 'monokai', 'dracula', 'synthwave-84', 'nord', 'solarized-dark', 'github-dark', 'night-owl', 'one-dark-pro'];

export const THEME_LABELS: Record<Theme, string> = {
    'ayu-dark': 'Ayu Dark',
    'ayu-mirage': 'Ayu Mirage',
    'ayu-light': 'Ayu Light',
    'monokai': 'Monokai',
    'dracula': 'Dracula',
    'synthwave-84': "Synthwave '84",
    'nord': 'Nord',
    'solarized-dark': 'Solarized Dark',
    'github-dark': 'GitHub Dark',
    'night-owl': 'Night Owl',
    'one-dark-pro': 'One Dark Pro'
};
const DEFAULT_THEME: Theme = 'synthwave-84';
const STORAGE_KEY = 'theme';

export class ThemeManager {
    private currentTheme: Theme;
    private themeSelect: HTMLSelectElement | null;
    private themeToggle: HTMLButtonElement | null;

    constructor() {
        this.currentTheme = this.loadTheme();
        this.themeSelect = document.getElementById('themeSelect') as HTMLSelectElement;
        this.themeToggle = document.getElementById('themeToggle') as HTMLButtonElement;
        
        this.init();
    }

    private init(): void {
        this.applyTheme(this.currentTheme);
        
        if (this.themeSelect) {
            this.themeSelect.value = this.currentTheme;
            this.themeSelect.addEventListener('change', (e) => this.handleThemeSelect(e));
        }

        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.cycleTheme());
        }

        this.setupKeyboardShortcuts();
    }

    private loadTheme(): Theme {
        const saved = localStorage.getItem(STORAGE_KEY);
        return (saved && THEMES.includes(saved as Theme)) ? saved as Theme : DEFAULT_THEME;
    }

    private saveTheme(theme: Theme): void {
        localStorage.setItem(STORAGE_KEY, theme);
    }

    private applyTheme(theme: Theme): void {
        document.body.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.saveTheme(theme);
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

    private setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.addEventListener('keydown', (e2) => {
                    if (e2.key === 't') {
                        e2.preventDefault();
                        this.cycleTheme();
                    }
                }, { once: true });
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                window.print();
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
