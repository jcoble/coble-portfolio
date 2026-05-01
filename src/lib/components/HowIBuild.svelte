<script lang="ts">
  import { spotlight } from "$lib/actions/spotlight";
</script>

<section id="how-i-build" class="section build">
  <div class="container">
    <div class="section-head">
      <div class="head-eyebrow fade-up"><div class="eyebrow">HOW I BUILD</div></div>
      <h2 class="fade-up delay-1">
        Engineered for the <em>next person on call</em> — including the version of me
        who comes back six months later.
      </h2>
    </div>

    <p class="build-intro fade-up delay-2">
      My work tends to sit where product, data, infrastructure, and operations overlap.
      The four areas below are where most of the time goes — and underneath them, four
      principles I keep coming back to when I'm deciding what to build, what to leave
      out, and what to refuse.
    </p>

    <div class="cap-grid">
      <article class="cap-card fade-up delay-1" use:spotlight>
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <path d="M10 6.5h4M6.5 10v4M14 17.5h-4M17.5 14v-4" />
        </svg>
        <h3>Integrations</h3>
        <p>
          EDI, APIs, accounting systems, partner-specific quirks. The wiring between
          systems that don't agree on anything by default.
        </p>
      </article>
      <article class="cap-card fade-up delay-2" use:spotlight>
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
        </svg>
        <h3>Backend systems</h3>
        <p>
          Data models, queues, background workers — and the validation, retries,
          and audit trails that let them survive contact with production.
        </p>
      </article>
      <article class="cap-card fade-up delay-3" use:spotlight>
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18M7 14h6" />
        </svg>
        <h3>Product-minded UI</h3>
        <p>
          Interfaces that explain what the system is actually doing right now,
          instead of hiding the complexity behind a spinner.
        </p>
      </article>
      <article class="cap-card fade-up delay-4" use:spotlight>
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <h3>Production discipline</h3>
        <p>
          Tests as a safety net, monitoring as a second pair of eyes, data
          isolation enforced below the application — so nothing depends on
          everyone always remembering to do the right thing.
        </p>
      </article>
    </div>

    <div class="principles-block fade-up">
      <div class="principles-eyebrow"><div class="eyebrow">FOUR PRINCIPLES</div></div>
      <div class="principles">
        <div class="pr fade-up delay-1"><span>01</span>Make state visible.</div>
        <div class="pr fade-up delay-2"><span>02</span>Enforce boundaries below the app.</div>
        <div class="pr fade-up delay-3"><span>03</span>Design for failure.</div>
        <div class="pr fade-up delay-4"><span>04</span>Keep systems understandable.</div>
      </div>
    </div>
  </div>
</section>

<style>
  .principles-block {
    margin-top: 64px;
    padding-top: 48px;
    border-top: 1px solid rgba(80, 200, 255, 0.12);
  }
  .principles-eyebrow {
    margin-bottom: 24px;
  }
</style>
