// Cursor-following soft glow inside cards. Tracks mousemove on the element
// and exposes --spot-x / --spot-y CSS variables that the card's ::after
// pseudo-element uses to position a radial-gradient highlight.

export function spotlight(node: HTMLElement) {
  function onMove(e: MouseEvent) {
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }
  function onLeave() {
    node.style.setProperty("--spot-x", `-200px`);
    node.style.setProperty("--spot-y", `-200px`);
  }

  node.addEventListener("pointermove", onMove);
  node.addEventListener("pointerleave", onLeave);

  return {
    destroy() {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    },
  };
}
