# Fonts

The current design system loads webfonts from Google Fonts CDN. **No licensed local font files are included.**

## Used families

| Role | Family | Weights | Variable axes | Source |
|---|---|---|---|---|
| Display | **Fraunces** | 300, 400, 500, 600 | `opsz` 9–144, `SOFT` 0–100, `WONK` 0–1 | [Google Fonts](https://fonts.google.com/specimen/Fraunces) (SIL OFL 1.1) |
| Sans | **Inter Tight** | 400, 500, 600, 700 | static cuts | [Google Fonts](https://fonts.google.com/specimen/Inter+Tight) (SIL OFL 1.1) |
| Mono | **JetBrains Mono** | 400, 500, 600 | static cuts | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) (Apache 2.0) |

## Substitution flags

The original site used **Instrument Serif + Geist + Geist Mono**. We've changed that pairing per the user's brief — they explicitly do not like the existing color/font system. **Please confirm the new pairing before we ship it as final.**

If you'd prefer to self-host:
1. Download the variable WOFF2s from Google Fonts.
2. Drop them in `fonts/` (e.g. `Fraunces[opsz,SOFT,WONK,wght].woff2`).
3. Replace the `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` calls in the UI kit with `@font-face` declarations.

## CDN snippet (currently in use)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..700,0..100&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```
