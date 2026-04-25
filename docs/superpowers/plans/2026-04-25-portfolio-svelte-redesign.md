# Portfolio — Svelte Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Jesse Coble portfolio at `/Users/blackcolours/dev/work/portfolio` from Next.js/React to SvelteKit/Svelte 5 with a "Technical Editorial" design direction, two animated architecture diagrams, two deep-dive technical pages (`/retailready` and `/working-with-ai`), and a typeset résumé section using real content.

**Architecture:** SvelteKit (Node adapter), Svelte 5 with runes (`$state`, `$derived`, `$effect`, `$props`), Tailwind v4 via `@theme` directive, no animation library (uses Svelte built-in `spring()` / `tweened()` / IntersectionObserver). Scaffolded fresh on top of the existing dir; existing Next.js code preserved in `_legacy-next/` until the new build verifies. Two SVG-based animated diagrams (`ArchitectureDiagram.svelte` and `AISystemDiagram.svelte`) drive nodes/dots via `getPointAtLength()` + `requestAnimationFrame`, paused via IntersectionObserver, static fallback for `prefers-reduced-motion`.

**Tech Stack:** SvelteKit (latest), Svelte 5 runes, TypeScript, Tailwind v4, `phosphor-svelte`, `@sveltejs/adapter-node`, Google Fonts (Instrument Serif, Geist Sans, Geist Mono).

**Reference spec:** `/Users/blackcolours/dev/work/portfolio/docs/superpowers/specs/2026-04-25-portfolio-svelte-redesign-design.md`

**Notes for the executor:**

- Svelte 5 is rune-based: `let count = $state(0)` not `let count = 0`. Props are `let { foo, bar }: { foo: string; bar: number } = $props()`. Slots are now `{@render children()}`. Don't use `<slot />` syntax — that's Svelte 4.
- Tailwind v4 reads theme tokens from a `@theme` directive in CSS, not `tailwind.config.js`. `npm install` includes `@tailwindcss/vite` and a Vite plugin in `vite.config.ts`.
- Project is initialized as a public GitHub repo (`coble-portfolio`) in Phase 0 and Phase 10. After every task, run the verification gate (`npm run check && npm run lint && npm run format`) and create a conventional-commit. Skipping commits is not allowed — frequent commits are part of the discipline.
- "Verification" steps run `npm run check` (svelte-check), `npm run lint`, and `npm run format`. The goal is zero TypeScript/Svelte errors and a clean lint after each task.
- The owner's reference EdiPlatform codebase at `/Users/blackcolours/dev/work/EdiPlatform/ediplatform-web/` uses the same SvelteKit/Tailwind v4/Svelte 5 patterns — consult it when uncertain.

---

## Code Conventions (read once, apply throughout)

- **File naming:** Svelte components are `PascalCase.svelte` (`Hero.svelte`); actions and utilities are `camelCase.ts` (`reveal.ts`); route directories are `kebab-case` (`working-with-ai/`).
- **TypeScript:** strict mode; no `any` — prefer `unknown` and narrow at boundaries; explicit return types on exported functions.
- **Svelte 5:** runes only — `$props`, `$state`, `$derived`, `$effect`. No `export let`, no legacy `$:` reactive statements. Use `{@render children()}` for slots, not `<slot />`. Use `{#snippet name()}` to pass content into props that take a snippet.
- **Imports:** use `$lib/...` aliases, never deep relative imports across multiple parent directories. Group order: external packages → `$lib/...` → relative.
- **Tailwind:** prefer design tokens defined in `@theme` (`text-copper`, `bg-paper`) over arbitrary values; use arbitrary values (`text-[var(--color-x)]`) only when no token applies. `prettier-plugin-tailwindcss` orders classes automatically.
- **Comments:** rare. Only when the WHY is non-obvious — a hidden constraint, a workaround, a subtle invariant. Don't narrate WHAT the code does.
- **No `console.log`** in committed code.
- **Commits:** conventional commits format — `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `build:`, `perf:`. One concept per commit. Each commit ends with a `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer (per the writing-plans skill expectation).
- **ESLint + Prettier:** configured in Phase 1, Task 3. Run `npm run lint && npm run format && npm run check` before every commit.

## Subagent Review Workflow (between tasks)

This plan is intended to be executed via `superpowers:subagent-driven-development` — fresh subagent per task, with a code-review pass between tasks. After implementing each task:

1. The implementer (subagent) finishes the steps and runs the verification gate.
2. A separate **code-reviewer** subagent reads the diff and the spec/plan task definition, and reports any issues against the Code Conventions above and the success criteria of the task.
3. Reviewer flags Critical / Important / Cosmetic. Critical and Important findings are fixed inline before moving on. Cosmetic findings are batched and addressed in Phase 9 polish.
4. Only after review passes, the controller moves to the next task.

---

## Phase 0 — Repository Setup

### Task 0: Initialize git repo, write `.gitignore`, first commit

**Files:**

- Create: `/Users/blackcolours/dev/work/portfolio/.gitignore`
- Init: `/Users/blackcolours/dev/work/portfolio/.git/`

- [ ] **Step 1: Initialize git on `main` branch**

```bash
cd /Users/blackcolours/dev/work/portfolio
git init -b main
git status
```

Expected: `On branch main · No commits yet · Untracked files: docs/...`

- [ ] **Step 2: Write `.gitignore`**

Path: `/Users/blackcolours/dev/work/portfolio/.gitignore`

```
# Dependencies
node_modules/

# SvelteKit / Vite build artifacts
.svelte-kit/
build/

# Local / transient
output/
.history/
_legacy-next/
.playwright-cli/
*.log
.DS_Store

# Environment
.env
.env.*
!.env.example

# Editor
.vscode/
.idea/

# Deployment
.vercel/
.netlify/
```

- [ ] **Step 3: Configure local commit identity (only if not set globally)**

```bash
git config --get user.name || git config user.name "Jesse Coble"
git config --get user.email || git config user.email "coble.jesse@gmail.com"
```

Expected: a name and email are now set for this repo.

- [ ] **Step 4: Create the initial commit (spec + plan + gitignore)**

```bash
cd /Users/blackcolours/dev/work/portfolio
git add .gitignore docs/
git commit -m "$(cat <<'EOF'
chore: initialize repo with spec, plan, and gitignore

Capture the brainstorming spec and implementation plan that drive the
SvelteKit rebuild, plus a SvelteKit-friendly gitignore.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git log --oneline
```

Expected: one commit on `main` with the conventional-commit message.

---

## Phase 1 — Foundation

### Task 1: Archive existing Next.js code

**Files:**

- Create: `/Users/blackcolours/dev/work/portfolio/_legacy-next/` (directory)
- Move: existing top-level files into the legacy directory, preserving the originals

- [ ] **Step 1: Create the legacy directory**

```bash
mkdir -p /Users/blackcolours/dev/work/portfolio/_legacy-next
```

- [ ] **Step 2: Move Next.js artifacts into legacy**

Move everything _except_ `node_modules`, `_legacy-next/`, `docs/`, `output/`, and `.history/` (those last three are unrelated to the rebuild).

```bash
cd /Users/blackcolours/dev/work/portfolio
mv src public next-env.d.ts package.json package-lock.json postcss.config.mjs tsconfig.json tsconfig.tsbuildinfo README.md _legacy-next/ 2>/dev/null
mv .next .playwright-cli _legacy-next/ 2>/dev/null
ls -la
```

Expected: top-level dir now contains `_legacy-next/`, `node_modules/` (will be replaced), `docs/`, `output/`, `.history/`, `.gitignore`.

- [ ] **Step 3: Remove the old `node_modules`**

The Next.js dependencies are no longer needed. Removing prevents confusion with the new SvelteKit install.

```bash
cd /Users/blackcolours/dev/work/portfolio
rm -rf node_modules
ls
```

Expected: `_legacy-next/`, `docs/`, `output/`, `.history/`, `.gitignore`.

---

### Task 2: Scaffold SvelteKit project files

**Files:**

- Create: `package.json`
- Create: `svelte.config.js`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/app.html`
- Create: `src/app.d.ts`

We scaffold by hand (not `npm create svelte`) for predictability — interactive prompts are unreliable in agentic sessions.

- [ ] **Step 1: Write `package.json`**

Path: `/Users/blackcolours/dev/work/portfolio/package.json`

```json
{
  "name": "jesse-coble-portfolio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"
  },
  "devDependencies": {
    "@sveltejs/adapter-node": "^5.2.0",
    "@sveltejs/kit": "^2.20.0",
    "@sveltejs/vite-plugin-svelte": "^5.1.0",
    "@tailwindcss/vite": "^4.2.4",
    "@types/node": "^22.0.0",
    "svelte": "^5.20.0",
    "svelte-check": "^4.1.0",
    "tailwindcss": "^4.2.4",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  },
  "dependencies": {
    "phosphor-svelte": "^3.0.0"
  }
}
```

- [ ] **Step 2: Write `svelte.config.js`**

Path: `/Users/blackcolours/dev/work/portfolio/svelte.config.js`

```javascript
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};

export default config;
```

- [ ] **Step 3: Write `vite.config.ts`**

Path: `/Users/blackcolours/dev/work/portfolio/vite.config.ts`

```typescript
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()]
});
```

- [ ] **Step 4: Write `tsconfig.json`**

Path: `/Users/blackcolours/dev/work/portfolio/tsconfig.json`

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

- [ ] **Step 5: Write `src/app.html`**

Path: `/Users/blackcolours/dev/work/portfolio/src/app.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#f4f2eb" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 6: Write `src/app.d.ts`**

Path: `/Users/blackcolours/dev/work/portfolio/src/app.d.ts`

```typescript
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
```

- [ ] **Step 7: Install dependencies**

```bash
cd /Users/blackcolours/dev/work/portfolio
npm install
```

Expected: clean install, no errors. `node_modules/` re-created with SvelteKit packages.

- [ ] **Step 8: Run sveltekit sync to generate `.svelte-kit/`**

```bash
cd /Users/blackcolours/dev/work/portfolio
npx svelte-kit sync
ls .svelte-kit/
```

Expected: `.svelte-kit/tsconfig.json` exists (referenced by our tsconfig).

- [ ] **Step 9: Commit the scaffold**

```bash
cd /Users/blackcolours/dev/work/portfolio
git add package.json package-lock.json svelte.config.js vite.config.ts tsconfig.json src/app.html src/app.d.ts
git commit -m "$(cat <<'EOF'
build: scaffold SvelteKit with Tailwind v4 + Svelte 5

- package.json with adapter-node, svelte 5, tailwind v4
- svelte.config.js, vite.config.ts, tsconfig.json
- src/app.html with Google Fonts preconnect (Instrument Serif, Geist, Geist Mono)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Configure ESLint + Prettier

**Files:**

- Modify: `/Users/blackcolours/dev/work/portfolio/package.json` (add scripts + devDependencies via `npm install`)
- Create: `/Users/blackcolours/dev/work/portfolio/.prettierrc`
- Create: `/Users/blackcolours/dev/work/portfolio/.prettierignore`
- Create: `/Users/blackcolours/dev/work/portfolio/eslint.config.js`

- [ ] **Step 1: Install ESLint + Prettier dev dependencies**

```bash
cd /Users/blackcolours/dev/work/portfolio
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-svelte eslint-config-prettier globals prettier prettier-plugin-svelte prettier-plugin-tailwindcss
```

Expected: clean install. No peer-dep errors. If any peer warnings about Svelte 5 being unsupported by `eslint-plugin-svelte`, the plugin's latest minor handles Svelte 5 — verify with `npm view eslint-plugin-svelte version` (should be 3.x or later).

- [ ] **Step 2: Write `.prettierrc`**

Path: `/Users/blackcolours/dev/work/portfolio/.prettierrc`

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "singleQuote": false,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  "overrides": [
    {
      "files": "*.svelte",
      "options": { "parser": "svelte" }
    }
  ]
}
```

- [ ] **Step 3: Write `.prettierignore`**

Path: `/Users/blackcolours/dev/work/portfolio/.prettierignore`

```
.svelte-kit
build
node_modules
_legacy-next
output
.history
package-lock.json
*.pdf
static/resume.pdf
```

- [ ] **Step 4: Write `eslint.config.js`**

Path: `/Users/blackcolours/dev/work/portfolio/eslint.config.js`

```javascript
import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    }
  },
  {
    ignores: ["build/", ".svelte-kit/", "package/", "_legacy-next/", "output/", ".history/"]
  }
];
```

- [ ] **Step 5: Add lint + format scripts to `package.json`**

Update the `scripts` block in `/Users/blackcolours/dev/work/portfolio/package.json`:

```json
"scripts": {
  "dev": "vite dev",
  "build": "vite build",
  "preview": "vite preview",
  "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
  "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

- [ ] **Step 6: Run lint and format on the existing scaffold to validate config**

```bash
cd /Users/blackcolours/dev/work/portfolio
npm run lint
npm run format
```

Expected: lint exits cleanly (or with only zero-issue runs); format rewrites no significant content. If lint produces errors, they are config-level and must be fixed before continuing.

- [ ] **Step 7: Commit**

```bash
cd /Users/blackcolours/dev/work/portfolio
git add .prettierrc .prettierignore eslint.config.js package.json package-lock.json
git commit -m "$(cat <<'EOF'
chore: configure ESLint + Prettier

ESLint flat config with typescript-eslint + eslint-plugin-svelte + prettier
config. Prettier with svelte and tailwindcss plugins. npm run lint and
npm run format scripts added.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Set up Tailwind v4 with theme tokens and base styles

**Files:**

- Create: `src/app.css`
- Create: `src/routes/+layout.svelte`
- Create: `static/favicon.svg` (placeholder; reuse from legacy if available)

- [ ] **Step 1: Copy favicon from legacy if present**

```bash
mkdir -p /Users/blackcolours/dev/work/portfolio/static
[ -f /Users/blackcolours/dev/work/portfolio/_legacy-next/src/app/icon.svg ] \
  && cp /Users/blackcolours/dev/work/portfolio/_legacy-next/src/app/icon.svg /Users/blackcolours/dev/work/portfolio/static/favicon.svg \
  || echo "no legacy icon — placeholder needed"
```

If no legacy icon, write a minimal placeholder:

```bash
cat > /Users/blackcolours/dev/work/portfolio/static/favicon.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0e0e0b"/><text x="16" y="22" font-family="serif" font-size="18" font-weight="600" fill="#f4f2eb" text-anchor="middle">JC</text></svg>
EOF
```

- [ ] **Step 2: Write `src/app.css` — Tailwind v4 theme + base styles**

Path: `/Users/blackcolours/dev/work/portfolio/src/app.css`

```css
@import "tailwindcss";

@theme {
  --color-paper: #f4f2eb;
  --color-paper-deep: #e8e3d7;
  --color-ink: #0e0e0b;
  --color-charcoal: #1c1c17;
  --color-muted: #6d6a60;
  --color-line: #d6d0c4;
  --color-line-dark: #2a2a23;
  --color-copper: #a26b4f;
  --color-moss: #737d5d;
  --color-signal: #7fb1b2;

  --font-display:
    "Instrument Serif", "Iowan Old Style", "Apple Garamond", Baskerville, "Times New Roman", serif;
  --font-sans: "Geist", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--color-paper);
  scroll-behavior: smooth;
}

body {
  min-height: 100dvh;
  margin: 0;
  background:
    linear-gradient(90deg, rgba(14, 14, 11, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(14, 14, 11, 0.03) 1px, transparent 1px), var(--color-paper);
  background-size:
    88px 88px,
    88px 88px,
    auto;
  color: var(--color-ink);
  font-family: var(--font-sans);
  letter-spacing: 0;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
}

body::after {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  content: "";
  opacity: 0.18;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.84' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.32'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

::selection {
  background: rgba(115, 125, 93, 0.28);
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

video {
  display: block;
}

@keyframes marquee {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 3: Write `src/routes/+layout.svelte`**

Path: `/Users/blackcolours/dev/work/portfolio/src/routes/+layout.svelte`

```svelte
<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<a
  class="focus:bg-ink focus:text-paper sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:px-3 focus:py-2"
  href="#main">Skip to content</a
