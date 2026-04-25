<script lang="ts">
  import { methods } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section id="method" class="bg-paper">
  <div class="mx-auto max-w-[1500px] px-4 py-16 md:px-8 lg:px-12">
    <Reveal>
      <article
        class="bg-charcoal text-paper grid grid-cols-1 gap-10 rounded-lg px-6 py-10 shadow-[0_34px_90px_-66px_rgba(14,14,11,0.8)] md:grid-cols-[0.8fr_1.2fr] md:px-12 md:py-16"
      >
        <div>
          <p class="font-mono text-xs tracking-[0.2em] text-[#bca083] uppercase">Method</p>
          <h2
            class="mt-4 max-w-[12ch] font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl"
          >
            A tighter way to make things.
          </h2>
        </div>
        <div class="divide-y divide-white/12 border-y border-white/12">
          {#each methods as method, i (method)}
            <div class="grid grid-cols-[auto_1fr] gap-5 py-6 md:gap-7">
              <span class="font-mono text-sm text-[#bca083]">0{i + 1}</span>
              <p class="max-w-[58ch] text-xl leading-8 text-[rgba(244,242,235,0.84)]">{method}</p>
            </div>
          {/each}
        </div>
      </article>
    </Reveal>
  </div>
</section>
