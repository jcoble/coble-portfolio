<script lang="ts">
  let {
    children,
    attribution,
    tone = "dark"
  }: {
    children: import("svelte").Snippet;
    attribution?: string;
    tone?: "light" | "dark";
  } = $props();

  const wrapClass =
    tone === "dark" ? "border-y border-line-dark text-paper" : "border-y border-line text-ink";
  const attrClass = tone === "dark" ? "text-[rgba(244,242,235,0.5)]" : "text-muted";
</script>

<figure class="grid gap-6 py-12 md:py-16 {wrapClass}">
  <blockquote
    class="max-w-[58ch] font-[family-name:var(--font-display)] text-3xl leading-snug tracking-tight italic md:text-5xl"
  >
    {@render children()}
  </blockquote>
  {#if attribution}
    <figcaption class="font-mono text-xs tracking-[0.18em] uppercase {attrClass}">
      — {attribution}
    </figcaption>
  {/if}
</figure>
