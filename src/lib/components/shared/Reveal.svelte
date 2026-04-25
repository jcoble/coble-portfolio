<script lang="ts">
  import { reveal } from "$lib/actions/reveal";

  let {
    delay = 0,
    threshold = 0.18,
    children,
    class: className = ""
  }: {
    delay?: number;
    threshold?: number;
    children: import("svelte").Snippet;
    class?: string;
  } = $props();
</script>

<div class={className} use:reveal={{ delay, threshold }}>
  {@render children()}
</div>
