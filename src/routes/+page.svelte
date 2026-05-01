<script lang="ts">
  import { onMount } from "svelte";
  import Header from "$lib/components/shared/Header.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import Practice from "$lib/components/Practice.svelte";
  import RetailReady from "$lib/components/RetailReady.svelte";
  import AIEngineering from "$lib/components/AIEngineering.svelte";
  import Experience from "$lib/components/Experience.svelte";
  import HowIBuild from "$lib/components/HowIBuild.svelte";
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
    content="Jesse Coble — software engineer and founder of RetailReady, a multi-tenant retail EDI platform. A decade of building the boring middle of production software, with an AI-augmented dev workflow that runs identically under Claude Code or Codex."
  />
</svelte:head>

<Header />
<main id="main">
  <Hero />
  <Practice />
  <RetailReady />
  <AIEngineering />
  <Experience />
  <HowIBuild />
  <Resume />
  <Contact />
</main>
<Footer />
