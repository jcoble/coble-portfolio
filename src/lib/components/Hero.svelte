<script lang="ts">
  import { scrubVideo } from "$lib/actions/scrubVideo";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { onDestroy, onMount } from "svelte";

  let stageEl: HTMLElement | undefined = $state();
  let videoEl: HTMLVideoElement | undefined = $state();
  let progress = $state(0);
  let videoReady = $state(false);
  let bufferedFraction = $state(0);
  let skipped = $state(false);
  let showSkipButton = $state(false);

  // Static mode is only entered if the user explicitly skips OR the video
  // genuinely fails to load within the auto-skip timeout. We intentionally
  // do NOT branch on prefers-reduced-motion or navigator.connection — the
  // cinematic is the universal default; the manual skip and timeout are
  // the only escape hatches.
  let staticMode = $derived(skipped);
  let showSplash = $derived(!staticMode && !videoReady);

  const VIDEO_URL = "/media/hero-portal-scrub.mp4";
  const SKIP_BUTTON_DELAY_MS = 4000;
  const AUTO_SKIP_TIMEOUT_MS = 20000;

  let skipBtnTimer = 0;
  let autoSkipTimer = 0;
  let preloadAbort: AbortController | null = null;

  function onCanPlay() {
    videoReady = true;
    clearLoadTimers();
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
    preloadAbort?.abort();
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

  // Manual preloader: fetches the video as a stream so we can show real
  // byte-level progress (the native <video> `progress` event is unreliable
  // across browsers/CDNs/dev servers and frequently never fires for small
  // assets that arrive in one chunk).
  async function preloadVideo() {
    preloadAbort = new AbortController();
    try {
      const res = await fetch(VIDEO_URL, { signal: preloadAbort.signal });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const total = Number(res.headers.get("Content-Length") || 0);
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (total > 0) bufferedFraction = Math.min(0.99, received / total);
        }
      }
      bufferedFraction = 1;
      if (skipped) return; // user bailed; don't bother attaching the blob
      const blob = new Blob(chunks as BlobPart[], { type: "video/mp4" });
      const blobUrl = URL.createObjectURL(blob);
      if (videoEl) {
        videoEl.src = blobUrl;
        videoEl.load();
      }
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      // Fallback: hand the URL straight to the video element. The browser
      // takes over loading; canplay/loadeddata will fire when ready.
      if (videoEl && !videoEl.src) {
        videoEl.src = VIDEO_URL;
        videoEl.load();
      }
    }
  }

  onMount(() => {
    if (typeof window === "undefined") return;
    lockScroll();

    if (videoEl) {
      videoEl.addEventListener("canplaythrough", onCanPlay, { once: true });
      videoEl.addEventListener("loadeddata", onCanPlay, { once: true });
    }

    preloadVideo();

    skipBtnTimer = window.setTimeout(() => {
      showSkipButton = true;
    }, SKIP_BUTTON_DELAY_MS);

    autoSkipTimer = window.setTimeout(() => {
      if (!videoReady) skip();
    }, AUTO_SKIP_TIMEOUT_MS);
  });

  // ScrollTrigger lifecycle. Builds the pin/scrub once the cinematic is
  // engaged AND the video is ready (so the spacer height is computed against
  // the final, splash-free layout). Cleans itself up on unmount or if the
  // user flips into static mode.
  $effect(() => {
    if (typeof window === "undefined") return;
    if (staticMode) return;
    if (!videoReady) return;
    if (!stageEl) return;

    gsap.registerPlugin(ScrollTrigger);

    // 1800% (≈18 viewport heights) of scroll runway. Combined with the
    // 5% blank gaps between stages below, every card has a clear "video-
    // only" beat on either side instead of crossfading into the next.
    const trigger = ScrollTrigger.create({
      trigger: stageEl,
      start: "top top",
      end: "+=1800%",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.4,
      onUpdate: (self) => {
        progress = self.progress;
      }
    });

    const onLoadRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoadRefresh);
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
    if (fonts?.ready) fonts.ready.then(() => ScrollTrigger.refresh());
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("load", onLoadRefresh);
      trigger.kill();
    };
  });

  onDestroy(() => {
    if (typeof window === "undefined") return;
    unlockScroll();
    clearLoadTimers();
    preloadAbort?.abort();
    if (videoEl) {
      videoEl.removeEventListener("canplaythrough", onCanPlay);
      videoEl.removeEventListener("loadeddata", onCanPlay);
      if (videoEl.src.startsWith("blob:")) URL.revokeObjectURL(videoEl.src);
    }
  });

  // Whenever the loader closes (ready or skipped), let the page scroll again.
  $effect(() => {
    if (videoReady || skipped) unlockScroll();
  });

  function stageOpacity(start: number, end: number, p: number) {
    const fade = 0.02;
    if (p < start - fade || p > end + fade) return 0;
    if (p < start) return Math.max(0, (p - (start - fade)) / fade);
    if (p > end) return Math.max(0, 1 - (p - end) / fade);
    return 1;
  }
  function stageDrift(opacity: number) {
    return (1 - opacity) * 16;
  }

  // 7 stages with 5% blank gaps between consecutive ranges. FADE=0.02 above
  // makes each card snap in/out fast — combined with the 5% gap, no two
  // stages share screen time (you see the video alone between every card).
  // Stage 3 (ENTERING THE SYSTEM) now gets 10% dwell instead of 3%; stage 4
  // (proof card) cut from 27% to 16%; final stays anchored to the last ~13%.
  const s1 = $derived(stageOpacity(0.0, 0.1, progress)); // opening
  const s2 = $derived(stageOpacity(0.15, 0.22, progress)); // "integrations…" line
  const s3 = $derived(stageOpacity(0.27, 0.37, progress)); // ENTERING THE SYSTEM (longer dwell)
  const s4 = $derived(stageOpacity(0.42, 0.56, progress)); // RetailReady proof card
  const s5 = $derived(stageOpacity(0.63, 0.7, progress)); // "systems explain themselves"
  const s6 = $derived(stageOpacity(0.76, 0.83, progress)); // "decade of EDI"
  const s7 = $derived(stageOpacity(0.9, 1.0, progress)); // final block (lands on video climax)
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

