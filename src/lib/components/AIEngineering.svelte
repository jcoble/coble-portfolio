<script lang="ts">
  import { spotlight } from "$lib/actions/spotlight";
  import { headlineReveal } from "$lib/actions/headlineReveal";
</script>

<section id="ai" class="section ai-eng">
  <div class="container">
    <div class="section-head">
      <div class="head-eyebrow fade-up"><div class="eyebrow">WORKING WITH AI</div></div>
      <h2 class="fade-up delay-1" use:headlineReveal>
        Treating AI agents like <em>junior engineers.</em>
      </h2>
    </div>

    <p class="ai-intro fade-up delay-2">
      Most "AI coding" falls apart in a real codebase because the agent has no map and
      no rails. Drop a model into a 600-file repo and you'll get edits that look right
      but quietly break the rest of the system. The workflow I run on RetailReady is
      built around that — onboarding the agent into the right context, paired sub-agent
      reviews on every spec and plan, and guardrails that fail loud at the commit,
      push, and test boundaries.
    </p>

    <div class="ai-mechs">
      <article class="ai-mech fade-up delay-1" use:spotlight>
        <div class="ai-mech-eyebrow">01 · ORIENTATION</div>
        <h3>A topic map the agent loads on demand.</h3>
        <p>
          A single <code>INDEX.md</code> at the root splits the project into 13 topics —
          testing, EDI flow, retailers, database, security, deploy, and so on. Each
          topic block lists the right docs, the matching architecture diagram, and a
          one-paragraph summary. When a question lands, the matching block gets pulled
          into the conversation, so the agent works from the right context instead of
          grepping cold.
        </p>
        <p>
          Every project directory also has its own short rules file — and there are
          two copies of each: a <code>CLAUDE.md</code> for Claude Code and a mirrored
          <code>AGENTS.md</code> for Codex. Walk into the AS2 project, the agent picks
          up the rules scoped to AS2. Walk into the engine, it picks up the engine's
          rules. On top of that, 13 "orient" skills run in side conversations and
          return a structured briefing on each topic — so the main session stays
          clean and focused on the task at hand.
        </p>
      </article>

      <article class="ai-mech fade-up delay-2" use:spotlight>
        <div class="ai-mech-eyebrow">02 · GUARDRAILS</div>
        <h3>Hooks and tests that fail loud.</h3>
        <p>
          The commit hook refuses any commit that weakens a failing test without a
          written justification — so the suite can't quietly erode just to make a
          build pass. Real EDI fixtures live in versioned files with a provenance
          sidecar; if anyone tries to inline a fake one in a test file, the hook
          blocks the commit. A meta-test fails red the moment a new document type
          ships without coverage. Push hooks block pushes that touch architectural
          areas without updating the matching diagram. And destructive git commands
          (<code>reset --hard</code>, <code>checkout --</code>, <code>clean -f</code>)
          are blocked outright with a hard-coded reason citing the day they cost me
          work.
        </p>
        <p>
          The agent gets to be useful inside a system that won't let it cut corners.
          The bar isn't enforced by hoping the agent reads the style guide — it's
          enforced by the tooling.
        </p>
      </article>

      <article class="ai-mech fade-up delay-3" use:spotlight>
        <div class="ai-mech-eyebrow">03 · SPEC → PLAN → SHIP</div>
        <h3>Brainstorm, spec, plan, sub-agent review, ship.</h3>
        <p>
          Built on top of Anthropic's open-source "superpowers" agent skills. Every
          feature flows the same way: brainstorm with the agent, write a spec doc,
          have a separate sub-agent review it (never self-review), write an
          implementation plan, review the plan with another sub-agent, then build it
          task-by-task with a fresh sub-agent per task and tests written before the
          code. Each concurrent piece of work runs in its own git worktree on its
          own branch, so multiple sessions can be open at once without stepping on
          each other.
        </p>
        <p>
          Two collaboration modes: a paired one where I'm in the loop on every
          checkpoint, and an autonomous one for well-scoped work — but both go
          through the same spec, plan, and review gates.
        </p>
      </article>

      <article class="ai-mech fade-up delay-4" use:spotlight>
        <div class="ai-mech-eyebrow">04 · TOOL-AGNOSTIC</div>
        <h3>Same project, runs identically under Claude or Codex.</h3>
        <p>
          Every <code>CLAUDE.md</code> has a mirrored <code>AGENTS.md</code> — same
          content, written for Codex's loading model. The 13 orient skills are
          installed under both <code>~/.claude/skills/</code> and
          <code>~/.codex/skills/</code>. Hooks and meta-tests apply at commit, push,
          and test time regardless of which agent wrote the diff. Codex sessions get
          a <code>cdx/</code> branch prefix so they're easy to spot in
          <code>git log</code>. Everything else is symmetrical, by design — no
          vendor lock-in.
        </p>
      </article>
    </div>

    <div class="ai-pull fade-up">
      <blockquote>
        Most "AI-native" claims that the AI raised the bar.
        <em>The scaffolding raises the bar.</em>
        The AI just gets to run inside it safely.
      </blockquote>
    </div>

    <p class="ai-close fade-up">
      The system is self-improving. When something goes wrong — a class of bug
      slipped through, a judgment call paid off, a workaround turned out to be the
      wrong call — a hook prompts a short feedback note that becomes a durable
      guardrail. About 30 of those exist in project memory now, each one preventing
      a class of mistake from coming back.
    </p>

    <div class="section-cta fade-up">
      <a class="link-cta" href="/working-with-ai">
        Read how I work with AI
        <span class="arrow">→</span>
      </a>
    </div>
  </div>
