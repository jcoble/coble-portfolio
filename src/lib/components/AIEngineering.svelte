<script lang="ts">
  import ArrowUpRight from "phosphor-svelte/lib/ArrowUpRight";
  import { aiEngineering } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
  import StatsGrid from "$lib/components/shared/StatsGrid.svelte";
  import PullQuote from "$lib/components/shared/PullQuote.svelte";
  import AISystemDiagram from "$lib/components/shared/AISystemDiagram.svelte";
</script>

<section id="ai-engineering" class="bg-ink text-paper">
  <div class="mx-auto max-w-[1500px] px-4 py-24 md:px-8 md:py-32 lg:px-12">
    <Reveal>
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">
        {aiEngineering.eyebrow}
      </p>
      <h2
        class="mt-5 max-w-[14ch] font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-8xl"
      >
        {aiEngineering.headline}
      </h2>
      <p class="mt-8 max-w-[68ch] text-lg leading-8 text-[rgba(244,242,235,0.76)]">
        {aiEngineering.problem}
      </p>
    </Reveal>

    <Reveal class="mt-16" delay={120}>
      <div class="border-line-dark rounded-lg border bg-[rgba(244,242,235,0.03)] p-6 md:p-10">
        <AISystemDiagram variant="full" />
      </div>
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">By the numbers</p>
      <div class="mt-6">
        <StatsGrid stats={aiEngineering.stats} tone="dark" />
      </div>
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      <PullQuote tone="dark">
        "{aiEngineering.pullQuote}"
      </PullQuote>
    </Reveal>

    <Reveal class="mt-12" delay={120}>
      <p class="text-paper max-w-[44ch] text-2xl leading-snug font-medium md:text-3xl">
        {aiEngineering.closing}
      </p>
    </Reveal>

    <Reveal class="mt-12" delay={120}>
      <a
        href="/working-with-ai"
        class="group text-copper inline-flex items-center gap-3 font-mono text-sm tracking-[0.18em] uppercase transition-colors hover:text-[color-mix(in_oklab,var(--color-copper)_85%,white)]"
      >
        Read how I work with Claude
        <ArrowUpRight
          aria-hidden="true"
          size={20}
          weight="bold"
          class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </Reveal>
  </div>
</section>
