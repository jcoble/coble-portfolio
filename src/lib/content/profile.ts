export const profile = {
  name: "Jesse Coble",
  monogram: "JC",
  role: "Owner of Coble Solutions and RetailReady EDI",
  headline: "Building sharper systems for retail operations.",
  intro:
    "I run Coble Solutions and RetailReady EDI, building product surfaces, automation, and operating systems for real business workflows. The work sits between practical engineering, restrained interface design, and tools teams can trust when the stakes are high.",
  location: "Akron, OH",
  email: "coble.jesse@gmail.com",
  retailreadyEmail: "jessecoble@retailreadyedi.com",
  videoSrc: "/media/hero-laptop-scrub.mp4",
  availability: "Coble Solutions / RetailReady EDI",
  focus: ["RetailReady EDI", "Coble Solutions", "Workflow design", "Product systems"]
} as const;

export const heroSignals = [
  { label: "Founder-led", icon: "CirclesThreePlus" as const },
  { label: "Operational", icon: "SealCheck" as const },
  { label: "Fast", icon: "Lightning" as const }
];

export const practice = {
  eyebrow: "Practice",
  headline: "Founder-led software for operational work.",
  body: "Jesse builds founder-led software around practical workflows: EDI operations, data movement, customer-facing tools, and the internal systems that make a business easier to run."
};

export const retailready = {
  eyebrow: "RetailReady EDI",
  headline: "A retail EDI platform that shows its work.",
  intro: [
    "RetailReady is a multi-tenant EDI platform that sits between product vendors and major retailers — Walmart, Best Buy, Dollar Tree, Meijer, Dollar General. It receives purchase orders, generates acknowledgments, ASNs, and invoices, validates everything against retailer-specific rules, and tracks compliance and chargebacks in real time.",
    "Built so vendors don't have to wait for support tickets to know what happened to their documents. Document state, validator output, retransmission status, and SLA clocks are all visible in one place."
  ],
  stats: [
    { value: "5", label: "Active retailers" },
    { value: "52", label: "Entities" },
    { value: "40", label: "RLS-enforced tables" },
    { value: "60", label: "Controllers" },
    { value: "9", label: "Engine workers + watchers" },
    { value: "48", label: "Migrations" },
    { value: "~900", label: "Tests, default suite" },
    { value: "X12 / EDIFACT", label: "Document formats" }
  ],
  docTypes: {
    columns: [
      {
        format: "X12",
        docs: [
          { code: "850", name: "Purchase Order" },
          { code: "855", name: "PO Acknowledgment" },
          { code: "856", name: "Ship Notice (ASN)" },
          { code: "810", name: "Invoice" },
          { code: "846", name: "Inventory" },
          { code: "997", name: "Functional Ack" },
          { code: "812", name: "Chargeback" },
          { code: "820", name: "Payment / Remittance" }
        ]
      },
      {
        format: "EDIFACT",
        docs: [
          { code: "ORDERS", name: "Purchase Order" },
          { code: "ORDRSP", name: "Order Response" },
          { code: "DESADV", name: "Despatch Advice" },
          { code: "INVOIC", name: "Invoice" },
          { code: "CONTRL", name: "Control Message" },
          { code: "REMADV", name: "Remittance Advice" }
        ]
      }
    ]
  },
  journey: [
    {
      name: "Sandbox",
      description: "Practice mode against a retailer simulator. Real generators, no live partners."
    },
    {
      name: "Preflight",
      description: "8 validation checks. Receiver IDs, protocol config, credentials, connection."
    },
    {
      name: "Certification",
      description: "Live test docs exchanged with the retailer. Most retailers require it."
    },
    {
      name: "Go-Live",
      description: "Final verification, all checks green. Promote to production."
    },
    {
      name: "Production",
      description: "Real documents, real metrics, OTIF + ASN accuracy + chargeback tracking."
    }
  ],
  techStack: [
    {
      category: "Frontend",
      items: ["SvelteKit", "Svelte 5 runes", "Tailwind v4", "Shadcn-Svelte"]
    },
    { category: "API", items: [".NET 10", "ASP.NET Core", "EF Core", "SignalR"] },
    {
      category: "Engine",
      items: [".NET 10", "8 background workers", "2 watchers", "Advisory-lock singleton"]
    },
    { category: "Database", items: ["PostgreSQL", "RLS on 40 tables", "ediplatform_api role"] },
    { category: "Messaging", items: ["RabbitMQ (API ↔ Engine)"] },
    { category: "EDI Protocols", items: ["SFTP (SSH.NET)", "AS2 (OpenAS2)"] },
    { category: "Billing", items: ["Stripe"] },
    { category: "Accounting", items: ["QuickBooks Online", "NetSuite", "OAuth2"] },
    { category: "Infrastructure", items: ["Docker", "Traefik", "Hetzner"] }
  ],
  flexPoints: [
    {
      title: "Two-layer monitoring after a real silent outage",
      body: "An in-app EngineAlertService watches domain logic — stale documents, repeated per-partner failures, worker heartbeat gaps. A host-level edi-monitor systemd service catches container crashes and healthcheck failures. The host-level layer is the only notifier that survives an API startup failure. Both were built after a 2.7-day silent outage in April 2026 proved one layer wasn't enough."
    },
    {
      title: "Per-worker cascading timeouts",
      body: "Every Engine worker carries its own poll interval and per-step deadline enforced via CancellationTokenSource.CreateLinkedTokenSource. One stalled retailer connection cannot freeze the rest of the pipeline."
    },
    {
      title: "Outbound retry with optimistic concurrency",
      body: "Outbound documents enforce a 45-second per-doc transmit timeout. Postgres RowVersion (xmin) prevents a retry from racing with an inbound 997 acknowledgment that arrived mid-transmission."
    },
    {
      title: "Advisory-lock singleton with takeover handshake",
      body: "Engine startup acquires pg_advisory_lock(59483) on a dedicated non-pooled connection. If a stale instance still holds it, pg_terminate_backend() evicts cleanly. A watcher service triggers graceful shutdown on lock loss instead of leaving zombies."
    },
    {
      title: "Postgres row-level security at the database layer",
      body: "40 tables enforce row-level security through the ediplatform_api role and per-request GUC variables set by an EF Core interceptor. FORCE ROW LEVEL SECURITY blocks even the table owner from bypassing policies — defense-in-depth alongside the existing application-layer filters."
    }
  ],
  wedge:
    "Most EDI platforms are black boxes that hide failures behind support tickets. RetailReady shows you the document, the validator output, the retransmission state, and the SLA clock — all live, all in one place. Sandbox runs your real EDI generators against a retailer simulator before you touch a live partner. RLS at the database layer means a controller bug can't leak across customers. A single-instance engine with advisory-lock takeover means no zombie processes, no lost documents."
};

