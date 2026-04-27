<section id="retailready" class="section retailready">
  <div class="container">
    <div class="section-head">
      <div class="head-eyebrow fade-up"><div class="eyebrow">RETAILREADY EDI</div></div>
      <h2 class="fade-up delay-1">
        A retail EDI platform built around <em>visibility, isolation,</em> and reliable document flow.
      </h2>
    </div>

    <p class="rr-intro fade-up delay-2">
      RetailReady is the EDI platform I built for vendors selling into major retailers. It handles
      document exchange, validation, acknowledgments, sandbox testing, retransmission state, and
      production visibility across retailers like Walmart, Best Buy, Dollar Tree, Meijer, and
      Dollar General.
    </p>

    <p class="rr-wedge fade-up delay-2">
      EDI can become opaque quickly: documents move through multiple systems, failures hide in
      logs, and customers often wait on support to understand what happened. RetailReady is built
      to surface the document state, validator output, retransmission state, and SLA clock in one
      place. Sandbox lets vendors test against retailer-specific expectations before go-live.
      Tenant boundaries are enforced at the database layer, and the engine is designed around
      explicit ownership, timeouts, retries, and takeover behavior instead of invisible background
      jobs.
    </p>

    <div class="stat-grid">
      <div class="stat-card cyan fade-up">
        <div class="v">5</div>
        <div class="l">Active retailers</div>
      </div>
      <div class="stat-card cyan fade-up delay-1">
        <div class="v">52</div>
        <div class="l">Data entities</div>
      </div>
      <div class="stat-card cyan fade-up delay-2">
        <div class="v">40</div>
        <div class="l">RLS-enforced tables</div>
      </div>
      <div class="stat-card violet fade-up delay-3">
        <div class="v"><small>~</small>900</div>
        <div class="l">Automated tests</div>
      </div>
    </div>

    <div class="rr-highlights">
      <article class="rr-hl fade-up delay-1">
        <div class="icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
            <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
          </svg>
        </div>
        <h3>Database-enforced tenant isolation</h3>
        <p>
          Customer boundaries are enforced below application code with Postgres row-level security,
          reducing the chance that a controller bug becomes a cross-customer data leak.
        </p>
      </article>
      <article class="rr-hl fade-up delay-2">
        <div class="icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <h3>Failure-aware background engine</h3>
        <p>
          Long-running EDI work is split into isolated workers with per-step deadlines, retry
          behavior, and monitoring that catches both domain failures and host-level outages.
        </p>
      </article>
      <article class="rr-hl fade-up delay-3">
        <div class="icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <h3>Visible document state</h3>
        <p>
          Documents are not treated as invisible background traffic. RetailReady tracks validation,
          acknowledgments, retransmission state, and SLA timing so users can see where work stands.
        </p>
      </article>
    </div>

    <div class="section-cta fade-up">
      <a class="link-cta" href="/retailready">
        View the full system overview
        <span class="arrow">→</span>
      </a>
    </div>
  </div>
</section>
