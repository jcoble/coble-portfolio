# Coble Portfolio Design System

A design system for **Jesse Coble's** personal portfolio site — a single-page experience that showcases:

- **RetailReady EDI** — a multi-tenant retail EDI platform (Walmart, Best Buy, Dollar Tree, Meijer, Dollar General). X12 + EDIFACT, .NET 10 + SvelteKit, Postgres RLS, RabbitMQ, AS2/SFTP transport.
- **Coble Solutions** — founder-led product engineering services.
- **Working with AI** — Jesse's opinionated context system around Claude (skills, sub-agents, hook scripts, typed memory).
- **Résumé / Experience** — 10+ years of EDI, ISO management systems (medical/aerospace), and current EDI platform work.

## Source

- **Repo:** [`jcoble/coble-portfolio`](https://github.com/jcoble/coble-portfolio) — SvelteKit 2 + Svelte 5 runes + Tailwind v4, deployed on Cloudflare Pages.
- Composed of 10 stacked sections inside `<StickyPanel>` wrappers (each is `h-[290dvh]` with a `sticky top-0 h-dvh` inner surface). Hero uses scroll-driven video scrubbing.
- **Phosphor Svelte** is the icon set in production.
- Full-bleed media: `static/media/hero-laptop-scrub.mp4` + `static/media/hero-transition.jpg`.

## Direction · "Aurora · Magical-Tech"

The brief is anchored in a portrait of Jesse coding under a tree at night by a moonlit lake — the leaves light-painted in hot pink, magenta, and electric purple, fireflies in the grass, a glowing laptop. We built the design system around that single image.

1. **Dark, cinematic surfaces** — deep night blues + bark purples. No light theme.
2. **Neon aurora accents** — magenta `#FF3DA6`, orchid `#C84BFF`, violet `#7A3DFF`, and a single electric cyan signal `#3DE1FF`. Plus warm firefly yellow `#F9D976` for "live" / availability dots.
3. **Glow as a primitive** — buttons, eyebrows, focus rings, hover states *emit light*. Aurora gradient hairlines replace the old copper rule.
4. **Video everywhere, not just the hero** — every major section has its own scroll-scrubbed background video / parallax layer. Sections don't end and start; they cross-dissolve through the same piece of glass. The hero's laptop-scrub treatment becomes a system primitive (`<VideoBackdrop scrub progress />`) that every card uses.
5. **Magical motion** — fireflies drift, aurora gradients pulse and rotate, headline punch-words have a faint chromatic glow, sticky panels hand off via cross-scale + cross-blur.

The new direction is documented in `colors_and_type.css` and the visual foundations section below.

## Index

- `README.md` — this file (overview, content, visual foundations, iconography)
- `SKILL.md` — invocable skill manifest for Claude Code / agents
- `colors_and_type.css` — CSS variables for color, type, spacing, motion
- `assets/` — logos, favicon, hero media, illustrations
- `fonts/` — webfont references (currently Google Fonts CDN; flagged for review)
- `preview/` — small swatch / specimen / token cards rendered into the Design System tab
- `ui_kits/portfolio/` — the JSX recreation of the portfolio UI (Hero, RetailReady section, sticky-card scroll engine, etc.) with an interactive `index.html`
- `slides/` — *(none — no slide template was provided)*

---

## Content Fundamentals

Jesse's voice across the site is **plain-spoken, technically specific, and confident without bravado.** It reads like an engineer who has shipped a lot and would rather tell you exactly what they built than market around it.

**Tone & casing**
- Sentence case for almost everything. Headlines are written as full sentences with a period (e.g. *"Building sharper systems for retail operations."*, *"A retail EDI platform that shows its work."*).
- Eyebrows / labels are `font-mono` ALL CAPS with wide tracking (`0.2em`) — used for section markers like `RETAILREADY EDI`, `BY THE NUMBERS`, `STACK`, `STAGE 01`.
- Numbers are concrete (5 active retailers, 52 entities, 40 RLS-enforced tables, ~900 tests). They *carry* the marketing.

**Pronouns & POV**
- First-person *I/Jesse* on personal sections; third-person *Jesse builds…* on Practice. Mixed POV is intentional — the site is a portfolio, not a company landing page. *You* is rare, used only in product positioning ("RetailReady shows you the document…").
- Never "we" — there is no team voice.

**Vibe checks**
- ✅ **Specific over generic:** *"pg_advisory_lock(59483) on a dedicated non-pooled connection"*, not "robust locking."
- ✅ **Show-the-work humility:** *"I'm no master at this. But the system is opinionated, and the opinions are earned."*
- ✅ **Operational framing:** *"A 2.7-day silent outage in April 2026 proved one layer wasn't enough."* — failures and lessons are part of the pitch.
- ❌ **No emoji.** Anywhere.
- ❌ **No hype words** ("revolutionary", "next-gen", "AI-powered" used sparingly and only when literally accurate).
- ❌ **No exclamation marks.** Tone is dry-warm, never excited.

**Section pattern**
Every section follows: `eyebrow → headline → body → evidence`. Evidence is a stats grid, a doc-types table, a stage rail, a tech-stack matrix, or a numbered "design highlights" list. Quotes (italic display serif, copper left rule) anchor the bigger arguments.

**Examples to mimic**
- *"Most EDI platforms are black boxes that hide failures behind support tickets. RetailReady shows you the document, the validator output, the retransmission state, and the SLA clock — all live, all in one place."*
- *"Loaded ≠ attended. Files dumped into SessionStart context become bytes the model doesn't actively retrieve…"*
- *"Bring the hard part early."* — the contact CTA. Five words. That's the whole thing.

---

## Visual Foundations

### Color
The palette is **deep night with a neon aurora.** All surfaces are dark; accents glow.

| Role | Token | Value | Notes |
|---|---|---|---|
| Surface — void | `--bg-void` | `#07060D` | Deepest black, behind everything. |
| Surface — night | `--bg-night` | `#0C0A18` | Primary dark — "lake at midnight". |
| Surface — bark | `--bg-bark` | `#15101F` | Elevated card. |
| Surface — mist | `--bg-mist` | `#1C1530` | Highest elevation / hover. |
| Foreground — moonlight | `--fg-moonlight` | `#F3EEF8` | Primary text. |
| Foreground — haze | `--fg-haze` | `#B9B0C8` | Secondary text. |
| Foreground — dim | `--fg-dim` | `#6E6580` | Tertiary, captions. |
| Hairline | `--line` | `#261E3A` | Default. |
| Hairline (glow) | `--line-glow` | `#3A2A5A` | Hover/focus. |
| **Aurora — magenta** | `--aurora-magenta` | `#FF3DA6` | Primary accent. |
| **Aurora — orchid** | `--aurora-orchid` | `#C84BFF` | Secondary. |
| **Aurora — violet** | `--aurora-violet` | `#7A3DFF` | Tertiary. |
| **Aurora — cyan** | `--aurora-cyan` | `#3DE1FF` | Signal — focus, links. |
| **Firefly** | `--aurora-firefly` | `#F9D976` | "Live" dots, moon, fireflies. |

**The Aurora Bar** — the brand's signature mark. A 92° linear gradient: magenta → orchid → violet → cyan. Used as eyebrow rule, button glow, divider, scrubber bar.

**Rules**
- Surfaces are always dark. There is no light theme.
- Glow > flat fill. Use `--glow-magenta` / `--glow-cyan` shadow tokens on accents.
- Imagery is moody, lit by colored practicals (pink/purple/cyan), with grain. The hero portrait sets the law.

### Type
- **Display:** `Fraunces` (variable, `opsz` and `SOFT` axes used). Replaces Instrument Serif. More technical, more presence at large sizes; the soft-axis lets us lean either humanist or sharp. *Flagged: substitution from Google Fonts — see Fonts section.*
- **Sans:** `Inter Tight` for UI body and labels. Replaces Geist. Tighter default tracking, cleaner at small sizes.
- **Mono:** `JetBrains Mono` for eyebrows, stat values, code, EDI doc codes. Replaces Geist Mono.

**Scale (semantic)**
| Token | Size / Line | Use |
|---|---|---|
| `--type-display-xl` | clamp 56–112 / 0.92 | Hero headline. |
| `--type-display-lg` | clamp 44–88 / 0.95 | Section H2 ("A retail EDI platform that shows its work."). |
| `--type-display-md` | clamp 32–56 / 1.0 | Card-level H3. |
| `--type-body-lg` | 18 / 1.65 | Lead paragraphs. |
| `--type-body` | 16 / 1.6 | Default body. |
| `--type-label` | 12 / 1.0, tracking 0.2em, uppercase | Eyebrows. |
| `--type-mono-stat` | clamp 28–56 / 1.0 | Stats grid values. |

### Spacing & Layout
- **Container max-width:** 1500px (matches the source).
- **Inner padding:** `1rem → 2rem → 3rem` at sm/md/lg.
- **Section vertical rhythm:** `py-24` (384px) at base, `py-32` at md+.
- **Gutter grid:** subtle 88×88 background grid on light surfaces (`rgba(14,14,11,0.03)` lines). Carried over from the source.
- **Hairlines, not borders.** `1px` rules in `--line` / `--line-dark`. `border-radius` only on cards and buttons (8 / 12 / 24px). No pill chips.

### Backgrounds (the cinematic ask)
Every section sits over its own video / motion layer. Treat the whole page like one continuous reel.

1. **Aurora wash** (`.bg-aurora`) — three radial blooms (violet upper-left, magenta upper-right, cyan bottom) over `--bg-night`. Fixed attachment, so it parallax-floats as you scroll.
2. **Star field** (`.bg-stars`) — pure-CSS multi-radial dots at random positions. Drifts ~30s.
3. **Grain** (`.bg-grain`) — overlay multiply noise, 16% opacity. Stops the gradients from banding.
4. **Per-section video backdrops** — every major panel (`Hero`, `RetailReady`, `AI Engineering`, `Coble Solutions`, `Experience`) has its own short looping video clip behind it, scrub-tied to scroll progress and ducked behind a section-tinted gradient so copy stays legible. Examples:
   - Hero — laptop-glow under the tree (the portrait, animated).
   - RetailReady — fiber-data flowing through pipes, magenta cast.
   - AI — particle field, orchid/violet swirl.
   - Coble Solutions — slow ink-in-water, cyan.
   - Experience — long-exposure firefly trails.
5. **Cross-panel hand-off** — outgoing video fades + scales `1 → 0.94`; incoming video enters at `1.06 → 1` with a 12% blur clearing. Never a hard cut.
6. **Aurora cone halo** — behind hero headlines and section monograms, a slow-rotating `conic-gradient` at 35–45% opacity, blurred 80px. Pure CSS.

### Motion (the big upgrade)

1. **Sticky-panel hand-off.** Each section is `h-[300dvh]` with a `sticky top-0 h-dvh` inner stage. The *outgoing* stage scales `1 → 0.94` + opacity `1 → 0.4` + blur `0 → 6px` over the last 22% of its range; the *incoming* stage enters scaled `1.06 → 1`, blur `8 → 0px`, opacity `0.5 → 1`. Result: cross-dissolve through one piece of glass.
2. **Per-section scrubbed video.** `<VideoBackdrop>` primitive: `currentTime = duration * progress` on every scroll tick. No autoplay, no audio. Each section gets its own clip.
3. **Aurora cone halo.** Slow `360deg / 40s` rotation behind hero / section eyebrows, `filter: blur(80px)`, mix-blend `screen`.
4. **Firefly drift.** 12 `.firefly` dots per dark panel, individually animated `translate3d` paths, 18–32s loops, `box-shadow: var(--glow-firefly)`.
5. **Aurora bar pulse.** The 2px gradient hairline shifts hue `0 → 30deg` on a 6s loop. Subliminal.
6. **Headline chromatic glow.** Display headlines (`.t-aurora`) gradient-clip text + `drop-shadow(0 0 18px rgba(255,61,166,0.35))`. Used on punch words only.
7. **Card lift-in.** `translateY(36px) → 0`, `scale(0.985) → 1`, opacity `0 → 1`, staggered 60ms. Eases on `--ease-out-soft`.
8. **Magnetic cursor pull** on primary CTAs (Spring stiffness 0.18, damping 0.62, travel 0.16). Ember replaced with magenta glow on hover.

**Easing tokens**
- `--ease-out-soft`: `cubic-bezier(0.2, 0.8, 0.2, 1)` — default reveal.
- `--ease-out-expo`: `cubic-bezier(0.16, 1, 0.3, 1)` — large-amplitude moves (panel hand-offs).
- `--ease-in-out-quint`: `cubic-bezier(0.83, 0, 0.17, 1)` — bidirectional state (toggle, sticky scrub).

**Durations**
- `--dur-fast`: 180ms (hover, focus ring)
- `--dur-base`: 320ms (button press, link color)
- `--dur-slow`: 720ms (section reveal)
- `--dur-cinema`: 1100ms (panel hand-off)

### Hover & Press
- **Hover (links/labels):** color shifts to `--aurora-magenta`; aurora-gradient underline grows from left, 240ms.
- **Hover (cards):** translate `-2px`, magenta rim glow appears via `box-shadow: 0 0 24px rgba(255,61,166,0.35)`. Hairline brightens `--line` → `--line-glow`.
- **Hover (primary button):** glow intensifies, magenta rim brightens 0.5 → 1.0.
- **Press (all):** `translateY(1px)` + tighten transition to 80ms. No scale.
- **Focus-visible:** 2px solid `--aurora-cyan`, 3px offset, 4px radius. Cyan, not magenta — distinct from hover.

### Borders, Radius, Shadow
- **Radius:** `--r-sm: 8px`, `--r-md: 14px`, `--r-lg: 28px`. Slightly softer than the old system to match the magical register.
- **Borders:** 1px hairlines in `--line`. Cards add a faint magenta inner rim via `--shadow-rim-magenta` rather than a hard outer border highlight.
- **Card shadow:** `0 30px 80px -50px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,61,166,0.06)`.
- **Panel-lift between sections:** `0 -28px 80px -34px rgba(122,61,255,0.55)` (violet, not black). Sells the cross-fade.
- **CTA glow:** `0 18px 50px -22px rgba(255,61,166,0.6)`.

### Transparency & Blur
- Header bar: `bg-[rgba(12,10,24,0.46)]` + `backdrop-blur-xl`, with a 1px aurora-gradient hairline on bottom.
- Cards: `bg-[rgba(28,21,48,0.42)]` over the aurora wash so the glow shows through. Never solid.

### Card anatomy
- 1px hairline `--line` (`#261E3A`)
- `bg-[rgba(28,21,48,0.42)]` wash, `backdrop-filter: blur(12px)`
- `--shadow-rim-magenta` on default state
- 14px radius
- 24–48px padding (responsive)
- `.lift` translates up 2px on hover, swaps to `--shadow-rim-cyan` and adds an outer magenta glow

### Layout rules
- Header is `position: absolute; top: 16px` over hero, then `position: sticky; top: 16px` once the page scrolls. Always rounded `--r-md`, never full-width.
- Section eyebrows pin to the top-left of each panel, never centered.
- Stat grids are 2 cols mobile / 4 cols desktop, divided by 1px hairlines (no card backgrounds).
- The contact section uses `min-h-[60dvh]` and a 1.6:1 ratio between headline and CTA column. Don't over-compress it.

---

## Iconography

**System:** [Phosphor Icons](https://phosphoricons.com) at `weight="bold"` for buttons and `weight="duotone"` for the Compass-style accent icons (Practice section). Sized 18–28px.

**Used in production:** `ArrowDownRight`, `ArrowRight`, `ArrowUpRight`, `CirclesThreePlus`, `SealCheck`, `Lightning`, `Compass`, `EnvelopeSimple`, `DownloadSimple`. That's it — small, consistent vocabulary.

**Approach for this design system:** we substitute the **Lucide CDN** (`lucide@latest/dist/umd/lucide.js`) for the JSX UI kit, mapping 1:1:
- `ArrowDownRight` → `arrow-down-right`
- `ArrowUpRight` → `arrow-up-right`
- `CirclesThreePlus` → `circles` (closest match — flagged)
- `SealCheck` → `badge-check`
- `Lightning` → `zap`
- `Compass` → `compass`
- `EnvelopeSimple` → `mail`
- `DownloadSimple` → `download`

Phosphor Bold and Lucide are visually compatible — same 1.5–2px stroke, same rounded line caps, same 24px grid. **`CirclesThreePlus` does not have a perfect Lucide twin; flagged for the user to confirm.** If exact parity matters, we can ship the actual Phosphor SVG sprites in `assets/icons/`.

**Other rules**
- **No emoji.**
- **No unicode chars as icons.** The site uses real SVG everywhere.
- **Imagery:** the only photographic asset in the repo is `hero-transition.jpg` (a static fallback for the scroll-scrubbed laptop video). No stock photography, no illustration, no avatars.

---

## Caveats / Open Questions

- **Fonts:** Fraunces, Inter Tight, JetBrains Mono are loaded from Google Fonts. **Licensed font files (TTF/WOFF2) are not in `fonts/`.** If you want self-hosted, drop them in `fonts/` and I'll wire them up.
- **The user does not like the existing palette and type pairing** — this refresh proposes Fraunces + Inter Tight + JetBrains Mono and a graphite/bone/ember palette. **This is a proposal, not a finalization** — please react and we'll iterate.
- **Icon `CirclesThreePlus` has no clean Lucide match.** If you want pixel parity, say the word and we'll embed the Phosphor SVGs directly.
- **No slide deck was provided**, so `slides/` is intentionally absent.
