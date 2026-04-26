# Portfolio Content Specification

**Date:** 2026-04-25  
**Owner:** Jesse Coble  
**Status:** Draft content spec  
**Scope:** Content, information architecture, section copy, and content hierarchy only. Styling, visual theming, palette, typography, animation mechanics, and framework implementation details are intentionally out of scope.

---

## 1. Purpose

This spec revises the portfolio content strategy so the site feels focused, memorable, and technically credible without overwhelming the visitor.

The original redesign spec contains strong material: RetailReady as the main technical proof, a working-with-AI system as a secondary proof, real career history, résumé content, capabilities, and deep-dive pages. The main content issue is not lack of substance. The issue is density.

This revised spec separates:

- **Homepage signal** — the strongest, clearest proof a visitor can understand quickly.
- **Deep-dive proof** — detailed architecture, tables, implementation specifics, and technical receipts for motivated readers.

The homepage should tell a tight story:

> Jesse turns real-world operational problems into digital software systems.

RetailReady proves that with a real platform.  
The AI engineering section proves the same mindset applied to developer workflow and large-codebase complexity.  
The experience section shows this is a long-running career arc, not a one-off project.

---

## 2. Primary Audience

The portfolio should work for multiple audiences, in this order:

1. **Technical employers / engineering leads**  
   They want proof of judgment, architecture, production awareness, and technical maturity.

2. **Prospective customers / business contacts**  
   They want confidence that Jesse can build practical systems for real operational problems.

3. **Technical peers**  
   They may read the deep dives and look for implementation rigor.

4. **Recruiters / non-technical visitors**  
   They need a clear, fast explanation of what Jesse does and why the work matters.

The homepage should be readable by all four audiences. The deep dives can be more technical.

---

## 3. Core Narrative

### Main positioning line

> **Turning real-world problems into digital solutions.**

This should be the primary hero line and the thread that ties the whole site together.

### Supporting positioning

> I build practical software systems for operations-heavy businesses — integrations, background workflows, data boundaries, and interfaces that make complex work clear.

### Expanded narrative

Jesse builds software where real-world operations meet technical complexity: EDI, APIs, accounting systems, retailer requirements, customer-specific rules, long-running jobs, retries, acknowledgments, audits, and production visibility.

The site should not present him as only a frontend developer, only a backend developer, or only an EDI specialist. The stronger positioning is:

> **Software engineer, founder, and systems builder focused on practical software for operational complexity.**

---

## 4. Content Principles

### 4.1 Homepage should be selective

The homepage should not try to document everything. It should create confidence and invite deeper reading.

Use the homepage for:

- strongest positioning
- strongest proof
- a few impressive numbers
- plain-English explanations
- short technical highlights
- clear calls to action

Move detailed implementation material to deep dives.

### 4.2 Explain the problem before the architecture

Visitors need to know why the work matters before seeing how it works.

For each major section, use this sequence:

1. **The real-world problem**
2. **The software solution**
3. **The engineering proof**
4. **The deeper link**

### 4.3 Use technical detail as proof, not decoration

Technical numbers and terms should be used when they communicate maturity.

Good homepage stats:

- 5 active retailers
- 52 data entities
- 40 RLS-enforced tables
- ~900 tests

Less useful on the homepage:

- controller counts
- migration counts
- detailed worker counts
- full protocol tables
- full stack grids

Those are valuable, but they belong in the deep dives.

### 4.4 Avoid absolute claims

Avoid wording like:

- “no lost documents”
- “impossible to leak”
- “guaranteed”
- “fully prevents”

Prefer:

- “designed to reduce”
- “built to make visible”
- “enforced below application code”
- “reduces the chance that”
- “makes state recoverable”

This keeps the tone credible and mature.

### 4.5 Do not over-explain Coble Solutions

Coble Solutions matters as the business identity behind the work, but it should not interrupt the main technical narrative as a full standalone section.

Fold it into:

- the hero eyebrow
- the experience timeline
- the contact/footer
- optionally a small business identity card

