<script lang="ts">
  import { onMount } from "svelte";

  let { variant = "compact" }: { variant?: "compact" | "full" } = $props();

  // Six visible nodes — main flow + cluster of three sources
  const nodes = [
    { id: "prompt", label: "Prompt", x: 80, y: 120 },
    { id: "main", label: "Main Thread", x: 240, y: 120 },
    { id: "subagent", label: "Sub-agent", x: 460, y: 120 },
    { id: "briefing", label: "Briefing", x: 680, y: 120 },
    { id: "main2", label: "Main (resume)", x: 860, y: 120 },
    { id: "diagram", label: "Diagram", x: 380, y: 260 },
    { id: "memory", label: "Memory", x: 460, y: 280 },
    { id: "claude", label: "CLAUDE.md", x: 540, y: 260 }
  ];

  const edges = [
    { from: "prompt", to: "main" },
    { from: "main", to: "subagent" },
    { from: "subagent", to: "briefing" },
    { from: "briefing", to: "main2" },
    { from: "diagram", to: "subagent" },
    { from: "memory", to: "subagent" },
    { from: "claude", to: "subagent" }
  ];

  function pathFor(edge: { from: string; to: string }) {
    const a = nodes.find((n) => n.id === edge.from)!;
    const b = nodes.find((n) => n.id === edge.to)!;
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  }

  type Dot = { edgeIndex: number; offset: number; speed: number; color: string };
  const colors = ["var(--color-signal)", "var(--color-copper)", "var(--color-moss)"];
  const initialDots: Dot[] = [];
  for (let e = 0; e < edges.length; e++) {
    for (let i = 0; i < 2; i++) {
      initialDots.push({
        edgeIndex: e,
        offset: i / 2 + Math.random() * 0.1,
        speed: 0.18 + Math.random() * 0.05,
        color: colors[(e + i) % colors.length]
      });
    }
  }

  let dots = $state<Dot[]>(initialDots);
  let svgEl: SVGSVGElement | undefined = $state();
  let pathEls: SVGPathElement[] = $state([]);
  let running = $state(false);
  let reduced = false;

  onMount(() => {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) running = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (svgEl) observer.observe(svgEl);

    let raf = 0;
    let lastTime = performance.now();
    function tick(time: number) {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      if (running) {
        dots = dots.map((d) => {
          let next = d.offset + d.speed * dt;
          if (next >= 1) next = 0;
          return { ...d, offset: next };
        });
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  });

  function dotPosition(dot: Dot) {
    const path = pathEls[dot.edgeIndex];
    if (!path) return { x: 0, y: 0 };
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len * dot.offset);
    return { x: pt.x, y: pt.y };
  }

  const viewBox = "0 0 940 360"; // same for both variants
  const heightClass = $derived(variant === "full" ? "h-[480px]" : "h-[360px]");
</script>

<figure class="relative w-full {heightClass}" aria-hidden="true">
  <svg
    bind:this={svgEl}
    {viewBox}
    class="h-full w-full"
    preserveAspectRatio="xMidYMid meet"
    role="img"
  >
    <g stroke="var(--color-line-dark)" stroke-width="1.2" fill="none">
      {#each edges as edge, i (edge.from + edge.to)}
        <path bind:this={pathEls[i]} d={pathFor(edge)} stroke-dasharray="4 4" />
      {/each}
    </g>

    <g>
      {#each dots as dot, i (i)}
        {@const pos = dotPosition(dot)}
        <circle cx={pos.x} cy={pos.y} r="4.5" fill={dot.color} opacity="0.9" />
      {/each}
    </g>

    <g>
      {#each nodes as node (node.id)}
        <g transform="translate({node.x}, {node.y})">
          <rect
            x="-58"
            y="-20"
            width="116"
            height="40"
            rx="6"
            fill="var(--color-charcoal)"
            stroke="var(--color-line-dark)"
          />
          <text
            x="0"
            y="5"
            text-anchor="middle"
            font-family="var(--font-mono)"
            font-size="11"
            fill="var(--color-paper)"
            letter-spacing="0.03em"
          >
            {node.label}
          </text>
        </g>
      {/each}
    </g>
  </svg>
</figure>
