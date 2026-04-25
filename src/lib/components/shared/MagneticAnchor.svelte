<script lang="ts">
  import { magnetic } from "$lib/actions/magnetic";

  let {
    href,
    tone = "dark",
    children,
    class: className = ""
  }: {
    href: string;
    tone?: "dark" | "light";
    children: import("svelte").Snippet;
    class?: string;
  } = $props();

  const baseClass =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition active:translate-y-px will-change-transform";
  const toneClass =
    tone === "dark"
      ? "bg-paper text-charcoal shadow-[0_20px_50px_-34px_rgba(0,0,0,0.75)] hover:bg-[color-mix(in_oklab,var(--color-paper)_92%,white)]"
      : "border border-white/16 bg-[rgba(244,242,235,0.1)] text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.13)] backdrop-blur-lg hover:bg-[rgba(244,242,235,0.18)]";
</script>

<a class="{baseClass} {toneClass} {className}" {href} use:magnetic={{ travel: 0.16 }}>
  {@render children()}
</a>
