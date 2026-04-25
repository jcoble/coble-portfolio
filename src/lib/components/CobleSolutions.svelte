<script lang="ts">
  import { cobleSolutions } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section class="bg-paper">
  <div class="mx-auto max-w-[1500px] px-4 py-24 md:px-8 md:py-32 lg:px-12">
    <Reveal>
      <article
        class="lift border-line rounded-lg border bg-[rgba(255,255,255,0.32)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] md:grid md:grid-cols-[0.7fr_1.3fr] md:gap-12 md:p-12"
      >
        <div>
          <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">
            {cobleSolutions.eyebrow}
          </p>
          <h2
            class="mt-4 font-[family-name:var(--font-display)] text-4xl leading-none tracking-tight md:text-5xl"
          >
            {cobleSolutions.headline}
          </h2>
        </div>
        <p class="text-muted mt-6 max-w-[58ch] text-lg leading-8 md:mt-2">
          {cobleSolutions.body}
        </p>
      </article>
    </Reveal>
  </div>
</section>
