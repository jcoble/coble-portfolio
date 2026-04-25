<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import Practice from "$lib/components/Practice.svelte";
  import RetailReady from "$lib/components/RetailReady.svelte";
  import AIEngineering from "$lib/components/AIEngineering.svelte";
  import CobleSolutions from "$lib/components/CobleSolutions.svelte";
  import Experience from "$lib/components/Experience.svelte";
  import Capabilities from "$lib/components/Capabilities.svelte";
  import Method from "$lib/components/Method.svelte";
  import Resume from "$lib/components/Resume.svelte";
  import Contact from "$lib/components/Contact.svelte";
  import StickyPanel from "$lib/components/shared/StickyPanel.svelte";
</script>

<svelte:head>
  <title>Jesse Coble — Coble Solutions / RetailReady EDI</title>
  <meta
    name="description"
    content="Jesse Coble — owner of Coble Solutions and RetailReady EDI. Building sharper systems for retail operations."
  />
</svelte:head>

<main id="main">
  <Hero />
  <StickyPanel>
    <Practice />
  </StickyPanel>
  <StickyPanel
    surfaceClass="rounded-t-3xl bg-charcoal shadow-[0_-28px_70px_-38px_rgba(0,0,0,0.55)]"
  >
    <RetailReady />
  </StickyPanel>
  <StickyPanel
    surfaceClass="rounded-t-3xl bg-ink shadow-[0_-28px_70px_-38px_rgba(0,0,0,0.55)]"
  >
    <AIEngineering />
  </StickyPanel>
  <StickyPanel>
    <CobleSolutions />
  </StickyPanel>
  <StickyPanel>
    <Experience />
  </StickyPanel>
  <StickyPanel>
    <Capabilities />
  </StickyPanel>
  <StickyPanel>
    <Method />
  </StickyPanel>
  <StickyPanel>
    <Resume />
  </StickyPanel>
  <StickyPanel heightClass="h-[260dvh]">
    <Contact />
  </StickyPanel>
</main>
