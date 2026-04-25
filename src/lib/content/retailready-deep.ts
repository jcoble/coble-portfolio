export const retailreadyDeep = {
  title: "RetailReady — System Overview",
  subtitle: "Multi-tenant EDI platform for vendors selling to major retailers.",
  lastUpdated: "2026-04-25",
  toc: [
    { id: "what-it-is", label: "What it is" },
    { id: "how-it-works", label: "How it works" },
    { id: "architecture", label: "Architecture" },
    { id: "customer-journey", label: "Customer journey" },
    { id: "platform-features", label: "Platform features" },
    { id: "design-decisions", label: "Key design decisions" },
    { id: "tech-stack", label: "Tech stack" }
  ],
  sections: {
    whatItIs: [
      "EdiPlatform — branded as RetailReady — is a cloud EDI platform for product vendors selling through major retailers like Walmart, Best Buy, Dollar Tree, Meijer, and Dollar General. It handles the complete EDI lifecycle: receiving purchase orders, sending acknowledgments, ship notices, and invoices, while tracking compliance, chargebacks, and payments.",
      "Think of it as a managed middleware layer between a vendor's operations and their retail partners' EDI systems."
    ],
    whoItsFor: [
      "Primary users: small-to-mid-size product vendors who sell through major retailers but don't have the infrastructure or expertise to manage EDI compliance in-house.",
      "The problem it solves: retailers like Walmart and Best Buy require vendors to exchange documents in specific EDI formats (X12, EDIFACT). Getting the formatting, timing, and compliance right is complex — mistakes lead to chargebacks, strained relationships, and lost revenue. RetailReady handles the technical complexity so vendors can focus on selling."
    ],
    coreFlow: [
      "Retailer sends a Purchase Order (850) via SFTP or AS2",
      "Platform receives and parses it into a structured order",
      "Platform sends a Functional Acknowledgment (997) within 24 hours of receiving any inbound doc",
      "Vendor acknowledges the order (855 PO Acknowledgment) within the retailer's SLA",
      "Vendor ships and the platform generates an ASN (856 Ship Notice)",
      "Vendor invoices and the platform generates an invoice (810)",
      "Retailer's 997s confirm receipt of each outbound doc",
      "Platform tracks compliance — on-time delivery, ASN accuracy, SLA adherence, chargebacks"
    ],
    activeRetailers: [
      { code: "WALMART", name: "Walmart", notes: "UL/GLN qualifier" },
      { code: "BESTBUY", name: "Best Buy", notes: "DUNS qualifier" },
      { code: "DOLLARTREE", name: "Dollar Tree", notes: "Routes through Ariba shared gateway" },
      { code: "MEIJER", name: "Meijer", notes: "6-char PO numbers, hierarchy code 0001" },
      { code: "DOLLARGENERAL", name: "Dollar General", notes: "855 + 856 are optional" }
    ],
    runtime: [
      "Three .NET runtime processes plus a SvelteKit SSR process. PostgreSQL is the shared DB. RabbitMQ is the API↔Engine message bus. SignalR is the API→browser push channel. AS2 and SFTP terminate at the platform EDI server (separate VPS) and reach retailers from there.",
      "Browser ↔ API: REST + 2 SignalR hubs. SvelteKit SSR proxies and attaches the JWT.",
      "API ↔ Engine: RabbitMQ for fanned-out events. Never direct HTTP. Canonical path: RabbitMqPublisher (Engine) → NotificationConsumer (API hosted service) → SignalR hub.",
      "Engine ↔ external EDI: routed through the platform EDI server VPS. The Engine never speaks AS2/SFTP directly to retailers."
    ],
    projects: [
      {
        name: "EdiPlatform.Core",
        role: "Domain model, enums, interfaces, configuration POCOs, value services"
      },
      {
        name: "EdiPlatform.Data",
        role: "EF Core DbContext, 48 migrations, seeders, RLS interceptor, audit-trail service"
      },
      {
        name: "EdiPlatform.Parsers",
        role: "X12 + EDIFACT + SP-API parsers and generators, validators"
      },
      {
        name: "EdiPlatform.Api",
        role: "ASP.NET Core REST API, 60 controllers (36 customer + 24 admin), SignalR hubs, JWT/API-Key auth, RabbitMQ publisher, Stripe webhook"
      },
      {
        name: "EdiPlatform.Engine",
        role: "Background-worker host. 7 workers + 2 watchers + advisory-lock singleton guard. Owns SFTP/AS2/SP-API I/O."
      },
      {
        name: "RetailerSimulator",
        role: "Standalone .NET service simulating 11 retailers' inbound/outbound for sandbox / practice mode. Has its own DB + parsers."
      }
    ],
    workers: [
      {
        name: "FtpMonitorWorker",
        poll: "15 s",
        timeout: "2 min",
        job: "Polls EDI server SFTP inbound folders for each trading partner, downloads new files."
      },
      {
        name: "TransactionProcessorWorker",
        poll: "5 s",
        timeout: "30 s",
        job: "Parses queued inbound EDI into entities, auto-enriches lines from SkuMappings."
      },
      {
        name: "OutboundTransmissionWorker",
        poll: "10 s",
        timeout: "3 min",
        job: "Picks Pending OutboundDocument rows, validates, transmits via SFTP/AS2/SP-API."
      },
      {
        name: "MdnCheckWorker",
        poll: "5 min",
        timeout: "30 s",
        job: "Sweeps AS2 messages waiting for MDN. Marks any past 30 min as MDN-timeout."
      },
      {
        name: "DeadlineCheckWorker",
        poll: "1 h",
        timeout: "2 min",
        job: "Runs DeadlineTrackingService.CheckDeadlinesAsync(), fans alerts."
      },
      {
        name: "SpApiPollerWorker",
        poll: "60 s",
        timeout: "5 min",
        job: "Polls Amazon SP-API for new POs per active integration."
      },
      {
        name: "SpApiStatusPollerWorker",
        poll: "30 s",
        timeout: "2 min",
        job: "Polls SP-API for status of submitted ack/ship/invoice transactions."
      },
      {
        name: "WorkerWatchdogService",
        poll: "30 s",
        timeout: "n/a",
        job: "Reads worker heartbeats from DB; after 3 stuck detections (~90 s), triggers graceful shutdown."
      },
      {
        name: "AdvisoryLockWatcherService",
        poll: "5 s",
        timeout: "n/a",
        job: "Watches the dedicated NPGSQL connection holding pg_advisory_lock(59483); triggers shutdown if evicted."
      }
    ],
    journeyDeep: [
      {
        stage: "Onboarding (5 steps)",
        body: "Company info, address, plan selection, retailer selection, confirmation. Creates trading partners in Sandbox stage with auto-linked EDI standards."
      },
      {
        stage: "Sandbox (Practice Mode)",
        body: "Guided 5-step walkthrough: add products, receive test PO, acknowledge order, ship order, invoice. Uses real EDI document generation against the Retailer Simulator — no risk of hitting live retailers."
      },
      {
        stage: "Preflight",
        body: "8 validation checks (EDI receiver ID, protocol config, credentials, connection test, sandbox success, etc.). 4-step wizard walks users through configuration. Passing all checks unlocks promotion to Certification."
      },
      {
        stage: "Certification",
        body: "The vendor exchanges live test documents directly with the retailer to prove their EDI implementation is correct. Most retailers require this before allowing a vendor to go live."
      },
      {
        stage: "Go-Live",
        body: "Final verification that all preflight checks still pass and the connection test is proven. Promotes to Live stage — real production EDI starts flowing."
      },
      {
        stage: "Production Operations",
        body: "Real purchase orders received and processed automatically. Outbound documents generated, validated against retailer-specific rules, and transmitted. Compliance scoring (OTIF, ASN accuracy, acknowledgment rates) with 30-day rolling metrics. Chargeback tracking with reason codes, dispute workflow, and deadline alerts. Payment matching from 820 remittance documents."
      }
    ],
    features: [
      {
        name: "Products & Inventory",
        body: "Vendors manage a unified product catalog combining SKU mappings with inventory levels. Each product can have retailer-specific identifiers (UPC, buyer item numbers) mapped per trading partner. Inventory tracks quantity on hand, reserved, and available with a full audit trail. When inbound POs arrive, the platform auto-enriches order line items from the SKU catalog and learns new identifiers back into the catalog."
      },
      {
        name: "Accounting Integration",
        body: "Two-way sync with QuickBooks Online and NetSuite. Vendors can import orders from their accounting system and invoices sync back with payment status. Supports CSV export as a fallback. OAuth2 for credential management."
      },
      {
        name: "AI Assistant",
        body: "Built-in chat assistant for questions about EDI concepts, platform usage, and the user's own data. It can look up orders, shipments, invoices, and trading partner status. Streams responses via SSE. Per-customer usage tracking for billing."
      },
      {
        name: "Notifications",
        body: "Multi-channel coverage of the full document lifecycle — new orders, transmission success/failure, SLA deadline warnings, chargeback alerts, payment receipts, engine health alerts. Users configure per-notification-type preferences. The notification bell shows unread counts in real time via SignalR."
      },
      {
        name: "Reports",
        body: "Reporting with PDF export for compliance scorecards, order summaries, and financial reconciliation. Per-retailer breakdowns with trend analysis."
      },
      {
        name: "Documentation",
        body: "Built-in searchable documentation covering EDI concepts, platform workflows, retailer-specific requirements, and an EDI glossary. Rendered from markdown inside the customer portal."
      }
    ],
    designDecisions: [
      {
        title: "Multi-format support",
        body: "The same order can generate X12 or EDIFACT output depending on the trading partner's configuration. A plugin-based generator resolver loads the correct generator at runtime."
      },
      {
        title: "Retailer-specific configs are HARDCODED",
        body: "RetailerEdiConfigFactory in EdiPlatform.Engine holds per-retailer envelope quirks (qualifiers, hierarchy codes, identifier preferences) — not in the database. Connection/transport (SFTP creds, AS2 endpoints) lives in the RetailerProfile DB entity."
      },
      {
        title: "Validator scope is OUTBOUND ONLY",
        body: "RetailerValidator (via PreSendValidationService) validates outbound docs (855/856/810/997-out) before transmit. Inbound docs (850/860/812/820/824/997-in) are PARSER territory — we cannot reject what retailers send."
      },
      {
        title: "Three EDI ack layers — never conflate",
        body: '997 (protocol/syntax — "your file arrived"), 855 (business — "I\'ll fulfill 20, backorder 5"), 824 (semantic-error — "data parsed fine but business rules say it\'s wrong"). Each is required independently.'
      },
      {
        title: "Single-instance engine",
        body: "PostgreSQL advisory lock (key 59483) ensures only one Engine instance runs at a time, with a pg_terminate_backend() takeover handshake for safe failover. Workers use FOR UPDATE SKIP LOCKED for claim-based concurrency on transactions and status-based claiming on outbound documents."
      },
      {
        title: "Real-time updates everywhere",
        body: "The Engine publishes events via RabbitMQ. The API consumes them and broadcasts to connected browsers via SignalR. Virtually every customer-facing page updates in real time — the Order Details page with its tabbed workspace (Ship, Invoice, Payment, Chargeback, Confirm tabs) live-updates as documents are generated, transmitted, and acknowledged."
      },
      {
        title: "Row-Level Security (RLS)",
        body: "PostgreSQL RLS policies enforce per-customer data isolation at the database layer. The API connects as ediplatform_api (a restricted role with RLS enforced); the Engine connects as a role with admin bypass for cross-customer routing. An EF Core DbConnectionInterceptor sets app.current_customer_id and app.is_admin GUC variables on every connection open. Defense-in-depth alongside application-layer .Where(CustomerId == x) filtering — even a controller bug that omits a filter cannot leak cross-tenant data."
      },
      {
        title: "Sandbox isolation",
        body: "All sandbox entities are flagged with IsSandbox = true. Sandbox documents are validated but never transmitted to real retailers. The Retailer Simulator provides realistic responses for end-to-end testing."
      },
      {
        title: "Two-layer monitoring",
        body: "Layer A: in-app EngineAlertService catches stale documents, repeated per-partner failures, worker-heartbeat gaps. Layer B: host-level edi-monitor systemd service catches container crashes and healthcheck failures. The host-level layer is the only notifier that survives an API startup failure. Built after a real silent outage."
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
        title: "Multi-environment isolation in the simulator",
        body: "The simulator's CustomerEnrollment unique key is (RetailerInstanceId, CustomerEdiId, Environment) — Environment was added explicitly because without it, a dev enrollment would silently block staging from creating the same retailer/customer pair. Paired with env-suffixed AS2 sender IDs (SIM_WALMART for dev, SIM_WALMART_STAGING for staging, SIM_WALMART_PROD for prod), each environment's documents route to its own SFTP folder."
      },
      {
        title: "AES-256-GCM per-file certificate encryption",
        body: "Each AS2 certificate is individually encrypted with AES-256-GCM at the application layer before persisting. Allows per-cert key rotation and enables future migration to HSM/KMS without architectural changes."
      },
      {
        title: "Required-environment-parameter API discipline",
        body: "SimulatorClient.FindEnrollmentAsync makes the environment parameter required (never optional or defaulted), forcing every cross-env lookup to be explicit and preventing silent mis-routing of documents."
      }
    ],
    techStackTable: [
      {
        layer: "Frontend",
        tech: "SvelteKit · Svelte 5 runes · TanStack Query · Tailwind v4 · Shadcn-Svelte"
      },
      { layer: "API", tech: ".NET 10 · ASP.NET Core · EF Core · SignalR" },
      {
        layer: "Engine",
        tech: ".NET 10 · 7 background workers + 2 watchers + advisory-lock singleton guard"
      },
      { layer: "Database", tech: "PostgreSQL · RLS on 40 tables · ediplatform_api role" },
      { layer: "Messaging", tech: "RabbitMQ" },
      { layer: "EDI Protocols", tech: "SFTP (SSH.NET) · AS2 (OpenAS2)" },
      { layer: "Billing", tech: "Stripe" },
      { layer: "Accounting", tech: "QuickBooks · NetSuite (OAuth2)" },
      { layer: "Testing", tech: "xUnit · Testcontainers · FluentAssertions · Moq" },
      { layer: "Infrastructure", tech: "Docker · Traefik · Hetzner VPSes · Sentry" }
    ]
  }
};