>
<div id="top">
  {@render children()}
</div>
```

- [ ] **Step 4: Write a temporary `src/routes/+page.svelte` to verify scaffold**

Path: `/Users/blackcolours/dev/work/portfolio/src/routes/+page.svelte`

```svelte
<main id="main" class="min-h-dvh px-8 py-16">
  <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Scaffold check</p>
  <h1 class="mt-4 font-[family-name:var(--font-display)] text-7xl leading-[0.92] tracking-tight">
    Portfolio is alive.
  </h1>
  <p class="text-muted mt-6 max-w-prose text-lg leading-8">
    Tailwind theme tokens, fonts, and SvelteKit routing all wired up. Ready to build sections.
  </p>
</main>
```

- [ ] **Step 5: Run dev server and verify**

```bash
cd /Users/blackcolours/dev/work/portfolio
npm run dev
```

Open http://localhost:5173. Expected: cream background, the headline rendered in a serif font, mono eyebrow text in copper. No console errors. Stop the dev server with Ctrl-C.

- [ ] **Step 6: Run typecheck**

```bash
cd /Users/blackcolours/dev/work/portfolio
npm run check
```

Expected: `0 errors and 0 warnings`. If errors, fix before continuing.

---

## Phase 2 — Shared Primitives & Actions

### Task 5: Build the `reveal` action

**Files:**

- Create: `src/lib/actions/reveal.ts`

The `reveal` action attaches an IntersectionObserver to an element and toggles a CSS class when it enters the viewport. The CSS does the actual animation; the action just triggers the state change.

- [ ] **Step 1: Write `src/lib/actions/reveal.ts`**

```typescript
type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  delay?: number; // ms
  once?: boolean;
};

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
  const { threshold = 0.18, rootMargin = "-10% 0px -22% 0px", delay = 0, once = true } = options;

  // Initial state
  node.dataset.revealState = "hidden";

  // Honor reduced motion — show immediately
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    node.dataset.revealState = "shown";
    return { destroy() {} };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (delay > 0) {
            window.setTimeout(() => {
              node.dataset.revealState = "shown";
            }, delay);
          } else {
            node.dataset.revealState = "shown";
          }
          if (once) observer.unobserve(node);
        } else if (!once) {
          node.dataset.revealState = "hidden";
        }
      }
    },
    { threshold, rootMargin }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
```

- [ ] **Step 2: Add reveal CSS to `src/app.css`**

Append the following to `src/app.css`:

```css
[data-reveal-state="hidden"] {
  opacity: 0;
  transform: translateY(24px);
  filter: blur(8px);
  transition:
    opacity 700ms cubic-bezier(0.18, 0.7, 0.22, 1),
    transform 700ms cubic-bezier(0.18, 0.7, 0.22, 1),
    filter 700ms cubic-bezier(0.18, 0.7, 0.22, 1);
}

[data-reveal-state="shown"] {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal-state="hidden"],
  [data-reveal-state="shown"] {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}
```

- [ ] **Step 3: Verify**

```bash
cd /Users/blackcolours/dev/work/portfolio
npm run check
```

Expected: 0 errors.

---

### Task 6: Build the `magnetic` action

**Files:**

- Create: `src/lib/actions/magnetic.ts`

Mouse-tracking translate via Svelte's `spring` from `svelte/motion`. Used by anchor buttons.

- [ ] **Step 1: Write `src/lib/actions/magnetic.ts`**

```typescript
import { Spring } from "svelte/motion";

type MagneticOptions = {
  travel?: number; // 0-1, multiplier on (mouseDelta * travel)
};

export function magnetic(node: HTMLElement, options: MagneticOptions = {}) {
  const travel = options.travel ?? 0.16;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) return { destroy() {} };

  const x = new Spring(0, { stiffness: 0.18, damping: 0.62 });
  const y = new Spring(0, { stiffness: 0.18, damping: 0.62 });

  const apply = () => {
    node.style.transform = `translate3d(${x.current}px, ${y.current}px, 0)`;
  };

  const unsubX = x.subscribe(apply);
  const unsubY = y.subscribe(apply);

  function onMove(event: MouseEvent) {
    const rect = node.getBoundingClientRect();
    const dx = (event.clientX - rect.left - rect.width / 2) * travel;
    const dy = (event.clientY - rect.top - rect.height / 2) * travel;
    x.target = dx;
    y.target = dy;
  }

  function onLeave() {
    x.target = 0;
    y.target = 0;
  }

  node.addEventListener("mousemove", onMove);
  node.addEventListener("mouseleave", onLeave);

  return {
    destroy() {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
      unsubX();
      unsubY();
    }
  };
}
```

> **Note on Svelte 5 motion:** Svelte 5 uses `Spring` and `Tween` classes from `svelte/motion`. The legacy `spring()` / `tweened()` factory functions still work but the class form is preferred. If TypeScript complains about `Spring` not having a `subscribe` method, use `$effect` in a wrapping component instead (we won't need this here since the action lives in a `.ts` file outside Svelte component context).

- [ ] **Step 2: Verify typecheck**

```bash
cd /Users/blackcolours/dev/work/portfolio
npm run check
```

Expected: 0 errors. If `Spring` has API differences in your installed version, consult `node_modules/svelte/types/index.d.ts` for the actual exports.

---

### Task 7: Build the `scrubVideo` action

**Files:**

- Create: `src/lib/actions/scrubVideo.ts`

Drives `video.currentTime` from a scroll progress value. Computed externally (in the Hero component) and passed in via the `progress` parameter (0-1).

- [ ] **Step 1: Write `src/lib/actions/scrubVideo.ts`**

```typescript
type ScrubOptions = {
  exitLeadSeconds?: number; // hold these many seconds before end as the "release" zone
};

