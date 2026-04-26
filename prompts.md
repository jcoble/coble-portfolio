# Generation prompts for the cloud-city backdrop

## Step 1 — Generate the still in Midjourney (or Flux)

Paste this exact prompt. We want a wide cinematic painterly piece, twilight, dark enough that white headline type pops, with an unmistakable focal island that the camera can fly past.

```
A vast twilight cloudscape stretching to the horizon, painterly cinematic concept art, deep navy and magenta-violet sky, scattered moonlit cumulus clouds rim-lit from above, a single magical floating island in mid-frame composed of dark stone, a small wooden cabin with three glowing windows, an antenna stack of vintage CRT screens emitting soft cyan light, a brass lantern with warm amber glow, a thin chain bridge trailing off into the clouds toward another distant island, faint glowing fiber-optic cables in cyan and magenta arcing between islands, distant smaller islands receding into atmospheric haze, particles of light drifting like fireflies, cinematic 21:9 ultrawide composition, low contrast in shadows, dramatic god rays, depth of field, painterly brushwork, ArtStation, 8k --ar 21:9 --style raw --stylize 250
```

**Variations to try** (rerun with each as a tail):
- ` --chaos 8` — looser, more painterly
- replace "twilight" with "pre-dawn" — more violet
- add "--no people, --no characters, --no text"
- swap "magenta-violet" for "magenta-purple-cyan" if you want more brand-aligned

**Pick the one that:**
1. Has clear empty sky in the upper-left ⅓ (where the headline sits)
2. The island is right of center, not centered
3. The horizon line is in the lower third (so panels can slide up and "land" on it)
4. Dark enough top-left quadrant that white type reads at 60%+ contrast

Upscale to 4K. Save as `assets/cloud-city.jpg`.

---

## Step 2 — Animate it in Runway Gen-3 / Gen-4

Upload the still as the **first frame**. Use these settings:

- **Duration:** 10s
- **Camera motion:** Forward dolly + slight downward tilt (very subtle)
- **Motion strength:** Low (3–4 / 10) — we want a slow drift, not a roller-coaster

Prompt:
```
The camera slowly drifts forward through the clouds, a gentle continuous dolly-in. Cumulus clouds part softly around the lens. The floating island ahead grows almost imperceptibly larger. Lanterns flicker. CRT screens pulse. Glowing cables sway in the wind. Particles of light drift past the camera like fireflies. Subtle parallax: foreground clouds move faster than the island. No cuts. No camera shake. Cinematic, 24fps, painterly.
```

**Critical:** request a **loopable** clip — set the last-frame target to match the first frame ("seamless loop"). If Runway doesn't loop cleanly, generate ~20s and we'll cross-fade in CSS.

Export H.264, 1920×1080, around 6–10 MB.
Save as `assets/cloud-city.mp4`.

**Alternative tools** (same prompt works):
- **Kling 1.6** — strongest slow cinematic dolly right now
- **Luma Dream Machine** — good for atmospheric drift
- **Sora** — if you have access, gold standard

---

## Step 3 — Drop it in

Place `cloud-city.mp4` in `assets/`. The portfolio page will pick it up automatically (the scroll-scrub backdrop is already wired — see `ui_kits/portfolio/index.html`).
