# Portfolio — Svelte Redesign Design Doc

**Date:** 2026-04-25
**Owner:** Jesse Coble
**Status:** Approved (brainstorming complete; awaiting spec review before plan)

## 1. Context

Existing portfolio at `/Users/blackcolours/dev/work/portfolio` is Next.js 16 / React 19 / Tailwind v4 / Framer Motion. It works but the owner doesn't know React; he ships SvelteKit at his day job (EdiPlatform). Maintaining the portfolio in a stack he can't comfortably edit is a long-term liability.

This redesign is a **complete rebuild in SvelteKit** that also raises the design ceiling and adds two substantive technical showcases — RetailReady (the EDI platform he built) and the AI orchestration system he built for working with Claude on the EdiPlatform codebase.

The portfolio targets technical employers and prospective customers. The goal is to demonstrate concrete capability — not brag — through real artifacts: real platform architecture, real numbers, real code, and the system he built to manage AI on a large codebase.

## 2. Decisions Locked In

| Decision | Choice | Why |
|---|---|---|
| Framework | SvelteKit (latest), Node adapter | Owner ships SvelteKit daily; Next.js liability removed |
| Component model | Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`) | Matches EdiPlatform |
| Styling | Tailwind v4 | Already in current site; matches EdiPlatform |
| Language | TypeScript | Standard |
| Icons | `phosphor-svelte` | Same icon family as current site |
| Animation library | None (Svelte built-in `spring()` / `tweened()` + transitions + custom IntersectionObserver action) | No framer-motion equivalent needed; smaller bundle |
| Component kit | None (not Shadcn-Svelte) | Overkill for one-page site; we want bespoke |
| Hero video | Reuse existing `hero-laptop-scrub.mp4` | Already wired; second clip rejected (tonal mismatch + watermark) |
| Existing Next.js code | Move to `_legacy-next/` (or delete after working build) | Preserve until we're confident |

## 3. Design Direction — "Technical Editorial"

A paper-cream base for personal/editorial sections, with deep-ink technical sections that interleave. Reference: Stripe Press, Tailscale, Plaid, Linear docs — not Linear/Vercel marketing pages, not Pentagram-style portfolios.

The light/dark interleave is the central move. Each transition is a sticky-panel pass — feels like turning the page from a magazine to a system spec sheet.

### 3.1 Palette

```
--paper        #f4f2eb   warm cream base
--paper-deep   #e8e3d7   sub-surface
--ink          #0e0e0b   deep warm black (sharper than current #181813)
--charcoal     #1c1c17   dark-section base
--muted        #6d6a60   secondary text
--line         #d6d0c4   dividers / borders on light
--line-dark    #2a2a23   dividers on dark

