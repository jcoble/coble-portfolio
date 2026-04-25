type ScrubOptions = {
  exitLeadSeconds?: number; // hold these many seconds before end as the "release" zone
};

export function scrubVideo(
  video: HTMLVideoElement,
  initial: { progress: number; options?: ScrubOptions }
) {
  const opts = { exitLeadSeconds: 2, ...initial.options };
  let current = initial.progress;

  function sync() {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    video.pause();
    video.muted = true;

    const clamped = Math.min(1, Math.max(0, current));
    const exitStart = Math.max(
      0.01,
      Math.min(0.98, (video.duration - opts.exitLeadSeconds) / video.duration)
    );
    const target =
      clamped <= 0.002
        ? 0.01
        : Math.min(
            video.duration - 0.02,
            video.duration * clamped * exitStart +
              (clamped > exitStart ? (clamped - exitStart) * (1 - exitStart) : 0)
          );

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
    update({ progress }: { progress: number; options?: ScrubOptions }) {
      current = progress;
      sync();
    },
    destroy() {
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("canplay", markReady);
    }
  };
}
