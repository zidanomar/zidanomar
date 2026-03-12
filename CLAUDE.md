# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:4321)
npm run build     # Build static site to dist/
npm run preview   # Preview production build locally
```

## Architecture

Personal portfolio/resume site built with **Astro 5** as a static site, deployed to GitHub Pages at `https://430am.dev`.

### Data lives in `index.astro`

All content arrays are defined in `src/pages/index.astro` and passed as props to components:

- `experiences` — work history `{ year, company, role, tags[], work[] }`
- `educations` — `{ year, school, major }`
- `contacts` — `{ label, value, href, external? }`

### Component structure

Each section is its own component in `src/components/`:

| Component | Props |
|---|---|
| `SiteHeader.astro` | none |
| `SectionNav.astro` | none |
| `Landing.astro` | `company: string` |
| `ExperienceSection.astro` | `experiences[]`, `educations[]` |
| `ContactSection.astro` | `contacts[]` |
| `Footer.astro` | none (uses `new Date().getFullYear()`) |

### Styles: what goes where

- `src/styles/global.css` — shared cross-component classes: `.section`, `.section-inner`, `.section-heading`, `.tl-reveal` / `.tl-reveal.visible` (JS-toggled scroll reveal), `.dot.active` (JS-toggled nav dot). Any class toggled by JS in `index.astro` must live here, not in a component `<style>` block, because Astro scopes component styles.
- `src/styles/themes.css` — CSS variables for 11 themes. Each theme block defines background, text, accent, and Shiki syntax token colors.
- Component `<style>` blocks — section-specific styles, scoped by Astro automatically.

### Theme system

Themes are applied via `data-theme` on `<body>`. `src/scripts/theme-manager.ts` exports a `ThemeManager` class that reads/writes `localStorage` and cycles themes. Keyboard shortcuts: `Ctrl+K, T` cycles; `Ctrl+P` prints. Default theme: `ayu-mirage`.

Adding a new theme requires entries in both `themes.css` and `theme-manager.ts` (`Theme` type + `THEME_LABELS`).

### Scroll reveal

Elements with `.tl-reveal` start at `opacity: 0; transform: translateY(12px)`. The `IntersectionObserver` in `index.astro`'s `<script>` adds `.visible` when they enter the viewport. The transition is defined in `global.css`.

### Path aliases

```
@components/* → src/components/*
@layouts/*    → src/layouts/*
@scripts/*    → src/scripts/*
@styles/*     → src/styles/*
```

The TS language server may show stale `Cannot find module '@components/...'` errors until `astro dev` or `astro build` regenerates `.astro/types.d.ts`.

### Commit style

Conventional Commits, lowercase, no period at end:

```
feat: add X
fix: correct Y
chore: update Z
```

Types used: `feat`, `fix`, `chore`. Description is a short imperative phrase.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on push to `main`. `public/CNAME` sets the custom domain.
