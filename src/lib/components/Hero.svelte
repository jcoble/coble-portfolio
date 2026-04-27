<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { scrubVideo } from "$lib/actions/scrubVideo";

  let stageEl: HTMLElement;
  let videoEl: HTMLVideoElement | undefined = $state();
  let progress = $state(0);
  let videoReady = $state(false);
  let bufferedFraction = $state(0);
  let skipped = $state(false);
  let showSkipButton = $state(false);

  // Static mode: cinematic disabled, hero collapses to single 100vh Stage 1.
  let staticMode = $derived(skipped);
  // Show splash whenever the cinematic is enabled but video isn't ready yet.
  let showSplash = $derived(!staticMode && !videoReady);

  const SCRUB_VH = 10;
  const SMOOTHING = 0.12;
  const SKIP_BUTTON_DELAY_MS = 4000;
  const AUTO_SKIP_TIMEOUT_MS = 14000;

  let target = 0;
  let raf = 0;
  let animating = false;
  let skipBtnTimer = 0;
  let autoSkipTimer = 0;

  function readScroll() {
    if (!stageEl) return;
    const rect = stageEl.getBoundingClientRect();
    const runway = window.innerHeight * SCRUB_VH;
    const scrolled = -rect.top;
    target = Math.max(0, Math.min(1, scrolled / runway));
    if (!animating) {
      animating = true;
      raf = requestAnimationFrame(tick);
    }
  }

  function tick() {
    const diff = target - progress;
    if (Math.abs(diff) < 0.0005) {
      progress = target;
      animating = false;
      return;
    }
    progress = progress + diff * SMOOTHING;
    raf = requestAnimationFrame(tick);
  }

  function onCanPlay() {
    videoReady = true;
    bufferedFraction = 1;
    clearLoadTimers();
  }
  function onBufferProgress() {
    if (!videoEl || !videoEl.duration || videoEl.buffered.length === 0) return;
    const end = videoEl.buffered.end(videoEl.buffered.length - 1);
    bufferedFraction = Math.min(1, end / videoEl.duration);
  }
  function clearLoadTimers() {
    if (skipBtnTimer) {
      clearTimeout(skipBtnTimer);
      skipBtnTimer = 0;
    }
    if (autoSkipTimer) {
      clearTimeout(autoSkipTimer);
      autoSkipTimer = 0;
    }
  }
  function skip() {
    skipped = true;
    clearLoadTimers();
  }
  function detectSlowConnection(): boolean {
    if (typeof navigator === "undefined") return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conn = (navigator as any).connection;
    if (!conn) return false;
    if (conn.saveData) return true;
    if (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g") return true;
    return false;
  }
  function lockScroll() {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
  function unlockScroll() {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  onMount(() => {
    if (detectSlowConnection()) {
      skipped = true;
    } else {
      lockScroll();
    }

    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);

    if (videoEl) {
      videoEl.addEventListener("canplaythrough", onCanPlay, { once: true });
      videoEl.addEventListener("loadeddata", onCanPlay, { once: true });
      videoEl.addEventListener("progress", onBufferProgress);
      onBufferProgress();
    }

    skipBtnTimer = window.setTimeout(() => {
      showSkipButton = true;
    }, SKIP_BUTTON_DELAY_MS);

    autoSkipTimer = window.setTimeout(() => {
      if (!videoReady) skip();
    }, AUTO_SKIP_TIMEOUT_MS);
  });

  onDestroy(() => {
    if (typeof window === "undefined") return;
    unlockScroll();
    clearLoadTimers();
    window.removeEventListener("scroll", readScroll);
    window.removeEventListener("resize", readScroll);
    if (videoEl) {
      videoEl.removeEventListener("canplaythrough", onCanPlay);
      videoEl.removeEventListener("loadeddata", onCanPlay);
      videoEl.removeEventListener("progress", onBufferProgress);
    }
    if (raf) cancelAnimationFrame(raf);
  });

  // Whenever the loader closes (ready or skipped), let the page scroll again.
  $effect(() => {
    if (videoReady || skipped) unlockScroll();
  });

  function stageOpacity(start: number, end: number, p: number) {
    const fade = 0.04;
    if (p < start - fade || p > end + fade) return 0;
    if (p < start) return (p - (start - fade)) / fade;
    if (p > end) return (end + fade - p) / fade;
    return 1;
  }

  const s1 = $derived(stageOpacity(0.0, 0.13, progress));
  const s2 = $derived(stageOpacity(0.18, 0.27, progress));
  const s3 = $derived(stageOpacity(0.32, 0.42, progress));
  const s4 = $derived(stageOpacity(0.48, 0.57, progress));
  const s5 = $derived(stageOpacity(0.62, 0.72, progress));
  const s6 = $derived(stageOpacity(0.77, 0.85, progress));
  const s7 = $derived(stageOpacity(0.89, 0.94, progress));
  const s8 = $derived(progress > 0.95 ? Math.min(1, (progress - 0.95) / 0.04) : 0);
</script>

{#if showSplash}
  <div class="splash" role="status" aria-live="polite" aria-label="Loading the experience">
    <div class="splash-inner">
      <div class="splash-brand">
        <span class="splash-dot" aria-hidden="true"></span>
        <span>JESSE COBLE</span>
      </div>
      <h2 class="splash-headline">Loading the experience</h2>
      <p class="splash-sub">
        First paint pulls a short hero video so the cinematic stays smooth as you scroll.
      </p>
      <div class="splash-progress" aria-hidden="true">
        <div class="splash-progress-fill" style="width: {bufferedFraction * 100}%"></div>
      </div>
      <div class="splash-meta">
        <span class="splash-percent">{Math.round(bufferedFraction * 100)}%</span>
        <span class="splash-status">
          {#if bufferedFraction >= 1}
            Decoding…
          {:else if bufferedFraction > 0}
            Downloading hero video
          {:else}
            Connecting
          {/if}
        </span>
      </div>
      {#if showSkipButton}
        <button class="splash-skip" onclick={skip} type="button">
          Skip animation
          <span aria-hidden="true">→</span>
        </button>
      {/if}
    </div>
  </div>
{/if}

<section
  id="top"
  class="hero-scroll-stage"
  class:static-mode={staticMode}
  bind:this={stageEl}
  style="--scrub-vh: {SCRUB_VH};"
>
  <div class="hero-pin">
    <div class="hero-video-wrap" aria-hidden="true">
      <video
        bind:this={videoEl}
        class="hero-video"
        playsinline
        muted
        preload="auto"
        poster="/media/hero-poster.jpg"
        use:scrubVideo={{ progress }}
      >
        <source src="/media/hero-portal-scrub.mp4" type="video/mp4" />
      </video>
      <div class="hero-vignette"></div>
    </div>

    <!-- Stage 1 — Opening -->
    <div class="stage stage-1" style="opacity: {staticMode ? 1 : s1}">
      <div class="container">
        <div class="hero-eyebrow">SOFTWARE ENGINEER · FOUNDER · SYSTEMS BUILDER</div>
        <h1 class="hero-headline">
          Turning real-world problems into <em>digital solutions.</em>
        </h1>
        <p class="hero-sub">
          I build practical software systems for operations-heavy businesses — from retail EDI
          workflows to the tooling that keeps large codebases understandable.
        </p>
        <div class="hero-ctas">
          <a class="btn btn-primary" href="#retailready">
            View selected work
            <svg
              class="arrow"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 13L13 3M6 3h7v7" />
            </svg>
          </a>
          <a class="btn btn-ghost" href="#contact">Start a conversation</a>
        </div>

        {#if !staticMode}
          <div
            class="hero-scrollcue"
            style="opacity: {Math.max(0, 1 - progress * 8)}"
            aria-hidden="true"
          >
            <span>SCROLL</span>
            <span class="cue-line"></span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Stages 2–8 only render in cinematic mode -->
    {#if !staticMode}
      <div class="stage stage-text" style="opacity: {s2}">
        <p class="stage-line">Built with <em>code.</em> Designed for people.</p>
      </div>
      <div class="stage stage-text" style="opacity: {s3}">
        <p class="stage-line">
          Integrations, background workflows, data boundaries, and
          <em>production visibility.</em>
        </p>
      </div>
      <div class="stage stage-thresh" style="opacity: {s4}">
        <span class="thresh-tag">
          <span class="dot"></span>
          ENTERING THE SYSTEM
        </span>
      </div>
      <div class="stage stage-proof" style="opacity: {s5}">
        <div class="proof-card">
          <div class="proof-label">RETAILREADY EDI</div>
          <h3 class="proof-title">A platform for retailer document flow.</h3>
          <p class="proof-copy">
            Validation, acknowledgments, sandbox testing, and production visibility — across
            Walmart, Best Buy, Dollar Tree, Meijer, and Dollar General.
          </p>
          <div class="proof-tags">
            <span>X12</span><span>EDIFACT</span><span>POSTGRES RLS</span><span>RABBITMQ</span><span
              >.NET 10</span
            >
          </div>
        </div>
      </div>
      <div class="stage stage-text" style="opacity: {s6}">
        <p class="stage-line">
          Systems built to <em>explain themselves.</em><br />
          Visible state. Reliable boundaries. Failure-aware workflows.
        </p>
      </div>
      <div class="stage stage-text" style="opacity: {s7}">
        <p class="stage-line">
          A <em>decade</em> of EDI, integrations, and operational software.
        </p>
      </div>
      <div class="stage stage-final" style="opacity: {s8}">
        <div class="final-block">
          <div class="final-name">JESSE COBLE · SOFTWARE ENGINEER</div>
          <h2 class="final-head">
            Turning real-world problems into <em>digital solutions.</em>
          </h2>
          <div class="final-ctas">
            <a class="btn btn-primary" href="#retailready">
              View selected work
              <svg
                class="arrow"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 13L13 3M6 3h7v7" />
              </svg>
            </a>
            <a class="btn btn-ghost" href="#contact">Start a conversation</a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  /* =====================================================================
     Splash loader — full-viewport gate, blocks scroll until ready/skipped
     ===================================================================== */
  .splash {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background:
      radial-gradient(58% 40% at 14% 18%, rgba(106, 92, 255, 0.28), transparent 70%),
      radial-gradient(48% 36% at 88% 28%, rgba(80, 200, 255, 0.22), transparent 70%),
      radial-gradient(70% 50% at 50% 110%, rgba(58, 58, 160, 0.3), transparent 70%),
      var(--bg-void);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    animation: splash-in 320ms var(--ease-out-soft);
  }
  .splash-inner {
    width: 100%;
    max-width: 460px;
    text-align: center;
    color: var(--fg-moonlight);
  }
  .splash-brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-mono);
    font-size: 13px;
    letter-spacing: 0.3em;
    color: var(--fg-haze);
    margin-bottom: 32px;
  }
  .splash-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ember);
    box-shadow: var(--glow-ember);
    animation: pulse 2.4s ease-in-out infinite;
  }
  .splash-headline {
    font-family: var(--font-display);
    font-weight: 350;
    font-size: clamp(1.75rem, 3vw + 0.5rem, 2.5rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    font-variation-settings: "opsz" 100, "SOFT" 40;
    color: var(--fg-moonlight);
    margin: 0 0 14px;
  }
  .splash-sub {
    font-size: 14.5px;
    line-height: 1.6;
    color: var(--fg-haze);
    margin: 0 0 32px;
  }
  .splash-progress {
    height: 3px;
    background: rgba(80, 200, 255, 0.12);
    border-radius: 3px;
    overflow: hidden;
    margin: 0 0 14px;
    position: relative;
  }
  .splash-progress-fill {
    height: 100%;
    background: var(--portal-bar);
    box-shadow: 0 0 14px rgba(80, 200, 255, 0.6);
    transition: width 220ms var(--ease-out-soft);
    border-radius: 3px;
  }
  .splash-progress::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(125, 220, 255, 0.55),
      transparent
    );
    background-size: 30% 100%;
    background-repeat: no-repeat;
    animation: splash-shimmer 1.6s linear infinite;
    pointer-events: none;
  }
  .splash-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--fg-dim);
    margin-bottom: 32px;
  }
  .splash-percent {
    color: var(--cyan);
    font-size: 13px;
    letter-spacing: 0.12em;
  }
  .splash-skip {
    background: transparent;
    border: 1px solid var(--line-glow);
    color: var(--fg-haze);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 10px 18px;
    border-radius: var(--r-sm);
    cursor: pointer;
    transition: all var(--dur-base) var(--ease-out-soft);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    animation: splash-skip-in 320ms var(--ease-out-soft);
  }
  .splash-skip:hover {
    color: var(--cyan-bright);
    border-color: rgba(80, 200, 255, 0.5);
    background: rgba(80, 200, 255, 0.06);
  }
  @keyframes splash-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes splash-shimmer {
    0% {
      background-position: -30% 0;
    }
    100% {
      background-position: 130% 0;
    }
  }
  @keyframes splash-skip-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* =====================================================================
     Hero pinned scroll-stage
     ===================================================================== */
  .hero-scroll-stage {
    position: relative;
    height: calc((1 + var(--scrub-vh, 6)) * 100vh);
    background: var(--bg-void);
  }
  .hero-pin {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }
  /* Static fallback: cinematic disabled */
  .hero-scroll-stage.static-mode {
    height: 100vh;
  }
  .hero-scroll-stage.static-mode .hero-pin {
    position: relative;
  }

  .hero-video-wrap {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }
  .hero-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(1.05) contrast(1.04) brightness(0.85);
  }
  .hero-vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(120% 80% at 50% 50%, transparent 40%, rgba(4, 6, 13, 0.55) 100%),
      linear-gradient(
        180deg,
        rgba(4, 6, 13, 0.55) 0%,
        transparent 22%,
        transparent 70%,
        rgba(4, 6, 13, 0.85) 100%
      );
  }

  .stage {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    pointer-events: none;
    transition: opacity 240ms var(--ease-out-soft);
    will-change: opacity;
  }
  .stage > * {
    pointer-events: auto;
  }
  .stage-1 {
    justify-content: flex-start;
  }

  .hero-scrollcue {
    margin-top: 64px;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.28em;
    color: var(--fg-dim);
    transition: opacity 240ms var(--ease-out-soft);
  }
  .hero-scrollcue .cue-line {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, var(--cyan), transparent);
    box-shadow: var(--glow-cyan-soft);
  }

  .stage-text {
    justify-content: center;
    text-align: center;
    padding: 0 var(--pad-x-md);
  }
  .stage-text .stage-line {
    font-family: var(--font-display);
    font-weight: 330;
    font-size: clamp(1.75rem, 4.2vw, 3.5rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    font-variation-settings: "opsz" 100, "SOFT" 50;
    color: var(--fg-moonlight);
    max-width: 22ch;
    text-wrap: balance;
    text-shadow: 0 4px 40px rgba(0, 0, 0, 0.7);
    margin: 0;
  }
  .stage-text .stage-line em {
    font-style: normal;
    color: var(--cyan-bright);
    filter: drop-shadow(0 0 24px rgba(80, 200, 255, 0.55));
  }

  .stage-thresh {
    justify-content: center;
  }
  .thresh-tag {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: var(--cyan-bright);
    padding: 10px 22px;
    border: 1px solid rgba(80, 200, 255, 0.4);
    border-radius: 100px;
    background: rgba(7, 11, 24, 0.4);
    backdrop-filter: blur(8px);
    box-shadow: var(--glow-cyan-soft);
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }
  .thresh-tag .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--cyan);
    box-shadow: var(--glow-cyan);
    display: inline-block;
  }

  .stage-proof {
    justify-content: center;
    padding: 0 var(--pad-x-md);
  }
  .proof-card {
    background: rgba(7, 11, 24, 0.66);
    backdrop-filter: blur(14px) saturate(140%);
    border: 1px solid rgba(80, 200, 255, 0.22);
    border-radius: var(--r-md);
    padding: 28px 32px;
    max-width: 520px;
    box-shadow:
      0 30px 80px -30px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(80, 200, 255, 0.06);
  }
  .proof-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--cyan);
    margin-bottom: 12px;
  }
  .proof-title {
    font-family: var(--font-display);
    font-weight: 380;
    font-size: clamp(1.25rem, 1.8vw + 0.5rem, 1.75rem);
    line-height: 1.15;
    margin: 0 0 12px;
    letter-spacing: -0.015em;
    color: var(--fg-moonlight);
  }
  .proof-copy {
    color: var(--fg-haze);
    font-size: 14.5px;
    line-height: 1.55;
    margin: 0;
  }
  .proof-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 18px;
  }
  .proof-tags span {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 5px 9px;
    border: 1px solid var(--line-cyan);
    border-radius: 4px;
    color: var(--fg-haze);
    background: rgba(80, 200, 255, 0.04);
  }

  .stage-final {
    justify-content: center;
    text-align: center;
    padding: 0 var(--pad-x-md);
  }
  .final-block {
    max-width: 36rem;
  }
  .final-name {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--cyan);
    margin-bottom: 24px;
  }
  .final-head {
    font-family: var(--font-display);
    font-weight: 330;
    font-size: clamp(2.5rem, 6vw, 5rem);
    line-height: 1;
    letter-spacing: -0.025em;
    font-variation-settings: "opsz" 144, "SOFT" 40;
    margin: 0 0 28px;
    text-wrap: balance;
    text-shadow: 0 4px 40px rgba(0, 0, 0, 0.7);
    color: var(--fg-moonlight);
  }
  .final-head em {
    font-style: italic;
    color: var(--cyan-bright);
    filter: drop-shadow(0 0 24px rgba(80, 200, 255, 0.4));
  }
  .final-ctas {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .stage,
    .hero-scrollcue {
      transition: none !important;
    }
    .splash-progress::after,
    .splash-dot {
      animation: none !important;
    }
  }
</style>