---

## 5. Homepage Information Architecture

Recommended main page order:

| Order | Section | Purpose |
|---:|---|---|
| 1 | Hero / Scroll Journey | Identity, main positioning, cinematic intro |
| 2 | Practice | Short bridge explaining what kind of work Jesse does |
| 3 | RetailReady | Main proof-of-capability |
| 4 | AI Engineering | Secondary proof: systems thinking applied to AI workflow |
| 5 | Experience | Shows the career through-line and EDI depth |
| 6 | How I Build | Merged capabilities and method |
| 7 | Résumé | Compact professional record |
| 8 | Contact | Simple final conversion |

Removed as standalone homepage sections:

- **Coble Solutions** — fold into hero, experience, contact, or footer.
- **Separate Capabilities and Method** — merge into **How I Build**.

---

## 6. Hero / Scroll Journey Content

The hero should pair with the real-world-to-digital scroll-scrubbed video concept:

> hands on laptop → camera moves into screen → digital system world → portfolio proof cards → final hero state

The actual readable content should be HTML/CSS overlay, not baked into the video.

### 6.1 Hero eyebrow

Preferred:

> **SOFTWARE ENGINEER · FOUNDER · SYSTEMS BUILDER**

Alternatives:

- **BUILDING SOFTWARE FOR REAL-WORLD OPERATIONS**
- **FOUNDER / SOFTWARE ENGINEER / RETAILREADY EDI**
- **OPERATIONAL SYSTEMS · EDI · AI WORKFLOWS**

Avoid:

> OWNER OF COBLE SOLUTIONS AND RETAILREADY EDI

Reason: it feels stiff and business-card-like. The new wording is broader and more portfolio-friendly.

### 6.2 Hero headline

Primary:

> **Turning real-world problems into digital solutions.**

### 6.3 Hero subhead

Preferred:

> I build practical software systems for operations-heavy businesses — from retail EDI workflows to the tooling that keeps large codebases understandable.

Alternative:

> I design and build software for messy operational domains: integrations, background jobs, customer-specific rules, data boundaries, and interfaces that make system state visible.

### 6.4 Hero CTAs

Primary CTA:

> **View selected work**

Target: `#retailready`

Secondary CTA:

> **Start a conversation**

Target: `mailto:coble.jesse@gmail.com`

Optional tertiary CTA:

> **Read the technical deep dive**

Target: `/retailready`

Only use a tertiary CTA if the layout still feels clean.

---

## 7. Scroll-Synced Overlay Copy

The video may visually pass from the real world into the digital world, but the overlay copy should stay restrained.

### 7.1 Overlay sequence

| Scroll Range | Video Moment | Overlay Content |
|---|---|---|
| 0–15% | Hands on laptop | Name, role, hero headline |
| 15–30% | Camera approaches screen | Short supporting line |
| 30–45% | Screen begins to dominate | What Jesse builds |
| 45–60% | Passing through the screen | Minimal text or no text |
| 60–75% | Inside digital environment | RetailReady preview |
| 75–88% | Floating systems / nodes | AI Engineering or technical systems preview |
| 88–96% | Wider focal composition | Experience / credibility cue |
| 96–100% | Final hero lockup | Name, title, CTAs |

### 7.2 Exact copy by stage

#### Stage 1 — Opening

Eyebrow:

> SOFTWARE ENGINEER · FOUNDER · SYSTEMS BUILDER

Headline:

> Turning real-world problems into digital solutions.

Subhead:

> Practical software for operational complexity.

#### Stage 2 — Approach

> Built with code. Designed for people.

Optional alternate:

> Real workflows. Digital systems. Clear outcomes.

#### Stage 3 — Screen fills frame

> I build systems for integrations, background workflows, data boundaries, and production visibility.

#### Stage 4 — Threshold

Use little or no text.

Optional microcopy:

> Entering the system.

This line is optional. The visual transition may be stronger without text.

#### Stage 5 — Digital world / RetailReady cue

