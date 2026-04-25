<script lang="ts">
  import { capabilities } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section id="capabilities" class="bg-paper">
  <div
    class="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-4 py-24 md:grid-cols-[0.72fr_1.28fr] md:px-8 md:py-32 lg:px-12"
  >
    <Reveal>
      <div>
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Capabilities</p>
        <h2
          class="mt-5 max-w-[10ch] font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl"
        >
          Useful systems, not theater.
        </h2>
      </div>
    </Reveal>

    <Reveal delay={140}>
      <div class="border-line grid gap-0 border-y">
        {#each capabilities as capability, i (capability.name)}
          <article
            class="border-line grid gap-5 border-b py-7 last:border-b-0 md:grid-cols-[auto_1fr] md:gap-8"
          >
            <span class="text-muted font-mono text-xs tracking-[0.18em] uppercase">
              0{i + 1}
            </span>
            <div>
              <h3 class="text-ink text-2xl font-semibold tracking-tight">{capability.name}</h3>
              <p class="text-muted mt-3 max-w-[65ch] leading-7">{capability.description}</p>
            </div>
          </article>
        {/each}
      </div>
    </Reveal>
  </div>
</section>
