// Scroll-driven headline reveal — letters start wide-spaced and translucent,
// then tighten + fade in left-to-right as the heading scrolls into view.
// Inspired by 375.studio's section headers.
//
// Walks the heading, splits each text node into per-character <span>s
// (preserving inline children like <em>), then drives a ScrollTrigger
// scrub that maps scroll progress (0..1) onto:
//   - per-character opacity + translateX (staggered left-to-right)
//   - parent letter-spacing tightening from wide to natural
//
// Lenis is wired to ScrollTrigger.update in +layout.svelte so the scrub
// stays in sync with the eased scroll position.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Options = {
  /** Extra letter-spacing in px at progress 0 (added to natural). Default 14. */
  spacing?: number;
  /** Per-char x offset in px at progress 0. Default 22. */
  offset?: number;
  /** Stagger spread (0..1) — fraction of total scroll spent staggering. Default 0.55. */
  stagger?: number;
  /** Per-char duration (0..1) — overlap window for each char's transition. Default 0.5. */
  overlap?: number;
};

export function headlineReveal(node: HTMLElement, opts: Options = {}) {
  if (typeof window === "undefined") return;
  if (node.querySelector(".char")) return; // already initialized (HMR)

  const extraSpacing = opts.spacing ?? 14;
  const offset = opts.offset ?? 22;
  const stagger = opts.stagger ?? 0.55;
  const overlap = opts.overlap ?? 0.5;

  // Walk and split. Words are wrapped in inline-block spans so they don't
  // break mid-word; characters within each word are inline-block .char spans.
  // Whitespace stays as text-nodes so the browser wraps naturally.
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
  walk(node);

  const chars = Array.from(node.querySelectorAll<HTMLElement>(".char"));
  const total = chars.length;
  if (total === 0) return;

  // Capture the natural letter-spacing for the final state.
  const computed = getComputedStyle(node);
  const naturalSpacing = parseFloat(computed.letterSpacing) || 0; // px

  function setProgress(p: number) {
    chars.forEach((ch, i) => {
      const start = (i / total) * stagger;
      const cp = Math.max(0, Math.min(1, (p - start) / overlap));
      ch.style.opacity = String(cp);
      ch.style.transform = `translateX(${(1 - cp) * offset}px)`;
    });
    node.style.letterSpacing = `${naturalSpacing + (1 - p) * extraSpacing}px`;
  }
  setProgress(0);

  gsap.registerPlugin(ScrollTrigger);
  const trigger = ScrollTrigger.create({
    trigger: node,
    start: "top 85%",
    end: "top 35%",
    scrub: 0.6,
    onUpdate: (self) => setProgress(self.progress),
  });

  return {
    destroy() {
      trigger.kill();
    },
  };
}