Accents:
--copper       #a26b4f   warm primary accent (CTAs, headers)
--moss         #737d5d   neutral secondary
--signal       #7fb1b2   muted cyan — DARK SECTIONS ONLY for data flow dots, diagram edges
```

The single cool accent (`signal`) used sparingly against the warm base is the trick that makes it feel "designed" rather than "themed."

### 3.2 Typography

| Role | Family | Source | Notes |
|---|---|---|---|
| Display | **Instrument Serif** | Google Fonts (variable) | Big editorial headlines, hero, section openers |
| Body | **Geist Sans** | Google Fonts | Already in use; modern, neutral |
| Technical | **Geist Mono** | Google Fonts | Stats, EDI codes, system specs, architecture labels |

Type scale (Tailwind classes — informative, not strict):
- Display 1 (hero, section openers): `text-7xl md:text-9xl` Instrument Serif, leading-[0.92], tracking-tight
- Display 2 (sub-section openers): `text-5xl md:text-7xl` Instrument Serif, leading-[0.95]
- Heading 3 (cards): `text-2xl md:text-3xl` Geist Sans semibold
- Body large: `text-lg md:text-xl` Geist Sans, leading-8
- Body: `text-base` Geist Sans, leading-7
- Eyebrow: `text-xs uppercase tracking-[0.2em]` Geist Mono
- Stat number: `text-5xl md:text-7xl` Geist Mono (technical sections — feels precise, not editorial)
- Code/label: `text-xs` Geist Mono

### 3.3 Motion Principles

- **Reveal on enter** — opacity 0→1, y 24→0px, blur 8→0px, spring (`stiffness 70, damping 18, mass 0.7`), staggered children at 90ms
- **Magnetic anchors** — mouse-tracking translate via `spring()` (`stiffness 180, damping 16`), 16% travel, snap on leave
- **Hero scroll-scrub** — keep existing pattern, port to SvelteKit (custom scroll listener + video.currentTime sync)
- **Sticky panels** — stack with `position: sticky`, refined timing at boundaries, parallax y movement on entry/exit
- **Animated dots (architecture diagram)** — continuous SVG `<circle>` motion along `<path>` via `getPointAtLength()` + `requestAnimationFrame`, slight stagger per dot, color-coded by document type
- **Hover** — cards lift 2px + reveal a 1px copper edge highlight on the leading side, 240ms ease-out
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables all spring/scrub/parallax; reveals collapse to instant fade
- **No GSAP, no ScrollTrigger** — Svelte built-ins cover everything

## 4. Information Architecture

### 4.1 Main page `/`

| # | Section | Background | Purpose |
|---|---|---|---|
| 1 | Hero | dark (charcoal + video) | Identity, headline, intro, CTAs |
| 2 | Practice | paper | Short positioning bridge |
| 3 | RetailReady | paper → dark | The centerpiece — proves "I ship serious systems" |
| 4 | AI Engineering | dark | The meta-system — proves "I work with AI at system level" |
| 5 | Coble Solutions | paper | Smaller, deliberately understated |
| 6 | Programming Experience | paper | Career timeline + bio (real content) |
| 7 | Capabilities | paper | What kind of work he does |
| 8 | Method | dark card on paper | Beliefs / principles |
| 9 | Résumé | paper | Editorial typeset + PDF download |
| 10 | Contact | paper | Minimal email-forward |

### 4.2 Deep-dive pages

- `/retailready` — full system overview deep dive (typeset Svelte; redacted from `Docs/SYSTEM-OVERVIEW.md`)
- `/working-with-ai` — AI orchestration deep dive (problem → architecture → design decisions → honest framing)

### 4.3 Cross-linking

- RetailReady main-page section ends with `View the full system overview →` linking to `/retailready`
- AI Engineering main-page section ends with `Read how I work with Claude →` linking to `/working-with-ai`
- Both deep-dive pages have a sticky right-side TOC on desktop and back-to-portfolio link
- Same animated architecture diagram component appears on both main page (RetailReady section, condensed) and `/retailready` (full)
- Same AI-system diagram appears on main page (AI Engineering section, condensed) and `/working-with-ai` (full)

## 5. Content Specifications

### 5.1 Hero (existing copy, polished)

- Eyebrow: `OWNER OF COBLE SOLUTIONS AND RETAILREADY EDI`
- Headline (Instrument Serif): "Building sharper systems for retail operations."
- Intro: existing intro copy, lightly tightened
- CTAs:
  - "Selected work" → anchor `#retailready`
  - "Start a conversation" → `mailto:coble.jesse@gmail.com`
- Live availability pill (existing pulse dot pattern)

### 5.2 Practice — short positioning bridge

Keep existing copy; tighten the second sentence. One paragraph block + the three signal items (Founder-led / Operational / Fast).

### 5.3 RetailReady centerpiece

**Subsections (in order):**

1. **Header** — Eyebrow `RETAILREADY EDI`, Display 1 headline, 2-paragraph intro
2. **Animated architecture diagram** — central interactive figure (see §6 for technical detail)
3. **Stats grid** — 4-column, big numbers + small mono labels:
   - 5 active retailers
   - 52 entities
   - 40 RLS-enforced tables
   - 60 controllers (36 customer + 24 admin)
   - 7 background workers + 2 watchers
   - 48 migrations
   - ~900 tests
4. **Document types table** — X12 / EDIFACT side-by-side grid
5. **Customer journey rail** — Sandbox → Preflight → Certification → Go-Live → Production (5-step horizontal rail with mono labels)
6. **Tech stack reference grid** — rendered like a real spec sheet:
   - Frontend: SvelteKit · Svelte 5 · Tailwind v4 · Shadcn-Svelte
   - API: .NET 10 · ASP.NET Core · EF Core · SignalR
   - Engine: .NET 10 (8 workers + 2 watchers, advisory-lock singleton)
   - Database: PostgreSQL (RLS on 40 tables)
   - Messaging: RabbitMQ (API↔Engine)
   - EDI Protocols: SFTP (SSH.NET) · AS2 (OpenAS2)
   - Billing: Stripe
   - Accounting: QuickBooks · NetSuite (OAuth2)
   - Infrastructure: Docker · Traefik · Hetzner VPSes
