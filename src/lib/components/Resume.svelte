<script lang="ts">
  import DownloadSimple from "phosphor-svelte/lib/DownloadSimple";
  import { resume } from "$lib/content/profile";
  import Reveal from "$lib/components/shared/Reveal.svelte";
</script>

<section id="resume" class="bg-paper">
  <div class="mx-auto max-w-[940px] px-4 py-24 md:px-8 md:py-32">
    <Reveal>
      <header class="border-line border-b pb-8">
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Résumé</p>
        <h2
          class="mt-5 font-[family-name:var(--font-display)] text-6xl leading-none tracking-tight md:text-8xl"
        >
          {resume.name}
        </h2>
        <p class="text-muted mt-5 font-mono text-sm">
          {resume.email} · {resume.location}
        </p>
        <a
          href="/resume.pdf"
          download
          class="border-ink bg-ink text-paper hover:bg-charcoal mt-7 inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition"
        >
          <DownloadSimple aria-hidden="true" size={18} weight="bold" />
          Download résumé (PDF)
        </a>
      </header>
    </Reveal>

    <Reveal class="mt-12" delay={120}>
      <section>
        <h3 class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Summary</h3>
        <p class="text-ink mt-4 max-w-[68ch] text-lg leading-8">{resume.summary}</p>
      </section>
    </Reveal>

    <Reveal class="mt-16" delay={120}>
      <section>
        <h3 class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Experience</h3>
        <ol class="mt-6 grid gap-12">
          {#each resume.experience as job (job.years)}
            <li>
              <div class="grid gap-2 md:grid-cols-[1fr_auto] md:items-baseline">
                <h4 class="text-ink text-2xl font-semibold tracking-tight">{job.role}</h4>
                <span class="text-muted font-mono text-xs tracking-[0.16em] uppercase"
                  >{job.years}</span
                >
              </div>
              <p class="text-muted mt-1 text-base">{job.company} · {job.location}</p>
              <ul class="mt-4 grid list-none gap-3 pl-0">
                {#each job.bullets as bullet (bullet)}
                  <li class="text-ink grid grid-cols-[auto_1fr] gap-3 leading-7">
                    <span class="text-copper font-mono text-xs leading-7">·</span>
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
        <h3 class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Technical</h3>
        <dl class="border-line mt-6 border-y">
          {#each resume.technical as row (row.category)}
            <div
              class="border-line grid grid-cols-1 gap-2 border-b py-5 last:border-b-0 md:grid-cols-[14rem_1fr] md:gap-8 md:py-6"
            >
              <dt class="text-muted font-mono text-xs tracking-[0.18em] uppercase">
                {row.category}
              </dt>
              <dd class="text-ink font-mono text-sm leading-7">{row.items.join(" · ")}</dd>
            </div>
          {/each}
        </dl>
      </section>
    </Reveal>

    <Reveal class="mt-16" delay={120}>
      <section>
        <h3 class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Education</h3>
        <p class="text-ink mt-4 text-lg">
          <span class="font-semibold">{resume.education.school}</span> · {resume.education.location}
        </p>
        <p class="text-muted mt-1 text-base">
          {resume.education.degree}, {resume.education.year}
        </p>
      </section>
    </Reveal>
  </div>
</section>
