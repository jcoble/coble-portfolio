<script lang="ts">
  type Stat = { value: string; label: string };

  let {
    stats,
    tone = "light"
  }: {
    stats: Stat[];
    tone?: "light" | "dark";
  } = $props();

  const numberClass = $derived(tone === "light" ? "text-ink" : "text-paper");
  const labelClass = $derived(tone === "light" ? "text-muted" : "text-[rgba(244,242,235,0.62)]");
  const dividerClass = $derived(tone === "light" ? "border-line" : "border-line-dark");
</script>

<div class="grid grid-cols-2 gap-px md:grid-cols-4 [&>*]:bg-transparent">
  {#each stats as stat (stat.label)}
    <div
      class="border-r border-b {dividerClass} px-4 py-6 last:border-r-0 odd:border-r md:px-6 md:py-7 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r md:[&:nth-child(4n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-last-child(-n+4)]:border-b-0"
    >
      <p class="font-mono text-3xl leading-none font-medium md:text-5xl {numberClass}">
        {stat.value}
      </p>
      <p class="mt-3 font-mono text-xs tracking-[0.16em] uppercase {labelClass}">
        {stat.label}
      </p>
    </div>
  {/each}
</div>
