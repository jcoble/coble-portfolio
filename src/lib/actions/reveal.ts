type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  delay?: number; // ms
  once?: boolean;
};

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
  const { threshold = 0.18, rootMargin = "-10% 0px -22% 0px", delay = 0, once = true } = options;

  // Initial state
  node.dataset.revealState = "hidden";

  // Honor reduced motion — show immediately
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    node.dataset.revealState = "shown";
    return { destroy() {} };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (delay > 0) {
            window.setTimeout(() => {
              node.dataset.revealState = "shown";
            }, delay);
          } else {
            node.dataset.revealState = "shown";
          }
          if (once) observer.unobserve(node);
        } else if (!once) {
          node.dataset.revealState = "hidden";
        }
      }
    },
    { threshold, rootMargin }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
