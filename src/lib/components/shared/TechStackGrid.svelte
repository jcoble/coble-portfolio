<script lang="ts">
  type StackRow = { category: string; items: string[] };

  let {
    rows,
    tone = "dark"
  }: {
    rows: StackRow[];
    tone?: "light" | "dark";
  } = $props();

  const labelClass = $derived(tone === "dark" ? "text-[rgba(244,242,235,0.62)]" : "text-muted");
  const valueClass = $derived(tone === "dark" ? "text-paper" : "text-ink");
  const lineClass = $derived(tone === "dark" ? "border-line-dark" : "border-line");
</script>

<dl class="border-y {lineClass}">
  {#each rows as row (row.category)}
    <div
      class="grid grid-cols-1 gap-2 border-b {lineClass} py-5 last:border-b-0 md:grid-cols-[12rem_1fr] md:gap-8 md:py-6"
    >
      <dt class="font-mono text-xs tracking-[0.18em] uppercase {labelClass}">{row.category}</dt>
      <dd class="font-mono text-sm leading-7 {valueClass}">
        {row.items.join(" · ")}
      </dd>
    </div>
  {/each}
</dl>
