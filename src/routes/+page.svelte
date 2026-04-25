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
  <Practice />
  <RetailReady />
  <AIEngineering />
  <CobleSolutions />
  <Experience />
  <Capabilities />
  <Method />
  <Resume />
  <Contact />
</main>
