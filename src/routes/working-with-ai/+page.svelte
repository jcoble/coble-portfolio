<script lang="ts">
  import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
  import { profile } from "$lib/content/profile";
  import { workingWithAiDeep } from "$lib/content/working-with-ai-deep";
  import AISystemDiagram from "$lib/components/shared/AISystemDiagram.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
  import PullQuote from "$lib/components/shared/PullQuote.svelte";
</script>

<svelte:head>
  <title>Working with Claude · Jesse Coble</title>
  <meta name="description" content={workingWithAiDeep.subtitle} />
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
        Last updated {workingWithAiDeep.lastUpdated}
      </span>
    </nav>
  </div>

  <article
    class="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1fr_220px]"
  >
    <div>
      <header class="border-line border-b pb-10">
        <p class="text-copper font-mono text-xs tracking-[0.2em] uppercase">Working with AI</p>
        <h1
          class="mt-5 font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight md:text-7xl"
        >
          {workingWithAiDeep.title}
        </h1>
        <p class="text-muted mt-6 max-w-[60ch] text-xl leading-8">
          {workingWithAiDeep.subtitle}
        </p>
      </header>

      <section id="the-problem" class="mt-16">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">The problem</h2>
        {#each workingWithAiDeep.problem as p (p)}
          <p class="text-ink mt-5 max-w-[68ch] text-lg leading-8">{p}</p>
        {/each}
      </section>

      <section id="the-system" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">The system</h2>
        <div class="border-line-dark bg-charcoal mt-6 rounded-lg border p-4 md:p-8">
          <AISystemDiagram variant="full" />
        </div>
        {#each workingWithAiDeep.system as p (p)}
          <p class="text-ink mt-5 max-w-[72ch] text-lg leading-8">{p}</p>
        {/each}
      </section>

      <section id="design-decisions" class="border-line mt-16 border-t pt-12">
        <h2 class="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Design decisions
        </h2>
        <ol class="mt-6 grid gap-6">
          {#each workingWithAiDeep.designDecisions as d, i (d.title)}
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

      <section id="honest" class="border-line mt-16 border-t pt-12">
        <PullQuote tone="light">
          {workingWithAiDeep.honest}
        </PullQuote>
      </section>

      <Footer name={profile.name} role={profile.role} />
    </div>

    <aside class="hidden lg:block">
      <nav class="border-line sticky top-8 grid gap-2 border-l pl-6 text-sm">
        <p class="text-muted font-mono text-xs tracking-[0.18em] uppercase">On this page</p>
        {#each workingWithAiDeep.toc as item (item.id)}
          <a
            class="text-ink hover:text-copper font-mono text-xs tracking-[0.16em] uppercase"
            href="#{item.id}">{item.label}</a
          >
        {/each}
      </nav>
    </aside>
  </article>
</main>