</section>

<style>
  .ai-mechs {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr;
    margin: 48px 0 56px;
  }
  @media (min-width: 900px) {
    .ai-mechs {
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
    }
  }
  .ai-mech {
    position: relative;
    overflow: hidden;
    background: rgba(13, 21, 48, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    padding: 32px;
    transform-style: preserve-3d;
    transform: perspective(800px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
    transition:
      transform 220ms var(--ease-out-soft),
      border-color var(--dur-base) var(--ease-out-soft),
      box-shadow var(--dur-base) var(--ease-out-soft);
    will-change: transform;
  }
  .ai-mech:hover {
    border-color: rgba(80, 200, 255, 0.32);
    transform: perspective(800px) translateY(-2px) rotateX(var(--tilt-x, 0deg))
      rotateY(var(--tilt-y, 0deg));
    box-shadow:
      0 30px 60px -30px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(80, 200, 255, 0.18);
  }
  .ai-mech::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      300px circle at var(--spot-x, -200px) var(--spot-y, -200px),
      rgba(125, 220, 255, 0.18),
      transparent 60%
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 220ms var(--ease-out-soft);
    mix-blend-mode: screen;
    z-index: 1;
  }
  .ai-mech:hover::after {
    opacity: 1;
  }
  .ai-mech > * {
    position: relative;
    z-index: 2;
  }
  @media (pointer: coarse) {
    .ai-mech {
      transform: none;
    }
    .ai-mech:hover {
      transform: translateY(-2px);
    }
  }
  .ai-mech-eyebrow {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--cyan);
    margin: 0 0 14px;
  }
  .ai-mech h3 {
    font-family: var(--font-display);
    font-weight: 360;
    font-size: clamp(1.25rem, 1.8vw + 0.5rem, 1.55rem);
    line-height: 1.2;
    letter-spacing: -0.012em;
    margin: 0 0 16px;
    color: var(--fg-moonlight);
  }
  .ai-mech p {
    margin: 0 0 14px;
    font-size: 15px;
    line-height: 1.6;
    color: var(--fg-haze);
  }
  .ai-mech p:last-child {
    margin-bottom: 0;
  }
  .ai-mech code {
    font-family: var(--font-mono);
    font-size: 0.88em;
    color: var(--cyan-bright);
    background: rgba(80, 200, 255, 0.06);
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid rgba(80, 200, 255, 0.12);
  }
</style>
