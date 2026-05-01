// Headline reveal — letters slide in from the right, staggered left-to-right.
// Tied to scroll position (so it reverses on scroll up) but reads the
// heading's current bounding rect on every frame instead of using cached
// trigger positions. This sidesteps the ScrollTrigger pin-spacer bug where
// the headline trigger's start/end were calculated against the page-without-
// pin-spacer layout (because Hero's pin gets added later).
//
// Walks the heading, splits each text node into per-character <span>s
// (preserving inline children like <em>), then runs a rAF loop while the
// heading is in the viewport. Each frame:
//   - reads heading.getBoundingClientRect()
//   - maps vertical position to progress (0 at bottom of viewport, 1 at
//     upper quarter)
//   - applies per-character opacity + translateX (staggered left-to-right)
//
// IntersectionObserver starts/stops the rAF loop so we don't burn cycles
// while the heading is off-screen.

type Options = {
  /** Per-char x offset in px at progress 0 — common slide-in distance. Default 60. */
  offset?: number;
  /** Per-char-index spread in px at progress 0 — replicates wide letter-spacing
   * via translate (no layout reflow). Char i shifts (1-p)*spread*i extra px. Default 4. */
  spread?: number;
  /** Stagger spread (0..1) — fraction of total scroll spent staggering. Default 0.55. */
  stagger?: number;
  /** Per-char duration (0..1) — overlap window for each char's transition. Default 0.5. */
  overlap?: number;
  /** Minimum opacity at progress 0 — chars never fully disappear. Default 0.15. */
  minOpacity?: number;
};

export function headlineReveal(node: HTMLElement, opts: Options = {}) {
  if (typeof window === "undefined") return;

  // Touch devices skip the per-char animation entirely. The free-running
  // rAF + ~30 inline-style writes per heading per frame compete with the
  // neighboring .fade-up transitions on mobile and produce visible judder.
  // Let the default .fade-up class handle reveal instead.
  if (window.matchMedia("(pointer: coarse)").matches) return;

  // Take ownership of the entrance animation. Without this, the global
  // .fade-up rule sets opacity:0 on the parent until an IntersectionObserver
  // adds .in — which nukes our per-character opacity (parent_opacity *
  // child_opacity = 0 * anything = 0). Stripping the class lets our action
  // be the only thing controlling visibility.
  node.classList.remove("fade-up", "delay-1", "delay-2", "delay-3", "delay-4", "in");
  node.style.opacity = "1";
  node.style.transform = "none";

  const offset = opts.offset ?? 60;
  const spread = opts.spread ?? 4;
  const stagger = opts.stagger ?? 0.55;
  const overlap = opts.overlap ?? 0.5;
  const minOpacity = opts.minOpacity ?? 0.15;

  function walk(el: Node) {
    Array.from(el.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || "";
        const frag = document.createDocumentFragment();
        const tokens = text.split(/(\s+)/);
        for (const tok of tokens) {
          if (!tok) continue;
          if (/^\s+$/.test(tok)) {
            frag.appendChild(document.createTextNode(tok));
            continue;
          }
          const word = document.createElement("span");
          word.style.display = "inline-block";
          word.style.whiteSpace = "nowrap";
          for (const ch of tok) {
            const sp = document.createElement("span");
            sp.className = "char";
            sp.style.display = "inline-block";
            sp.style.willChange = "transform, opacity";
            sp.textContent = ch;
            word.appendChild(sp);
          }
          frag.appendChild(word);
        }
        child.parentNode?.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  }
  if (!node.querySelector(".char")) {
    walk(node);
  }

  const chars = Array.from(node.querySelectorAll<HTMLElement>(".char"));
  const total = chars.length;
  if (total === 0) return;

  function setProgress(p: number) {
    chars.forEach((ch, i) => {
      const start = (i / total) * stagger;
      const cp = Math.max(0, Math.min(1, (p - start) / overlap));
      // Common slide-in (each char enters from the right) + per-index spread
      // (chars further to the right start more spread out). The spread fakes
      // a wide letter-spacing without changing layout.
      const slideIn = (1 - cp) * offset;
      const wideSpread = (1 - p) * spread * i;
      ch.style.opacity = String(minOpacity + (1 - minOpacity) * cp);
      ch.style.transform = `translateX(${slideIn + wideSpread}px)`;
    });
  }
  setProgress(0);

  // Compute progress from the heading's current viewport position. p=0 when
  // the top of the heading is at the bottom of the viewport, p=1 when the
  // top of the heading is at 25% from the top of the viewport. Linear in
  // between, clamped 0..1 outside.
  function compute() {
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight;
    const range = vh * 0.75;
    const distance = vh - rect.top;
    return Math.max(0, Math.min(1, distance / range));
  }

  let raf = 0;
  let inView = false;
  function tick() {
    setProgress(compute());
    if (inView) raf = requestAnimationFrame(tick);
    else raf = 0;
  }

  // Run once initially in case the heading is already in view at mount time.
  setProgress(compute());

  const obs = new IntersectionObserver(
    (entries) => {
      inView = entries[0].isIntersecting;
      if (inView && !raf) {
        raf = requestAnimationFrame(tick);
      }
      // When inView becomes false, the in-flight tick will see it and stop.
    },
    { rootMargin: "20% 0px 20% 0px" } // start the loop a bit before/after view
  );
  obs.observe(node);

  return {
    destroy() {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    },
  };
}
