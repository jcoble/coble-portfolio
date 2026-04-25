<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<a
  class="focus:bg-ink focus:text-paper sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:px-3 focus:py-2"
  href="#main">Skip to content</a
>
<div id="top">
  {@render children()}
</div>
