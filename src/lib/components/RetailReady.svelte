<script lang="ts">
  import { spotlight } from "$lib/actions/spotlight";
  import { countup } from "$lib/actions/countup";
</script>

<section id="retailready" class="section retailready">
  <div class="container">
    <div class="section-head">
      <div class="head-eyebrow fade-up"><div class="eyebrow">RETAILREADY EDI</div></div>
      <h2 class="fade-up delay-1">
        A retail EDI platform that <em>owns its own transport.</em>
      </h2>
    </div>

    <p class="rr-intro fade-up delay-2">
      RetailReady is the platform I built for vendors selling into the big retailers —
      Walmart, Best Buy, Dollar Tree, Meijer, and Dollar General. It handles the
      document exchange end-to-end: purchase orders in, acknowledgments out, advance
      ship notices, invoices, functional acks, the whole loop.
    </p>

    <p class="rr-wedge fade-up delay-2">
      The biggest change in the last cycle was getting rid of the third-party AS2
      server we used to run on a separate VPS. Trading partners would POST documents
      to it, the server would write files into per-retailer SFTP folders, and our
      engine would poll those folders every fifteen seconds to pick them up. Two
      systems, a filesystem in the middle, certificates configured in a place the
      application couldn't see. Now there's a single AS2 endpoint built directly into
      the platform. Retailers POST to us, the document lands in Postgres in the same
      request that returns the signed receipt back to them. One process, no SFTP hop,
      no remote machine to babysit. Fewer moving parts, fewer failure modes.
    </p>

    <div class="stat-grid">
      <div class="stat-card cyan fade-up">
        <div class="v" use:countup={{ target: 5 }}>5</div>
        <div class="l">Active retailers</div>
      </div>
      <div class="stat-card cyan fade-up delay-1">
        <div class="v" use:countup={{ target: 14 }}>14</div>
        <div class="l">EDI document types</div>
      </div>
      <div class="stat-card cyan fade-up delay-2">
        <div class="v" use:countup={{ target: 44 }}>44</div>
        <div class="l">Tenant-scoped tables</div>
      </div>
      <div class="stat-card violet fade-up delay-3">
        <div class="v"><small>~</small><span use:countup={{ target: 900 }}>900</span></div>
        <div class="l">Tests · 50s gate</div>
      </div>
    </div>

    <div class="rr-highlights">
      <article class="rr-hl fade-up delay-1" use:spotlight>
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
            <path d="M12 2v6M12 22v-6M2 12h6M22 12h-6" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
        <h3>AS2 endpoint in the platform</h3>
        <p>
          Trading partners send documents directly to our endpoint. The platform
          handles partner lookup, signature verification, decryption, and the signed
          acknowledgment all in one request — no separate AS2 server, no SFTP relay
          between machines, no certificate config living outside the app.
        </p>
      </article>
      <article class="rr-hl fade-up delay-2" use:spotlight>
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
          Customer boundaries are enforced by Postgres itself — not by application
          code. Even if a controller forgot a filter, the database would refuse to
          return another customer's rows. Same protection, regardless of which path
          got there.
        </p>
      </article>
      <article class="rr-hl fade-up delay-3" use:spotlight>
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
        <h3>One engine, by design</h3>
        <p>
          Background work runs in a single coordinator that hands jobs out to workers.
          When a new version deploys, it takes over from the old one cleanly — no two
          engines ever process the same document. Two independent layers of monitoring
          (one inside the app, one outside) catch the failure modes the other can't see.
        </p>
      </article>
      <article class="rr-hl fade-up delay-4" use:spotlight>
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
          Validation results, retransmission state, acknowledgment status, and SLA
          timing all surface in the UI as documents move — pushed live over a
          message bus, not polled. No "check the logs to see what happened."
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
