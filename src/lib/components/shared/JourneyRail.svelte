<script lang="ts">
  type Stage = { name: string; description: string };

  let { stages }: { stages: Stage[] } = $props();
</script>

<ol
  class="grid grid-cols-1 gap-3 md:gap-0 {stages.length === 5
    ? 'md:grid-cols-5'
    : stages.length === 4
      ? 'md:grid-cols-4'
      : 'md:grid-cols-3'}"
>
  {#each stages as stage, index (stage.name)}
    <li
      class="border-line relative grid gap-2 border bg-[rgba(255,255,255,0.32)] p-5 md:rounded-none md:border-r-0 md:first:rounded-l-lg md:last:rounded-r-lg md:last:border-r"
    >
      <span class="text-copper font-mono text-xs tracking-[0.18em] uppercase">
        Stage {String(index + 1).padStart(2, "0")}
      </span>
      <h3
        class="text-ink font-[family-name:var(--font-display)] text-3xl leading-none tracking-tight"
      >
        {stage.name}
      </h3>
      <p class="text-muted text-sm leading-6">
        {stage.description}
      </p>
    </li>
  {/each}
</ol>
