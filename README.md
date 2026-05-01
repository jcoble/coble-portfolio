# Jesse Coble — Portfolio

Single-page portfolio for **Jesse Coble** — software engineer, founder of [RetailReady EDI](https://retailreadyedi.com), and the person behind the AI-augmented dev workflow that powers it.

The site is a SvelteKit 2 / Svelte 5 single-page experience with a scroll-driven cinematic hero (GSAP ScrollTrigger pins the section while a video scrubs to scroll progress) and eight stacked content sections covering RetailReady, the AI workflow, professional experience, and contact.

## Stack

- **Framework:** SvelteKit 2 + Svelte 5 (runes), TypeScript
- **Styling:** Tailwind CSS v4 + global CSS tokens (Portal · Cyan-Violet palette)
- **Type:** Fraunces (display, variable axes), Inter Tight (sans), JetBrains Mono (mono) — Google Fonts
- **Motion:** GSAP 3 + ScrollTrigger (Hero scrub-pin); IntersectionObserver-based fade-up reveals elsewhere
- **Adapter:** `@sveltejs/adapter-cloudflare`
- **Deployment:** Cloudflare Workers (Workers + Static Assets), project name `jesse-coble-portfolio`
- **Lint / format:** ESLint flat config, Prettier with `prettier-plugin-svelte` + `prettier-plugin-tailwindcss`

## Run

```bash
npm install
npm run dev          # vite dev (defaults to 5173; this project uses 5174 to avoid collisions)
npm run build
npm run preview
npm run check        # svelte-kit sync + svelte-check
npm run lint
npm run format
```

`ediplatform-web` typically owns 5173 on this machine, so the portfolio runs on **5174**:

```bash
npm run dev -- --port 5174
```

## Deploy

The Cloudflare Worker is configured in `wrangler.jsonc` (binding `ASSETS`, compat date `2026-04-25`, `nodejs_als` flag).

```bash
npm run build
npx wrangler deploy
```

To check what's currently live: `npx wrangler deployments list`, or open the Cloudflare dashboard → Workers & Pages → `jesse-coble-portfolio`.

## Structure

```
src/
├── app.css                         # global tokens, type scale, shared section CSS
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte                # homepage section composition
│   ├── retailready/                # RetailReady deep-dive page
│   └── working-with-ai/            # AI workflow deep-dive page
└── lib/
    ├── actions/
    │   └── scrubVideo.ts           # use:scrubVideo — maps progress 0..1 → video.currentTime
    ├── components/
    │   ├── Hero.svelte             # GSAP ScrollTrigger pin + 7-stage card sequence
    │   ├── Practice.svelte
    │   ├── RetailReady.svelte
    │   ├── AIEngineering.svelte
    │   ├── Experience.svelte
    │   ├── HowIBuild.svelte
    │   ├── Resume.svelte
    │   ├── Contact.svelte
    │   └── shared/                 # Header, Footer, plus reusable building blocks
    └── content/
        ├── retailready-deep.ts     # content data for /retailready
        └── working-with-ai-deep.ts
static/
└── media/                          # hero videos (hero-portal-scrub.mp4) + portrait + poster
```

## Hero cinematic

The opening hero is the most distinctive piece:

- The video (`/media/hero-portal-scrub.mp4`) is manually preloaded via `fetch().body.getReader()` → chunks → `Blob` → `URL.createObjectURL`. This gives the splash byte-accurate progress; the native `<video>` `progress` event is unreliable across browsers / CDNs / dev servers.
- A full-viewport splash blocks scroll until the video is loaded. A Skip Animation button appears at 4s, and an automatic skip kicks in at 20s if the video genuinely fails to arrive.
- Once ready, **GSAP ScrollTrigger** pins the hero section (`pin: true`, `end: '+=1800%'`, `scrub: 0.4`) and progress drives `video.currentTime` linearly through 7 staged cards: opening hero, three "what / how / background" beats, RetailReady proof card, a threshold tag, and the final closing block.
- The cinematic is the universal default. There is intentionally no `prefers-reduced-motion` gate — only the manual Skip and the auto-timeout fallback.

## Color & type

Direction: **Portal · Cyan-Violet.** Deep navy surfaces (`--color-void: #04060d`, `--color-night: #070b18`) with cyan (`#50c8ff`), violet (`#6a5cff`), and ember (`#ffb070`) accents. Tokens live at the top of `src/app.css` (look for `--color-*`, `--cyan*`, `--violet*`, `--ember`, `--portal-*`).

Type pairing: Fraunces (display, with `opsz` and `SOFT` variable axes) for headlines and stage cards; Inter Tight for body and UI; JetBrains Mono for eyebrows, stat tiles, and inline code.

## Author

[Jesse Coble](mailto:coble.jesse@gmail.com) · Akron, OH · [github.com/jcoble](https://github.com/jcoble)

RetailReady inquiries: <jessecoble@retailreadyedi.com>
