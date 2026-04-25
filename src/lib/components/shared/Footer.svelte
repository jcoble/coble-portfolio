<script lang="ts">
  let {
    name,
    role
  }: {
    name: string;
    role: string;
  } = $props();

  const year = new Date().getFullYear();
</script>

<footer
  class="border-line text-muted mt-16 flex flex-col gap-3 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between"
>
  <span class="font-mono text-xs tracking-[0.16em] uppercase">© {year} {name}</span>
  <span class="font-mono text-xs tracking-[0.16em] uppercase">{role}</span>
</footer>
