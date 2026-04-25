<script lang="ts">
  let {
    heightClass = "h-[290dvh]",
    surfaceClass = "rounded-t-3xl bg-paper shadow-[0_-28px_70px_-38px_rgba(0,0,0,0.55)]",
    children
  }: {
    heightClass?: string;
    surfaceClass?: string;
    children: import("svelte").Snippet;
  } = $props();
</script>

<div class="relative {heightClass}">
  <div class="sticky top-0 h-dvh w-full overflow-hidden {surfaceClass}">
    {@render children()}
  </div>
</div>
