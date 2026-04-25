<script lang="ts">
  import EnvelopeSimple from "phosphor-svelte/lib/EnvelopeSimple";
  import { profile } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
</script>

<section id="contact" class="bg-paper">
  <div class="mx-auto max-w-[1500px] px-4 pt-24 pb-12 md:px-8 md:py-32 lg:px-12">
    <Reveal>
      <article
        class="border-line grid min-h-[60dvh] grid-cols-1 content-between rounded-lg border bg-[rgba(255,255,255,0.32)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] md:p-12"
      >
        <div class="grid gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Contact</p>
            <h2
              class="mt-5 max-w-[14ch] font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight md:text-7xl"
            >
              Bring the hard part early.
            </h2>
          </div>
          <div class="grid gap-3 self-start">
            <a
              class="bg-ink text-paper hover:bg-charcoal inline-flex h-14 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition active:translate-y-px"
              href="mailto:{profile.email}"
            >
              <EnvelopeSimple aria-hidden="true" size={19} weight="bold" />
              {profile.email}
            </a>
            <p class="text-muted font-mono text-xs tracking-[0.16em] uppercase">
              RetailReady inquiries: <a
                href="mailto:{profile.retailreadyEmail}"
                class="text-ink underline-offset-4 hover:underline">{profile.retailreadyEmail}</a
              >
            </p>
          </div>
        </div>

        <Footer name={profile.name} role={profile.role} />
      </article>
    </Reveal>
  </div>
</section>