7. **Design highlights** — five flex points as numbered editorial blocks (see list below)
8. **The wedge** — wedge copy (see below)
9. **CTA** — `View the full system overview →`

**Design highlights to feature on main page (5 of the 9 from research):**

1. **Two-layer monitoring** — In-app `EngineAlertService` watches domain logic; host-level `edi-monitor.py` systemd service catches container crashes. The only notifier that survives an API startup failure is the host-level one. Built after a real silent outage.
2. **Per-worker cascading timeouts** — Every Engine worker carries its own poll interval and per-step deadline enforced via `CancellationTokenSource.CreateLinkedTokenSource`. One stalled retailer connection can't freeze the pipeline.
3. **Outbound retry with optimistic concurrency** — 45-second per-doc timeout; `RowVersion` (Postgres `xmin`) prevents retransmits from racing with inbound 997 acknowledgments.
4. **Advisory-lock singleton with takeover handshake** — Engine startup acquires `pg_advisory_lock(59483)`; if a stale instance holds it, calls `pg_terminate_backend()` to evict cleanly. A watcher service triggers graceful shutdown on lock loss instead of leaving zombies.
5. **Postgres RLS at the database layer** — 40 tables enforce row-level security via the `ediplatform_api` role and per-request GUC variables. `FORCE ROW LEVEL SECURITY` blocks even the table owner from bypassing policies.

**The wedge (working draft — verify with owner):**

> Most EDI platforms are black boxes that hide failures behind support tickets. RetailReady shows you the document, the validator output, the retransmission state, and the SLA clock — all live, all in one place. Sandbox runs your real EDI generators against a retailer simulator before you touch a live partner. RLS at the database layer means a controller bug can't leak across customers. A single-instance engine with advisory-lock takeover means no zombie processes, no lost documents.

(No competitors named on main page. Wedge is descriptive, not comparative.)

### 5.4 AI Engineering section (NEW)

**Subsections:**

1. **Header** — Eyebrow `WORKING WITH AI`, headline like "Building a context system around Claude."
2. **The problem framing** — 1-paragraph: "Working with a coding LLM on a large codebase is a context problem disguised as a chat problem. Even a 1M-token window can't hold every architecture diagram, retailer-specific quirk, deployment runbook, and open bug — and what's loaded suffers attention drift, gets evicted by compaction, or goes stale."
3. **System diagram (mini)** — animated SVG showing User Prompt → Main Thread → invokes orient skill → forks Explore sub-agent → reads diagram + memory + project CLAUDE.md → structured briefing returns → main thread continues. Same dot-flow treatment as the EdiPlatform diagram. Visual symmetry.
4. **Stats grid** — same visual style as RetailReady stats:
   - 16 CLAUDE.md files (root + 15 module-scoped)
   - 13 orient skills
   - 28 total skills
   - 12 hook scripts
   - 7 specialist sub-agents
   - 64 typed memory files (38 feedback + 19 project + 7 reference)
5. **Key insight callout** — pull-quote style: *"Loaded ≠ attended. Files dumped into SessionStart context become bytes the model doesn't actively retrieve, and the next compaction evicts them. So orientation is on-demand and forked, not preloaded."*
6. **Honest framing close** — *"I'm no master at this. But the system is opinionated, and the opinions are earned."*
7. **CTA** — `Read how I work with Claude →`

### 5.5 Coble Solutions

Single card, one paragraph. Deliberately smaller than RetailReady. Existing copy is fine.

### 5.6 Programming Experience

Two-column block, real content from résumé:

- **Left: Bio block** — Eyebrow `EXPERIENCE`, headline like "A decade-plus of EDI." Body paragraph: "10+ years building software, with EDI as the through-line. Started in 2014 building reader/writer engines for steamship lines at DepotSystems (322, EDIFACT CEDEX, 301, Westim, Destim, Codeco, WORDER), spent four years as the sole developer on ISO management systems for the medical device and aerospace industries at IMSXpress, and currently runs RetailReady — a retail EDI platform for vendors selling into Walmart, Best Buy, Dollar Tree, Meijer, and Dollar General."

- **Right: Timeline rail** — vertical timeline, mono labels, three rows:
  ```
  2022 — Present    Coble Solutions / RetailReady EDI
                    Founder, Lead Engineer

  2018 — 2022       AQA Company (IMSXpress)
                    Senior / Sole Developer

  2014 — 2018       Edge Networks / DepotSystems
                    Developer → Senior Developer
  ```

