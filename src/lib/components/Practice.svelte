<script lang="ts">
  import { spotlight } from "$lib/actions/spotlight";
</script>

<section class="section practice">
  <div class="container">
    <div class="section-head">
      <div class="head-eyebrow fade-up"><div class="eyebrow">PRACTICE</div></div>
      <h2 class="fade-up delay-1">
        Software for the parts of a business where things <em>have to move correctly.</em>
      </h2>
    </div>
    <p class="practice-body fade-up delay-2">
      I work in the part of a codebase that takes input from somewhere it doesn't
      control, hands it off to a process that has to finish, and tells someone in
      the UI what happened. The boring middle of software — where most of the bugs
      people actually notice live.
    </p>
    <div class="signal-grid">
      <article class="signal-card fade-up delay-1" use:spotlight>
        <div class="num">01</div>
        <h3>Workflow software</h3>
        <p>
          The systems that run in the background and people only notice when they
          break — schedulers, integrations, processes that have to finish.
        </p>
      </article>
      <article class="signal-card fade-up delay-2" use:spotlight>
        <div class="num">02</div>
        <h3>Integration-heavy platforms</h3>
        <p>
          EDI, APIs, accounting systems, partner-specific requirements. The wiring
          between systems that don't agree on anything by default.
        </p>
      </article>
      <article class="signal-card fade-up delay-3" use:spotlight>
        <div class="num">03</div>
        <h3>Ship-focused engineering</h3>
        <p>
          Architecture that survives the second iteration. Decisions made with
          production in mind from the first commit.
        </p>
      </article>
    </div>
  </div>
</section>
