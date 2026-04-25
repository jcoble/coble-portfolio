<script lang="ts">
  import DownloadSimple from "phosphor-svelte/lib/DownloadSimple";
  import { resume } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section id="resume" class="bg-paper">
  <div class="mx-auto max-w-[940px] px-4 py-24 md:px-8 md:py-32">
    <Reveal>
      <header class="border-b border-line pb-8">
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-copper">Résumé</p>
        <h2
          class="mt-5 font-[family-name:var(--font-display)] text-6xl leading-none tracking-tight md:text-8xl"
        >
          {resume.name}
        </h2>
        <p class="mt-5 font-mono text-sm text-muted">
          {resume.email} · {resume.location}
        </p>
        <a
          href="/resume.pdf"
          download
          class="mt-7 inline-flex items-center gap-2 rounded-lg border border-ink bg-ink px-5 py-3 text-sm font-semibold text-paper transition hover:bg-charcoal"
        >
          <DownloadSimple aria-hidden="true" size={18} weight="bold" />
          Download résumé (PDF)
        </a>
      </header>
    </Reveal>

    <Reveal class="mt-12" delay={120}>
      <section>
        <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-copper">Summary</h3>
        <p class="mt-4 max-w-[68ch] text-lg leading-8 text-ink">{resume.summary}</p>
      </section>
    </Reveal>

    <Reveal class="mt-16" delay={120}>
      <section>
        <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-copper">Experience</h3>
        <ol class="mt-6 grid gap-12">
          {#each resume.experience as job (job.years)}
            <li>
              <div class="grid gap-2 md:grid-cols-[1fr_auto] md:items-baseline">
                <h4 class="text-2xl font-semibold tracking-tight text-ink">{job.role}</h4>
                <span class="font-mono text-xs uppercase tracking-[0.16em] text-muted">{job.years}</span>
              </div>
              <p class="mt-1 text-base text-muted">{job.company} · {job.location}</p>
              <ul class="mt-4 grid list-none gap-3 pl-0">
                {#each job.bullets as bullet (bullet)}
                  <li class="grid grid-cols-[auto_1fr] gap-3 leading-7 text-ink">
                    <span class="font-mono text-xs leading-7 text-copper">·</span>
                    <span>{bullet}</span>
                  </li>
                {/each}
              </ul>
            </li>
          {/each}
        </ol>
      </section>
    </Reveal>

    <Reveal class="mt-16" delay={120}>
      <section>
        <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-copper">Technical</h3>
        <dl class="mt-6 border-y border-line">
          {#each resume.technical as row (row.category)}
            <div
              class="grid grid-cols-1 gap-2 border-b border-line py-5 last:border-b-0 md:grid-cols-[14rem_1fr] md:gap-8 md:py-6"
            >
              <dt class="font-mono text-xs uppercase tracking-[0.18em] text-muted">{row.category}</dt>
              <dd class="font-mono text-sm leading-7 text-ink">{row.items.join(" · ")}</dd>
            </div>
          {/each}
        </dl>
      </section>
    </Reveal>

    <Reveal class="mt-16" delay={120}>
      <section>
        <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-copper">Education</h3>
        <p class="mt-4 text-lg text-ink">
          <span class="font-semibold">{resume.education.school}</span> · {resume.education.location}
        </p>
        <p class="mt-1 text-base text-muted">
          {resume.education.degree}, {resume.education.year}
        </p>
      </section>
    </Reveal>
  </div>
</section>