The narrative emphasis: **EDI experience since 2014 — RetailReady is a continuation, not a pivot.** That single line is what makes this section punch.

### 5.7 Capabilities

Refined existing four capabilities. Same content, sharper typography.

### 5.8 Method

Existing four methods, in the dark editorial card. Tighten typography.

### 5.9 Résumé

Real content from `/Users/blackcolours/Downloads/Jesse Coble Resume.md` typeset editorial-style. PDF copy from `/Users/blackcolours/Downloads/Jesse Coble Resume.pdf` → `static/resume.pdf` during scaffold.

**Layout (single column, generous margins, editorial spread):**

1. **Header block** — Name (Instrument Serif display 1), email (`coble.jesse@gmail.com`) + general location ("Akron, OH") below in mono. **Street address and phone number OMITTED** from the rendered web version for privacy — both still appear in the downloadable PDF. Personal email used here (`coble.jesse@gmail.com`), not the RetailReady business email — see §8.
2. **Summary** — 1 paragraph from résumé, lightly tightened
3. **Professional Experience** — 3 entries with dates / role / company / location, then bullet list of accomplishments. Add a current entry at the top (2022-Present, Coble Solutions / RetailReady EDI) since the résumé as written ends at 2022.
4. **Projects & Technical Accomplishments (DepotSystems)** — bulleted list, mono labels for project names, prose for descriptions
5. **Technical Summary** — 4 sub-categories (Languages / Tools & Methodologies / Software & Systems / Databases) rendered as mono-labeled rows. Add modern stack additions: TypeScript, SvelteKit, Svelte 5, Tailwind, .NET 10, RabbitMQ, AS2, Docker, Traefik, etc. — separating "Historical" from "Current."
6. **Education** — Kent State, B.S. Computer Information Systems, 2008
7. **Download button** — `Download résumé (PDF)` linking to `/resume.pdf`

**The portfolio résumé is intentionally a richer rendering than the static PDF.** It includes the 2022-present period that the standalone PDF doesn't yet cover. Owner can update the PDF separately when ready; the rendered version reflects current state.

### 5.10 Contact

Tightened existing block. Primary `mailto:coble.jesse@gmail.com` button, plus optional secondary line "RetailReady inquiries: jessecoble@retailreadyedi.com" (smaller, mono, below the primary). Footer with name + role.

### 5.11 Deep-dive page `/retailready`

Structure (typeset Svelte, NOT raw markdown render):

1. Header — title, "Last updated 2026-04-25" stamp, sticky right-side TOC (desktop only)
2. What it is / who it's for — prose
3. How it works — core flow + X12/EDIFACT table + 5 active retailers table
4. Architecture — full animated diagram (reused component) + runtime topology + .NET projects table + Engine workers table + RLS notes
5. Customer journey — Sandbox → Preflight → Certification → Go-Live → Production (expanded)
6. Platform features — Products / Accounting / AI Assistant / Notifications / Reports
7. Key design decisions — multi-format support, hardcoded retailer configs, validator scope (outbound-only), three ack layers (997/855/824), single-instance engine, RLS, sandbox isolation, all five flex points from the main-page section, plus the four reserve flex points (15-partnership simulator routing, FORCE RLS detail, AES-256-GCM per-cert encryption, required-env-parameter API discipline)
8. Tech stack — final table
9. Footer — back to portfolio + contact link

**Redactions from `Docs/SYSTEM-OVERVIEW.md`:**
- Remove all VPS IPs (`49.13.236.209`, `46.224.175.20`)
- Remove all internal cross-references to `Docs/Architecture/diagrams/...`, `CLAUDE.md`, `INDEX.md`, `Docs/Research/...`
- Remove the entire "FURTHER READING" pointer table at the top
- Soften specific test count "~899" to "~900"
- Keep: hostnames (already public DNS), Postgres role names, Hetzner mention, advisory-lock key, Sentry/Stripe deps

### 5.12 Deep-dive page `/working-with-ai`

Structure:

