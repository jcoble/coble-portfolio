<script lang="ts">
  import ArrowUpRight from "phosphor-svelte/lib/ArrowUpRight";
  import { retailready } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
  import StatsGrid from "$lib/components/shared/StatsGrid.svelte";
  import TechStackGrid from "$lib/components/shared/TechStackGrid.svelte";
  import DocTypesTable from "$lib/components/shared/DocTypesTable.svelte";
  import JourneyRail from "$lib/components/shared/JourneyRail.svelte";
  import ArchitectureDiagram from "$lib/components/shared/ArchitectureDiagram.svelte";
</script>

<section id="retailready" class="bg-charcoal text-paper">
  <div class="mx-auto max-w-[1500px] px-4 py-24 md:px-8 md:py-32 lg:px-12">
    <Reveal>
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">{retailready.eyebrow}</p>
      <h2
        class="mt-5 max-w-[14ch] font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-8xl"
      >
        {retailready.headline}
      </h2>
      <div class="mt-8 grid gap-5 md:grid-cols-2 md:gap-8">
        {#each retailready.intro as paragraph, i (i)}
          <p class="max-w-[58ch] text-lg leading-8 text-[rgba(244,242,235,0.76)]">
            {paragraph}
          </p>
        {/each}
      </div>
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      <div class="border-line-dark rounded-lg border bg-[rgba(244,242,235,0.04)] p-6 md:p-10">
        <ArchitectureDiagram variant="full" />
      </div>
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">By the numbers</p>
      <div class="mt-6">
        <StatsGrid stats={retailready.stats} tone="dark" />
      </div>
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">
        Document types supported
      </p>
      <div class="mt-6">
        <DocTypesTable columns={retailready.docTypes.columns} />
      </div>
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Customer journey</p>
      <div class="mt-6">
        <JourneyRail stages={retailready.journey} />
      </div>
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Stack</p>
      <div class="mt-6">
        <TechStackGrid rows={retailready.techStack} tone="dark" />
      </div>
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Design highlights</p>
      <ol class="border-line-dark mt-8 grid gap-px border md:grid-cols-2">
        {#each retailready.flexPoints as point, index (point.title)}
          <li class="lift bg-charcoal p-6 md:p-8">
            <span
              class="font-mono text-xs tracking-[0.18em] text-[rgba(244,242,235,0.5)] uppercase"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              class="text-paper mt-3 text-xl leading-tight font-semibold tracking-tight md:text-2xl"
            >
              {point.title}
            </h3>
            <p class="mt-3 text-sm leading-7 text-[rgba(244,242,235,0.74)]">
              {point.body}
            </p>
          </li>
        {/each}
      </ol>
    </Reveal>

    <Reveal class="mt-20" delay={120}>
      <blockquote
        class="border-copper text-paper max-w-[58ch] border-l-2 pl-6 font-[family-name:var(--font-display)] text-2xl leading-snug italic md:text-4xl"
      >
        {retailready.wedge}
      </blockquote>
    </Reveal>

    <Reveal class="mt-12" delay={120}>
      <a
        href="/retailready"
        class="group text-copper inline-flex items-center gap-3 font-mono text-sm tracking-[0.18em] uppercase transition-colors hover:text-[color-mix(in_oklab,var(--color-copper)_85%,white)]"
      >
        View the full system overview
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
