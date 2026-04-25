<script lang="ts">
  import { onMount } from "svelte";

  type Variant = "compact" | "full";
  let { variant = "compact" }: { variant?: Variant } = $props();

  const nodes = [
    { id: "retailer", label: "Retailer", x: 60, y: 220 },
    { id: "edi-server", label: "EDI Server", x: 220, y: 220 },
    { id: "engine", label: "Engine", x: 380, y: 220 },
    { id: "database", label: "Database", x: 540, y: 220 },
    { id: "api", label: "API", x: 700, y: 220 },
    { id: "browser", label: "Browser", x: 860, y: 220 }
  ];

  const edges = [
    { from: "retailer", to: "edi-server" },
    { from: "edi-server", to: "engine" },
    { from: "engine", to: "database" },
    { from: "database", to: "api" },
    { from: "api", to: "browser" }
  ];

  type Doc = { code: string; color: string; label: string };
  const docTypes: Doc[] = [
    { code: "850", color: "var(--color-copper)", label: "PO" },
    { code: "855", color: "var(--color-moss)", label: "Ack" },
    { code: "856", color: "var(--color-signal)", label: "ASN" },
    { code: "810", color: "var(--color-paper-deep)", label: "Invoice" },
    { code: "997", color: "rgba(244,242,235,0.5)", label: "FA" }
  ];

  // Path for each edge (M <fromX> <fromY> L <toX> <toY>)
  function pathFor(edge: { from: string; to: string }) {
    const a = nodes.find((n) => n.id === edge.from)!;
    const b = nodes.find((n) => n.id === edge.to)!;
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  }

  // Each dot has: edge index, doc type index, offset 0-1, speed multiplier
  type Dot = { edgeIndex: number; doc: Doc; offset: number; speed: number };
  const initialDots: Dot[] = [];
  for (let e = 0; e < edges.length; e++) {
    const count = 3; // 3 dots per edge
    for (let i = 0; i < count; i++) {
      initialDots.push({
        edgeIndex: e,
        doc: docTypes[(e * count + i) % docTypes.length],
        offset: i / count + Math.random() * 0.07,
        speed: 0.18 + Math.random() * 0.06
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
    if (reduced) {
      // Static evenly-spaced dots
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          running = entry.isIntersecting;
        }
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

  // height vs viewBox
  const viewBox = variant === "full" ? "0 0 940 380" : "0 0 940 320";
  const heightClass = variant === "full" ? "h-[480px]" : "h-[320px] md:h-[380px]";
</script>

<figure class="relative w-full {heightClass}" aria-hidden="true">
  <svg
    bind:this={svgEl}
    {viewBox}
    class="h-full w-full"
    preserveAspectRatio="xMidYMid meet"
    role="img"
  >
    <!-- Edges -->
    <g stroke="var(--color-line-dark)" stroke-width="1.2" fill="none">
      {#each edges as edge, i (edge.from + edge.to)}
        <path bind:this={pathEls[i]} d={pathFor(edge)} stroke-dasharray="4 4" />
      {/each}
    </g>

    <!-- Dots -->
    <g>
      {#each dots as dot, i (i)}
        {@const pos = dotPosition(dot)}
        <circle cx={pos.x} cy={pos.y} r="5" fill={dot.doc.color} opacity="0.92"> </circle>
      {/each}
    </g>

    <!-- Nodes -->
    <g>
      {#each nodes as node (node.id)}
        <g transform="translate({node.x}, {node.y})">
          <rect
            x="-44"
            y="-22"
            width="88"
            height="44"
            rx="6"
            fill="var(--color-charcoal)"
            stroke="var(--color-line-dark)"
          />
          <text
            x="0"
            y="6"
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

  <!-- Legend (full variant only) -->
  {#if variant === "full"}
    <div
      class="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[rgba(244,242,235,0.62)]"
    >
      {#each docTypes as dt (dt.code)}
        <span class="flex items-center gap-2 font-mono tracking-[0.14em] uppercase">
          <span class="size-2.5 rounded-full" style="background: {dt.color}"></span>
          {dt.code}
          {dt.label}
        </span>
      {/each}
    </div>
  {/if}
</figure>