1. Header — title, "Last updated 2026-04-25", sticky TOC
2. The problem — context limits, attention drift, eviction by compaction
3. The system — diagram + layered explanation
4. Layer 1: CLAUDE.md hierarchy — 16 files, what each scopes
5. Layer 2: INDEX.md as router — 185 lines, 13 topics, structure
6. Layer 3: Orient skills — `context: fork`, structured briefings, file:line citations, "flag drift" requirement
7. Layer 4: Memory system — 64 files in three classes (feedback / project / reference), MEMORY.md hand-curated index
8. Layer 5: Hooks — SessionStart, destructive-git guard, test-assertion guard (blocks assertion changes unless message contains `TEST-CHANGE: <TestName>: <reason>`), post-test-failure reminder
9. Layer 6: Sub-agents — 7 specialist agents, test-orchestrator coordinates Docker-slot test pipeline with mandatory user-checkpoint phase
10. Design decisions:
    - Forked-context skills over auto-injection — original `route-context.py` retired after INDEX hit ~19KB
    - "Loaded ≠ attended" — the meta-rule
    - Diagram parity enforced by `dotnet test` meta-tests + pre-push hook with documented bypass token
    - Sub-agents start cold — INDEX block must be pasted into dispatch prompt
    - Typed memory naming as the index — no vector DB
11. Honest framing — "I'm no master at this..."
12. Footer — back to portfolio

## 6. Technical Specifications

### 6.1 File structure

```
portfolio/
├── docs/superpowers/specs/         # this doc + future specs
├── src/
│   ├── app.css                     # Tailwind + theme tokens
│   ├── app.html                    # SvelteKit shell
│   ├── lib/
│   │   ├── content/
│   │   │   ├── profile.ts          # main-page content
│   │   │   ├── retailready.ts      # /retailready content
│   │   │   └── working-with-ai.ts  # /working-with-ai content
│   │   ├── components/
│   │   │   ├── Hero.svelte
│   │   │   ├── Practice.svelte
│   │   │   ├── RetailReady.svelte
│   │   │   ├── AIEngineering.svelte
│   │   │   ├── CobleSolutions.svelte
│   │   │   ├── Experience.svelte
│   │   │   ├── Capabilities.svelte
│   │   │   ├── Method.svelte
│   │   │   ├── Resume.svelte
│   │   │   ├── Contact.svelte
│   │   │   └── shared/
│   │   │       ├── StickyPanel.svelte
│   │   │       ├── Reveal.svelte
│   │   │       ├── MagneticAnchor.svelte
│   │   │       ├── ArchitectureDiagram.svelte
│   │   │       ├── AISystemDiagram.svelte
│   │   │       ├── StatsGrid.svelte
│   │   │       ├── TechStackGrid.svelte
│   │   │       ├── DocTypesTable.svelte
│   │   │       ├── JourneyRail.svelte
│   │   │       ├── PullQuote.svelte
│   │   │       ├── Header.svelte
│   │   │       └── Footer.svelte
│   │   └── actions/
│   │       ├── reveal.ts           # IntersectionObserver action for Reveal
│   │       ├── magnetic.ts         # mouse-tracking spring action
│   │       └── scrubVideo.ts       # scroll-scrubbed video sync
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte            # main portfolio
│       ├── retailready/
│       │   └── +page.svelte
│       └── working-with-ai/
│           └── +page.svelte
├── static/
│   ├── media/
│   │   ├── hero-laptop-scrub.mp4   # reuse from current
│   │   └── hero-transition.jpg     # reuse from current
│   └── resume.pdf                  # copied from /Users/blackcolours/Downloads/Jesse Coble Resume.pdf
├── package.json
├── svelte.config.js
├── tailwind.config.js (or v4 inline @theme in app.css)
└── tsconfig.json
```

### 6.2 Routing

- SvelteKit file-based routing
- All pages SSG-rendered (no server-side dynamic content)
- `+layout.svelte` defines header + global styles
- Navigation between pages uses `goto()` with smooth scroll preservation

### 6.3 Animated diagrams (technical detail)

Both architecture diagrams use the same approach:

- SVG `<path>` elements define edges between nodes
- Animated `<circle>` elements move along paths via `getPointAtLength()` driven by `requestAnimationFrame`
- Each dot has: starting offset (0-1), speed multiplier, color (signal/copper/moss), document-type label
- Dots loop — when offset ≥ 1, reset to 0 with small random jitter to avoid mechanical alignment
- Pause animation when off-screen (IntersectionObserver) for performance
- Reduced-motion: dots become static at evenly-spaced positions along the path

Architecture diagram (RetailReady) — linear pipeline:
- Nodes: `Retailer → EDI Server → Engine → Database → API → Browser` (6 nodes)
- Edge labels: `850 / 855 / 856 / 810 / 997` (color-coded by document type)
- The API→Browser edge is annotated `via SignalR` (transport, not a separate node)
- Outbound docs flow right-to-left on a return path; inbound left-to-right