<section id="top" class="hero-scroll-stage" bind:this={stageEl}>
  <div class="hero-pin">
    <div class="hero-video-wrap" aria-hidden="true">
      <video
        bind:this={videoEl}
        class="hero-video"
        playsinline
        muted
        preload="none"
        poster="/media/hero-poster.jpg"
        use:scrubVideo={{ progress }}
      ></video>
      <div class="hero-vignette"></div>
    </div>

    <!-- Stage 1 — Opening (0–15%) -->
    <div
      class="stage stage-1"
      style="opacity: {staticMode ? 1 : s1}; transform: translate3d(0, {staticMode
        ? 0
        : stageDrift(s1)}px, 0)"
    >
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
            style="opacity: {Math.max(0, 1 - progress * 12)}"
            aria-hidden="true"
          >
            <span>SCROLL</span>
            <span class="cue-line"></span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Stages 2–7 only render in cinematic mode -->
    {#if !staticMode}
      <div
        class="stage stage-text"
        style="opacity: {s2}; transform: translate3d(0, {stageDrift(s2)}px, 0)"
      >
        <div class="stage-card">
          <div class="eyebrow">WHAT I BUILD</div>
          <p class="stage-line">
            Integrations, background workflows, data boundaries, and <em>production visibility.</em>
          </p>
        </div>
      </div>
      <div
        class="stage stage-thresh"
        style="opacity: {s3}; transform: translate3d(0, {stageDrift(s3)}px, 0)"
      >
        <span class="thresh-tag">
          <span class="dot"></span>
          ENTERING THE SYSTEM
        </span>
      </div>
      <div
        class="stage stage-proof"
        style="opacity: {s4}; transform: translate3d(0, {stageDrift(s4)}px, 0)"
      >
        <div class="stage-card proof-card">
          <div class="eyebrow">RETAILREADY EDI</div>
          <h3 class="proof-title">
            A platform for <em>retailer document flow.</em>
          </h3>
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
      <div
        class="stage stage-text"
        style="opacity: {s5}; transform: translate3d(0, {stageDrift(s5)}px, 0)"
      >
        <div class="stage-card">
          <div class="eyebrow">HOW I BUILD</div>
          <p class="stage-line">
            Systems built to <em>explain themselves.</em><br />
            Visible state. Reliable boundaries. Failure-aware workflows.
          </p>
        </div>
      </div>
      <div
        class="stage stage-text"
        style="opacity: {s6}; transform: translate3d(0, {stageDrift(s6)}px, 0)"
      >
        <div class="stage-card">
          <div class="eyebrow">BACKGROUND</div>
          <p class="stage-line">
            A <em>decade</em> of EDI, integrations, and operational software.
          </p>
        </div>
      </div>
      <div
        class="stage stage-final"
        style="opacity: {s7}; transform: translate3d(0, {stageDrift(s7)}px, 0)"
      >
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
      radial-gradient(70% 50% at 50% 110%, rgba(58, 58, 160, 0.3), transparent 70%), var(--bg-void);
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
    font-variation-settings:
      "opsz" 100,
      "SOFT" 40;
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
    background: linear-gradient(90deg, transparent, rgba(125, 220, 255, 0.55), transparent);
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
     Hero pinned scroll-stage (GSAP ScrollTrigger pins this section directly;
     no manual sticky, no manual height calc — the spacer is created by ST.)
     ===================================================================== */
  .hero-scroll-stage {
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    background: var(--bg-void);
  }
  .hero-pin {
    position: relative;
    height: 100%;
    width: 100%;
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
    will-change: opacity, transform;
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
  /* Shared glass surface for every overlay card — sized to match the final
     block so all cards read as the same family at the same scale. */
  .stage-card {
    background: rgba(7, 11, 24, 0.72);
    backdrop-filter: blur(18px) saturate(150%);
    -webkit-backdrop-filter: blur(18px) saturate(150%);
    border: 1px solid rgba(80, 200, 255, 0.18);
    border-radius: var(--r-md);
    padding: 56px 64px;
    width: 100%;
    max-width: 920px;
    margin: 0 auto;
    box-shadow:
      0 30px 80px -30px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(80, 200, 255, 0.06);
  }
  .stage-card .eyebrow {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--cyan);
    margin: 0 0 24px;
  }
  /* Text stages — same display scale as .final-head so "what I build / how I
     build / background" land with the same weight as the closing headline. */
  .stage-text .stage-line {
    font-family: var(--font-display);
    font-weight: 330;
    font-size: clamp(2rem, 4.5vw, 3.5rem);
    line-height: 1.08;
    letter-spacing: -0.025em;
    font-variation-settings:
      "opsz" 144,
      "SOFT" 40;
    color: var(--fg-moonlight);
    max-width: 22ch;
    text-wrap: balance;
    margin: 0 auto;
  }
  .stage-text .stage-line em {
    font-style: italic;
    color: var(--cyan-bright);
    filter: drop-shadow(0 0 22px rgba(80, 200, 255, 0.45));
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
  /* Proof card uses the same display scale + italic accent as .final-head so
     the RetailReady stage reads as a peer of the closing card, not a smaller
     "info block." Pill tags downplayed into a quiet footer line. */
  .proof-title {
    font-family: var(--font-display);
    font-weight: 330;
    font-size: clamp(2rem, 4.5vw, 3.5rem);
    line-height: 1.08;
    letter-spacing: -0.025em;
    font-variation-settings:
      "opsz" 144,
      "SOFT" 40;
    color: var(--fg-moonlight);
    margin: 0 0 24px;
    text-wrap: balance;
  }
  .proof-title em {
    font-style: italic;
    color: var(--cyan-bright);
    filter: drop-shadow(0 0 22px rgba(80, 200, 255, 0.45));
  }
  .proof-copy {
    color: var(--fg-haze);
    font-size: clamp(1rem, 1.1vw + 0.4rem, 1.2rem);
    line-height: 1.55;
    margin: 0;
    max-width: 56ch;
  }
  .proof-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid rgba(80, 200, 255, 0.12);
  }
  .proof-tags span {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 6px 10px;
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
  /* Final block matches .stage-card geometry so all cards land at the same
     scale across the cinematic. */
  .final-block {
    width: 100%;
    max-width: 920px;
    background: rgba(7, 11, 24, 0.72);
    backdrop-filter: blur(18px) saturate(150%);
    -webkit-backdrop-filter: blur(18px) saturate(150%);
    border: 1px solid rgba(80, 200, 255, 0.18);
    border-radius: var(--r-md);
    padding: 56px 64px;
    box-shadow:
      0 30px 80px -30px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(80, 200, 255, 0.06);
    margin: 0 auto;
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
    font-size: clamp(2.25rem, 5vw, 4rem);
    line-height: 1.05;
    letter-spacing: -0.025em;
    font-variation-settings:
      "opsz" 144,
      "SOFT" 40;
    margin: 0 0 28px;
    text-wrap: balance;
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
    .hero-scrollcue {
      transition: none !important;
    }
    .splash-progress::after,
    .splash-dot {
      animation: none !important;
    }
  }
</style>
