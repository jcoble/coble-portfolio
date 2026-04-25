<script lang="ts">
  import { Spring } from "svelte/motion";
  import { onMount } from "svelte";

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

  let el: HTMLDivElement | undefined = $state();
  const progress = new Spring(0, { stiffness: 0.06, damping: 0.62 });
  let armed = $state(true);

  onMount(() => {
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      progress.set(1, { instant: true });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && armed) {
            armed = false;
            window.setTimeout(() => {
              progress.target = 1;
            }, delay);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "-10% 0px -22% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  });

  const opacity = $derived(progress.current);
  const y = $derived((1 - progress.current) * 24);
  const blur = $derived((1 - progress.current) * 8);
</script>

<div
  bind:this={el}
  class={className}
  style="opacity: {opacity}; transform: translate3d(0, {y}px, 0); filter: blur({blur}px); will-change: transform, opacity, filter;"
>
  {@render children()}
</div>
