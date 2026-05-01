// Cursor-following soft glow + 3D tilt for cards. The card "presses back"
// at the cursor position — the corner closest to the pointer rotates away
// from the viewer, giving a floating-in-space feel.
//
// Sets four CSS variables on the element (used by the matching CSS rule):
//   --spot-x / --spot-y  → radial-gradient highlight position (px from origin)
//   --tilt-x / --tilt-y  → rotateX / rotateY values (deg)
//
// rAF-throttled so rapid pointermove events coalesce into one DOM write.

type Options = {
  /** Max tilt angle in degrees. Default 6. */
  max?: number;
};

export function spotlight(node: HTMLElement, opts: Options = {}) {
  const max = opts.max ?? 6;
  let raf = 0;
  let pendingX = 0;
  let pendingY = 0;
  let pendingRotX = 0;
  let pendingRotY = 0;

  function flush() {
    raf = 0;
    node.style.setProperty("--spot-x", `${pendingX}px`);
    node.style.setProperty("--spot-y", `${pendingY}px`);
    node.style.setProperty("--tilt-x", `${pendingRotX}deg`);
    node.style.setProperty("--tilt-y", `${pendingRotY}deg`);
  }

  function onMove(e: PointerEvent) {
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nx = (x / rect.width) * 2 - 1; // -1 left .. +1 right
    const ny = (y / rect.height) * 2 - 1; // -1 top  .. +1 bottom

    pendingX = x;
    pendingY = y;
    // "Pressed back at the pointer" — corner under the cursor recedes.
    // rotateX positive tilts the top edge backwards. rotateY negative tilts
    // the right edge backwards. Sign-flipped from a "face the cursor" tilt.
    pendingRotX = -ny * max;
    pendingRotY = -nx * max;

    if (!raf) raf = requestAnimationFrame(flush);
  }

  function onLeave() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    node.style.setProperty("--spot-x", `-200px`);
    node.style.setProperty("--spot-y", `-200px`);
    node.style.setProperty("--tilt-x", `0deg`);
    node.style.setProperty("--tilt-y", `0deg`);
  }

  node.addEventListener("pointermove", onMove);
  node.addEventListener("pointerleave", onLeave);

  return {
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    },
  };
}
