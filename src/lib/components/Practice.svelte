<script lang="ts">
  import CirclesThreePlus from "phosphor-svelte/lib/CirclesThreePlus";
  import SealCheck from "phosphor-svelte/lib/SealCheck";
  import Lightning from "phosphor-svelte/lib/Lightning";
  import Compass from "phosphor-svelte/lib/Compass";
  import { practice } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";

  const signals = [
    { label: "Founder-led", icon: CirclesThreePlus },
    { label: "Operational", icon: SealCheck },
    { label: "Fast", icon: Lightning }
  ];
</script>

<section class="bg-paper">
  <div
    class="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-4 py-24 md:grid-cols-[0.72fr_1.28fr] md:px-8 md:py-32 lg:px-12"
  >
    <Reveal>
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">
        {practice.eyebrow}
      </p>
      <h2
        class="mt-4 max-w-[12ch] font-[family-name:var(--font-display)] text-4xl leading-none tracking-tight md:text-6xl"
      >
        {practice.headline}
      </h2>
    </Reveal>

    <div class="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <Reveal
        class="border-line rounded-lg border bg-[rgba(255,255,255,0.32)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] md:p-8"
        delay={120}
      >
        <Compass class="text-moss" size={28} weight="duotone" />
        <p class="text-ink mt-8 max-w-[48ch] text-xl leading-8">
          {practice.body}
        </p>
      </Reveal>

      <Reveal class="border-line grid content-end gap-3 border-y py-6" delay={240}>
        {#each signals as signal (signal.label)}
          <div class="flex items-center justify-between gap-4 py-4">
            <span class="text-ink text-lg font-medium">{signal.label}</span>
            <span
              class="text-moss grid size-10 place-items-center rounded-lg bg-[rgba(14,14,11,0.06)]"
            >
              <signal.icon aria-hidden="true" size={20} weight="bold" />
            </span>
          </div>
        {/each}
      </Reveal>
    </div>
  </div>
</section>