> RetailReady EDI  
> A platform for retailer document flow, validation, acknowledgments, sandbox testing, and production visibility.

#### Stage 6 — Technical systems cue

> Systems built to explain themselves.  
> Visible state. Reliable boundaries. Failure-aware workflows.

#### Stage 7 — Experience cue

> A decade of EDI, integrations, and operational software.

#### Stage 8 — Final hero state

> Jesse Coble  
> Software Engineer  
> Turning real-world problems into digital solutions.

CTAs:

> View selected work  
> Start a conversation

---

## 8. Practice Section

### 8.1 Purpose

This section should bridge the cinematic hero and the technical proof. It answers:

> What kind of work does Jesse do?

It should be short. This section is not another case study.

### 8.2 Recommended headline

> Software for the parts of the business where things have to move correctly.

Alternatives:

- **Where operations meet software.**
- **Practical systems for messy workflows.**
- **Building software around real operational constraints.**

### 8.3 Recommended body copy

> I work where software meets operational reality: integrations, background jobs, customer data, long-running workflows, retries, audits, and the need to know exactly what happened when something fails.

### 8.4 Signal cards

Use three cards.

#### Operational systems

> Software that supports real workflows, not just clean demos.

#### Integration-heavy platforms

> EDI, APIs, accounting systems, retailer requirements, and external system boundaries.

#### Ship-focused engineering

> Practical architecture, fast iteration, and production-aware decisions.

### 8.5 Notes

Replace the old “Founder-led / Operational / Fast” trio with the above. “Fast” by itself can sound careless. “Ship-focused engineering” keeps the speed idea but adds discipline.

---

## 9. RetailReady Homepage Section

### 9.1 Purpose

RetailReady is the main proof-of-capability. It should be the centerpiece of the homepage.

The homepage version should be a strong preview, not the full system overview.

### 9.2 Section eyebrow

> RETAILREADY EDI

### 9.3 Headline

Preferred:

> A retail EDI platform built around visibility, isolation, and reliable document flow.

Alternatives:

- **Retail EDI with visible state and production-aware architecture.**
- **A real platform for retailer document flow.**
- **Making EDI document state visible, testable, and recoverable.**

### 9.4 Intro copy

> RetailReady is the EDI platform I built for vendors selling into major retailers. It handles document exchange, validation, acknowledgments, sandbox testing, retransmission state, and production visibility across retailers like Walmart, Best Buy, Dollar Tree, Meijer, and Dollar General.

### 9.5 Problem / wedge copy

Use this before the architecture preview.

> EDI can become opaque quickly: documents move through multiple systems, failures hide in logs, and customers often wait on support to understand what happened. RetailReady is built to surface the document state, validator output, retransmission state, and SLA clock in one place. Sandbox lets vendors test against retailer-specific expectations before go-live. Tenant boundaries are enforced at the database layer, and the engine is designed around explicit ownership, timeouts, retries, and takeover behavior instead of invisible background jobs.

### 9.6 Homepage stats

Use four stats only:

| Stat | Label |
|---:|---|
| 5 | active retailers |
| 52 | data entities |
| 40 | RLS-enforced tables |
| ~900 | tests |

Move these to the RetailReady deep dive:

- 60 controllers
- 7 background workers + 2 watchers
- 48 migrations
- full worker/controller/project tables

### 9.7 Homepage engineering highlights

Use three highlights on the homepage.

#### 1. Database-enforced tenant isolation

> Customer boundaries are enforced below application code with Postgres row-level security, reducing the chance that a controller bug becomes a cross-customer data leak.

#### 2. Failure-aware background engine

> Long-running EDI work is split into isolated workers with per-step deadlines, retry behavior, and monitoring that catches both domain failures and host-level outages.

#### 3. Visible document state

> Documents are not treated as invisible background traffic. RetailReady tracks validation, acknowledgments, retransmission state, and SLA timing so users can see where work stands.

### 9.8 Homepage CTA

