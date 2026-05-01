// Animate a numeric value from 0 to a target when the element first scrolls
// into view. Renders as plain text replacement on the node — keep the SSR
// fallback (the static target value) as the node's textContent so the page
// is correct without JS.

export function countup(
  node: HTMLElement,
  opts: { target: number; duration?: number; prefix?: string }
) {
  let started = false;
  const target = opts.target;
  const duration = opts.duration ?? 900;
  const prefix = opts.prefix ?? "";
  const fallback = node.textContent;

  // Hide the static value until the animation runs (so it doesn't flash).
  // If JS is disabled the element keeps its SSR text, so this is purely a
  // pre-animation reset.
  node.textContent = `${prefix}0`;

  const obs = new IntersectionObserver(
    (entries) => {
      if (started) return;
      if (entries[0].isIntersecting) {
        started = true;
        obs.disconnect();
        animate();
      }
    },
    { threshold: 0.5 }
  );
  obs.observe(node);

  function animate() {
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      node.textContent = `${prefix}${value}`;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  return {
    destroy() {
      obs.disconnect();
      if (fallback !== null) node.textContent = fallback;
    },
  };
}
