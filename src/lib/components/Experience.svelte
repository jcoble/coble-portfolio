<script lang="ts">
  import { experience } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section id="experience" class="bg-paper">
  <div
    class="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-4 py-24 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:py-32 lg:px-12"
  >
    <Reveal>
      <div>
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">{experience.eyebrow}</p>
        <h2
          class="mt-5 max-w-[12ch] font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl"
        >
          {experience.headline}
        </h2>
        <p class="text-muted mt-7 max-w-[58ch] text-lg leading-8">
          {experience.body}
        </p>
      </div>
    </Reveal>

    <Reveal delay={140}>
      <ol class="border-line grid gap-px border">
        {#each experience.timeline as entry (entry.years)}
          <li
            class="grid gap-2 bg-[rgba(255,255,255,0.32)] p-6 md:grid-cols-[10rem_1fr] md:gap-8 md:p-8"
          >
            <span class="text-copper font-mono text-xs tracking-[0.18em] uppercase">
              {entry.years}
            </span>
            <div>
              <h3 class="text-ink text-xl font-semibold tracking-tight md:text-2xl">
                {entry.role}
              </h3>
              <p class="text-muted mt-1 text-sm md:text-base">{entry.company}</p>
            </div>
          </li>
        {/each}
      </ol>
    </Reveal>
  </div>
</section>