> View the full system overview →

Target: `/retailready`

Optional secondary CTA:

> Contact about RetailReady →

Target: `mailto:jessecoble@retailreadyedi.com`

Only include the RetailReady-specific email if it does not compete with the main personal contact CTA.

### 9.9 Move out of homepage

Move the following to `/retailready`:

- full X12 / EDIFACT document types table
- customer journey rail
- full tech stack reference grid
- all five detailed design highlights
- controller count
- worker count
- migration count
- runtime topology
- implementation-specific details like advisory lock behavior, `xmin`, `pg_terminate_backend()`, `FORCE ROW LEVEL SECURITY`, and watcher mechanics

These details are good. They are just too dense for the homepage.

---

## 10. AI Engineering Homepage Section

### 10.1 Purpose

This section should show that Jesse does not merely “use AI.” He thinks about AI-assisted development as a system: context, memory, routing, guardrails, review, and failure modes.

The section should feel like a second technical proof, not an AI hype section.

### 10.2 Section eyebrow

> WORKING WITH AI

### 10.3 Headline

Preferred:

> Making AI useful in codebases too large for chat.

Alternatives:

- **Treating AI assistance as an engineering system.**
- **Designing AI workflows for large codebases.**
- **Building context systems for AI-assisted development.**

### 10.4 Intro copy

> Working with a coding model on a large codebase is not just a chat problem. It is a context, memory, routing, and review problem. I built a workflow that orients the model through scoped project files, architecture notes, typed memory, hooks, and specialist sub-agents so context is pulled intentionally instead of dumped into every session.

### 10.5 Homepage stats

Use four stats:

| Stat | Label |
|---:|---|
| 16 | scoped project files |
| 13 | orientation workflows |
| 7 | specialist agents |
| 64 | typed memory files |

Move these to the AI deep dive:

- 28 total skills
- 12 hook scripts
- specific hook behavior
- detailed sub-agent pipeline
- internal script names
- bypass-token details
- exact file structure, unless safe to publish

### 10.6 Key insight callout

> Loaded ≠ attended. Context dumped into a session can still be ignored, evicted, or stale. The system works by pulling focused context on demand instead of pretending every file in the window is equally understood.

### 10.7 Honest framing

Replace:

> I'm no master at this. But the system is opinionated, and the opinions are earned.

With:

> This is not autopilot. It is an engineered workflow built from real failure modes: stale context, attention drift, unsafe edits, and unreviewed assumptions.

Alternative shorter version:

> This is not magic, and I do not treat it like autopilot. It is a practical system of guardrails, memory, review checkpoints, and hard-earned rules for keeping AI useful inside a real codebase.

### 10.8 Homepage CTA

> Read how I work with AI →

Target: `/working-with-ai`

Avoid a Claude-specific CTA unless the page is intentionally about Claude only. “AI” is broader and ages better.

---

## 11. Experience Section

### 11.1 Purpose

This section proves that RetailReady is a continuation of long-running experience, not a random pivot.

The key idea:

> EDI experience since 2014 — RetailReady is a continuation, not a pivot.

### 11.2 Section eyebrow

> EXPERIENCE

### 11.3 Headline

Preferred:

> A decade of EDI, integrations, and operational software.

Alternatives:

- **10+ years building systems where data has to move correctly.**
- **A career built around software for operational workflows.**

### 11.4 Body copy

> I have been building EDI and operations software since 2014 — from reader/writer engines for steamship-line workflows at DepotSystems, to ISO management systems for medical device and aerospace companies at IMSXpress, to RetailReady, a modern retail EDI platform for vendors selling into major retailers.

### 11.5 Timeline

Use a three-row timeline.

```text
2022 — Present    Coble Solutions / RetailReady EDI
                  Founder, Lead Engineer

2018 — 2022       AQA Company / IMSXpress
                  Senior / Sole Developer

2014 — 2018       Edge Networks / DepotSystems
                  Developer → Senior Developer
```

### 11.6 Optional emphasis line

