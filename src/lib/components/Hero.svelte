<script lang="ts">
  import { onMount } from "svelte";
  import ArrowDownRight from "phosphor-svelte/lib/ArrowDownRight";
  import ArrowRight from "phosphor-svelte/lib/ArrowRight";
  import MagneticAnchor from "$lib/components/shared/MagneticAnchor.svelte";
  import Header from "$lib/components/shared/Header.svelte";
  import { profile } from "$lib/content/profile";
  import { scrubVideo } from "$lib/actions/scrubVideo";

  let sectionEl: HTMLElement | undefined = $state();
  let progress = $state(0);
  let videoEl: HTMLVideoElement | undefined = $state();
  let videoFailed = $state(false);
  let videoReady = $state(false);

  onMount(() => {
    if (!sectionEl) return;

    const onScroll = () => {
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const total = sectionEl.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      progress = Math.min(1, Math.max(0, scrolled / total));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  });

  const copyOpacity = $derived(progress < 0.42 ? 1 : Math.max(0.12, 1 - (progress - 0.42) * 2.6));
  const copyY = $derived(`${-progress * 32}%`);
  const mediaScale = $derived(1.02 + progress * 0.16);
  const mediaY = $derived(`${-progress * 5}%`);
  const mediaOpacity = $derived(progress < 0.72 ? 1 : Math.max(0.68, 1 - (progress - 0.72) * 1.1));
  const sceneY = $derived(progress > 0.78 ? `${(progress - 0.78) * 220 - 18}dvh` : "0dvh");
</script>

<section bind:this={sectionEl} class="bg-charcoal relative min-h-[460dvh] overflow-clip">
  <div
    class="bg-charcoal sticky top-0 min-h-dvh overflow-hidden"
    style="transform: translateY({sceneY})"
  >
    <div
      class="absolute inset-0 origin-center"
      style="transform: scale({mediaScale}) translateY({mediaY}); opacity: {mediaOpacity}"
    >
      {#if !videoFailed}
        <video
          bind:this={videoEl}
          class="h-full w-full object-cover transition-opacity duration-700 {videoReady
            ? 'opacity-100'
            : 'opacity-0'}"
          muted
          playsinline
          preload="auto"
          oncanplay={() => {
            videoReady = true;
          }}
          onerror={() => {
            videoFailed = true;
          }}
          use:scrubVideo={{ progress }}
        >
          <source src={profile.videoSrc} type="video/mp4" />
        </video>
      {/if}

      {#if !videoReady || videoFailed}
        <div
          class="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_62%_32%,rgba(162,107,79,0.28),transparent_28%),linear-gradient(145deg,#25251f_0%,#161612_58%,#2d3025_100%)]"
        ></div>
      {/if}
    </div>

    <div
      class="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,14,11,0.78)_0%,rgba(14,14,11,0.5)_38%,rgba(14,14,11,0.1)_72%,rgba(14,14,11,0.42)_100%)]"
    ></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(162,107,79,0.14),transparent_32%),linear-gradient(180deg,rgba(14,14,11,0.1)_0%,rgba(14,14,11,0.03)_52%,rgba(14,14,11,0.82)_100%)]"
    ></div>

    <div class="relative mx-auto min-h-dvh w-full max-w-[1500px] px-4 py-5 md:px-8 lg:px-12">
      <Header monogram={profile.monogram} name={profile.name} tone="dark" />

      <div
        class="relative z-[1] flex min-h-dvh items-end pt-28 pb-16 md:items-center md:pb-0"
        style="transform: translateY({copyY}); opacity: {copyOpacity}"
      >
        <div class="max-w-[820px] md:pl-[4vw]">
          <div
            class="mb-8 flex w-fit items-center gap-3 rounded-lg border border-white/14 bg-[rgba(244,242,235,0.12)] px-3 py-2 text-xs tracking-[0.18em] text-[rgba(244,242,235,0.78)] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md"
          >
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full animate-ping rounded-full bg-[#a9b38a] opacity-40"
              ></span>
              <span class="relative inline-flex size-2 rounded-full bg-[#a9b38a]"></span>
            </span>
            {profile.availability}
          </div>

          <p
            class="mb-5 max-w-[42rem] text-sm font-medium tracking-[0.2em] text-[#d0ab8e] uppercase"
          >
            {profile.role}
          </p>
          <h1
            class="text-paper font-[family-name:var(--font-display)] text-5xl leading-[0.92] font-normal tracking-tight md:text-7xl lg:text-8xl"
          >
            {profile.headline}
          </h1>
          <p class="mt-7 max-w-[62ch] text-base leading-8 text-[rgba(244,242,235,0.78)] md:text-lg">
            {profile.intro}
          </p>

          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <MagneticAnchor href="#retailready" tone="dark">
              Selected work
              <ArrowDownRight aria-hidden="true" size={18} weight="bold" />
            </MagneticAnchor>
            <MagneticAnchor href="mailto:{profile.email}" tone="light">
              Start a conversation
              <ArrowRight aria-hidden="true" size={18} weight="bold" />
            </MagneticAnchor>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
