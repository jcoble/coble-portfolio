<script lang="ts">
  type DocList = { format: string; docs: { code: string; name: string }[] };

  let {
    columns
  }: {
    columns: DocList[];
  } = $props();
</script>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
  {#each columns as col (col.format)}
    <div class="border-line border-y py-5">
      <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">{col.format}</p>
      <ul class="mt-4 grid gap-2">
        {#each col.docs as doc (doc.code)}
          <li class="grid grid-cols-[4rem_1fr] gap-3 font-mono text-sm">
            <span class="text-ink">{doc.code}</span>
            <span class="text-muted">{doc.name}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>