export const aiEngineering = {
  eyebrow: "Working with AI",
  headline: "Building a context system around Claude.",
  problem:
    "Working with a coding LLM on a large codebase is a context problem disguised as a chat problem. Even a million-token window can't hold every architecture diagram, retailer-specific quirk, deployment runbook, and open bug — and what's loaded suffers attention drift, gets evicted by compaction, or goes stale against source.",
  stats: [
    { value: "16", label: "CLAUDE.md files" },
    { value: "13", label: "Orient skills" },
    { value: "28", label: "Skills total" },
    { value: "12", label: "Hook scripts" },
    { value: "7", label: "Specialist sub-agents" },
    { value: "64", label: "Typed memory files" }
  ],
  pullQuote:
    "Loaded ≠ attended. Files dumped into SessionStart context become bytes the model doesn't actively retrieve, and the next compaction evicts them. So orientation is on-demand and forked, not preloaded.",
  closing: "I'm no master at this. But the system is opinionated, and the opinions are earned."
};

export const cobleSolutions = {
  eyebrow: "Coble Solutions",
  headline: "Founder-led services.",
  body: "Hands-on technical strategy and product execution for companies that need software to reflect the way their work actually happens. Engagements stay close to business value and ship in tight loops with the people who will use the tool."
};

export const experience = {
  eyebrow: "Experience",
  headline: "A decade-plus of EDI.",
  body: "10+ years building software, with EDI as the through-line. Started in 2014 building reader/writer engines for steamship lines at DepotSystems (322, EDIFACT CEDEX, 301, Westim, Destim, Codeco, WORDER). Spent four years as the sole developer on ISO management systems for the medical device and aerospace industries at IMSXpress. Currently runs RetailReady — a retail EDI platform for vendors selling into Walmart, Best Buy, Dollar Tree, Meijer, and Dollar General.",
  timeline: [
    {
      years: "2022 — Present",
      role: "Founder, Lead Engineer",
      company: "Coble Solutions / RetailReady EDI"
    },
    { years: "2018 — 2022", role: "Senior / Sole Developer", company: "AQA Company (IMSXpress)" },
    {
      years: "2014 — 2018",
      role: "Developer → Senior Developer",
      company: "Edge Networks / DepotSystems"
    }
  ]
};

