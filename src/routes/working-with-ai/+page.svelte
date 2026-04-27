<script lang="ts">
  import { onMount } from "svelte";
  import Header from "$lib/components/shared/Header.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
  import { workingWithAiDeep } from "$lib/content/working-with-ai-deep";

  onMount(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll(".fade-up").forEach((el) => el.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "-10% 0px -22% 0px" }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
</script>

<svelte:head>
  <title>Working with Claude · Jesse Coble</title>
  <meta name="description" content={workingWithAiDeep.subtitle} />
</svelte:head>

<Header />

<main id="main">

  <!-- ── Hero / page header ──────────────────────────────────────────────── -->
  <section class="section deep-hero">
    <div class="container">
      <div class="fade-up">
        <div class="eyebrow">Working with AI</div>
      </div>
      <h1 class="deep-headline fade-up delay-1">
        Working with Claude on a <em>large codebase</em>
      </h1>
      <p class="deep-sub fade-up delay-2">{workingWithAiDeep.subtitle}</p>
      <div class="deep-meta fade-up delay-3">
        <span class="meta-label">Last updated</span>
        <span class="meta-value">{workingWithAiDeep.lastUpdated}</span>
        <span class="meta-sep" aria-hidden="true">·</span>
        <a class="meta-back" href="/">← Back to portfolio</a>
      </div>
    </div>
  </section>

  <div class="portal-bar"></div>

  <!-- ── The problem ─────────────────────────────────────────────────────── -->
  <section id="the-problem" class="section">
    <div class="container">
      <div class="section-head">
        <div class="head-eyebrow fade-up">
          <div class="eyebrow">The problem</div>
        </div>
        <h2 class="fade-up delay-1">
          Context is a problem <em>disguised as a chat problem.</em>
        </h2>
      </div>

      {#each workingWithAiDeep.problem as p (p)}
        <p class="body-prose fade-up">{p}</p>
      {/each}

      <div class="stat-grid fade-up delay-2">
        <div class="stat-card cyan">
          <div class="v">1M</div>
          <div class="l">Token window — still not enough</div>
        </div>
        <div class="stat-card violet">
          <div class="v">∞</div>
          <div class="l">Attention drift risk</div>
        </div>
        <div class="stat-card cyan">
          <div class="v">0</div>
          <div class="l">Correct assumptions from grep alone</div>
        </div>
        <div class="stat-card violet">
          <div class="v">↻</div>
          <div class="l">Re-discovered facts per session</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── The system ──────────────────────────────────────────────────────── -->
  <section id="the-system" class="section sys-section">
    <div class="container">
      <div class="section-head">
        <div class="head-eyebrow fade-up">
          <div class="eyebrow">The system</div>
        </div>
        <h2 class="fade-up delay-1">
          Six layered pieces, <em>one coherent workflow.</em>
        </h2>
      </div>

      <p class="body-prose fade-up">{workingWithAiDeep.system[0]}</p>

      <ol class="layer-list">
        {#each workingWithAiDeep.system.slice(1) as layer, i (layer)}
          <li class="layer-item fade-up" style="--delay:{i * 60}ms">
            <span class="layer-num">0{i + 1}</span>
            <p class="layer-body">{layer}</p>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <!-- ── Design decisions ────────────────────────────────────────────────── -->
  <section id="design-decisions" class="section">
    <div class="container">
      <div class="section-head">
        <div class="head-eyebrow fade-up">
          <div class="eyebrow">Design decisions</div>
        </div>
        <h2 class="fade-up delay-1">
          Opinions that are <em>earned, not assumed.</em>
        </h2>
      </div>

      <div class="principles fade-up delay-2">
        {#each workingWithAiDeep.designDecisions as d, i (d.title)}
          <div class="pr">
            <span>{String(i + 1).padStart(2, "0")}</span>
            {d.title}
          </div>
        {/each}
      </div>

      <div class="cap-grid">
        {#each workingWithAiDeep.designDecisions as d, i (d.title)}
          <div class="cap-card fade-up" class:delay-1={i % 4 === 1} class:delay-2={i % 4 === 2} class:delay-3={i % 4 === 3}>
            <h3>{d.title}</h3>
            <p>{d.body}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ── Honest framing ──────────────────────────────────────────────────── -->
  <section id="honest" class="section honest-section">
    <div class="container">
      <div class="section-head">
        <div class="head-eyebrow fade-up">
          <div class="eyebrow">Honest framing</div>
        </div>
        <h2 class="fade-up delay-1">
          Not autopilot. <em>Engineered workflow.</em>
        </h2>
      </div>

      <div class="ai-pull fade-up delay-2">
        <blockquote>
          {workingWithAiDeep.honest}
        </blockquote>
      </div>

      <div class="section-cta fade-up delay-3">
        <a class="btn btn-ghost" href="/">← Back to portfolio</a>
        <a class="btn btn-primary" href="mailto:coble.jesse@gmail.com">Start a conversation</a>
      </div>
    </div>
  </section>

</main>

<Footer />

<style>
  /* ── Page hero ────────────────────────────────────────────────────────── */
  .deep-hero {
    background: var(--portal-wash);
    padding-top: clamp(120px, 18vh, 200px);
  }

  .deep-headline {
    font-family: var(--font-display);
    font-weight: 350;
    font-size: clamp(2.5rem, 5vw + 0.5rem, 5rem);
    line-height: 1.0;
    letter-spacing: -0.022em;
    font-variation-settings: "opsz" 100, "SOFT" 30;
    color: var(--fg-moonlight);
    margin: 20px 0 24px;
    max-width: 22ch;
    text-wrap: balance;
  }

  .deep-headline em {
    font-style: italic;
    color: var(--cyan-bright);
  }

  .deep-sub {
    font-size: clamp(1rem, 1vw + 0.7rem, 1.2rem);
    line-height: 1.6;
    color: var(--fg-haze);
    max-width: 60ch;
    margin: 0 0 32px;
  }

  .deep-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.1em;
    flex-wrap: wrap;
  }

  .meta-label {
    color: var(--fg-dim);
    text-transform: uppercase;
    letter-spacing: 0.18em;
  }

  .meta-value {
    color: var(--cyan);
  }

  .meta-sep {
    color: var(--fg-dim);
  }

  .meta-back {
    color: var(--fg-haze);
    transition: color var(--dur-fast) var(--ease-out-soft);
  }

  .meta-back:hover {
    color: var(--cyan-bright);
  }

  /* ── Prose body ───────────────────────────────────────────────────────── */
  .body-prose {
    color: var(--fg-haze);
    font-size: clamp(1rem, 0.6vw + 0.85rem, 1.15rem);
    line-height: 1.7;
    max-width: 68ch;
    margin: 0 0 24px;
  }

  /* ── System layers ────────────────────────────────────────────────────── */
  .sys-section {
    background: linear-gradient(180deg, var(--bg-night) 0%, var(--bg-deep) 50%, var(--bg-night) 100%);
    position: relative;
  }

  .sys-section::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(60% 40% at 80% 20%, rgba(80, 200, 255, 0.12), transparent 70%),
      radial-gradient(50% 40% at 10% 80%, rgba(106, 92, 255, 0.10), transparent 70%);
  }

  .layer-list {
    list-style: none;
    margin: 40px 0 0;
    padding: 0;
    display: grid;
    gap: 0;
  }

  .layer-item {
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 24px;
    align-items: baseline;
    padding: 28px 0;
    border-top: 1px solid var(--line);
    transition: background var(--dur-base) var(--ease-out-soft);
    transition-delay: var(--delay, 0ms);
  }

  .layer-item:last-child {
    border-bottom: 1px solid var(--line);
  }

  .layer-item:hover {
    background: linear-gradient(90deg, rgba(80, 200, 255, 0.04), transparent 80%);
  }

  .layer-num {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.22em;
    color: var(--cyan);
    padding-top: 4px;
  }

  .layer-body {
    margin: 0;
    font-size: 15px;
    line-height: 1.65;
    color: var(--fg-haze);
  }

  /* ── Honest section ───────────────────────────────────────────────────── */
  .honest-section {
    background: var(--bg-night);
    position: relative;
  }

  .honest-section::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(60% 60% at 70% 50%, rgba(106, 92, 255, 0.14), transparent 70%),
      radial-gradient(50% 50% at 20% 100%, rgba(80, 200, 255, 0.12), transparent 70%);
  }

  .honest-section .container {
    position: relative;
  }
</style>
