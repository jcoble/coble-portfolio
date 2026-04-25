import { Spring } from "svelte/motion";

type MagneticOptions = {
  travel?: number; // 0-1, multiplier on (mouseDelta * travel)
};

export function magnetic(node: HTMLElement, options: MagneticOptions = {}) {
  const travel = options.travel ?? 0.16;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) return { destroy() {} };

  const x = new Spring(0, { stiffness: 0.18, damping: 0.62 });
  const y = new Spring(0, { stiffness: 0.18, damping: 0.62 });

  const apply = () => {
    node.style.transform = `translate3d(${x.current}px, ${y.current}px, 0)`;
  };

  const unsubX = x.subscribe(apply);
  const unsubY = y.subscribe(apply);

  function onMove(event: MouseEvent) {
    const rect = node.getBoundingClientRect();
    const dx = (event.clientX - rect.left - rect.width / 2) * travel;
    const dy = (event.clientY - rect.top - rect.height / 2) * travel;
    x.target = dx;
    y.target = dy;
  }

  function onLeave() {
    x.target = 0;
    y.target = 0;
  }

  node.addEventListener("mousemove", onMove);
  node.addEventListener("mouseleave", onLeave);

  return {
    destroy() {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
      unsubX();
      unsubY();
    }
  };
}