> RetailReady is not a pivot into EDI. It is the result of more than a decade spent building software around document flow, integrations, and operational correctness.

---

## 12. How I Build

This section merges the old **Capabilities** and **Method** sections.

### 12.1 Purpose

After RetailReady, AI Engineering, and Experience, this section summarizes Jesse’s working style.

It should not repeat everything. It should crystallize the pattern.

### 12.2 Section eyebrow

> HOW I BUILD

### 12.3 Headline

Preferred:

> Practical architecture for systems that have to keep working.

Alternatives:

- **I build for visibility, boundaries, and failure modes.**
- **Software that stays understandable when the workflow gets messy.**

### 12.4 Intro copy

> My work tends to sit where product, data, infrastructure, and operations overlap. I care about systems that make state visible, enforce boundaries, and remain maintainable after the first version ships.

### 12.5 Capability cards

Use four cards.

#### Integration architecture

> EDI, APIs, accounting systems, retailer-specific workflows, and external system boundaries.

#### Backend systems

> Data models, background workers, queues, retries, validation, authorization, and operational visibility.

#### Product-minded engineering

> Interfaces that explain system state clearly instead of hiding complexity from users.

#### Production discipline

> Testing, monitoring, failure handling, data isolation, and maintainable architecture.

### 12.6 Method principles

Use a short principles row or pullquote area:

> Make state visible.  
> Enforce boundaries below the app.  
> Design for failure.  
> Keep systems understandable.

### 12.7 Notes

Do not create a separate Method section unless the page feels too short. The combined section will be stronger and less repetitive.

---

## 13. Résumé Section

### 13.1 Purpose

The résumé section should provide a concise professional record without turning the site into a full résumé page.

### 13.2 Recommended headline

> Résumé

Optional headline:

> Professional record

### 13.3 Content

Include:

1. Name
2. Email: `coble.jesse@gmail.com`
3. General location: `Akron, OH`
4. Summary paragraph
5. Professional experience
6. Projects and technical accomplishments
7. Technical summary
8. Education
9. Download button, only if the PDF is current

### 13.4 Privacy

Omit from the rendered web version:

- street address
- phone number

### 13.5 PDF rule

Do not publish an outdated résumé PDF.

The PDF should either be:

1. updated to include the 2022–Present Coble Solutions / RetailReady period, or
2. generated from the current rendered résumé content, or
3. omitted until it is updated

The rendered résumé and downloaded PDF should not contradict each other.

### 13.6 Current résumé entry to add

```text
2022 — Present
Coble Solutions / RetailReady EDI
Founder, Lead Engineer

Built and operate RetailReady, a retail EDI platform for vendors selling into major retailers. Designed the platform architecture, document workflows, validation and acknowledgment handling, tenant isolation model, background engine, customer-facing interface, and operational visibility features.
```

---

## 14. Contact Section

### 14.1 Purpose

The contact section should be simple and direct.

### 14.2 Headline

Preferred:

> Let’s build something practical.

Alternatives:

- **Start a conversation.**
- **Have an operational problem that needs software?**
- **Looking for a software engineer who understands messy systems?**

### 14.3 Body copy

> I’m interested in practical software work: operational systems, integrations, EDI workflows, internal tools, and product engineering where reliability and clarity matter.

### 14.4 Primary CTA

> Email Jesse

Target:

```text
mailto:coble.jesse@gmail.com
```

### 14.5 Optional RetailReady contact line

> RetailReady inquiries: jessecoble@retailreadyedi.com

Keep this visually secondary to the personal contact CTA.

### 14.6 Footer line

> Jesse Coble · Software Engineer · Founder · Systems Builder

---

## 15. Deep-Dive Page: `/retailready`

### 15.1 Purpose

The RetailReady deep dive is the technical receipt for the homepage claims. It can be much more detailed than the homepage, but it should still read like a case study, not raw internal documentation.

### 15.2 Recommended structure

