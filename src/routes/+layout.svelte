<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import Lenis from "lenis";

  let { children } = $props();
  let progress = $state(0);

  onMount(() => {
    // Smooth scrolling — momentum easing on wheel/keyboard, native on touch.
    // Exposed on window so Hero's GSAP ScrollTrigger setup can subscribe to
    // Lenis scroll events and stay in sync with the eased position.
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // smoothTouch defaults to false in lenis@1.x — touch keeps native momentum
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progress = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    };
    onScroll();
    lenis.on("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    // Anchor links (e.g. "#retailready") need to go through Lenis, otherwise
    // native scroll-to-anchor jumps instantly and feels jarring next to the
    // smoothed wheel scroll.
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -16 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("resize", onScroll);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  });
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Jesse Coble — Software Engineer · Founder · Systems Builder" />
  <meta
    property="og:description"
    content="A decade of building the boring middle of production software. Currently shipping RetailReady, a multi-tenant retail EDI platform, on an AI-augmented dev workflow that runs identically under Claude Code or Codex."
  />
  <meta property="og:image" content="/media/jesse-portrait.png" />
  <meta property="og:url" content="https://portfolio.coblesolutions.com" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<a
  class="focus:bg-ink focus:text-paper sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:px-3 focus:py-2"
  href="#main">Skip to content</a
>

<div
  class="scroll-progress"
  style="transform: scaleX({progress})"
  aria-hidden="true"
></div>

<div id="top">
  {@render children()}
</div>

<style>
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #50c8ff 0%, #6a5cff 100%);
    transform-origin: left center;
    z-index: 100;
    pointer-events: none;
    box-shadow: 0 0 10px rgba(80, 200, 255, 0.4);
    transition: transform 60ms linear;
  }
</style>
