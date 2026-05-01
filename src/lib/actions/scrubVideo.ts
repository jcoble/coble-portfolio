// Scroll-driven scrub: maps caller's `progress` (0..1) → video.currentTime
// linearly so the entire video plays from first frame to last as the user
// scrolls. A tiny 0.02s safety margin at the end prevents Chromium from
// snapping back to 0 when currentTime is set to exactly duration.

export function scrubVideo(
  video: HTMLVideoElement,
  initial: { progress: number }
) {
  let current = initial.progress;

  function sync() {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    video.pause();
    video.muted = true;

    const clamped = Math.min(1, Math.max(0, current));
    const target =
      clamped <= 0.001 ? 0.01 : Math.min(video.duration - 0.02, video.duration * clamped);

    if (Math.abs(video.currentTime - target) > 0.015) {
      video.currentTime = target;
    }
  }

  function markReady() {
    video.muted = true;
    video.pause();
    video.currentTime = 0.01;
    sync();
  }

  if (video.readyState >= 1) markReady();
  video.addEventListener("loadedmetadata", markReady);
  video.addEventListener("canplay", markReady);

  return {
    update({ progress }: { progress: number }) {
      current = progress;
      sync();
    },
    destroy() {
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("canplay", markReady);
    },
  };
}