1. **Header**
   - title
   - short summary
   - last updated date
   - back-to-portfolio link

2. **The problem**
   - why EDI is operationally difficult
   - what vendors need to know
   - why visibility matters

3. **What RetailReady is**
   - who it is for
   - what document flows it supports
   - what problems it solves

4. **How it works**
   - document flow overview
   - X12 / EDIFACT table
   - active retailer table
   - sandbox → certification → production flow

5. **Architecture**
   - architecture diagram
   - runtime topology
   - API, engine, database, browser, messaging
   - SignalR
   - RabbitMQ
   - PostgreSQL

6. **Reliability and failure handling**
   - worker model
   - timeouts
   - retries
   - acknowledgment races
   - monitoring
   - host-level failure visibility

7. **Data isolation**
   - RLS model
   - tenant boundary concept
   - why database-level enforcement matters

8. **Customer-facing visibility**
   - validation
   - acknowledgments
   - retransmission state
   - SLA timing
   - reports / notifications

9. **Key design decisions**
   - multi-format support
   - retailer-specific configuration
   - sandbox isolation
   - single-instance engine
   - RLS
   - monitoring
   - timeout discipline
   - outbound retry and concurrency
   - explicit failure states

10. **Tech stack**
    - frontend
    - API
    - engine
    - database
    - messaging
    - protocols
    - infrastructure
    - billing/accounting integrations

11. **What this demonstrates**
    - production awareness
    - architecture judgment
    - operational thinking
    - customer-facing clarity

12. **Footer**
    - back to portfolio
    - contact link

### 15.3 Redactions and safety

Do not publish:

- VPS IP addresses
- internal filesystem paths
- private documentation paths
- private repo links
- internal-only diagrams or filenames
- secrets
- bypass tokens
- operational details that would meaningfully weaken security

It is acceptable to publish:

- high-level architecture
- public hostnames, if already public and intentional
- broad technology choices
- safe implementation concepts
- approximate counts like `~900 tests`

### 15.4 Tone

The page should sound like:

> I built this system carefully, and here is how it works.

It should not sound like:

> Here is a raw internal architecture manual.

---

## 16. Deep-Dive Page: `/working-with-ai`

### 16.1 Purpose

This page explains Jesse’s AI-assisted development workflow as an engineering system.

The page should prove:

- he understands the limits of coding models
- he thinks in systems
- he designs context and review workflows intentionally
- he does not treat AI as autopilot

### 16.2 Recommended structure

1. **Header**
   - title
   - short summary
   - last updated date
   - back-to-portfolio link

2. **The problem**
   - large codebases exceed naive chat workflows
   - context windows do not solve attention
   - stale context and compaction create failure modes

3. **The core insight**
   - Loaded ≠ attended
   - retrieval must be intentional
   - context should be scoped and pulled on demand

4. **The system**
   - diagram
   - prompt → orientation → exploration → memory → briefing → review loop

5. **Layer 1: Scoped project files**
   - what they are
   - why they exist
   - how they limit context drift

6. **Layer 2: Orientation workflows**
   - how the model gets briefed
   - why orientation is forked/on-demand instead of preloaded

7. **Layer 3: Typed memory**
   - feedback memory
   - project memory
   - reference memory
   - why typed names work as an index

8. **Layer 4: Hooks and guardrails**
   - explain conceptually
   - destructive action warnings
   - test-related reminders
   - review checkpoints

9. **Layer 5: Specialist agents**
   - what they are for
   - how scoped agents reduce broad, unfocused work

10. **Design decisions**
    - forked context over auto-injection
    - scoped memory over vector DB
    - cold-start sub-agents
    - human checkpoint for risky actions
    - diagram/test parity as a concept

11. **What still requires human review**
    - architecture judgment
    - safety-critical changes
    - tests
    - deployment
    - user-facing claims

12. **What this demonstrates**
    - systems thinking
    - practical AI adoption
    - review discipline
    - ability to create tooling around complex work

13. **Footer**
    - back to portfolio
    - contact link

