<script lang="ts">
  import { onMount } from "svelte";
  import Header from "$lib/components/shared/Header.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
  import { retailreadyDeep } from "$lib/content/retailready-deep";

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
  <title>RetailReady — System Deep-Dive · Jesse Coble</title>
  <meta
    name="description"
    content="A full technical deep-dive into RetailReady: multi-tenant EDI platform architecture, background workers, tenant isolation, and design decisions."
  />
</svelte:head>

<Header />

<main id="main">

  <!-- ═══════════════════════════════════════════════════════
       HERO / INTRO
  ═══════════════════════════════════════════════════════ -->
  <section class="section deep-hero">
    <div class="container">
      <div class="portal-bar deep-portal-bar"></div>
      <div class="deep-back fade-up">
        <a class="link-cta" href="/#retailready">
          <span class="arrow">←</span>
          Back to portfolio
        </a>
      </div>
      <div class="section-head fade-up delay-1">
        <div class="head-eyebrow">
          <div class="eyebrow">RETAILREADY EDI — SYSTEM OVERVIEW</div>
          <p class="deep-updated">Last updated {retailreadyDeep.lastUpdated}</p>
        </div>
        <h2>
          A <em>multi-tenant EDI platform</em> built for vendors selling through major retailers.
        </h2>
      </div>
      <p class="deep-lead fade-up delay-2">
        {retailreadyDeep.sections.whatItIs[0]}
      </p>
      <p class="deep-lead deep-lead--secondary fade-up delay-3">
        {retailreadyDeep.sections.whatItIs[1]}
      </p>

      <div class="stat-grid fade-up delay-2">
        <div class="stat-card cyan">
          <div class="v">5</div>
          <div class="l">Active retailers</div>
        </div>
        <div class="stat-card cyan">
          <div class="v">52</div>
          <div class="l">Data entities</div>
        </div>
        <div class="stat-card cyan">
          <div class="v">40</div>
          <div class="l">RLS-enforced tables</div>
        </div>
        <div class="stat-card violet">
          <div class="v"><small>~</small>900</div>
          <div class="l">Automated tests</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       WHO IT'S FOR
  ═══════════════════════════════════════════════════════ -->
  <section id="what-it-is" class="section deep-section">
    <div class="container">
      <div class="section-head fade-up">
        <div class="head-eyebrow">
          <div class="eyebrow">WHO IT'S FOR</div>
        </div>
        <h2>Small-to-mid vendors who need <em>retail compliance</em> without the overhead.</h2>
      </div>

      <div class="rr-highlights fade-up delay-1">
        {#each retailreadyDeep.sections.whoItsFor as p (p)}
          <article class="rr-hl">
            <div class="icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p>{p}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       HOW IT WORKS — CORE FLOW
  ═══════════════════════════════════════════════════════ -->
  <section id="how-it-works" class="section deep-section deep-section--alt">
    <div class="container">
      <div class="section-head fade-up">
        <div class="head-eyebrow">
          <div class="eyebrow">HOW IT WORKS</div>
        </div>
        <h2>The complete <em>EDI lifecycle</em> in eight steps.</h2>
      </div>

      <ol class="deep-flow fade-up delay-1">
        {#each retailreadyDeep.sections.coreFlow as step, i (step)}
          <li class="deep-flow-item">
            <span class="deep-flow-num">{String(i + 1).padStart(2, "0")}</span>
            <span class="deep-flow-text">{step}</span>
          </li>
        {/each}
      </ol>

      <div class="fade-up delay-2">
        <div class="eyebrow" style="margin: 56px 0 24px;">ACTIVE RETAILERS</div>
        <table class="deep-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {#each retailreadyDeep.sections.activeRetailers as r (r.code)}
              <tr>
                <td class="deep-table-mono">{r.code}</td>
                <td>{r.name}</td>
                <td class="deep-table-muted">{r.notes}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       ARCHITECTURE
  ═══════════════════════════════════════════════════════ -->
  <section id="architecture" class="section deep-section">
    <div class="container">
      <div class="section-head fade-up">
        <div class="head-eyebrow">
          <div class="eyebrow">ARCHITECTURE</div>
        </div>
        <h2>Three .NET runtimes, <em>RabbitMQ</em>, SignalR, and a Postgres foundation.</h2>
      </div>

      <div class="fade-up delay-1">
        {#each retailreadyDeep.sections.runtime as p (p)}
          <p class="deep-body">{p}</p>
        {/each}
      </div>

      <div class="fade-up delay-2">
        <div class="eyebrow" style="margin: 56px 0 24px;">.NET PROJECTS</div>
        <dl class="deep-dl">
          {#each retailreadyDeep.sections.projects as proj (proj.name)}
            <div class="deep-dl-row">
              <dt class="deep-dl-term">{proj.name}</dt>
              <dd class="deep-dl-def">{proj.role}</dd>
            </div>
          {/each}
        </dl>
      </div>

      <div class="fade-up delay-3">
        <div class="eyebrow" style="margin: 56px 0 24px;">ENGINE WORKERS</div>
        <div class="deep-table-wrap">
          <table class="deep-table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Poll</th>
                <th>Step timeout</th>
                <th>Job</th>
              </tr>
            </thead>
            <tbody>
              {#each retailreadyDeep.sections.workers as w (w.name)}
                <tr>
                  <td class="deep-table-mono">{w.name}</td>
                  <td class="deep-table-mono deep-table-muted">{w.poll}</td>
                  <td class="deep-table-mono deep-table-muted">{w.timeout}</td>
                  <td>{w.job}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       CUSTOMER JOURNEY
  ═══════════════════════════════════════════════════════ -->
  <section id="customer-journey" class="section deep-section deep-section--alt">
    <div class="container">
      <div class="section-head fade-up">
        <div class="head-eyebrow">
          <div class="eyebrow">CUSTOMER JOURNEY</div>
        </div>
        <h2>From <em>onboarding</em> to live production operations.</h2>
      </div>

      <ol class="deep-journey fade-up delay-1">
        {#each retailreadyDeep.sections.journeyDeep as stage, i (stage.stage)}
          <li class="deep-journey-item">
            <span class="deep-journey-num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 class="deep-journey-stage">{stage.stage}</h3>
              <p class="deep-journey-body">{stage.body}</p>
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       PLATFORM FEATURES
  ═══════════════════════════════════════════════════════ -->
  <section id="platform-features" class="section deep-section">
    <div class="container">
      <div class="section-head fade-up">
        <div class="head-eyebrow">
          <div class="eyebrow">PLATFORM FEATURES</div>
        </div>
        <h2>Everything vendors need to <em>operate and stay compliant.</em></h2>
      </div>

      <div class="cap-grid fade-up delay-1">
        {#each retailreadyDeep.sections.features as feat (feat.name)}
          <div class="cap-card">
            <h3>{feat.name}</h3>
            <p>{feat.body}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       KEY DESIGN DECISIONS
  ═══════════════════════════════════════════════════════ -->
  <section id="design-decisions" class="section deep-section deep-section--alt">
    <div class="container">
      <div class="section-head fade-up">
        <div class="head-eyebrow">
          <div class="eyebrow">KEY DESIGN DECISIONS</div>
        </div>
        <h2>The choices that make the system <em>reliable and maintainable.</em></h2>
      </div>

      <ol class="deep-decisions fade-up delay-1">
        {#each retailreadyDeep.sections.designDecisions as d, i (d.title)}
          <li class="deep-decision-item">
            <span class="deep-decision-num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 class="deep-decision-title">{d.title}</h3>
              <p class="deep-decision-body">{d.body}</p>
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       TECH STACK
  ═══════════════════════════════════════════════════════ -->
  <section id="tech-stack" class="section deep-section">
    <div class="container">
      <div class="section-head fade-up">
        <div class="head-eyebrow">
          <div class="eyebrow">TECH STACK</div>
        </div>
        <h2>The <em>tools and technologies</em> powering RetailReady.</h2>
      </div>

      <dl class="deep-dl fade-up delay-1">
        {#each retailreadyDeep.sections.techStackTable as row (row.layer)}
          <div class="deep-dl-row">
            <dt class="deep-dl-label">{row.layer}</dt>
            <dd>
              <div class="tech-tags">
                {#each row.tech.split(" · ") as tag (tag)}
                  <span>{tag}</span>
                {/each}
              </div>
            </dd>
          </div>
        {/each}
      </dl>

      <div class="section-cta fade-up delay-2">
        <a class="btn btn-ghost" href="/">
          <span class="arrow">←</span>
          Back to portfolio
        </a>
        <a class="btn btn-primary" href="/#contact">
          Start a conversation
          <span class="arrow">→</span>
        </a>
      </div>
    </div>
  </section>

</main>

<Footer />

<style>
  /* ─── Deep-dive page overrides / local-only classes ─── */

  .deep-hero {
    background: linear-gradient(180deg, var(--bg-void) 0%, var(--bg-deep) 100%);
    position: relative;
    padding-top: clamp(120px, 16vh, 180px);
  }
  .deep-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(60% 50% at 80% 20%, rgba(80, 200, 255, 0.14), transparent 70%),
      radial-gradient(50% 40% at 10% 80%, rgba(106, 92, 255, 0.12), transparent 70%);
  }
  .deep-hero .container {
    position: relative;
  }

  .deep-portal-bar {
    margin-bottom: 48px;
  }

  .deep-back {
    margin-bottom: 40px;
  }

  .deep-updated {
    margin: 8px 0 0;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    color: var(--fg-dim);
  }

  .deep-lead {
    color: var(--fg-haze);
    font-size: clamp(1.05rem, 0.6vw + 0.85rem, 1.2rem);
    line-height: 1.65;
    max-width: 68ch;
    margin: 0 0 20px;
  }
  .deep-lead--secondary {
    font-size: 0.98rem;
    padding-left: 24px;
    border-left: 1px solid var(--line-glow);
    color: var(--fg-haze);
    max-width: 64ch;
    margin-bottom: 0;
  }

  /* ─── Alternating section backgrounds ─── */
  .deep-section {
    background: var(--bg-night);
    position: relative;
  }
  .deep-section::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(50% 30% at 88% 30%, rgba(106, 92, 255, 0.10), transparent 70%),
      radial-gradient(40% 25% at 12% 75%, rgba(80, 200, 255, 0.08), transparent 70%);
  }
  .deep-section .container {
    position: relative;
  }
  .deep-section--alt {
    background: linear-gradient(180deg, var(--bg-night) 0%, var(--bg-deep) 50%, var(--bg-night) 100%);
  }
  .deep-section--alt::before {
    background:
      radial-gradient(60% 40% at 20% 30%, rgba(106, 92, 255, 0.13), transparent 70%),
      radial-gradient(50% 35% at 85% 70%, rgba(80, 200, 255, 0.10), transparent 70%);
  }

  /* ─── Body text ─── */
  .deep-body {
    color: var(--fg-haze);
    font-size: 1rem;
    line-height: 1.7;
    max-width: 72ch;
    margin: 0 0 18px;
  }
  .deep-body:last-of-type {
    margin-bottom: 0;
  }

  /* ─── Core flow ordered list ─── */
  .deep-flow {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0;
    border-top: 1px solid var(--line);
  }
  .deep-flow-item {
    display: grid;
    grid-template-columns: 3.5rem 1fr;
    gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid var(--line);
    align-items: baseline;
    transition: background var(--dur-base) var(--ease-out-soft);
  }
  .deep-flow-item:hover {
    background: linear-gradient(90deg, rgba(80, 200, 255, 0.04), transparent 80%);
  }
  .deep-flow-num {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.14em;
    color: var(--cyan);
    padding-top: 2px;
  }
  .deep-flow-text {
    font-size: 15px;
    line-height: 1.55;
    color: var(--fg-moonlight);
  }

  /* ─── Table ─── */
  .deep-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .deep-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .deep-table thead tr {
    border-bottom: 1px solid var(--line-glow);
  }
  .deep-table th {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--fg-dim);
    padding: 12px 16px 12px 0;
    text-align: left;
    white-space: nowrap;
  }
  .deep-table tbody tr {
    border-bottom: 1px solid var(--line);
    transition: background var(--dur-base) var(--ease-out-soft);
  }
  .deep-table tbody tr:hover {
    background: rgba(80, 200, 255, 0.04);
  }
  .deep-table td {
    padding: 14px 16px 14px 0;
    color: var(--fg-moonlight);
    line-height: 1.5;
    vertical-align: top;
  }
  .deep-table-mono {
    font-family: var(--font-mono);
    font-size: 12.5px;
  }
  .deep-table-muted {
    color: var(--fg-haze) !important;
  }

  /* ─── Definition list ─── */
  .deep-dl {
    margin: 0;
    border-top: 1px solid var(--line);
  }
  .deep-dl-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 20px 0;
    border-bottom: 1px solid var(--line);
    transition: background var(--dur-base) var(--ease-out-soft);
  }
  @media (min-width: 720px) {
    .deep-dl-row {
      grid-template-columns: 16rem 1fr;
      gap: 32px;
      align-items: baseline;
    }
  }
  .deep-dl-row:hover {
    background: linear-gradient(90deg, rgba(80, 200, 255, 0.04), transparent 80%);
  }
  .deep-dl-term {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--fg-moonlight);
  }
  .deep-dl-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--fg-dim);
    padding-top: 4px;
  }
  .deep-dl-def {
    font-size: 14px;
    line-height: 1.6;
    color: var(--fg-haze);
    margin: 0;
  }

  /* ─── Customer journey ─── */
  .deep-journey {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0;
  }
  .deep-journey-item {
    display: grid;
    grid-template-columns: 3.5rem 1fr;
    gap: 20px;
    padding: 28px 0;
    border-bottom: 1px solid var(--line);
  }
  .deep-journey-item:first-child {
    border-top: 1px solid var(--line);
  }
  .deep-journey-num {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--cyan);
    padding-top: 4px;
  }
  .deep-journey-stage {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 1.2;
    letter-spacing: -0.012em;
    color: var(--fg-moonlight);
    margin: 0 0 10px;
  }
  .deep-journey-body {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.6;
    color: var(--fg-haze);
    max-width: 68ch;
  }

  /* ─── Design decisions ─── */
  .deep-decisions {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0;
  }
  .deep-decision-item {
    display: grid;
    grid-template-columns: 3.5rem 1fr;
    gap: 20px;
    padding: 28px 0;
    border-bottom: 1px solid var(--line);
    transition: background var(--dur-base) var(--ease-out-soft);
  }
  .deep-decision-item:first-child {
    border-top: 1px solid var(--line);
  }
  .deep-decision-item:hover {
    background: linear-gradient(90deg, rgba(106, 92, 255, 0.05), transparent 80%);
  }
  .deep-decision-num {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--violet-bright);
    padding-top: 4px;
  }
  .deep-decision-title {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 1.2rem;
    line-height: 1.25;
    letter-spacing: -0.01em;
    color: var(--fg-moonlight);
    margin: 0 0 10px;
  }
  .deep-decision-body {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.65;
    color: var(--fg-haze);
    max-width: 72ch;
  }
</style>