export function scrubVideo(
  video: HTMLVideoElement,
  initial: { progress: number; options?: ScrubOptions }
) {
  const opts = { exitLeadSeconds: 2, ...initial.options };
  let current = initial.progress;

  function sync() {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    video.pause();
    video.muted = true;

    const clamped = Math.min(1, Math.max(0, current));
    const exitStart = Math.max(
      0.01,
      Math.min(0.98, (video.duration - opts.exitLeadSeconds) / video.duration)
    );
    const target =
      clamped <= 0.002
        ? 0.01
        : Math.min(
            video.duration - 0.02,
            video.duration * clamped * exitStart +
              (clamped > exitStart ? (clamped - exitStart) * (1 - exitStart) : 0)
          );

    if (Math.abs(video.currentTime - target) > 0.015) {
      video.currentTime = target;
    }
  }

  function markReady() {
    video.muted = true;
    video.pause();
    video.currentTime = 0.01;
    sync();
  }

  if (video.readyState >= 1) markReady();
  video.addEventListener("loadedmetadata", markReady);
  video.addEventListener("canplay", markReady);

  return {
    update({ progress }: { progress: number; options?: ScrubOptions }) {
      current = progress;
      sync();
    },
    destroy() {
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("canplay", markReady);
    }
  };
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 8: Build `Reveal.svelte` wrapper component

**Files:**

- Create: `src/lib/components/shared/Reveal.svelte`

A thin wrapper that applies the `reveal` action and supports `as` polymorphism. Most sections render their own elements via `{@render children()}`; this is for cases where we want a quick reveal-styled wrapper with stagger control.

- [ ] **Step 1: Write `Reveal.svelte`**

```svelte
<script lang="ts">
  import { reveal } from "$lib/actions/reveal";

  let {
    delay = 0,
    threshold = 0.18,
    children,
    class: className = ""
  }: {
    delay?: number;
    threshold?: number;
    children: import("svelte").Snippet;
    class?: string;
  } = $props();
</script>

<div class={className} use:reveal={{ delay, threshold }}>
  {@render children()}
</div>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 9: Build `StickyPanel.svelte`

**Files:**

- Create: `src/lib/components/shared/StickyPanel.svelte`

Wraps a tall scroll region whose contents stick to the viewport for a configurable height. Used for the section-to-section panel transitions.

- [ ] **Step 1: Write `StickyPanel.svelte`**

```svelte
<script lang="ts">
  let {
    heightClass = "h-[290dvh]",
    surfaceClass = "rounded-t-3xl bg-paper shadow-[0_-28px_70px_-38px_rgba(0,0,0,0.55)]",
    children
  }: {
    heightClass?: string;
    surfaceClass?: string;
    children: import("svelte").Snippet;
  } = $props();
</script>

<div class="relative {heightClass}">
  <div class="sticky top-0 h-dvh w-full overflow-hidden {surfaceClass}">
    {@render children()}
  </div>
</div>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 10: Build `MagneticAnchor.svelte`

**Files:**

- Create: `src/lib/components/shared/MagneticAnchor.svelte`

CTA anchor with magnetic mouse-following. Two tones: `dark` (paper-on-charcoal, primary) and `light` (translucent, secondary).

- [ ] **Step 1: Write `MagneticAnchor.svelte`**

```svelte
<script lang="ts">
  import { magnetic } from "$lib/actions/magnetic";

  let {
    href,
    tone = "dark",
    children,
    class: className = ""
  }: {
    href: string;
    tone?: "dark" | "light";
    children: import("svelte").Snippet;
    class?: string;
  } = $props();

  const baseClass =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition active:translate-y-px will-change-transform";
  const toneClass =
    tone === "dark"
      ? "bg-paper text-charcoal shadow-[0_20px_50px_-34px_rgba(0,0,0,0.75)] hover:bg-[color-mix(in_oklab,var(--color-paper)_92%,white)]"
      : "border border-white/16 bg-[rgba(244,242,235,0.1)] text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.13)] backdrop-blur-lg hover:bg-[rgba(244,242,235,0.18)]";
</script>

<a class="{baseClass} {toneClass} {className}" {href} use:magnetic={{ travel: 0.16 }}>
  {@render children()}
</a>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

## Phase 3 — Visual Building Blocks

### Task 11: Build `StatsGrid.svelte`

**Files:**

- Create: `src/lib/components/shared/StatsGrid.svelte`

Renders a grid of big mono numbers + small mono labels. Used in RetailReady and AI Engineering sections. Supports light and dark surface variants.

- [ ] **Step 1: Write `StatsGrid.svelte`**

```svelte
<script lang="ts">
  type Stat = { value: string; label: string };

  let {
    stats,
    tone = "light"
  }: {
    stats: Stat[];
    tone?: "light" | "dark";
  } = $props();

  const numberClass = tone === "light" ? "text-ink" : "text-paper";
  const labelClass = tone === "light" ? "text-muted" : "text-[rgba(244,242,235,0.62)]";
  const dividerClass = tone === "light" ? "border-line" : "border-line-dark";
</script>

<div class="grid grid-cols-2 gap-px md:grid-cols-4 [&>*]:bg-transparent">
  {#each stats as stat (stat.label)}
    <div
      class="border-r border-b {dividerClass} px-4 py-6 last:border-r-0 odd:border-r md:px-6 md:py-7 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r md:[&:nth-child(4n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-last-child(-n+4)]:border-b-0"
    >
      <p class="font-mono text-3xl leading-none font-medium md:text-5xl {numberClass}">
        {stat.value}
      </p>
      <p class="mt-3 font-mono text-xs tracking-[0.16em] uppercase {labelClass}">
        {stat.label}
      </p>
    </div>
  {/each}
</div>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 12: Build `TechStackGrid.svelte`

**Files:**

- Create: `src/lib/components/shared/TechStackGrid.svelte`

Spec-sheet style grid of stack categories with mono labels.

- [ ] **Step 1: Write `TechStackGrid.svelte`**

```svelte
<script lang="ts">
  type StackRow = { category: string; items: string[] };

  let {
    rows,
    tone = "dark"
  }: {
    rows: StackRow[];
    tone?: "light" | "dark";
  } = $props();

  const labelClass = tone === "dark" ? "text-[rgba(244,242,235,0.62)]" : "text-muted";
  const valueClass = tone === "dark" ? "text-paper" : "text-ink";
  const lineClass = tone === "dark" ? "border-line-dark" : "border-line";
</script>

<dl class="border-y {lineClass}">
  {#each rows as row (row.category)}
    <div
      class="grid grid-cols-1 gap-2 border-b {lineClass} py-5 last:border-b-0 md:grid-cols-[12rem_1fr] md:gap-8 md:py-6"
    >
      <dt class="font-mono text-xs tracking-[0.18em] uppercase {labelClass}">{row.category}</dt>
      <dd class="font-mono text-sm leading-7 {valueClass}">
        {row.items.join(" · ")}
      </dd>
    </div>
  {/each}
</dl>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 13: Build `JourneyRail.svelte`

**Files:**

- Create: `src/lib/components/shared/JourneyRail.svelte`

Horizontal stage rail (Sandbox → Preflight → Certification → Go-Live → Production). Mono labels + connecting dashes. Wraps to vertical on mobile.

- [ ] **Step 1: Write `JourneyRail.svelte`**

```svelte
<script lang="ts">
  type Stage = { name: string; description: string };

  let { stages }: { stages: Stage[] } = $props();
</script>

<ol class="grid grid-cols-1 gap-3 md:grid-cols-{stages.length} md:gap-0">
  {#each stages as stage, index (stage.name)}
    <li
      class="border-line relative grid gap-2 border bg-[rgba(255,255,255,0.32)] p-5 md:rounded-none md:border-r-0 md:first:rounded-l-lg md:last:rounded-r-lg md:last:border-r"
    >
      <span class="text-copper font-mono text-xs tracking-[0.18em] uppercase">
        Stage {String(index + 1).padStart(2, "0")}
      </span>
      <h3
        class="text-ink font-[family-name:var(--font-display)] text-3xl leading-none tracking-tight"
      >
        {stage.name}
      </h3>
      <p class="text-muted text-sm leading-6">
        {stage.description}
      </p>
    </li>
  {/each}
</ol>
```

> **Implementation note:** The dynamic `md:grid-cols-{stages.length}` won't work with Tailwind's static analysis. Replace with explicit class based on stages.length:
>
> ```svelte
> <ol class="grid grid-cols-1 gap-3 md:gap-0 {stages.length === 5 ? 'md:grid-cols-5' : stages.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}">
> ```

- [ ] **Step 2: Apply the fix from the implementation note**

- [ ] **Step 3: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 14: Build `DocTypesTable.svelte`

**Files:**

- Create: `src/lib/components/shared/DocTypesTable.svelte`

Two-column table of EDI document types: X12 on the left, EDIFACT on the right. Mono throughout.

- [ ] **Step 1: Write `DocTypesTable.svelte`**

```svelte
<script lang="ts">
  type DocList = { format: string; docs: { code: string; name: string }[] };

  let {
    columns
  }: {
    columns: DocList[];
  } = $props();
</script>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
  {#each columns as col (col.format)}
    <div class="border-line border-y py-5">
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">{col.format}</p>
      <ul class="mt-4 grid gap-2">
        {#each col.docs as doc (doc.code)}
          <li class="grid grid-cols-[4rem_1fr] gap-3 font-mono text-sm">
            <span class="text-ink">{doc.code}</span>
            <span class="text-muted">{doc.name}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 15: Build `PullQuote.svelte`

**Files:**

- Create: `src/lib/components/shared/PullQuote.svelte`

Editorial pull-quote for the AI Engineering section's "loaded ≠ attended" insight. Display serif, large, italic optional.

- [ ] **Step 1: Write `PullQuote.svelte`**

```svelte
<script lang="ts">
  let {
    children,
    attribution,
    tone = "dark"
  }: {
    children: import("svelte").Snippet;
    attribution?: string;
    tone?: "light" | "dark";
  } = $props();

  const wrapClass =
    tone === "dark" ? "border-y border-line-dark text-paper" : "border-y border-line text-ink";
  const attrClass = tone === "dark" ? "text-[rgba(244,242,235,0.5)]" : "text-muted";
</script>

<figure class="grid gap-6 py-12 md:py-16 {wrapClass}">
  <blockquote
    class="max-w-[58ch] font-[family-name:var(--font-display)] text-3xl leading-snug tracking-tight italic md:text-5xl"
  >
    {@render children()}
  </blockquote>
  {#if attribution}
    <figcaption class="font-mono text-xs tracking-[0.18em] uppercase {attrClass}">
      — {attribution}
    </figcaption>
  {/if}
</figure>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 16: Build `Header.svelte` (top nav)

**Files:**

- Create: `src/lib/components/shared/Header.svelte`

Top nav bar: monogram + name on left, links on right. Translucent over hero, solid in the rest of the site. The header is rendered inside the Hero (matching the existing pattern), but extracted for reuse.

- [ ] **Step 1: Write `Header.svelte`**

```svelte
<script lang="ts">
  let {
    monogram,
    name,
    tone = "dark",
    links = [
      { href: "#retailready", label: "RetailReady" },
      { href: "#ai-engineering", label: "AI" },
      { href: "#experience", label: "Experience" },
      { href: "#contact", label: "Contact" }
    ]
  }: {
    monogram: string;
    name: string;
    tone?: "dark" | "light";
    links?: { href: string; label: string }[];
  } = $props();

  const containerClass =
    tone === "dark"
      ? "border-white/14 bg-[rgba(20,20,16,0.42)] text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_18px_55px_-45px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      : "border-line bg-[rgba(244,242,235,0.86)] text-ink backdrop-blur-md";

  const monogramClass =
    tone === "dark" ? "bg-[rgba(244,242,235,0.92)] text-charcoal" : "bg-ink text-paper";

  const navLinkClass =
    tone === "dark"
      ? "text-[rgba(244,242,235,0.72)] hover:bg-white/10 hover:text-paper"
      : "text-muted hover:bg-ink/8 hover:text-ink";
</script>

<header
  class="absolute top-4 right-4 left-4 z-[2] flex items-center justify-between rounded-lg border px-3 py-2 md:right-8 md:left-8 lg:right-12 lg:left-12 {containerClass}"
>
  <a class="flex items-center gap-3 text-sm font-medium" href="#top">
    <span class="grid size-9 place-items-center rounded-lg font-mono text-xs {monogramClass}">
      {monogram}
    </span>
    <span class="hidden sm:inline">{name}</span>
  </a>
  <nav class="flex items-center gap-1 text-xs sm:text-sm">
    {#each links as link (link.href)}
      <a class="rounded-md px-3 py-2 transition {navLinkClass}" href={link.href}>{link.label}</a>
    {/each}
  </nav>
</header>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 17: Build `Footer.svelte`

**Files:**

- Create: `src/lib/components/shared/Footer.svelte`

Minimal footer used at the bottom of every page.

- [ ] **Step 1: Write `Footer.svelte`**

```svelte
<script lang="ts">
  let {
    name,
    role
  }: {
    name: string;
    role: string;
  } = $props();

  const year = new Date().getFullYear();
</script>

<footer
  class="border-line text-muted mt-16 flex flex-col gap-3 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between"
>
  <span class="font-mono text-xs tracking-[0.16em] uppercase">© {year} {name}</span>
  <span class="font-mono text-xs tracking-[0.16em] uppercase">{role}</span>
</footer>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

## Phase 4 — Animated Architecture Diagrams

### Task 18: Build `ArchitectureDiagram.svelte` (RetailReady doc flow)

**Files:**

- Create: `src/lib/components/shared/ArchitectureDiagram.svelte`

The signature visual for RetailReady. SVG-based architecture diagram with animated dots flowing between nodes. Pauses when off-screen. Static when reduced motion.

**Layout (left → right):** Retailer · EDI Server · Engine · Database · API · Browser
**Edges carry color-coded dots:** 850 (copper), 855 (moss), 856 (signal), 810 (paper-deep), 997 (small/translucent)

- [ ] **Step 1: Write the component skeleton**

```svelte
<script lang="ts">
  import { onMount } from "svelte";

  type Variant = "compact" | "full";
  let { variant = "compact" }: { variant?: Variant } = $props();

  const nodes = [
    { id: "retailer", label: "Retailer", x: 60, y: 220 },
    { id: "edi-server", label: "EDI Server", x: 220, y: 220 },
    { id: "engine", label: "Engine", x: 380, y: 220 },
    { id: "database", label: "Database", x: 540, y: 220 },
    { id: "api", label: "API", x: 700, y: 220 },
    { id: "browser", label: "Browser", x: 860, y: 220 }
  ];

  const edges = [
    { from: "retailer", to: "edi-server" },
    { from: "edi-server", to: "engine" },
    { from: "engine", to: "database" },
    { from: "database", to: "api" },
    { from: "api", to: "browser" }
  ];

  type Doc = { code: string; color: string; label: string };
  const docTypes: Doc[] = [
    { code: "850", color: "var(--color-copper)", label: "PO" },
    { code: "855", color: "var(--color-moss)", label: "Ack" },
    { code: "856", color: "var(--color-signal)", label: "ASN" },
    { code: "810", color: "var(--color-paper-deep)", label: "Invoice" },
    { code: "997", color: "rgba(244,242,235,0.5)", label: "FA" }
  ];

  // Path for each edge (M <fromX> <fromY> L <toX> <toY>)
  function pathFor(edge: { from: string; to: string }) {
    const a = nodes.find((n) => n.id === edge.from)!;
    const b = nodes.find((n) => n.id === edge.to)!;
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  }

  // Each dot has: edge index, doc type index, offset 0-1, speed multiplier
  type Dot = { edgeIndex: number; doc: Doc; offset: number; speed: number };
  const initialDots: Dot[] = [];
  for (let e = 0; e < edges.length; e++) {
    const count = 3; // 3 dots per edge
    for (let i = 0; i < count; i++) {
      initialDots.push({
        edgeIndex: e,
        doc: docTypes[(e * count + i) % docTypes.length],
        offset: i / count + Math.random() * 0.07,
        speed: 0.18 + Math.random() * 0.06
      });
    }
  }

  let dots = $state<Dot[]>(initialDots);
  let svgEl: SVGSVGElement | undefined = $state();
  let pathEls: SVGPathElement[] = $state([]);
  let running = $state(false);
  let reduced = false;

  onMount(() => {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Static evenly-spaced dots
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          running = entry.isIntersecting;
        }
      },
      { threshold: 0.1 }
    );
    if (svgEl) observer.observe(svgEl);

    let raf = 0;
    let lastTime = performance.now();

    function tick(time: number) {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      if (running) {
        dots = dots.map((d) => {
          let next = d.offset + d.speed * dt;
          if (next >= 1) next = 0;
          return { ...d, offset: next };
        });
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  });

  function dotPosition(dot: Dot) {
    const path = pathEls[dot.edgeIndex];
    if (!path) return { x: 0, y: 0 };
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len * dot.offset);
    return { x: pt.x, y: pt.y };
  }

  // height vs viewBox
  const viewBox = variant === "full" ? "0 0 940 380" : "0 0 940 320";
  const heightClass = variant === "full" ? "h-[480px]" : "h-[320px] md:h-[380px]";
</script>

<figure class="relative w-full {heightClass}" aria-hidden="true">
  <svg
    bind:this={svgEl}
    {viewBox}
    class="h-full w-full"
    preserveAspectRatio="xMidYMid meet"
    role="img"
  >
    <!-- Edges -->
    <g stroke="var(--color-line-dark)" stroke-width="1.2" fill="none">
      {#each edges as edge, i (edge.from + edge.to)}
        <path bind:this={pathEls[i]} d={pathFor(edge)} stroke-dasharray="4 4" />
      {/each}
    </g>

    <!-- Dots -->
    <g>
      {#each dots as dot, i (i)}
        {@const pos = dotPosition(dot)}
        <circle cx={pos.x} cy={pos.y} r="5" fill={dot.doc.color} opacity="0.92"> </circle>
      {/each}
    </g>

    <!-- Nodes -->
    <g>
      {#each nodes as node (node.id)}
        <g transform="translate({node.x}, {node.y})">
          <rect
            x="-44"
            y="-22"
            width="88"
            height="44"
            rx="6"
            fill="var(--color-charcoal)"
            stroke="var(--color-line-dark)"
          />
          <text
            x="0"
            y="6"
            text-anchor="middle"
            font-family="var(--font-mono)"
            font-size="11"
            fill="var(--color-paper)"
            letter-spacing="0.03em"
          >
            {node.label}
          </text>
        </g>
      {/each}
    </g>
  </svg>

  <!-- Legend (full variant only) -->
  {#if variant === "full"}
    <div
      class="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[rgba(244,242,235,0.62)]"
    >
      {#each docTypes as dt (dt.code)}
        <span class="flex items-center gap-2 font-mono tracking-[0.14em] uppercase">
          <span class="size-2.5 rounded-full" style="background: {dt.color}"></span>
          {dt.code}
          {dt.label}
        </span>
      {/each}
    </div>
  {/if}
</figure>
```

> **Note on Svelte 5 + SVG:** `bind:this` works on SVG elements normally, but for an array of paths, `bind:this={pathEls[i]}` is fine syntactically — pathEls accumulates as the SVG renders. The `dotPosition()` reactive helper depends on `pathEls` having been bound, so the first frame after mount is when positions become accurate.

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors. If `pathEls` typing complains, ensure the array is initialized as `let pathEls: SVGPathElement[] = $state([])`.

- [ ] **Step 3: Visually test by inserting into the temporary `+page.svelte`**

Replace the body of `src/routes/+page.svelte` temporarily:

```svelte
<script lang="ts">
  import ArchitectureDiagram from "$lib/components/shared/ArchitectureDiagram.svelte";
</script>

<main id="main" class="bg-charcoal min-h-dvh px-8 py-16">
  <ArchitectureDiagram variant="full" />
</main>
```

Run dev server. Expected: 6 dark node boxes labeled left-to-right (Retailer, EDI Server, Engine, Database, API, Browser), dashed lines between, ~3 colored dots flowing along each edge. Stop dev server. Restore the temporary scaffold-check page content (we'll wire up real pages later).

---

### Task 19: Build `AISystemDiagram.svelte` (fork-and-return pattern)

**Files:**

- Create: `src/lib/components/shared/AISystemDiagram.svelte`

The companion diagram for the AI Engineering section. Shows the fork-and-return: Main Thread dispatches a Sub-agent that reads from Diagram + Memory + CLAUDE.md, then returns a Briefing.

**Layout:** central horizontal axis Prompt → Main Thread → Sub-agent → Briefing → Main Thread (loop). Below the Sub-agent, three source nodes (Diagram, Memory, CLAUDE.md) feed in.

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import { onMount } from "svelte";

  let { variant = "compact" }: { variant?: "compact" | "full" } = $props();

  // Six visible nodes — main flow + cluster of three sources
  const nodes = [
    { id: "prompt", label: "Prompt", x: 80, y: 120 },
    { id: "main", label: "Main Thread", x: 240, y: 120 },
    { id: "subagent", label: "Sub-agent", x: 460, y: 120 },
    { id: "briefing", label: "Briefing", x: 680, y: 120 },
    { id: "main2", label: "Main (resume)", x: 860, y: 120 },
    { id: "diagram", label: "Diagram", x: 380, y: 260 },
    { id: "memory", label: "Memory", x: 460, y: 280 },
    { id: "claude", label: "CLAUDE.md", x: 540, y: 260 }
  ];

  const edges = [
    { from: "prompt", to: "main" },
    { from: "main", to: "subagent" },
    { from: "subagent", to: "briefing" },
    { from: "briefing", to: "main2" },
    { from: "diagram", to: "subagent" },
    { from: "memory", to: "subagent" },
    { from: "claude", to: "subagent" }
  ];

  function pathFor(edge: { from: string; to: string }) {
    const a = nodes.find((n) => n.id === edge.from)!;
    const b = nodes.find((n) => n.id === edge.to)!;
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  }

  type Dot = { edgeIndex: number; offset: number; speed: number; color: string };
  const colors = ["var(--color-signal)", "var(--color-copper)", "var(--color-moss)"];
  const initialDots: Dot[] = [];
  for (let e = 0; e < edges.length; e++) {
    for (let i = 0; i < 2; i++) {
      initialDots.push({
        edgeIndex: e,
        offset: i / 2 + Math.random() * 0.1,
        speed: 0.18 + Math.random() * 0.05,
        color: colors[(e + i) % colors.length]
      });
    }
  }

  let dots = $state<Dot[]>(initialDots);
  let svgEl: SVGSVGElement | undefined = $state();
  let pathEls: SVGPathElement[] = $state([]);
  let running = $state(false);
  let reduced = false;

  onMount(() => {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) running = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (svgEl) observer.observe(svgEl);

    let raf = 0;
    let lastTime = performance.now();
    function tick(time: number) {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      if (running) {
        dots = dots.map((d) => {
          let next = d.offset + d.speed * dt;
          if (next >= 1) next = 0;
          return { ...d, offset: next };
        });
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  });

  function dotPosition(dot: Dot) {
    const path = pathEls[dot.edgeIndex];
    if (!path) return { x: 0, y: 0 };
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len * dot.offset);
    return { x: pt.x, y: pt.y };
  }

  const viewBox = "0 0 940 360";
  const heightClass = variant === "full" ? "h-[480px]" : "h-[360px]";
</script>

<figure class="relative w-full {heightClass}" aria-hidden="true">
  <svg
    bind:this={svgEl}
    {viewBox}
    class="h-full w-full"
    preserveAspectRatio="xMidYMid meet"
    role="img"
  >
    <g stroke="var(--color-line-dark)" stroke-width="1.2" fill="none">
      {#each edges as edge, i (edge.from + edge.to)}
        <path bind:this={pathEls[i]} d={pathFor(edge)} stroke-dasharray="4 4" />
      {/each}
    </g>

    <g>
      {#each dots as dot, i (i)}
        {@const pos = dotPosition(dot)}
        <circle cx={pos.x} cy={pos.y} r="4.5" fill={dot.color} opacity="0.9" />
      {/each}
    </g>

    <g>
      {#each nodes as node (node.id)}
        <g transform="translate({node.x}, {node.y})">
          <rect
            x="-58"
            y="-20"
            width="116"
            height="40"
            rx="6"
            fill="var(--color-charcoal)"
            stroke="var(--color-line-dark)"
          />
          <text
            x="0"
            y="5"
            text-anchor="middle"
            font-family="var(--font-mono)"
            font-size="11"
            fill="var(--color-paper)"
            letter-spacing="0.03em"
          >
            {node.label}
          </text>
        </g>
      {/each}
    </g>
  </svg>
</figure>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 3: Visual test (same pattern as Task 18 step 3)**

Quick visual verification in `+page.svelte`, then restore.

---

## Phase 5 — Content Module

### Task 20: Write `src/lib/content/profile.ts` — main page content

**Files:**

- Create: `src/lib/content/profile.ts`

This is the single source of truth for main-page copy. Sections import from here.

- [ ] **Step 1: Write the file**

```typescript
export const profile = {
  name: "Jesse Coble",
  monogram: "JC",
  role: "Owner of Coble Solutions and RetailReady EDI",
  headline: "Building sharper systems for retail operations.",
  intro:
    "I run Coble Solutions and RetailReady EDI, building product surfaces, automation, and operating systems for real business workflows. The work sits between practical engineering, restrained interface design, and tools teams can trust when the stakes are high.",
  location: "Akron, OH",
  email: "coble.jesse@gmail.com",
  retailreadyEmail: "jessecoble@retailreadyedi.com",
  videoSrc: "/media/hero-laptop-scrub.mp4",
  availability: "Coble Solutions / RetailReady EDI",
  focus: ["RetailReady EDI", "Coble Solutions", "Workflow design", "Product systems"]
} as const;

export const heroSignals = [
  { label: "Founder-led", icon: "CirclesThreePlus" as const },
  { label: "Operational", icon: "SealCheck" as const },
  { label: "Fast", icon: "Lightning" as const }
];

export const practice = {
  eyebrow: "Practice",
  headline: "Founder-led software for operational work.",
  body: "Jesse builds founder-led software around practical workflows: EDI operations, data movement, customer-facing tools, and the internal systems that make a business easier to run."
};

export const retailready = {
  eyebrow: "RetailReady EDI",
  headline: "A retail EDI platform that shows its work.",
  intro: [
    "RetailReady is a multi-tenant EDI platform that sits between product vendors and major retailers — Walmart, Best Buy, Dollar Tree, Meijer, Dollar General. It receives purchase orders, generates acknowledgments, ASNs, and invoices, validates everything against retailer-specific rules, and tracks compliance and chargebacks in real time.",
    "Built so vendors don't have to wait for support tickets to know what happened to their documents. Document state, validator output, retransmission status, and SLA clocks are all visible in one place."
  ],
  stats: [
    { value: "5", label: "Active retailers" },
    { value: "52", label: "Entities" },
    { value: "40", label: "RLS-enforced tables" },
    { value: "60", label: "Controllers" },
    { value: "9", label: "Engine workers + watchers" },
    { value: "48", label: "Migrations" },
    { value: "~900", label: "Tests, default suite" },
    { value: "X12 / EDIFACT", label: "Document formats" }
  ],
  docTypes: {
    columns: [
      {
        format: "X12",
        docs: [
          { code: "850", name: "Purchase Order" },
          { code: "855", name: "PO Acknowledgment" },
          { code: "856", name: "Ship Notice (ASN)" },
          { code: "810", name: "Invoice" },
          { code: "846", name: "Inventory" },
          { code: "997", name: "Functional Ack" },
          { code: "812", name: "Chargeback" },
          { code: "820", name: "Payment / Remittance" }
        ]
      },
      {
        format: "EDIFACT",
        docs: [
          { code: "ORDERS", name: "Purchase Order" },
          { code: "ORDRSP", name: "Order Response" },
          { code: "DESADV", name: "Despatch Advice" },
          { code: "INVOIC", name: "Invoice" },
          { code: "CONTRL", name: "Control Message" },
          { code: "REMADV", name: "Remittance Advice" }
        ]
      }
    ]
  },
  journey: [
    {
      name: "Sandbox",
      description: "Practice mode against a retailer simulator. Real generators, no live partners."
    },
    {
      name: "Preflight",
      description: "8 validation checks. Receiver IDs, protocol config, credentials, connection."
    },
    {
      name: "Certification",
      description: "Live test docs exchanged with the retailer. Most retailers require it."
    },
    {
      name: "Go-Live",
      description: "Final verification, all checks green. Promote to production."
    },
    {
      name: "Production",
      description: "Real documents, real metrics, OTIF + ASN accuracy + chargeback tracking."
    }
  ],
  techStack: [
    {
      category: "Frontend",
      items: ["SvelteKit", "Svelte 5 runes", "Tailwind v4", "Shadcn-Svelte"]
    },
    { category: "API", items: [".NET 10", "ASP.NET Core", "EF Core", "SignalR"] },
    {
      category: "Engine",
      items: [".NET 10", "8 background workers", "2 watchers", "Advisory-lock singleton"]
    },
    { category: "Database", items: ["PostgreSQL", "RLS on 40 tables", "ediplatform_api role"] },
    { category: "Messaging", items: ["RabbitMQ (API ↔ Engine)"] },
    { category: "EDI Protocols", items: ["SFTP (SSH.NET)", "AS2 (OpenAS2)"] },
    { category: "Billing", items: ["Stripe"] },
    { category: "Accounting", items: ["QuickBooks Online", "NetSuite", "OAuth2"] },
    { category: "Infrastructure", items: ["Docker", "Traefik", "Hetzner"] }
  ],
  flexPoints: [
    {
      title: "Two-layer monitoring after a real silent outage",
      body: "An in-app EngineAlertService watches domain logic — stale documents, repeated per-partner failures, worker heartbeat gaps. A host-level edi-monitor systemd service catches container crashes and healthcheck failures. The host-level layer is the only notifier that survives an API startup failure. Both were built after a 2.7-day silent outage in April 2026 proved one layer wasn't enough."
    },
    {
      title: "Per-worker cascading timeouts",
      body: "Every Engine worker carries its own poll interval and per-step deadline enforced via CancellationTokenSource.CreateLinkedTokenSource. One stalled retailer connection cannot freeze the rest of the pipeline."
    },
    {
      title: "Outbound retry with optimistic concurrency",
      body: "Outbound documents enforce a 45-second per-doc transmit timeout. Postgres RowVersion (xmin) prevents a retry from racing with an inbound 997 acknowledgment that arrived mid-transmission."
    },
    {
      title: "Advisory-lock singleton with takeover handshake",
      body: "Engine startup acquires pg_advisory_lock(59483) on a dedicated non-pooled connection. If a stale instance still holds it, pg_terminate_backend() evicts cleanly. A watcher service triggers graceful shutdown on lock loss instead of leaving zombies."
    },
    {
      title: "Postgres row-level security at the database layer",
      body: "40 tables enforce row-level security through the ediplatform_api role and per-request GUC variables set by an EF Core interceptor. FORCE ROW LEVEL SECURITY blocks even the table owner from bypassing policies — defense-in-depth alongside the existing application-layer filters."
    }
  ],
  wedge:
    "Most EDI platforms are black boxes that hide failures behind support tickets. RetailReady shows you the document, the validator output, the retransmission state, and the SLA clock — all live, all in one place. Sandbox runs your real EDI generators against a retailer simulator before you touch a live partner. RLS at the database layer means a controller bug can't leak across customers. A single-instance engine with advisory-lock takeover means no zombie processes, no lost documents."
};

export const aiEngineering = {
  eyebrow: "Working with AI",
  headline: "Building a context system around Claude.",
  problem:
    "Working with a coding LLM on a large codebase is a context problem disguised as a chat problem. Even a million-token window can't hold every architecture diagram, retailer-specific quirk, deployment runbook, and open bug — and what's loaded suffers attention drift, gets evicted by compaction, or goes stale against source.",
  stats: [
    { value: "16", label: "CLAUDE.md files" },
    { value: "13", label: "Orient skills" },
    { value: "28", label: "Skills total" },
    { value: "12", label: "Hook scripts" },
    { value: "7", label: "Specialist sub-agents" },
    { value: "64", label: "Typed memory files" }
  ],
  pullQuote:
    "Loaded ≠ attended. Files dumped into SessionStart context become bytes the model doesn't actively retrieve, and the next compaction evicts them. So orientation is on-demand and forked, not preloaded.",
  closing: "I'm no master at this. But the system is opinionated, and the opinions are earned."
};

export const cobleSolutions = {
  eyebrow: "Coble Solutions",
  headline: "Founder-led services.",
  body: "Hands-on technical strategy and product execution for companies that need software to reflect the way their work actually happens. Engagements stay close to business value and ship in tight loops with the people who will use the tool."
};

export const experience = {
  eyebrow: "Experience",
  headline: "A decade-plus of EDI.",
  body: "10+ years building software, with EDI as the through-line. Started in 2014 building reader/writer engines for steamship lines at DepotSystems (322, EDIFACT CEDEX, 301, Westim, Destim, Codeco, WORDER). Spent four years as the sole developer on ISO management systems for the medical device and aerospace industries at IMSXpress. Currently runs RetailReady — a retail EDI platform for vendors selling into Walmart, Best Buy, Dollar Tree, Meijer, and Dollar General.",
  timeline: [
    {
      years: "2022 — Present",
      role: "Founder, Lead Engineer",
      company: "Coble Solutions / RetailReady EDI"
    },
    { years: "2018 — 2022", role: "Senior / Sole Developer", company: "AQA Company (IMSXpress)" },
    {
      years: "2014 — 2018",
      role: "Developer → Senior Developer",
      company: "Edge Networks / DepotSystems"
    }
  ]
};

export const capabilities = [
  {
    name: "EDI workflow design",
    description:
      "Map how documents, retailers, customers, and exceptions actually move through the business before shaping the interface."
  },
  {
    name: "Operational product engineering",
    description:
      "Build usable systems where backend reliability and frontend clarity carry equal weight."
  },
  {
    name: "Automation with judgment",
    description:
      "Use automation to remove repeated work while keeping review, accountability, and edge cases visible."
  },
  {
    name: "Founder-speed execution",
    description:
      "Keep the scope close to business value, then ship in tight loops with the people who will use the tool."
  }
];

export const methods = [
  "Start with the workflow, then design the screen.",
  "Keep state, exceptions, and next actions visible.",
  "Use motion to clarify relationships, never to hide loading.",
  "Bias toward tools that can be operated repeatedly without fatigue."
];

export const resume = {
  name: "Jesse Coble",
  email: "coble.jesse@gmail.com",
  location: "Akron, OH",
  summary:
    "Highly accomplished Software Developer with 10+ years of experience leading projects through the entire SDLC. Translates complex business demands into robust, scalable technical solutions — from initial concept and implementation through post-launch support.",
  experience: [
    {
      role: "Founder, Lead Engineer",
      company: "Coble Solutions / RetailReady EDI",
      location: "Akron, OH",
      years: "2022 — Present",
      bullets: [
        "Built RetailReady — a multi-tenant EDI platform serving 5 active retailers (Walmart, Best Buy, Dollar Tree, Meijer, Dollar General) with X12 + EDIFACT support, real-time SignalR updates, and Postgres RLS at the database layer.",
        "Multi-project .NET 10 + SvelteKit architecture: ASP.NET Core API, background-worker Engine, RabbitMQ messaging, OpenAS2/SFTP transport, ~900-test default suite.",
        "Operates Coble Solutions, providing founder-led product execution to companies needing practical systems."
      ]
    },
    {
      role: "Senior / Sole Developer",
      company: "AQA Company, Inc. (IMSXpress)",
      location: "Remote",
      years: "2018 — 2022",
      bullets: [
        "Architected and maintained the core IMSXpress software — an ISO Management System for the medical device and aerospace industries.",
        "Built ancillary systems for managing software development specifications compliant with regulated-industry standards.",
        "Provided full-stack development, maintenance, complex debugging, and direct support to the company owner."
      ]
    },
    {
      role: "Senior Developer / Tech",
      company: "Edge Networks Inc. / DepotSystems Software",
      location: "Willoughby, OH",
      years: "2014 — 2018",
      bullets: [
        "Developed EDI reader and writer engines for steamship-line ↔ depot communication (322, EDIFACT CEDEX, 301, Westim, Destim, Codeco, WORDER).",
        "Key contributor to the main DepotSystems PC/Tablet software — full lifecycle in C#.NET + DevExpress + SQL.",
        "Built a FoxPro → SQL migration tool that significantly increased data conversion speed while working around corrupted source data.",
        "Wrote and customized a large library of customer reports via stored procedures, Crystal Reports, and DevExpress Reports.",
        "Provided 24/7 on-call production support and mentored junior team members."
      ]
    }
  ],
  technical: [
    { category: "Languages", items: ["C# / .NET", "TypeScript", "VB.NET", "T-SQL", "JavaScript"] },
    {
      category: "Frameworks (current)",
      items: [
        "SvelteKit",
        "Svelte 5 runes",
        "ASP.NET Core",
        ".NET 10",
        "EF Core",
        "SignalR",
        "Tailwind v4"
      ]
    },
    {
      category: "Frameworks (historical)",
      items: ["WinForms", "ASP.NET WebForms", "DevExpress", "Crystal Reports"]
    },
    { category: "Data", items: ["PostgreSQL", "MS SQL Server", "SQLite", "FoxPro"] },
    {
      category: "Infrastructure",
      items: ["Docker", "Traefik", "Hetzner", "Hyper-V", "Microsoft Server"]
    },
    {
      category: "Messaging / Protocols",
      items: ["RabbitMQ", "AS2 (OpenAS2)", "SFTP", "EDI X12 + EDIFACT"]
    },
    { category: "Methodologies", items: ["OOAD", "TDD", "SDLC ownership", "On-call support"] }
  ],
  education: {
    school: "Kent State University",
    location: "Kent, Ohio",
    degree: "B.S. in Computer Information Systems",
    year: "2008"
  }
};
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

## Phase 6 — Main Page Sections

For Tasks 21-30, each task creates one Svelte component under `src/lib/components/`. Each task follows the same pattern:

1. Write the component (importing content from `$lib/content/profile`)
2. Verify typecheck

Components are wired into `+page.svelte` in Task 31.

### Task 21: Build `Hero.svelte`

**Files:**

- Create: `src/lib/components/Hero.svelte`

This is the largest single component. It owns: scroll-scrubbed video, the navbar, magnetic CTAs, and the live-availability pill. Ports the existing `HeroExperience.tsx` to Svelte 5 runes.

- [ ] **Step 1: Copy media assets from legacy**

```bash
mkdir -p /Users/blackcolours/dev/work/portfolio/static/media
cp /Users/blackcolours/dev/work/portfolio/_legacy-next/public/media/hero-laptop-scrub.mp4 /Users/blackcolours/dev/work/portfolio/static/media/
cp /Users/blackcolours/dev/work/portfolio/_legacy-next/public/media/hero-transition.jpg /Users/blackcolours/dev/work/portfolio/static/media/
ls /Users/blackcolours/dev/work/portfolio/static/media/
```

Expected: both files present.

- [ ] **Step 2: Write `Hero.svelte`**

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import ArrowDownRight from "phosphor-svelte/lib/ArrowDownRight";
  import ArrowRight from "phosphor-svelte/lib/ArrowRight";
  import MagneticAnchor from "$lib/components/shared/MagneticAnchor.svelte";
  import Header from "$lib/components/shared/Header.svelte";
  import { profile } from "$lib/content/profile";
  import { scrubVideo } from "$lib/actions/scrubVideo";

  // Scroll progress 0..1 across the hero section
  let sectionEl: HTMLElement | undefined = $state();
  let progress = $state(0);
  let videoEl: HTMLVideoElement | undefined = $state();
  let videoFailed = $state(false);
  let videoReady = $state(false);

  onMount(() => {
    if (!sectionEl) return;

    const onScroll = () => {
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const total = sectionEl.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      progress = Math.min(1, Math.max(0, scrolled / total));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  });

  // Derived parallax/opacity values from progress
  const copyOpacity = $derived(progress < 0.42 ? 1 : Math.max(0.12, 1 - (progress - 0.42) * 2.6));
  const copyY = $derived(`${-progress * 32}%`);
  const mediaScale = $derived(1.02 + progress * 0.16);
  const mediaY = $derived(`${-progress * 5}%`);
  const mediaOpacity = $derived(progress < 0.72 ? 1 : Math.max(0.68, 1 - (progress - 0.72) * 1.1));
  const sceneY = $derived(progress > 0.78 ? `${(progress - 0.78) * 220 - 18}dvh` : "0dvh");
</script>

<section bind:this={sectionEl} class="bg-charcoal relative min-h-[460dvh] overflow-clip">
  <div
    class="bg-charcoal sticky top-0 min-h-dvh overflow-hidden"
    style="transform: translateY({sceneY})"
  >
    <div
      class="absolute inset-0 origin-center"
      style="transform: scale({mediaScale}) translateY({mediaY}); opacity: {mediaOpacity}"
    >
      {#if !videoFailed}
        <video
          bind:this={videoEl}
          class="h-full w-full object-cover transition-opacity duration-700 {videoReady
            ? 'opacity-100'
            : 'opacity-0'}"
          muted
          playsinline
          preload="auto"
          oncanplay={() => {
            videoReady = true;
          }}
          onerror={() => {
            videoFailed = true;
          }}
          use:scrubVideo={{ progress }}
        >
          <source src={profile.videoSrc} type="video/mp4" />
        </video>
      {/if}

      {#if !videoReady || videoFailed}
        <div
          class="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_62%_32%,rgba(162,107,79,0.28),transparent_28%),linear-gradient(145deg,#25251f_0%,#161612_58%,#2d3025_100%)]"
        ></div>
      {/if}
    </div>

    <div
      class="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,14,11,0.78)_0%,rgba(14,14,11,0.5)_38%,rgba(14,14,11,0.1)_72%,rgba(14,14,11,0.42)_100%)]"
    ></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(162,107,79,0.14),transparent_32%),linear-gradient(180deg,rgba(14,14,11,0.1)_0%,rgba(14,14,11,0.03)_52%,rgba(14,14,11,0.82)_100%)]"
    ></div>

    <div class="relative mx-auto min-h-dvh w-full max-w-[1500px] px-4 py-5 md:px-8 lg:px-12">
      <Header monogram={profile.monogram} name={profile.name} tone="dark" />

      <div
        class="relative z-[1] flex min-h-dvh items-end pt-28 pb-16 md:items-center md:pb-0"
        style="transform: translateY({copyY}); opacity: {copyOpacity}"
      >
        <div class="max-w-[820px] md:pl-[4vw]">
          <div
            class="mb-8 flex w-fit items-center gap-3 rounded-lg border border-white/14 bg-[rgba(244,242,235,0.12)] px-3 py-2 text-xs tracking-[0.18em] text-[rgba(244,242,235,0.78)] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md"
          >
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full animate-ping rounded-full bg-[#a9b38a] opacity-40"
              ></span>
              <span class="relative inline-flex size-2 rounded-full bg-[#a9b38a]"></span>
            </span>
            {profile.availability}
          </div>

          <p
            class="mb-5 max-w-[42rem] text-sm font-medium tracking-[0.2em] text-[#d0ab8e] uppercase"
          >
            {profile.role}
          </p>
          <h1
            class="text-paper font-[family-name:var(--font-display)] text-5xl leading-[0.92] font-normal tracking-tight md:text-7xl lg:text-8xl"
          >
            {profile.headline}
          </h1>
          <p class="mt-7 max-w-[62ch] text-base leading-8 text-[rgba(244,242,235,0.78)] md:text-lg">
            {profile.intro}
          </p>

          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <MagneticAnchor href="#retailready" tone="dark">
              {#snippet children()}
                Selected work
                <ArrowDownRight aria-hidden="true" size={18} weight="bold" />
              {/snippet}
            </MagneticAnchor>
            <MagneticAnchor href="mailto:{profile.email}" tone="light">
              {#snippet children()}
                Start a conversation
                <ArrowRight aria-hidden="true" size={18} weight="bold" />
              {/snippet}
            </MagneticAnchor>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

> If `phosphor-svelte` import paths complain, the package may export icons differently. Try `import { ArrowDownRight } from "phosphor-svelte"` instead of the per-icon path. Consult `node_modules/phosphor-svelte/dist/lib/` to see the actual structure.

---

### Task 22: Build `Practice.svelte`

**Files:**

- Create: `src/lib/components/Practice.svelte`

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import CirclesThreePlus from "phosphor-svelte/lib/CirclesThreePlus";
  import SealCheck from "phosphor-svelte/lib/SealCheck";
  import Lightning from "phosphor-svelte/lib/Lightning";
  import Compass from "phosphor-svelte/lib/Compass";
  import { practice } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";

  const signals = [
    { label: "Founder-led", icon: CirclesThreePlus },
    { label: "Operational", icon: SealCheck },
    { label: "Fast", icon: Lightning }
  ];
</script>

<section class="bg-paper">
  <div
    class="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-4 py-24 md:grid-cols-[0.72fr_1.28fr] md:px-8 md:py-32 lg:px-12"
  >
    <Reveal>
      {#snippet children()}
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">
          {practice.eyebrow}
        </p>
        <h2
          class="mt-4 max-w-[12ch] font-[family-name:var(--font-display)] text-4xl leading-none tracking-tight md:text-6xl"
        >
          {practice.headline}
        </h2>
      {/snippet}
    </Reveal>

    <div class="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <Reveal
        class="border-line rounded-lg border bg-[rgba(255,255,255,0.32)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] md:p-8"
        delay={120}
      >
        {#snippet children()}
          <Compass class="text-moss" size={28} weight="duotone" />
          <p class="text-ink mt-8 max-w-[48ch] text-xl leading-8">
            {practice.body}
          </p>
        {/snippet}
      </Reveal>

      <Reveal class="border-line grid content-end gap-3 border-y py-6" delay={240}>
        {#snippet children()}
          {#each signals as signal (signal.label)}
            <div class="flex items-center justify-between gap-4 py-4">
              <span class="text-ink text-lg font-medium">{signal.label}</span>
              <span
                class="text-moss grid size-10 place-items-center rounded-lg bg-[rgba(14,14,11,0.06)]"
              >
                <signal.icon aria-hidden="true" size={20} weight="bold" />
              </span>
            </div>
          {/each}
        {/snippet}
      </Reveal>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 23: Build `RetailReady.svelte`

**Files:**

- Create: `src/lib/components/RetailReady.svelte`

The centerpiece. Imports content from `profile.ts`, lays out: header → diagram → stats → doc types → journey → tech stack → flex points → wedge → CTA.

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import ArrowUpRight from "phosphor-svelte/lib/ArrowUpRight";
  import { retailready } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
  import StatsGrid from "$lib/components/shared/StatsGrid.svelte";
  import TechStackGrid from "$lib/components/shared/TechStackGrid.svelte";
  import DocTypesTable from "$lib/components/shared/DocTypesTable.svelte";
  import JourneyRail from "$lib/components/shared/JourneyRail.svelte";
  import ArchitectureDiagram from "$lib/components/shared/ArchitectureDiagram.svelte";
</script>

<section id="retailready" class="bg-charcoal text-paper">
  <div class="mx-auto max-w-[1500px] px-4 py-24 md:px-8 md:py-32 lg:px-12">
    <Reveal>
      {#snippet children()}
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">
          {retailready.eyebrow}
        </p>
        <h2
          class="mt-5 max-w-[14ch] font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-8xl"
        >
          {retailready.headline}
        </h2>
        <div class="mt-8 grid gap-5 md:grid-cols-2 md:gap-8">
          {#each retailready.intro as paragraph, i (i)}
            <p class="max-w-[58ch] text-lg leading-8 text-[rgba(244,242,235,0.76)]">
              {paragraph}
            </p>
          {/each}
        </div>
      {/snippet}
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      {#snippet children()}
        <div class="border-line-dark rounded-lg border bg-[rgba(244,242,235,0.04)] p-6 md:p-10">
          <ArchitectureDiagram variant="full" />
        </div>
      {/snippet}
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      {#snippet children()}
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">By the numbers</p>
        <div class="mt-6">
          <StatsGrid stats={retailready.stats} tone="dark" />
        </div>
      {/snippet}
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      {#snippet children()}
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">
          Document types supported
        </p>
        <div class="mt-6">
          <DocTypesTable columns={retailready.docTypes.columns} />
        </div>
      {/snippet}
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      {#snippet children()}
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Customer journey</p>
        <div class="mt-6">
          <JourneyRail stages={retailready.journey} />
        </div>
      {/snippet}
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      {#snippet children()}
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Stack</p>
        <div class="mt-6">
          <TechStackGrid rows={retailready.techStack} tone="dark" />
        </div>
      {/snippet}
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      {#snippet children()}
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Design highlights</p>
        <ol class="border-line-dark mt-8 grid gap-px border md:grid-cols-2">
          {#each retailready.flexPoints as point, index (point.title)}
            <li class="bg-charcoal p-6 md:p-8">
              <span
                class="font-mono text-xs tracking-[0.18em] text-[rgba(244,242,235,0.5)] uppercase"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3
                class="text-paper mt-3 text-xl leading-tight font-semibold tracking-tight md:text-2xl"
              >
                {point.title}
              </h3>
              <p class="mt-3 text-sm leading-7 text-[rgba(244,242,235,0.74)]">
                {point.body}
              </p>
            </li>
          {/each}
        </ol>
      {/snippet}
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      {#snippet children()}
        <blockquote
          class="border-copper text-paper max-w-[58ch] border-l-2 pl-6 font-[family-name:var(--font-display)] text-2xl leading-snug italic md:text-4xl"
        >
          {retailready.wedge}
        </blockquote>
      {/snippet}
    </Reveal>

    <Reveal class="mt-12" delay={120}>
      {#snippet children()}
        <a
          href="/retailready"
          class="group text-copper inline-flex items-center gap-3 font-mono text-sm tracking-[0.18em] uppercase transition-colors hover:text-[color-mix(in_oklab,var(--color-copper)_85%,white)]"
        >
          View the full system overview
          <ArrowUpRight
            aria-hidden="true"
            size={20}
            weight="bold"
            class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      {/snippet}
    </Reveal>
  </div>
</section>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 24: Build `AIEngineering.svelte`

**Files:**

- Create: `src/lib/components/AIEngineering.svelte`

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import ArrowUpRight from "phosphor-svelte/lib/ArrowUpRight";
  import { aiEngineering } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
  import StatsGrid from "$lib/components/shared/StatsGrid.svelte";
  import PullQuote from "$lib/components/shared/PullQuote.svelte";
  import AISystemDiagram from "$lib/components/shared/AISystemDiagram.svelte";
</script>

<section id="ai-engineering" class="bg-ink text-paper">
  <div class="mx-auto max-w-[1500px] px-4 py-24 md:px-8 md:py-32 lg:px-12">
    <Reveal>
      {#snippet children()}
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">
          {aiEngineering.eyebrow}
        </p>
        <h2
          class="mt-5 max-w-[14ch] font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-8xl"
        >
          {aiEngineering.headline}
        </h2>
        <p class="mt-8 max-w-[68ch] text-lg leading-8 text-[rgba(244,242,235,0.76)]">
          {aiEngineering.problem}
        </p>
      {/snippet}
    </Reveal>

    <Reveal class="mt-16" delay={120}>
      {#snippet children()}
        <div class="border-line-dark rounded-lg border bg-[rgba(244,242,235,0.03)] p-6 md:p-10">
          <AISystemDiagram variant="full" />
        </div>
      {/snippet}
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      {#snippet children()}
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">By the numbers</p>
        <div class="mt-6">
          <StatsGrid stats={aiEngineering.stats} tone="dark" />
        </div>
      {/snippet}
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      {#snippet children()}
        <PullQuote tone="dark">
          {#snippet children()}
            "{aiEngineering.pullQuote}"
          {/snippet}
        </PullQuote>
      {/snippet}
    </Reveal>

    <Reveal class="mt-12" delay={120}>
      {#snippet children()}
        <p class="text-paper max-w-[44ch] text-2xl leading-snug font-medium md:text-3xl">
          {aiEngineering.closing}
        </p>
      {/snippet}
    </Reveal>

    <Reveal class="mt-12" delay={120}>
      {#snippet children()}
        <a
          href="/working-with-ai"
          class="group text-copper inline-flex items-center gap-3 font-mono text-sm tracking-[0.18em] uppercase transition-colors hover:text-[color-mix(in_oklab,var(--color-copper)_85%,white)]"
        >
          Read how I work with Claude
          <ArrowUpRight
            aria-hidden="true"
            size={20}
            weight="bold"
            class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      {/snippet}
    </Reveal>
  </div>
</section>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 25: Build `CobleSolutions.svelte`

**Files:**

- Create: `src/lib/components/CobleSolutions.svelte`

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import { cobleSolutions } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section class="bg-paper">
  <div class="mx-auto max-w-[1500px] px-4 py-24 md:px-8 md:py-32 lg:px-12">
    <Reveal>
      {#snippet children()}
        <article
          class="border-line rounded-lg border bg-[rgba(255,255,255,0.32)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] md:grid md:grid-cols-[0.7fr_1.3fr] md:gap-12 md:p-12"
        >
          <div>
            <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">
              {cobleSolutions.eyebrow}
            </p>
            <h2
              class="mt-4 font-[family-name:var(--font-display)] text-4xl leading-none tracking-tight md:text-5xl"
            >
              {cobleSolutions.headline}
            </h2>
          </div>
          <p class="text-muted mt-6 max-w-[58ch] text-lg leading-8 md:mt-2">
            {cobleSolutions.body}
          </p>
        </article>
      {/snippet}
    </Reveal>
  </div>
</section>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 26: Build `Experience.svelte`

**Files:**

- Create: `src/lib/components/Experience.svelte`

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import { experience } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section id="experience" class="bg-paper">
  <div
    class="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-4 py-24 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:py-32 lg:px-12"
  >
    <Reveal>
      {#snippet children()}
        <div>
          <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">
            {experience.eyebrow}
          </p>
          <h2
            class="mt-5 max-w-[12ch] font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl"
          >
            {experience.headline}
          </h2>
          <p class="text-muted mt-7 max-w-[58ch] text-lg leading-8">
            {experience.body}
          </p>
        </div>
      {/snippet}
    </Reveal>

    <Reveal delay={140}>
      {#snippet children()}
        <ol class="border-line grid gap-px border">
          {#each experience.timeline as entry, i (entry.years)}
            <li
              class="grid gap-2 bg-[rgba(255,255,255,0.32)] p-6 md:grid-cols-[10rem_1fr] md:gap-8 md:p-8"
            >
              <span class="text-copper font-mono text-xs tracking-[0.18em] uppercase">
                {entry.years}
              </span>
              <div>
                <h3 class="text-ink text-xl font-semibold tracking-tight md:text-2xl">
                  {entry.role}
                </h3>
                <p class="text-muted mt-1 text-sm md:text-base">{entry.company}</p>
              </div>
            </li>
          {/each}
        </ol>
      {/snippet}
    </Reveal>
  </div>
</section>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 27: Build `Capabilities.svelte`

**Files:**

- Create: `src/lib/components/Capabilities.svelte`

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import { capabilities } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section id="capabilities" class="bg-paper">
  <div
    class="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-4 py-24 md:grid-cols-[0.72fr_1.28fr] md:px-8 md:py-32 lg:px-12"
  >
    <Reveal>
      {#snippet children()}
        <div>
          <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Capabilities</p>
          <h2
            class="mt-5 max-w-[10ch] font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl"
          >
            Useful systems, not theater.
          </h2>
        </div>
      {/snippet}
    </Reveal>

    <Reveal delay={140}>
      {#snippet children()}
        <div class="border-line grid gap-0 border-y">
          {#each capabilities as capability, i (capability.name)}
            <article
              class="border-line grid gap-5 border-b py-7 last:border-b-0 md:grid-cols-[auto_1fr] md:gap-8"
            >
              <span class="text-muted font-mono text-xs tracking-[0.18em] uppercase">
                0{i + 1}
              </span>
              <div>
                <h3 class="text-ink text-2xl font-semibold tracking-tight">{capability.name}</h3>
                <p class="text-muted mt-3 max-w-[65ch] leading-7">{capability.description}</p>
              </div>
            </article>
          {/each}
        </div>
      {/snippet}
    </Reveal>
  </div>
</section>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 28: Build `Method.svelte`

**Files:**

- Create: `src/lib/components/Method.svelte`

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import { methods } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section id="method" class="bg-paper">
  <div class="mx-auto max-w-[1500px] px-4 py-16 md:px-8 lg:px-12">
    <Reveal>
      {#snippet children()}
        <article
          class="bg-charcoal text-paper grid grid-cols-1 gap-10 rounded-lg px-6 py-10 shadow-[0_34px_90px_-66px_rgba(14,14,11,0.8)] md:grid-cols-[0.8fr_1.2fr] md:px-12 md:py-16"
        >
          <div>
            <p class="font-mono text-xs tracking-[0.2em] text-[#bca083] uppercase">Method</p>
            <h2
              class="mt-4 max-w-[12ch] font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl"
            >
              A tighter way to make things.
            </h2>
          </div>
          <div class="divide-y divide-white/12 border-y border-white/12">
            {#each methods as method, i (method)}
              <div class="grid grid-cols-[auto_1fr] gap-5 py-6 md:gap-7">
                <span class="font-mono text-sm text-[#bca083]">0{i + 1}</span>
                <p class="max-w-[58ch] text-xl leading-8 text-[rgba(244,242,235,0.84)]">{method}</p>
              </div>
            {/each}
          </div>
        </article>
      {/snippet}
    </Reveal>
  </div>
</section>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 29: Build `Resume.svelte`

**Files:**

- Create: `src/lib/components/Resume.svelte`
- Copy: PDF from `/Users/blackcolours/Downloads/` to `static/`

- [ ] **Step 1: Copy the résumé PDF**

```bash
cp "/Users/blackcolours/Downloads/Jesse Coble Resume.pdf" /Users/blackcolours/dev/work/portfolio/static/resume.pdf
ls -la /Users/blackcolours/dev/work/portfolio/static/resume.pdf
```

Expected: file present, ~78KB.

- [ ] **Step 2: Write `Resume.svelte`**

```svelte
<script lang="ts">
  import DownloadSimple from "phosphor-svelte/lib/DownloadSimple";
  import { resume } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section id="resume" class="bg-paper">
  <div class="mx-auto max-w-[940px] px-4 py-24 md:px-8 md:py-32">
    <Reveal>
      {#snippet children()}
        <header class="border-line border-b pb-8">
          <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Résumé</p>
          <h2
            class="mt-5 font-[family-name:var(--font-display)] text-6xl leading-none tracking-tight md:text-8xl"
          >
            {resume.name}
          </h2>
          <p class="text-muted mt-5 font-mono text-sm">
            {resume.email} · {resume.location}
          </p>
          <a
            href="/resume.pdf"
            download
            class="border-ink bg-ink text-paper hover:bg-charcoal mt-7 inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition"
          >
            <DownloadSimple aria-hidden="true" size={18} weight="bold" />
            Download résumé (PDF)
          </a>
        </header>
      {/snippet}
    </Reveal>

    <Reveal class="mt-12" delay={120}>
      {#snippet children()}
        <section>
          <h3 class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Summary</h3>
          <p class="text-ink mt-4 max-w-[68ch] text-lg leading-8">{resume.summary}</p>
        </section>
      {/snippet}
    </Reveal>

    <Reveal class="mt-16" delay={120}>
      {#snippet children()}
        <section>
          <h3 class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Experience</h3>
          <ol class="mt-6 grid gap-12">
            {#each resume.experience as job (job.years)}
              <li>
                <div class="grid gap-2 md:grid-cols-[1fr_auto] md:items-baseline">
                  <h4 class="text-ink text-2xl font-semibold tracking-tight">{job.role}</h4>
                  <span class="text-muted font-mono text-xs tracking-[0.16em] uppercase"
                    >{job.years}</span
                  >
                </div>
                <p class="text-muted mt-1 text-base">{job.company} · {job.location}</p>
                <ul class="mt-4 grid list-none gap-3 pl-0">
                  {#each job.bullets as bullet (bullet)}
                    <li class="text-ink grid grid-cols-[auto_1fr] gap-3 leading-7">
                      <span class="text-copper font-mono text-xs leading-7">·</span>
                      <span>{bullet}</span>
                    </li>
                  {/each}
                </ul>
              </li>
            {/each}
          </ol>
        </section>
      {/snippet}
    </Reveal>

    <Reveal class="mt-16" delay={120}>
      {#snippet children()}
        <section>
          <h3 class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Technical</h3>
          <dl class="border-line mt-6 border-y">
            {#each resume.technical as row (row.category)}
              <div
                class="border-line grid grid-cols-1 gap-2 border-b py-5 last:border-b-0 md:grid-cols-[14rem_1fr] md:gap-8 md:py-6"
              >
                <dt class="text-muted font-mono text-xs tracking-[0.18em] uppercase">
                  {row.category}
                </dt>
                <dd class="text-ink font-mono text-sm leading-7">{row.items.join(" · ")}</dd>
              </div>
            {/each}
          </dl>
        </section>
      {/snippet}
    </Reveal>

    <Reveal class="mt-16" delay={120}>
      {#snippet children()}
        <section>
          <h3 class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Education</h3>
          <p class="text-ink mt-4 text-lg">
            <span class="font-semibold">{resume.education.school}</span> · {resume.education
              .location}
          </p>
          <p class="text-muted mt-1 text-base">
            {resume.education.degree}, {resume.education.year}
          </p>
        </section>
      {/snippet}
    </Reveal>
  </div>
</section>
```

- [ ] **Step 3: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

### Task 30: Build `Contact.svelte`

**Files:**

- Create: `src/lib/components/Contact.svelte`

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import EnvelopeSimple from "phosphor-svelte/lib/EnvelopeSimple";
  import { profile } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
</script>

<section id="contact" class="bg-paper">
  <div class="mx-auto max-w-[1500px] px-4 pt-24 pb-12 md:px-8 md:py-32 lg:px-12">
    <Reveal>
      {#snippet children()}
        <article
          class="border-line grid min-h-[60dvh] grid-cols-1 content-between rounded-lg border bg-[rgba(255,255,255,0.32)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] md:p-12"
        >
          <div class="grid gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Contact</p>
              <h2
                class="mt-5 max-w-[14ch] font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight md:text-7xl"
              >
                Bring the hard part early.
              </h2>
            </div>
            <div class="grid gap-3 self-start">
              <a
                class="bg-ink text-paper hover:bg-charcoal inline-flex h-14 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition active:translate-y-px"
                href="mailto:{profile.email}"
              >
                <EnvelopeSimple aria-hidden="true" size={19} weight="bold" />
                {profile.email}
              </a>
              <p class="text-muted font-mono text-xs tracking-[0.16em] uppercase">
                RetailReady inquiries: <a
                  href="mailto:{profile.retailreadyEmail}"
                  class="text-ink underline-offset-4 hover:underline">{profile.retailreadyEmail}</a
                >
              </p>
            </div>
          </div>

          <Footer name={profile.name} role={profile.role} />
        </article>
      {/snippet}
    </Reveal>
  </div>
</section>
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run check
```

Expected: 0 errors.

---

## Phase 7 — Main Page Composition

### Task 31: Wire `+page.svelte`

**Files:**

- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Replace the temporary scaffold-check with real composition**

```svelte
<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import Practice from "$lib/components/Practice.svelte";
  import RetailReady from "$lib/components/RetailReady.svelte";
  import AIEngineering from "$lib/components/AIEngineering.svelte";
  import CobleSolutions from "$lib/components/CobleSolutions.svelte";
  import Experience from "$lib/components/Experience.svelte";
  import Capabilities from "$lib/components/Capabilities.svelte";
  import Method from "$lib/components/Method.svelte";
  import Resume from "$lib/components/Resume.svelte";
  import Contact from "$lib/components/Contact.svelte";
</script>

<svelte:head>
  <title>Jesse Coble — Coble Solutions / RetailReady EDI</title>
  <meta
    name="description"
    content="Jesse Coble — owner of Coble Solutions and RetailReady EDI. Building sharper systems for retail operations."
  />
</svelte:head>

<main id="main">
  <Hero />
  <Practice />
  <RetailReady />
  <AIEngineering />
  <CobleSolutions />
  <Experience />
  <Capabilities />
  <Method />
  <Resume />
  <Contact />
</main>
```

- [ ] **Step 2: Run dev server and walk the page**

```bash
cd /Users/blackcolours/dev/work/portfolio
npm run dev
```

Open http://localhost:5173. Walk through the page in order:

1. Hero — video plays/scrubs as you scroll, navbar visible, CTAs render
2. Practice — eyebrow + headline + body + signal items
3. RetailReady — animated diagram visible (dots flowing), stats grid, doc types, journey, stack, flex points, wedge, CTA
4. AI Engineering — system diagram, stats, pull quote, closing line, CTA
5. Coble Solutions — single card
6. Experience — timeline rail
7. Capabilities — numbered list
8. Method — dark editorial card
9. Résumé — header + sections + download button (download to verify it works)
10. Contact — primary email button + RetailReady secondary

Stop dev server.

- [ ] **Step 3: Run typecheck and build**

```bash
npm run check
npm run build
```

Expected: 0 errors on both. Build output in `build/`.

---

## Phase 8 — Deep-Dive Pages

### Task 32: Build `/retailready` deep-dive page

**Files:**

- Create: `src/lib/content/retailready-deep.ts`
- Create: `src/routes/retailready/+page.svelte`

The deep dive is a typeset Svelte page based on a redacted version of `/Users/blackcolours/dev/work/EdiPlatform/Docs/SYSTEM-OVERVIEW.md`. Reuses the architecture diagram, adds a sticky right-side TOC on desktop.

- [ ] **Step 1: Write `src/lib/content/retailready-deep.ts`**

This file holds the full deep-dive content. Mirror the structure in spec §5.11. The redaction rules from spec §5.11:

- Remove all VPS IPs (`49.13.236.209`, `46.224.175.20`)
- Remove all internal cross-references (`Docs/Architecture/diagrams/...`, `CLAUDE.md`, `INDEX.md`, `Docs/Research/...`)
- Remove the entire "FURTHER READING" pointer table at the top
- Soften specific test count `~899` to `~900`
- Keep: hostnames, Postgres role names, Hetzner mention, advisory-lock key, Sentry/Stripe deps

```typescript
export const retailreadyDeep = {
  title: "RetailReady — System Overview",
  subtitle: "Multi-tenant EDI platform for vendors selling to major retailers.",
  lastUpdated: "2026-04-25",
  toc: [
    { id: "what-it-is", label: "What it is" },
    { id: "how-it-works", label: "How it works" },
    { id: "architecture", label: "Architecture" },
    { id: "customer-journey", label: "Customer journey" },
    { id: "platform-features", label: "Platform features" },
    { id: "design-decisions", label: "Key design decisions" },
    { id: "tech-stack", label: "Tech stack" }
  ],
  sections: {
    whatItIs: [
      "EdiPlatform — branded as RetailReady — is a cloud EDI platform for product vendors selling through major retailers like Walmart, Best Buy, Dollar Tree, Meijer, and Dollar General. It handles the complete EDI lifecycle: receiving purchase orders, sending acknowledgments, ship notices, and invoices, while tracking compliance, chargebacks, and payments.",
      "Think of it as a managed middleware layer between a vendor's operations and their retail partners' EDI systems."
    ],
    whoItsFor: [
      "Primary users: small-to-mid-size product vendors who sell through major retailers but don't have the infrastructure or expertise to manage EDI compliance in-house.",
      "The problem it solves: retailers like Walmart and Best Buy require vendors to exchange documents in specific EDI formats (X12, EDIFACT). Getting the formatting, timing, and compliance right is complex — mistakes lead to chargebacks, strained relationships, and lost revenue. RetailReady handles the technical complexity so vendors can focus on selling."
    ],
    coreFlow: [
      "Retailer sends a Purchase Order (850) via SFTP or AS2",
      "Platform receives and parses it into a structured order",
      "Platform sends a Functional Acknowledgment (997) within 24 hours of receiving any inbound doc",
      "Vendor acknowledges the order (855 PO Acknowledgment) within the retailer's SLA",
      "Vendor ships and the platform generates an ASN (856 Ship Notice)",
      "Vendor invoices and the platform generates an invoice (810)",
      "Retailer's 997s confirm receipt of each outbound doc",
      "Platform tracks compliance — on-time delivery, ASN accuracy, SLA adherence, chargebacks"
    ],
    activeRetailers: [
      { code: "WALMART", name: "Walmart", notes: "UL/GLN qualifier" },
      { code: "BESTBUY", name: "Best Buy", notes: "DUNS qualifier" },
      { code: "DOLLARTREE", name: "Dollar Tree", notes: "Routes through Ariba shared gateway" },
      { code: "MEIJER", name: "Meijer", notes: "6-char PO numbers, hierarchy code 0001" },
      { code: "DOLLARGENERAL", name: "Dollar General", notes: "855 + 856 are optional" }
    ],
    runtime: [
      "Three .NET runtime processes plus a SvelteKit SSR process. PostgreSQL is the shared DB. RabbitMQ is the API↔Engine message bus. SignalR is the API→browser push channel. AS2 and SFTP terminate at the platform EDI server (separate VPS) and reach retailers from there.",
      "Browser ↔ API: REST + 2 SignalR hubs. SvelteKit SSR proxies and attaches the JWT.",
      "API ↔ Engine: RabbitMQ for fanned-out events. Never direct HTTP. Canonical path: RabbitMqPublisher (Engine) → NotificationConsumer (API hosted service) → SignalR hub.",
      "Engine ↔ external EDI: routed through the platform EDI server VPS. The Engine never speaks AS2/SFTP directly to retailers."
    ],
    projects: [
      {
        name: "EdiPlatform.Core",
        role: "Domain model, enums, interfaces, configuration POCOs, value services"
      },
      {
        name: "EdiPlatform.Data",
        role: "EF Core DbContext, 48 migrations, seeders, RLS interceptor, audit-trail service"
      },
      {
        name: "EdiPlatform.Parsers",
        role: "X12 + EDIFACT + SP-API parsers and generators, validators"
      },
      {
        name: "EdiPlatform.Api",
        role: "ASP.NET Core REST API, 60 controllers (36 customer + 24 admin), SignalR hubs, JWT/API-Key auth, RabbitMQ publisher, Stripe webhook"
      },
      {
        name: "EdiPlatform.Engine",
        role: "Background-worker host. 7 workers + 2 watchers + advisory-lock singleton guard. Owns SFTP/AS2/SP-API I/O."
      },
      {
        name: "RetailerSimulator",
        role: "Standalone .NET service simulating 11 retailers' inbound/outbound for sandbox / practice mode. Has its own DB + parsers."
      }
    ],
    workers: [
      {
        name: "FtpMonitorWorker",
        poll: "15 s",
        timeout: "2 min",
        job: "Polls EDI server SFTP inbound folders for each trading partner, downloads new files."
      },
      {
        name: "TransactionProcessorWorker",
        poll: "5 s",
        timeout: "30 s",
        job: "Parses queued inbound EDI into entities, auto-enriches lines from SkuMappings."
      },
      {
        name: "OutboundTransmissionWorker",
        poll: "10 s",
        timeout: "3 min",
        job: "Picks Pending OutboundDocument rows, validates, transmits via SFTP/AS2/SP-API."
      },
      {
        name: "MdnCheckWorker",
        poll: "5 min",
        timeout: "30 s",
        job: "Sweeps AS2 messages waiting for MDN. Marks any past 30 min as MDN-timeout."
      },
      {
        name: "DeadlineCheckWorker",
        poll: "1 h",
        timeout: "2 min",
        job: "Runs DeadlineTrackingService.CheckDeadlinesAsync(), fans alerts."
      },
      {
        name: "SpApiPollerWorker",
        poll: "60 s",
        timeout: "5 min",
        job: "Polls Amazon SP-API for new POs per active integration."
      },
      {
        name: "SpApiStatusPollerWorker",
        poll: "30 s",
        timeout: "2 min",
        job: "Polls SP-API for status of submitted ack/ship/invoice transactions."
      },
      {
        name: "WorkerWatchdogService",
        poll: "30 s",
        timeout: "n/a",
        job: "Reads worker heartbeats from DB; after 3 stuck detections (~90 s), triggers graceful shutdown."
      },
      {
        name: "AdvisoryLockWatcherService",
        poll: "5 s",
        timeout: "n/a",
        job: "Watches the dedicated NPGSQL connection holding pg_advisory_lock(59483); triggers shutdown if evicted."
      }
    ],
    journeyDeep: [
      {
        stage: "Onboarding (5 steps)",
        body: "Company info, address, plan selection, retailer selection, confirmation. Creates trading partners in Sandbox stage with auto-linked EDI standards."
      },
      {
        stage: "Sandbox (Practice Mode)",
        body: "Guided 5-step walkthrough: add products, receive test PO, acknowledge order, ship order, invoice. Uses real EDI document generation against the Retailer Simulator — no risk of hitting live retailers."
      },
      {
        stage: "Preflight",
        body: "8 validation checks (EDI receiver ID, protocol config, credentials, connection test, sandbox success, etc.). 4-step wizard walks users through configuration. Passing all checks unlocks promotion to Certification."
      },
      {
        stage: "Certification",
        body: "The vendor exchanges live test documents directly with the retailer to prove their EDI implementation is correct. Most retailers require this before allowing a vendor to go live."
      },
      {
        stage: "Go-Live",
        body: "Final verification that all preflight checks still pass and the connection test is proven. Promotes to Live stage — real production EDI starts flowing."
      },
      {
        stage: "Production Operations",
        body: "Real purchase orders received and processed automatically. Outbound documents generated, validated against retailer-specific rules, and transmitted. Compliance scoring (OTIF, ASN accuracy, acknowledgment rates) with 30-day rolling metrics. Chargeback tracking with reason codes, dispute workflow, and deadline alerts. Payment matching from 820 remittance documents."
      }
    ],
    features: [
      {
        name: "Products & Inventory",
        body: "Vendors manage a unified product catalog combining SKU mappings with inventory levels. Each product can have retailer-specific identifiers (UPC, buyer item numbers) mapped per trading partner. Inventory tracks quantity on hand, reserved, and available with a full audit trail. When inbound POs arrive, the platform auto-enriches order line items from the SKU catalog and learns new identifiers back into the catalog."
      },
      {
        name: "Accounting Integration",
        body: "Two-way sync with QuickBooks Online and NetSuite. Vendors can import orders from their accounting system and invoices sync back with payment status. Supports CSV export as a fallback. OAuth2 for credential management."
      },
      {
        name: "AI Assistant",
        body: "Built-in chat assistant for questions about EDI concepts, platform usage, and the user's own data. It can look up orders, shipments, invoices, and trading partner status. Streams responses via SSE. Per-customer usage tracking for billing."
      },
      {
        name: "Notifications",
        body: "Multi-channel coverage of the full document lifecycle — new orders, transmission success/failure, SLA deadline warnings, chargeback alerts, payment receipts, engine health alerts. Users configure per-notification-type preferences. The notification bell shows unread counts in real time via SignalR."
      },
      {
        name: "Reports",
        body: "Reporting with PDF export for compliance scorecards, order summaries, and financial reconciliation. Per-retailer breakdowns with trend analysis."
      },
      {
        name: "Documentation",
        body: "Built-in searchable documentation covering EDI concepts, platform workflows, retailer-specific requirements, and an EDI glossary. Rendered from markdown inside the customer portal."
      }
    ],
    designDecisions: [
      {
        title: "Multi-format support",
        body: "The same order can generate X12 or EDIFACT output depending on the trading partner's configuration. A plugin-based generator resolver loads the correct generator at runtime."
      },
      {
        title: "Retailer-specific configs are HARDCODED",
        body: "RetailerEdiConfigFactory in EdiPlatform.Engine holds per-retailer envelope quirks (qualifiers, hierarchy codes, identifier preferences) — not in the database. Connection/transport (SFTP creds, AS2 endpoints) lives in the RetailerProfile DB entity."
      },
      {
        title: "Validator scope is OUTBOUND ONLY",
        body: "RetailerValidator (via PreSendValidationService) validates outbound docs (855/856/810/997-out) before transmit. Inbound docs (850/860/812/820/824/997-in) are PARSER territory — we cannot reject what retailers send."
      },
      {
        title: "Three EDI ack layers — never conflate",
        body: '997 (protocol/syntax — "your file arrived"), 855 (business — "I\'ll fulfill 20, backorder 5"), 824 (semantic-error — "data parsed fine but business rules say it\'s wrong"). Each is required independently.'
      },
      {
        title: "Single-instance engine",
        body: "PostgreSQL advisory lock (key 59483) ensures only one Engine instance runs at a time, with a pg_terminate_backend() takeover handshake for safe failover. Workers use FOR UPDATE SKIP LOCKED for claim-based concurrency on transactions and status-based claiming on outbound documents."
      },
      {
        title: "Real-time updates everywhere",
        body: "The Engine publishes events via RabbitMQ. The API consumes them and broadcasts to connected browsers via SignalR. Virtually every customer-facing page updates in real time — the Order Details page with its tabbed workspace (Ship, Invoice, Payment, Chargeback, Confirm tabs) live-updates as documents are generated, transmitted, and acknowledged."
      },
      {
        title: "Row-Level Security (RLS)",
        body: "PostgreSQL RLS policies enforce per-customer data isolation at the database layer. The API connects as ediplatform_api (a restricted role with RLS enforced); the Engine connects as a role with admin bypass for cross-customer routing. An EF Core DbConnectionInterceptor sets app.current_customer_id and app.is_admin GUC variables on every connection open. Defense-in-depth alongside application-layer .Where(CustomerId == x) filtering — even a controller bug that omits a filter cannot leak cross-tenant data."
      },
      {
        title: "Sandbox isolation",
        body: "All sandbox entities are flagged with IsSandbox = true. Sandbox documents are validated but never transmitted to real retailers. The Retailer Simulator provides realistic responses for end-to-end testing."
      },
      {
        title: "Two-layer monitoring",
        body: "Layer A: in-app EngineAlertService catches stale documents, repeated per-partner failures, worker-heartbeat gaps. Layer B: host-level edi-monitor systemd service catches container crashes and healthcheck failures. The host-level layer is the only notifier that survives an API startup failure. Built after a real silent outage."
      },
      {
        title: "Per-worker cascading timeouts",
        body: "Every Engine worker carries its own poll interval and per-step deadline enforced via CancellationTokenSource.CreateLinkedTokenSource. One stalled retailer connection cannot freeze the rest of the pipeline."
      },
      {
        title: "Outbound retry with optimistic concurrency",
        body: "Outbound documents enforce a 45-second per-doc transmit timeout. Postgres RowVersion (xmin) prevents a retry from racing with an inbound 997 acknowledgment that arrived mid-transmission."
      },
      {
        title: "Multi-environment isolation in the simulator",
        body: "The simulator's CustomerEnrollment unique key is (RetailerInstanceId, CustomerEdiId, Environment) — Environment was added explicitly because without it, a dev enrollment would silently block staging from creating the same retailer/customer pair. Paired with env-suffixed AS2 sender IDs (SIM_WALMART for dev, SIM_WALMART_STAGING for staging, SIM_WALMART_PROD for prod), each environment's documents route to its own SFTP folder."
      },
      {
        title: "AES-256-GCM per-file certificate encryption",
        body: "Each AS2 certificate is individually encrypted with AES-256-GCM at the application layer before persisting. Allows per-cert key rotation and enables future migration to HSM/KMS without architectural changes."
      },
      {
        title: "Required-environment-parameter API discipline",
        body: "SimulatorClient.FindEnrollmentAsync makes the environment parameter required (never optional or defaulted), forcing every cross-env lookup to be explicit and preventing silent mis-routing of documents."
      }
    ],
    techStackTable: [
      {
        layer: "Frontend",
        tech: "SvelteKit · Svelte 5 runes · TanStack Query · Tailwind v4 · Shadcn-Svelte"
      },
      { layer: "API", tech: ".NET 10 · ASP.NET Core · EF Core · SignalR" },
      {
        layer: "Engine",
        tech: ".NET 10 · 7 background workers + 2 watchers + advisory-lock singleton guard"
      },
      { layer: "Database", tech: "PostgreSQL · RLS on 40 tables · ediplatform_api role" },
      { layer: "Messaging", tech: "RabbitMQ" },
      { layer: "EDI Protocols", tech: "SFTP (SSH.NET) · AS2 (OpenAS2)" },
      { layer: "Billing", tech: "Stripe" },
      { layer: "Accounting", tech: "QuickBooks · NetSuite (OAuth2)" },
      { layer: "Testing", tech: "xUnit · Testcontainers · FluentAssertions · Moq" },
      { layer: "Infrastructure", tech: "Docker · Traefik · Hetzner VPSes · Sentry" }
    ]
  }
};
```

- [ ] **Step 2: Write `src/routes/retailready/+page.svelte`**

```svelte
<script lang="ts">
  import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
  import { profile } from "$lib/content/profile";
  import { retailreadyDeep } from "$lib/content/retailready-deep";
  import ArchitectureDiagram from "$lib/components/shared/ArchitectureDiagram.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
</script>

<svelte:head>
  <title>RetailReady — System Overview · Jesse Coble</title>
  <meta name="description" content={retailreadyDeep.subtitle} />
</svelte:head>

<main id="main" class="bg-paper">
  <div class="border-line border-b">
    <nav class="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-5 md:px-8">
      <a
        class="text-muted hover:text-ink inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase"
        href="/"
      >
        <ArrowLeft size={14} weight="bold" />
        Back to portfolio
      </a>
      <span class="text-muted font-mono text-xs tracking-[0.18em] uppercase">
        Last updated {retailreadyDeep.lastUpdated}
      </span>
    </nav>
  </div>

  <article
    class="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1fr_220px]"
  >
    <div>
      <header class="border-line border-b pb-10">
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">RetailReady EDI</p>
        <h1
          class="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl"
        >
          {retailreadyDeep.title}
        </h1>
        <p class="text-muted mt-6 max-w-[60ch] text-xl leading-8">
          {retailreadyDeep.subtitle}
        </p>
      </header>

      <section id="what-it-is" class="mt-16">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">What it is</h2>
        {#each retailreadyDeep.sections.whatItIs as p (p)}
          <p class="text-ink mt-5 max-w-[68ch] text-lg leading-8">{p}</p>
        {/each}
        <h3 class="text-copper mt-10 font-mono text-xs tracking-[0.18em] uppercase">
          Who it's for
        </h3>
        {#each retailreadyDeep.sections.whoItsFor as p (p)}
          <p class="text-ink mt-4 max-w-[68ch] text-lg leading-8">{p}</p>
        {/each}
      </section>

      <section id="how-it-works" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">How it works</h2>
        <h3 class="text-copper mt-6 font-mono text-xs tracking-[0.18em] uppercase">Core flow</h3>
        <ol class="mt-4 grid gap-3">
          {#each retailreadyDeep.sections.coreFlow as step, i (step)}
            <li class="text-ink grid grid-cols-[3rem_1fr] gap-4 leading-7">
              <span class="text-muted font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
              <span>{step}</span>
            </li>
          {/each}
        </ol>
        <h3 class="text-copper mt-10 font-mono text-xs tracking-[0.18em] uppercase">
          Active retailers
        </h3>
        <table class="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr class="border-line border-b text-left">
              <th class="text-muted py-3 pr-4 font-mono text-xs tracking-[0.16em] uppercase"
                >Code</th
              >
              <th class="text-muted py-3 pr-4 font-mono text-xs tracking-[0.16em] uppercase"
                >Name</th
              >
              <th class="text-muted py-3 font-mono text-xs tracking-[0.16em] uppercase">Notes</th>
            </tr>
          </thead>
          <tbody>
            {#each retailreadyDeep.sections.activeRetailers as r (r.code)}
              <tr class="border-line border-b">
                <td class="text-ink py-3 pr-4 font-mono">{r.code}</td>
                <td class="text-ink py-3 pr-4">{r.name}</td>
                <td class="text-muted py-3">{r.notes}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

      <section id="architecture" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">Architecture</h2>
        <div class="border-line-dark bg-charcoal mt-6 rounded-lg border p-4 md:p-8">
          <ArchitectureDiagram variant="full" />
        </div>
        <h3 class="text-copper mt-10 font-mono text-xs tracking-[0.18em] uppercase">
          Runtime topology
        </h3>
        {#each retailreadyDeep.sections.runtime as p (p)}
          <p class="text-ink mt-4 max-w-[72ch] text-lg leading-8">{p}</p>
        {/each}
        <h3 class="text-copper mt-10 font-mono text-xs tracking-[0.18em] uppercase">
          .NET projects
        </h3>
        <dl class="border-line mt-4 border-y">
          {#each retailreadyDeep.sections.projects as proj (proj.name)}
            <div
              class="border-line grid gap-2 border-b py-4 last:border-b-0 md:grid-cols-[14rem_1fr] md:gap-8"
            >
              <dt class="text-ink font-mono text-sm">{proj.name}</dt>
              <dd class="text-muted text-sm leading-6">{proj.role}</dd>
            </div>
          {/each}
        </dl>
        <h3 class="text-copper mt-10 font-mono text-xs tracking-[0.18em] uppercase">
          Engine workers
        </h3>
        <table class="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr class="border-line border-b text-left">
              <th class="text-muted py-3 pr-4 font-mono text-xs tracking-[0.16em] uppercase"
                >Worker</th
              >
              <th class="text-muted py-3 pr-4 font-mono text-xs tracking-[0.16em] uppercase"
                >Poll</th
              >
              <th class="text-muted py-3 pr-4 font-mono text-xs tracking-[0.16em] uppercase"
                >Step timeout</th
              >
              <th class="text-muted py-3 font-mono text-xs tracking-[0.16em] uppercase">Job</th>
            </tr>
          </thead>
          <tbody>
            {#each retailreadyDeep.sections.workers as w (w.name)}
              <tr class="border-line border-b">
                <td class="text-ink py-3 pr-4 font-mono">{w.name}</td>
                <td class="text-muted py-3 pr-4 font-mono">{w.poll}</td>
                <td class="text-muted py-3 pr-4 font-mono">{w.timeout}</td>
                <td class="text-ink py-3 leading-6">{w.job}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

      <section id="customer-journey" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Customer journey
        </h2>
        <ol class="mt-6 grid gap-6">
          {#each retailreadyDeep.sections.journeyDeep as stage, i (stage.stage)}
            <li class="grid grid-cols-[3rem_1fr] gap-4">
              <span class="text-copper font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 class="text-ink text-xl font-semibold">{stage.stage}</h3>
                <p class="text-muted mt-2 max-w-[68ch] leading-7">{stage.body}</p>
              </div>
            </li>
          {/each}
        </ol>
      </section>

      <section id="platform-features" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Platform features
        </h2>
        <div class="border-line mt-6 grid gap-px border md:grid-cols-2">
          {#each retailreadyDeep.sections.features as feat (feat.name)}
            <div class="bg-paper p-6 md:p-8">
              <h3 class="text-ink text-xl font-semibold">{feat.name}</h3>
              <p class="text-muted mt-3 leading-7">{feat.body}</p>
            </div>
          {/each}
        </div>
      </section>

      <section id="design-decisions" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Key design decisions
        </h2>
        <ol class="mt-6 grid gap-6">
          {#each retailreadyDeep.sections.designDecisions as d, i (d.title)}
            <li class="grid grid-cols-[3rem_1fr] gap-4">
              <span class="text-copper font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 class="text-ink text-xl font-semibold">{d.title}</h3>
                <p class="text-muted mt-2 max-w-[72ch] leading-7">{d.body}</p>
              </div>
            </li>
          {/each}
        </ol>
      </section>

      <section id="tech-stack" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">Tech stack</h2>
        <dl class="border-line mt-6 border-y">
          {#each retailreadyDeep.sections.techStackTable as row (row.layer)}
            <div
              class="border-line grid gap-2 border-b py-5 last:border-b-0 md:grid-cols-[12rem_1fr] md:gap-8"
            >
              <dt class="text-muted font-mono text-xs tracking-[0.18em] uppercase">{row.layer}</dt>
              <dd class="text-ink font-mono text-sm">{row.tech}</dd>
            </div>
          {/each}
        </dl>
      </section>

      <Footer name={profile.name} role={profile.role} />
    </div>

    <aside class="hidden lg:block">
      <nav class="border-line sticky top-8 grid gap-2 border-l pl-6 text-sm">
        <p class="text-muted font-mono text-xs tracking-[0.18em] uppercase">On this page</p>
        {#each retailreadyDeep.toc as item (item.id)}
          <a
            class="text-ink hover:text-copper font-mono text-xs tracking-[0.16em] uppercase"
            href="#{item.id}">{item.label}</a
          >
        {/each}
      </nav>
    </aside>
  </article>
</main>
```

- [ ] **Step 3: Verify and visually walk**

```bash
npm run check
npm run dev
```

Open http://localhost:5173/retailready. Verify:

- Header with last-updated stamp + back link
- Sections render in order
- Architecture diagram renders with animated dots
- TOC visible on desktop right side
- Tables render correctly
- No internal-cross-references appear (search the page for "Docs/" — should not appear)

Stop dev server.

---

### Task 33: Build `/working-with-ai` deep-dive page

**Files:**

- Create: `src/lib/content/working-with-ai-deep.ts`
- Create: `src/routes/working-with-ai/+page.svelte`

Mirrors `/retailready` structure but with AI-orchestration content. Reuses `AISystemDiagram.svelte`.

- [ ] **Step 1: Write `src/lib/content/working-with-ai-deep.ts`**

```typescript
export const workingWithAiDeep = {
  title: "Working with Claude on a large codebase",
  subtitle:
    "A context-routing system between Claude and EdiPlatform — CLAUDE.md hierarchy, INDEX.md routing, orient skills, hooks, and memory.",
  lastUpdated: "2026-04-25",
  toc: [
    { id: "the-problem", label: "The problem" },
    { id: "the-system", label: "The system" },
    { id: "claude-md", label: "CLAUDE.md hierarchy" },
    { id: "index-md", label: "INDEX.md as router" },
    { id: "orient-skills", label: "Orient skills" },
    { id: "memory", label: "Memory system" },
    { id: "hooks", label: "Hooks" },
    { id: "subagents", label: "Sub-agents" },
    { id: "design-decisions", label: "Design decisions" },
    { id: "honest", label: "Honest framing" }
  ],
  problem: [
    "Working with a coding LLM on a large, evolving codebase is a context problem disguised as a chat problem. Even a million-token window can't hold every architecture diagram, retailer-specific quirk, deployment runbook, and open bug — and what's loaded suffers attention drift, gets evicted by compaction, or goes stale against source.",
    "The naive workaround — letting the model grep its way to understanding on every task — burns context, produces confidently-wrong assumptions, and re-discovers things the human already wrote down."
  ],
  system: [
    "EdiPlatform is a multi-project .NET 10 + SvelteKit codebase with 16 module-scoped CLAUDE.md files, 40 RLS-protected tables, three production servers, and a ~900-test default suite. The orchestration sits at the project's `.claude/` root and works in five layered pieces.",
    "Layer 1 — Hierarchical CLAUDE.md (16 files, auto-loaded by working dir). The 129-line root CLAUDE.md carries cross-cutting rules. Each .NET project has its own scoped CLAUDE.md.",
    "Layer 2 — INDEX.md as topic router. A 185-line file mapping 13 topics to a primary architecture diagram with a FRESH/STALE label, then deep links into research docs and memory files.",
    'Layer 3 — 13 orient-* skills (forked-context briefings). Each skill uses context: fork + Explore sub-agent. The skill body lists 4-5 must-read files and demands a structured briefing back with cited file:line references plus a mandatory "flag drift" section.',
    "Layer 4 — File-based typed memory system. 64 typed memory files split into 38 feedback_*, 19 project_*, and 7 reference_*. MEMORY.md groups them with one-line annotations.",
    "Layer 5 — Hooks (12 hook files). SessionStart loads INDEX.md plus current.md. PreToolUse-Bash blocks destructive git (git reset --hard, git clean -f, git restore .). PreToolUse-Edit blocks assertion changes in test files unless the new string strictly extends the old. PostToolUse-Bash prompts the model to fix code-not-tests after dotnet test failures.",
    "Layer 6 — 7 specialist sub-agents in `.claude/agents/`: test-orchestrator coordinates Docker-slot test pipelines with a mandatory user-checkpoint phase before fixing anything."
  ],
  designDecisions: [
    {
      title: "Forked-context skills, not auto-injection",
      body: "The original design auto-dumped INDEX.md on every UserPromptSubmit via route-context.py. That worked until INDEX hit ~19KB and started getting truncated. The auto-injector was retired in favor of context: fork skills that dispatch an Explore sub-agent. The diagram + memory files are read in the forked context; only the briefing returns. Trade-off: the model has to recognize the topic and self-invoke. The win: controller context stays lean across long sessions."
    },
    {
      title: "Loaded ≠ attended",
      body: 'Files dumped into context at SessionStart are bytes, not active memory. Long sessions + compactions evict unused content. Active re-reading via the Read tool is the only behavior that survives compaction. This single insight reshaped the whole orientation pattern away from "preload everything" toward "fork-and-summarize on demand."'
    },
    {
      title: "Diagrams as first-class, with executable parity tests",
      body: "Architecture diagrams under Docs/Architecture/diagrams/ carry FRESH/STALE labels, but parity is enforced by C1 meta-tests in EdiPlatform.IntegrationTests/MetaTests/ — adding a new entity, controller, or retailer without listing it in the matching diagram fails the next dotnet test. A C2 pre-push hook blocks pushes that touch watched directories without diagram updates, with a documented bypass token. Same pattern for test integrity: the commit-msg hook blocks assertion-flip diffs unless the message contains TEST-CHANGE: <TestName>: <reason>."
    },
    {
      title: "Sub-agents start cold — INDEX is paste-required",
      body: "Hooks don't fire for sub-agents. The dispatcher must paste the matching INDEX.md topic block into every sub-agent prompt. Most people miss this — the auto-load mechanism only protects the main thread; dispatchers must explicitly hand context down."
    },
    {
      title: "Typed memory naming is the index",
      body: "Memory files use a <type>_<slug>.md convention. MEMORY.md groups by type with one-line annotations marking high-leverage entries. INDEX.md DEEP links point straight at specific memory files. Files marked HIGH-LEVERAGE are the meta-rules that prevent recurring mistake classes. There's no vector DB — just disciplined naming and a hand-curated index."
    }
  ],
  honest: "I'm no master at this — but the system is opinionated, and the opinions are earned."
};
```

- [ ] **Step 2: Write `src/routes/working-with-ai/+page.svelte`**

```svelte
<script lang="ts">
  import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
  import { profile } from "$lib/content/profile";
  import { workingWithAiDeep } from "$lib/content/working-with-ai-deep";
  import AISystemDiagram from "$lib/components/shared/AISystemDiagram.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
  import PullQuote from "$lib/components/shared/PullQuote.svelte";
</script>

<svelte:head>
  <title>Working with Claude · Jesse Coble</title>
  <meta name="description" content={workingWithAiDeep.subtitle} />
</svelte:head>

<main id="main" class="bg-paper">
  <div class="border-line border-b">
    <nav class="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-5 md:px-8">
      <a
        class="text-muted hover:text-ink inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase"
        href="/"
      >
        <ArrowLeft size={14} weight="bold" />
        Back to portfolio
      </a>
      <span class="text-muted font-mono text-xs tracking-[0.18em] uppercase">
        Last updated {workingWithAiDeep.lastUpdated}
      </span>
    </nav>
  </div>

  <article
    class="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1fr_220px]"
  >
    <div>
      <header class="border-line border-b pb-10">
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Working with AI</p>
        <h1
          class="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl"
        >
          {workingWithAiDeep.title}
        </h1>
        <p class="text-muted mt-6 max-w-[60ch] text-xl leading-8">
          {workingWithAiDeep.subtitle}
        </p>
      </header>

      <section id="the-problem" class="mt-16">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">The problem</h2>
        {#each workingWithAiDeep.problem as p (p)}
          <p class="text-ink mt-5 max-w-[68ch] text-lg leading-8">{p}</p>
        {/each}
      </section>

      <section id="the-system" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">The system</h2>
        <div class="border-line-dark bg-charcoal mt-6 rounded-lg border p-4 md:p-8">
          <AISystemDiagram variant="full" />
        </div>
        {#each workingWithAiDeep.system as p (p)}
          <p class="text-ink mt-5 max-w-[72ch] text-lg leading-8">{p}</p>
        {/each}
      </section>

      <section id="design-decisions" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Design decisions
        </h2>
        <ol class="mt-6 grid gap-6">
          {#each workingWithAiDeep.designDecisions as d, i (d.title)}
            <li class="grid grid-cols-[3rem_1fr] gap-4">
              <span class="text-copper font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 class="text-ink text-xl font-semibold">{d.title}</h3>
                <p class="text-muted mt-2 max-w-[72ch] leading-7">{d.body}</p>
              </div>
            </li>
          {/each}
        </ol>
      </section>

      <section id="honest" class="border-line mt-16 border-t pt-12">
        <PullQuote tone="light">
          {#snippet children()}
            {workingWithAiDeep.honest}
          {/snippet}
        </PullQuote>
      </section>

      <Footer name={profile.name} role={profile.role} />
    </div>

    <aside class="hidden lg:block">
      <nav class="border-line sticky top-8 grid gap-2 border-l pl-6 text-sm">
        <p class="text-muted font-mono text-xs tracking-[0.18em] uppercase">On this page</p>
        {#each workingWithAiDeep.toc as item (item.id)}
          <a
            class="text-ink hover:text-copper font-mono text-xs tracking-[0.16em] uppercase"
            href="#{item.id}">{item.label}</a
          >
        {/each}
      </nav>
    </aside>
  </article>
</main>
```

- [ ] **Step 3: Verify and visually walk**

```bash
npm run check
npm run dev
```

Open http://localhost:5173/working-with-ai. Verify all sections render and the AI system diagram animates. Stop dev server.

---

## Phase 9 — Polish & Verification

### Task 34: A11y audit pass

**Files:**

- Modify: any component lacking proper landmarks, aria attributes, or focus styles

- [ ] **Step 1: Run dev server and inspect each page with browser devtools "Accessibility" panel**

```bash
npm run dev
```

For each page (`/`, `/retailready`, `/working-with-ai`):

1. Tab through the page from top — verify every interactive element gets a visible focus indicator
2. Inspect heading hierarchy in devtools — should descend in order (h1 → h2 → h3, no skips)
3. Verify all `<img>` and `<video>` have `alt` or are wrapped in `aria-hidden="true"` if decorative
4. Confirm both architecture diagrams have `aria-hidden="true"` (they do — they're decorative; the surrounding stat grids are the textual equivalents)
5. Verify color contrast on `text-muted` and `text-copper` against `bg-paper` using devtools color picker (must be ≥ 4.5:1 for body text)

- [ ] **Step 2: Add focus-visible styles to all anchor/button elements that lack them**

If any element shows no focus indicator, add to its component class list (or in a global rule in `app.css`):

```css
:focus-visible {
  outline: 2px solid var(--color-copper);
  outline-offset: 3px;
  border-radius: 4px;
}
```

Append to `app.css` if not already present. Verify after.

- [ ] **Step 3: Verify skip-to-content link works**

Reload page, press Tab once. The skip link should appear in the top-left and focus the main content when activated.

---

### Task 35: Reduced-motion verification

**Files:**

- (none — verification only)

- [ ] **Step 1: Enable reduced motion in macOS**

System Settings → Accessibility → Display → Reduce motion. Or via devtools: Rendering panel → Emulate CSS media feature `prefers-reduced-motion: reduce`.

- [ ] **Step 2: Reload each page and verify**

For `/`, `/retailready`, `/working-with-ai`:

- Hero video does not scrub on scroll (acceptable — it just sits at frame 0)
- No reveal animations — content appears immediately
- Magnetic anchors do not follow the cursor
- Architecture diagram dots are visible but stationary

- [ ] **Step 3: Disable reduced motion and verify everything resumes**

---

### Task 36: Cross-browser test

**Files:**

- (none — verification only)

- [ ] **Step 1: Test in Chrome**

```bash
npm run dev
```

Open in Chrome. Walk all three pages. Verify no console errors, animations smooth, layout intact.

- [ ] **Step 2: Test in Safari**

Open the same URL in Safari. Specific Safari concerns:

- Video autoplay (we use muted + playsinline — should work)
- `dvh` units
- `backdrop-filter` (used in header)

If anything breaks, fix it. Most likely culprit: video preload behavior. If the video doesn't seek, check that `videoEl.muted = true` is set before any `currentTime` write.

- [ ] **Step 3: Test in Firefox**

Specific Firefox concerns:

- `getPointAtLength()` performance on the diagrams (Firefox is slower than Chrome on heavy SVG)

If diagrams stutter, reduce dot count in `ArchitectureDiagram.svelte` from 3-per-edge to 2-per-edge.

- [ ] **Step 4: Test mobile viewport in Chrome devtools**

Throttle to "Mid-tier mobile" CPU. Verify:

- Hero scroll-scrub still feels responsive (not janky)
- Diagrams render at smaller viewBox without breaking
- TOC sidebar hides correctly on narrow screens

---

### Task 37: Final build verification

**Files:**

- (none — verification only)

- [ ] **Step 1: Clean build**

```bash
cd /Users/blackcolours/dev/work/portfolio
rm -rf .svelte-kit build
npm run check
npm run build
```

Expected: 0 errors, 0 warnings on check; build succeeds with `build/` directory created.

- [ ] **Step 2: Run preview server**

```bash
npm run preview
```

Open http://localhost:4173. Verify all three pages render identically to dev mode.

- [ ] **Step 3: Lighthouse audit**

In Chrome devtools → Lighthouse. Run for `/`, `/retailready`, `/working-with-ai`. Target: Performance ≥ 90 on all three.

If Performance falls below 90:

- Check LCP (likely the hero video) — verify `preload="auto"` on the `<video>` element only fires after first paint
- Check unused JS — Vite tree-shaking should handle this; if not, audit imports

- [ ] **Step 4: Review legacy directory and confirm safe to delete**

```bash
ls /Users/blackcolours/dev/work/portfolio/_legacy-next/
```

The user can delete `_legacy-next/` whenever they're confident in the new build. Do NOT delete it without their say-so.

- [ ] **Step 5: Final report to owner**

Summarize:

- Build status: ✓ passes check + build
- Pages: 3 (`/`, `/retailready`, `/working-with-ai`)
- Lighthouse Performance scores per page
- Any known issues or trade-offs accepted
- Note: `_legacy-next/` preserved; can be deleted after walkthrough

---

## Phase 10 — Publish to GitHub

### Task 38: Create public repo `coble-portfolio` and push

**Files:**

- (no new files; `gh` CLI creates the remote and pushes)

> **Risky-action gate:** This step creates a public artifact on the user's GitHub account. The owner has explicitly approved: public repo, name `coble-portfolio`. Do not deviate.

- [ ] **Step 1: Verify gh is authenticated**

```bash
gh auth status
```

Expected: shows the active user with sufficient scopes (`repo`, `workflow` recommended). If unauthenticated, the controller MUST stop and ask the user to run `gh auth login` themselves — do not run interactive auth from an agent.

- [ ] **Step 2: Confirm the working tree is clean**

```bash
cd /Users/blackcolours/dev/work/portfolio
git status
```

Expected: `nothing to commit, working tree clean`. If dirty, commit before continuing.

- [ ] **Step 3: Create the GitHub repo and push**

```bash
cd /Users/blackcolours/dev/work/portfolio
gh repo create coble-portfolio \
  --public \
  --source=. \
  --remote=origin \
  --description="Personal portfolio site for Jesse Coble — owner of Coble Solutions and RetailReady EDI. Built in SvelteKit." \
  --push
```

Expected: repo created, remote `origin` set, branch `main` pushed.

- [ ] **Step 4: Verify the repo on GitHub**

```bash
gh repo view coble-portfolio --web
```

Or use:

```bash
gh repo view coble-portfolio
```

to print metadata. Confirm the README/spec/plan are visible. (No README at this point — may add one in a follow-up.)

- [ ] **Step 5: Final report to owner**

Report:

- Repo URL
- Latest commit hash on main
- Lighthouse Performance scores per page from Task 37
- Anything in `_legacy-next/` they may want to delete (and how)

---

## Self-Review Notes

This plan covers the full spec. A few cross-references for the executor:

- **Spec §3.1 palette** → Task 4 step 2 (theme tokens)
- **Spec §3.2 typography** → Task 4 step 2 (font tokens) + Task 2 step 5 (font preconnect/load)
- **Spec §3.3 motion** → Tasks 5 (reveal), 6 (magnetic), 7 (scrub video)
- **Spec §4.1 sitemap** → Task 31 (`+page.svelte` composition)
- **Spec §5.x section content** → Task 20 (content module) + Tasks 21-30 (component implementations)
- **Spec §5.11 retailready deep dive** → Task 32
- **Spec §5.12 working-with-ai deep dive** → Task 33
- **Spec §6.3 animated diagrams** → Tasks 18 + 19
- **Spec §6.4 a11y** → Task 34
- **Spec §6.5 performance** → Task 37 step 3
- **Spec §6.6 build** → Task 2 (config) + Task 37 (verify)

If during execution any task reveals that the spec was wrong (e.g., a stat number is off), correct the content module (`profile.ts`) and note the change in the final summary.
