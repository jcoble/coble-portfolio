export const workingWithAiDeep = {
  title: "Working with Claude on a large codebase",
  subtitle:
    "A context-routing system between Claude and EdiPlatform — CLAUDE.md hierarchy, INDEX.md routing, orient skills, hooks, and memory.",
  lastUpdated: "2026-04-25",
  toc: [
    { id: "the-problem", label: "The problem" },
    { id: "the-system", label: "The system" },
    { id: "design-decisions", label: "Design decisions" },
    { id: "honest", label: "Honest framing" }
  ],
  problem: [
    "Working with a coding LLM on a large, evolving codebase is a context problem disguised as a chat problem. Even a million-token window can't hold every architecture diagram, retailer-specific quirk, deployment runbook, and open bug — and what's loaded suffers attention drift, gets evicted by compaction, or goes stale against source.",
    "The naive workaround — letting the model grep its way to understanding on every task — burns context, produces confidently-wrong assumptions, and re-discovers things the human already wrote down."
  ],
  system: [
    "EdiPlatform is a multi-project .NET 10 + SvelteKit codebase with 16 module-scoped CLAUDE.md files, 40 RLS-protected tables, three production servers, and a ~900-test default suite. The orchestration sits at the project's `.claude/` root and works in five layered pieces.",
    "Layer 1 — Hierarchical CLAUDE.md (16 files, auto-loaded by working dir). The 129-line root CLAUDE.md carries cross-cutting rules. Each .NET project has its own scoped CLAUDE.md.",
    "Layer 2 — INDEX.md as topic router. A 185-line file mapping 13 topics to a primary architecture diagram with a FRESH/STALE label, then deep links into research docs and memory files.",
    'Layer 3 — 13 orient-* skills (forked-context briefings). Each skill uses context: fork + Explore sub-agent. The skill body lists 4-5 must-read files and demands a structured briefing back with cited file:line references plus a mandatory "flag drift" section.',
    "Layer 4 — File-based typed memory system. 64 typed memory files split into 38 feedback_*, 19 project_*, and 7 reference_*. MEMORY.md groups them with one-line annotations.",
    "Layer 5 — Hooks (12 hook files). SessionStart loads INDEX.md plus current.md. PreToolUse-Bash blocks destructive git (git reset --hard, git clean -f, git restore .). PreToolUse-Edit blocks assertion changes in test files unless the new string strictly extends the old. PostToolUse-Bash prompts the model to fix code-not-tests after dotnet test failures.",
    "Layer 6 — 7 specialist sub-agents in `.claude/agents/`: test-orchestrator coordinates Docker-slot test pipelines with a mandatory user-checkpoint phase before fixing anything."
  ],
  designDecisions: [
    {
      title: "Forked-context skills, not auto-injection",
      body: "The original design auto-dumped INDEX.md on every UserPromptSubmit via route-context.py. That worked until INDEX hit ~19KB and started getting truncated. The auto-injector was retired in favor of context: fork skills that dispatch an Explore sub-agent. The diagram + memory files are read in the forked context; only the briefing returns. Trade-off: the model has to recognize the topic and self-invoke. The win: controller context stays lean across long sessions."
    },
    {
      title: "Loaded ≠ attended",
      body: 'Files dumped into context at SessionStart are bytes, not active memory. Long sessions + compactions evict unused content. Active re-reading via the Read tool is the only behavior that survives compaction. This single insight reshaped the whole orientation pattern away from "preload everything" toward "fork-and-summarize on demand."'
    },
    {
      title: "Diagrams as first-class, with executable parity tests",
      body: "Architecture diagrams under Docs/Architecture/diagrams/ carry FRESH/STALE labels, but parity is enforced by C1 meta-tests in EdiPlatform.IntegrationTests/MetaTests/ — adding a new entity, controller, or retailer without listing it in the matching diagram fails the next dotnet test. A C2 pre-push hook blocks pushes that touch watched directories without diagram updates, with a documented bypass token. Same pattern for test integrity: the commit-msg hook blocks assertion-flip diffs unless the message contains TEST-CHANGE: <TestName>: <reason>."
    },
    {
      title: "Sub-agents start cold — INDEX is paste-required",
      body: "Hooks don't fire for sub-agents. The dispatcher must paste the matching INDEX.md topic block into every sub-agent prompt. Most people miss this — the auto-load mechanism only protects the main thread; dispatchers must explicitly hand context down."
    },
    {
      title: "Typed memory naming is the index",
      body: "Memory files use a <type>_<slug>.md convention. MEMORY.md groups by type with one-line annotations marking high-leverage entries. INDEX.md DEEP links point straight at specific memory files. Files marked HIGH-LEVERAGE are the meta-rules that prevent recurring mistake classes. There's no vector DB — just disciplined naming and a hand-curated index."
    }
  ],
  honest: "I'm no master at this — but the system is opinionated, and the opinions are earned."
};