AI system diagram — fork-and-return pattern:
- Main flow: `User Prompt → Main Thread → Sub-agent → Briefing → Main Thread (resume)` (loop)
- Sub-agent reads from a cluster: `Diagram + Memory + CLAUDE.md` (rendered as three nodes feeding into the sub-agent)
- 6 visible nodes total; clearer than the 9-node version on smaller viewports
- Edge labels: `prompt / dispatch / read / synthesize / return / act`

### 6.4 A11y

- Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<section>` with proper headings)
- Focus rings on all interactive elements (don't remove the default — restyle if needed)
- Skip-to-content link in `+layout.svelte`
- All images/videos have `alt`/`aria-label`
- Animated diagrams are decorative — `aria-hidden="true"` with a textual fallback nearby
- Color contrast: paper/ink ≥ 12:1, paper/copper ≥ 4.5:1, dark/signal ≥ 4.5:1 (verify in build)
- `prefers-reduced-motion` honored across all motion

### 6.5 Performance targets

- Lighthouse Performance ≥ 90
- LCP ≤ 2.5s on 4G
- Hero video preload `auto` only after first paint
- Fonts loaded with `display: swap`
- Images lazy-loaded with `loading="lazy"` (except hero)
- No external analytics in initial build (owner can add later)

### 6.6 Build / deploy

- Adapter: `@sveltejs/adapter-node` (matches EdiPlatform pattern) — owner can swap to `adapter-vercel` or `adapter-static` later if preferred
- `npm run build` produces a Node build
- `npm run dev` for local development
- `npm run typecheck` runs `svelte-check`
- No CI/CD in scope for this design

## 7. Out of Scope

- CMS / blog / dynamic content
- Contact form (just `mailto:` link)
- Analytics
- i18n
- Dark/light mode toggle (the design already interleaves both)
- A separate `/coble-solutions` deep dive (only RetailReady + AI get deep dives)
- Mobile app
- SEO beyond basic metadata

## 8. Open Questions / Owner Decisions Pending

- **Emails — RESOLVED (2026-04-25):**
  - `coble.jesse@gmail.com` — primary personal contact, used in Hero CTAs, Contact section, and rendered Résumé header
  - `jessecoble@retailreadyedi.com` — RetailReady business contact, optionally appears under the RetailReady section as a "Contact RetailReady →" link (separate from personal contact)
  - Old addresses (`jesse@coblesolutions.com`, `coblesolutions@gmail.com`) are RETIRED — do not appear anywhere on the new site
  - The downloadable PDF still contains `coblesolutions@gmail.com`; owner can update separately if desired
- **Phone number on web** — résumé includes `(330) 396-6191`. Default plan: omit from rendered web version; only appears in the downloadable PDF.
- **Standalone résumé PDF** — currently ends at 2022 and doesn't include Coble Solutions / RetailReady period. The portfolio's rendered résumé section bridges this. Owner can update the PDF independently; spec doesn't block on it.
- **Wedge copy verification** — working draft in §5.3; owner confirms or revises during walkthrough
- **Deep-dive update cadence** — `/retailready` and `/working-with-ai` will go stale as the platform evolves; not building auto-sync; manual updates expected

## 9. Success Criteria

- Site loads in SvelteKit dev mode without errors
- All sections render with content
- All animations respect `prefers-reduced-motion`
- Both deep-dive pages link correctly from main page and back
- `npm run build` succeeds
- `npm run typecheck` passes with zero errors
- Tested in Chrome, Safari, Firefox — desktop + mobile viewports
- Architecture diagrams animate smoothly (60fps target on M1+)
- No bugs reported by owner during walkthrough

## 10. Implementation Approach

After this spec is approved, the next step is `superpowers:writing-plans` to produce a detailed implementation plan with subtasks. The plan will sequence:

1. Archive existing Next.js code
2. Scaffold SvelteKit + dependencies
3. Set up Tailwind v4 + theme tokens + fonts
4. Build shared primitives (Reveal, MagneticAnchor, StickyPanel)
5. Build the architecture diagram component (used twice)
6. Build the AI system diagram component
7. Build main-page sections in order (Hero → Contact)
8. Build `/retailready` deep dive
9. Build `/working-with-ai` deep dive
10. A11y + reduced-motion pass
11. Cross-browser test
12. Build verification

Each step gets reviewed before the next begins.