### 16.3 Public-safety rule

Explain guardrails and workflows without publishing:

- bypass tokens
- exact guard bypass strings
- sensitive internal script names
- private file paths
- private repo references
- security-sensitive operational details

### 16.4 Recommended page headline

> Making AI useful in codebases too large for chat.

### 16.5 Recommended opening copy

> Working with a coding model on a large codebase is not just a chat problem. It is a context, memory, routing, and review problem. The system I built gives the model scoped ways to orient itself, retrieve relevant memory, call specialist workflows, and return structured briefings — while keeping human review at the center of risky decisions.

---

## 17. Homepage Content Budget

To prevent the homepage from getting too dense, use these limits.

### 17.1 Hero

- 1 eyebrow
- 1 headline
- 1 subhead
- 2 CTAs max

### 17.2 Practice

- 1 headline
- 1 paragraph
- 3 signal cards

### 17.3 RetailReady

- 1 intro paragraph
- 1 problem/wedge paragraph
- 4 stats
- 3 engineering highlights
- 1 CTA

### 17.4 AI Engineering

- 1 intro paragraph
- 4 stats
- 1 pullquote
- 1 honest-framing paragraph
- 1 CTA

### 17.5 Experience

- 1 paragraph
- 3 timeline entries

### 17.6 How I Build

- 1 paragraph
- 4 cards
- 4 principles

### 17.7 Résumé

- compact rendered version
- no outdated PDF

### 17.8 Contact

- 1 paragraph
- 1 primary CTA
- optional secondary RetailReady email

---

## 18. Content to Remove or Relocate From Homepage

Move to deep dives:

- full X12 / EDIFACT table
- full customer journey rail
- full RetailReady tech stack grid
- all detailed RetailReady design highlights
- all AI internals and hook details
- all AI stats
- implementation-specific names that do not help a homepage visitor
- detailed architecture tables
- worker/controller/migration counts

Remove as standalone homepage sections:

- Coble Solutions
- separate Method section if merged into How I Build

Hold until updated:

- outdated résumé PDF

---

## 19. Suggested Main Page Copy, Consolidated

This section collects the homepage copy in one place.

### Hero

**Eyebrow**

> SOFTWARE ENGINEER · FOUNDER · SYSTEMS BUILDER

**Headline**

> Turning real-world problems into digital solutions.

**Subhead**

> I build practical software systems for operations-heavy businesses — from retail EDI workflows to the tooling that keeps large codebases understandable.

**CTAs**

> View selected work  
> Start a conversation

---

### Practice

**Headline**

> Software for the parts of the business where things have to move correctly.

**Body**

> I work where software meets operational reality: integrations, background jobs, customer data, long-running workflows, retries, audits, and the need to know exactly what happened when something fails.

**Cards**

> Operational systems  
> Software that supports real workflows, not just clean demos.

> Integration-heavy platforms  
> EDI, APIs, accounting systems, retailer requirements, and external system boundaries.

> Ship-focused engineering  
> Practical architecture, fast iteration, and production-aware decisions.

---

### RetailReady

**Eyebrow**

> RETAILREADY EDI

**Headline**

> A retail EDI platform built around visibility, isolation, and reliable document flow.

**Intro**

> RetailReady is the EDI platform I built for vendors selling into major retailers. It handles document exchange, validation, acknowledgments, sandbox testing, retransmission state, and production visibility across retailers like Walmart, Best Buy, Dollar Tree, Meijer, and Dollar General.

**Problem / wedge**

> EDI can become opaque quickly: documents move through multiple systems, failures hide in logs, and customers often wait on support to understand what happened. RetailReady is built to surface the document state, validator output, retransmission state, and SLA clock in one place. Sandbox lets vendors test against retailer-specific expectations before go-live. Tenant boundaries are enforced at the database layer, and the engine is designed around explicit ownership, timeouts, retries, and takeover behavior instead of invisible background jobs.

**Stats**