export const capabilities = [
  {
    name: "EDI workflow design",
    description:
      "Map how documents, retailers, customers, and exceptions actually move through the business before shaping the interface."
  },
  {
    name: "Operational product engineering",
    description:
      "Build usable systems where backend reliability and frontend clarity carry equal weight."
  },
  {
    name: "Automation with judgment",
    description:
      "Use automation to remove repeated work while keeping review, accountability, and edge cases visible."
  },
  {
    name: "Founder-speed execution",
    description:
      "Keep the scope close to business value, then ship in tight loops with the people who will use the tool."
  }
];

export const methods = [
  "Start with the workflow, then design the screen.",
  "Keep state, exceptions, and next actions visible.",
  "Use motion to clarify relationships, never to hide loading.",
  "Bias toward tools that can be operated repeatedly without fatigue."
];

export const resume = {
  name: "Jesse Coble",
  email: "coble.jesse@gmail.com",
  location: "Akron, OH",
  summary:
    "Highly accomplished Software Developer with 10+ years of experience leading projects through the entire SDLC. Translates complex business demands into robust, scalable technical solutions — from initial concept and implementation through post-launch support.",
  experience: [
    {
      role: "Founder, Lead Engineer",
      company: "Coble Solutions / RetailReady EDI",
      location: "Akron, OH",
      years: "2022 — Present",
      bullets: [
        "Built RetailReady — a multi-tenant EDI platform serving 5 active retailers (Walmart, Best Buy, Dollar Tree, Meijer, Dollar General) with X12 + EDIFACT support, real-time SignalR updates, and Postgres RLS at the database layer.",
        "Multi-project .NET 10 + SvelteKit architecture: ASP.NET Core API, background-worker Engine, RabbitMQ messaging, OpenAS2/SFTP transport, ~900-test default suite.",
        "Operates Coble Solutions, providing founder-led product execution to companies needing practical systems."
      ]
    },
    {
      role: "Senior / Sole Developer",
      company: "AQA Company, Inc. (IMSXpress)",
      location: "Remote",
      years: "2018 — 2022",
      bullets: [
        "Architected and maintained the core IMSXpress software — an ISO Management System for the medical device and aerospace industries.",
        "Built ancillary systems for managing software development specifications compliant with regulated-industry standards.",
        "Provided full-stack development, maintenance, complex debugging, and direct support to the company owner."
      ]
    },
    {
      role: "Senior Developer / Tech",
      company: "Edge Networks Inc. / DepotSystems Software",
      location: "Willoughby, OH",
      years: "2014 — 2018",
      bullets: [
        "Developed EDI reader and writer engines for steamship-line ↔ depot communication (322, EDIFACT CEDEX, 301, Westim, Destim, Codeco, WORDER).",
        "Key contributor to the main DepotSystems PC/Tablet software — full lifecycle in C#.NET + DevExpress + SQL.",
        "Built a FoxPro → SQL migration tool that significantly increased data conversion speed while working around corrupted source data.",
        "Wrote and customized a large library of customer reports via stored procedures, Crystal Reports, and DevExpress Reports.",
        "Provided 24/7 on-call production support and mentored junior team members."
      ]
    }
  ],
  technical: [
    { category: "Languages", items: ["C# / .NET", "TypeScript", "VB.NET", "T-SQL", "JavaScript"] },
    {
      category: "Frameworks (current)",
      items: [
        "SvelteKit",
        "Svelte 5 runes",
        "ASP.NET Core",
        ".NET 10",
        "EF Core",
        "SignalR",
        "Tailwind v4"
      ]
    },
    {
      category: "Frameworks (historical)",
      items: ["WinForms", "ASP.NET WebForms", "DevExpress", "Crystal Reports"]
    },
    { category: "Data", items: ["PostgreSQL", "MS SQL Server", "SQLite", "FoxPro"] },
    {
      category: "Infrastructure",
      items: ["Docker", "Traefik", "Hetzner", "Hyper-V", "Microsoft Server"]
    },
    {
      category: "Messaging / Protocols",
      items: ["RabbitMQ", "AS2 (OpenAS2)", "SFTP", "EDI X12 + EDIFACT"]
    },
    { category: "Methodologies", items: ["OOAD", "TDD", "SDLC ownership", "On-call support"] }
  ],
  education: {
    school: "Kent State University",
    location: "Kent, Ohio",
    degree: "B.S. in Computer Information Systems",
    year: "2008"
  }
};
