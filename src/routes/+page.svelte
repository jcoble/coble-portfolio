<script lang="ts">
  import { onMount } from "svelte";
  import Header from "$lib/components/shared/Header.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
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
  <title>Jesse Coble — Software Engineer · Founder · Systems Builder</title>
  <meta
    name="description"
    content="Jesse Coble — software engineer, founder, and systems builder. I turn real-world operational problems into digital solutions: retail EDI, integrations, background workflows."
  />
</svelte:head>

<Header />
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
<Footer />