> 5 active retailers  
> 52 data entities  
> 40 RLS-enforced tables  
> ~900 tests

**Highlights**

> Database-enforced tenant isolation  
> Customer boundaries are enforced below application code with Postgres row-level security, reducing the chance that a controller bug becomes a cross-customer data leak.

> Failure-aware background engine  
> Long-running EDI work is split into isolated workers with per-step deadlines, retry behavior, and monitoring that catches both domain failures and host-level outages.

> Visible document state  
> Documents are not treated as invisible background traffic. RetailReady tracks validation, acknowledgments, retransmission state, and SLA timing so users can see where work stands.

**CTA**

> View the full system overview →

---

### AI Engineering

**Eyebrow**

> WORKING WITH AI

**Headline**

> Making AI useful in codebases too large for chat.

**Intro**

> Working with a coding model on a large codebase is not just a chat problem. It is a context, memory, routing, and review problem. I built a workflow that orients the model through scoped project files, architecture notes, typed memory, hooks, and specialist sub-agents so context is pulled intentionally instead of dumped into every session.

**Stats**

> 16 scoped project files  
> 13 orientation workflows  
> 7 specialist agents  
> 64 typed memory files

**Callout**

> Loaded ≠ attended. Context dumped into a session can still be ignored, evicted, or stale. The system works by pulling focused context on demand instead of pretending every file in the window is equally understood.

**Close**

> This is not autopilot. It is an engineered workflow built from real failure modes: stale context, attention drift, unsafe edits, and unreviewed assumptions.

**CTA**

> Read how I work with AI →

---

### Experience

**Eyebrow**

> EXPERIENCE

**Headline**

> A decade of EDI, integrations, and operational software.

**Body**

> I have been building EDI and operations software since 2014 — from reader/writer engines for steamship-line workflows at DepotSystems, to ISO management systems for medical device and aerospace companies at IMSXpress, to RetailReady, a modern retail EDI platform for vendors selling into major retailers.

**Timeline**

```text
2022 — Present    Coble Solutions / RetailReady EDI
                  Founder, Lead Engineer

2018 — 2022       AQA Company / IMSXpress
                  Senior / Sole Developer

2014 — 2018       Edge Networks / DepotSystems
                  Developer → Senior Developer
```

**Emphasis**

> RetailReady is not a pivot into EDI. It is the result of more than a decade spent building software around document flow, integrations, and operational correctness.

---

### How I Build

**Eyebrow**

> HOW I BUILD

**Headline**

> Practical architecture for systems that have to keep working.

**Intro**

> My work tends to sit where product, data, infrastructure, and operations overlap. I care about systems that make state visible, enforce boundaries, and remain maintainable after the first version ships.

**Cards**

> Integration architecture  
> EDI, APIs, accounting systems, retailer-specific workflows, and external system boundaries.

> Backend systems  
> Data models, background workers, queues, retries, validation, authorization, and operational visibility.

> Product-minded engineering  
> Interfaces that explain system state clearly instead of hiding complexity from users.

> Production discipline  
> Testing, monitoring, failure handling, data isolation, and maintainable architecture.

**Principles**

> Make state visible.  
> Enforce boundaries below the app.  
> Design for failure.  
> Keep systems understandable.

---

### Contact

**Headline**

> Let’s build something practical.

**Body**

> I’m interested in practical software work: operational systems, integrations, EDI workflows, internal tools, and product engineering where reliability and clarity matter.

**CTA**

> Email Jesse

**Footer**

> Jesse Coble · Software Engineer · Founder · Systems Builder

---

## 20. Success Criteria

This content spec is successful if the finished site:

- clearly explains what Jesse does within the first screen
- makes RetailReady the strongest proof point
- keeps AI Engineering impressive without sounding like hype
- shows the career through-line from 2014 to RetailReady
- keeps the homepage readable and not documentation-heavy
- gives technical readers deep-dive pages with real substance
- avoids publishing outdated résumé information
- avoids publishing sensitive internal details
- feels confident without overclaiming
