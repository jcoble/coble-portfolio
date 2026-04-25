<script lang="ts">
  import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
  import { profile } from "$lib/content/profile";
  import { retailreadyDeep } from "$lib/content/retailready-deep";
  import ArchitectureDiagram from "$lib/components/shared/ArchitectureDiagram.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
</script>

<svelte:head>
  <title>RetailReady — System Overview · Jesse Coble</title>
  <meta name="description" content={retailreadyDeep.subtitle} />
</svelte:head>

<main id="main" class="bg-paper">
  <div class="border-line border-b">
    <nav class="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-5 md:px-8">
      <a
        class="text-muted hover:text-ink inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase"
        href="/"
      >
        <ArrowLeft size={14} weight="bold" />
        Back to portfolio
      </a>
      <span class="text-muted font-mono text-xs tracking-[0.18em] uppercase">
        Last updated {retailreadyDeep.lastUpdated}
      </span>
    </nav>
  </div>

  <article
    class="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1fr_220px]"
  >
    <div>
      <header class="border-line border-b pb-10">
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">RetailReady EDI</p>
        <h1
          class="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl"
        >
          {retailreadyDeep.title}
        </h1>
        <p class="text-muted mt-6 max-w-[60ch] text-xl leading-8">
          {retailreadyDeep.subtitle}
        </p>
      </header>

      <section id="what-it-is" class="mt-16">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">What it is</h2>
        {#each retailreadyDeep.sections.whatItIs as p (p)}
          <p class="text-ink mt-5 max-w-[68ch] text-lg leading-8">{p}</p>
        {/each}
        <h3 class="text-copper mt-10 font-mono text-xs tracking-[0.18em] uppercase">
          Who it's for
        </h3>
        {#each retailreadyDeep.sections.whoItsFor as p (p)}
          <p class="text-ink mt-4 max-w-[68ch] text-lg leading-8">{p}</p>
        {/each}
      </section>

      <section id="how-it-works" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">How it works</h2>
        <h3 class="text-copper mt-6 font-mono text-xs tracking-[0.18em] uppercase">Core flow</h3>
        <ol class="mt-4 grid gap-3">
          {#each retailreadyDeep.sections.coreFlow as step, i (step)}
            <li class="text-ink grid grid-cols-[3rem_1fr] gap-4 leading-7">
              <span class="text-muted font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
              <span>{step}</span>
            </li>
          {/each}
        </ol>
        <h3 class="text-copper mt-10 font-mono text-xs tracking-[0.18em] uppercase">
          Active retailers
        </h3>
        <table class="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr class="border-line border-b text-left">
              <th class="text-muted py-3 pr-4 font-mono text-xs tracking-[0.16em] uppercase"
                >Code</th
              >
              <th class="text-muted py-3 pr-4 font-mono text-xs tracking-[0.16em] uppercase"
                >Name</th
              >
              <th class="text-muted py-3 font-mono text-xs tracking-[0.16em] uppercase">Notes</th>
            </tr>
          </thead>
          <tbody>
            {#each retailreadyDeep.sections.activeRetailers as r (r.code)}
              <tr class="border-line border-b">
                <td class="text-ink py-3 pr-4 font-mono">{r.code}</td>
                <td class="text-ink py-3 pr-4">{r.name}</td>
                <td class="text-muted py-3">{r.notes}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

      <section id="architecture" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">Architecture</h2>
        <div class="border-line-dark bg-charcoal mt-6 rounded-lg border p-4 md:p-8">
          <ArchitectureDiagram variant="full" />
        </div>
        <h3 class="text-copper mt-10 font-mono text-xs tracking-[0.18em] uppercase">
          Runtime topology
        </h3>
        {#each retailreadyDeep.sections.runtime as p (p)}
          <p class="text-ink mt-4 max-w-[72ch] text-lg leading-8">{p}</p>
        {/each}
        <h3 class="text-copper mt-10 font-mono text-xs tracking-[0.18em] uppercase">
          .NET projects
        </h3>
        <dl class="border-line mt-4 border-y">
          {#each retailreadyDeep.sections.projects as proj (proj.name)}
            <div
              class="border-line grid gap-2 border-b py-4 last:border-b-0 md:grid-cols-[14rem_1fr] md:gap-8"
            >
              <dt class="text-ink font-mono text-sm">{proj.name}</dt>
              <dd class="text-muted text-sm leading-6">{proj.role}</dd>
            </div>
          {/each}
        </dl>
        <h3 class="text-copper mt-10 font-mono text-xs tracking-[0.18em] uppercase">
          Engine workers
        </h3>
        <table class="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr class="border-line border-b text-left">
              <th class="text-muted py-3 pr-4 font-mono text-xs tracking-[0.16em] uppercase"
                >Worker</th
              >
              <th class="text-muted py-3 pr-4 font-mono text-xs tracking-[0.16em] uppercase"
                >Poll</th
              >
              <th class="text-muted py-3 pr-4 font-mono text-xs tracking-[0.16em] uppercase"
                >Step timeout</th
              >
              <th class="text-muted py-3 font-mono text-xs tracking-[0.16em] uppercase">Job</th>
            </tr>
          </thead>
          <tbody>
            {#each retailreadyDeep.sections.workers as w (w.name)}
              <tr class="border-line border-b">
                <td class="text-ink py-3 pr-4 font-mono">{w.name}</td>
                <td class="text-muted py-3 pr-4 font-mono">{w.poll}</td>
                <td class="text-muted py-3 pr-4 font-mono">{w.timeout}</td>
                <td class="text-ink py-3 leading-6">{w.job}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

      <section id="customer-journey" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Customer journey
        </h2>
        <ol class="mt-6 grid gap-6">
          {#each retailreadyDeep.sections.journeyDeep as stage, i (stage.stage)}
            <li class="grid grid-cols-[3rem_1fr] gap-4">
              <span class="text-copper font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 class="text-ink text-xl font-semibold">{stage.stage}</h3>
                <p class="text-muted mt-2 max-w-[68ch] leading-7">{stage.body}</p>
              </div>
            </li>
          {/each}
        </ol>
      </section>

      <section id="platform-features" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Platform features
        </h2>
        <div class="border-line mt-6 grid gap-px border md:grid-cols-2">
          {#each retailreadyDeep.sections.features as feat (feat.name)}
            <div class="bg-paper p-6 md:p-8">
              <h3 class="text-ink text-xl font-semibold">{feat.name}</h3>
              <p class="text-muted mt-3 leading-7">{feat.body}</p>
            </div>
          {/each}
        </div>
      </section>

      <section id="design-decisions" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Key design decisions
        </h2>
        <ol class="mt-6 grid gap-6">
          {#each retailreadyDeep.sections.designDecisions as d, i (d.title)}
            <li class="grid grid-cols-[3rem_1fr] gap-4">
              <span class="text-copper font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 class="text-ink text-xl font-semibold">{d.title}</h3>
                <p class="text-muted mt-2 max-w-[72ch] leading-7">{d.body}</p>
              </div>
            </li>
          {/each}
        </ol>
      </section>

      <section id="tech-stack" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">Tech stack</h2>
        <dl class="border-line mt-6 border-y">
          {#each retailreadyDeep.sections.techStackTable as row (row.layer)}
            <div
              class="border-line grid gap-2 border-b py-5 last:border-b-0 md:grid-cols-[12rem_1fr] md:gap-8"
            >
              <dt class="text-muted font-mono text-xs tracking-[0.18em] uppercase">{row.layer}</dt>
              <dd class="text-ink font-mono text-sm">{row.tech}</dd>
            </div>
          {/each}
        </dl>
      </section>

      <Footer name={profile.name} role={profile.role} />
    </div>

    <aside class="hidden lg:block">
      <nav class="border-line sticky top-8 grid gap-2 border-l pl-6 text-sm">
        <p class="text-muted font-mono text-xs tracking-[0.18em] uppercase">On this page</p>
        {#each retailreadyDeep.toc as item (item.id)}
          <a
            class="text-ink hover:text-copper font-mono text-xs tracking-[0.16em] uppercase"
            href="#{item.id}">{item.label}</a
          >
        {/each}
      </nav>
    </aside>
  </article>
</main>
