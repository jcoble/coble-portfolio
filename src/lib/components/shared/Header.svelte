<script lang="ts">
  let {
    monogram,
    name,
    tone = "dark",
    links = [
      { href: "#retailready", label: "RetailReady" },
      { href: "#ai-engineering", label: "AI" },
      { href: "#experience", label: "Experience" },
      { href: "#contact", label: "Contact" }
    ]
  }: {
    monogram: string;
    name: string;
    tone?: "dark" | "light";
    links?: { href: string; label: string }[];
  } = $props();

  const containerClass = $derived(
    tone === "dark"
      ? "border-white/14 bg-[rgba(20,20,16,0.42)] text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_18px_55px_-45px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      : "border-line bg-[rgba(244,242,235,0.86)] text-ink backdrop-blur-md"
  );

  const monogramClass = $derived(
    tone === "dark" ? "bg-[rgba(244,242,235,0.92)] text-charcoal" : "bg-ink text-paper"
  );

  const navLinkClass = $derived(
    tone === "dark"
      ? "text-[rgba(244,242,235,0.72)] hover:bg-white/10 hover:text-paper"
      : "text-muted hover:bg-ink/8 hover:text-ink"
  );
</script>

<header
  class="absolute top-4 right-4 left-4 z-[2] flex items-center justify-between rounded-lg border px-3 py-2 md:right-8 md:left-8 lg:right-12 lg:left-12 {containerClass}"
>
  <a class="flex items-center gap-3 text-sm font-medium" href="#top">
    <span class="grid size-9 place-items-center rounded-lg font-mono text-xs {monogramClass}">
      {monogram}
    </span>
    <span class="hidden sm:inline">{name}</span>
  </a>
  <nav class="flex items-center gap-1 text-xs sm:text-sm">
    {#each links as link (link.href)}
      <a class="rounded-md px-3 py-2 transition {navLinkClass}" href={link.href}>{link.label}</a>
    {/each}
  </nav>
</header>
