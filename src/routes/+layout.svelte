<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";

  let { children } = $props();
  let progress = $state(0);

  onMount(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progress = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
