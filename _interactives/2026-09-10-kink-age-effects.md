---
layout: post
title: "Kink Age Effects"
date: 2026-09-10
permalink: /kink-age-effects/
categories:
---

<link rel="stylesheet" href="{{ '/assets/css/kink-age-effects.css' | relative_url }}">

<div
  class="kink-age-explorer"
  data-kink-age-effects
  data-default-item="romance"
  data-data-url="{{ '/assets/jsons/kink_age_effects.json' | relative_url }}"
>
  <p class="kink-age-intro">
    Select a kink item to see how its age pattern differs across gender groups. Effects are measured in latent-response standard deviations and estimated while controlling for general kinkiness. The shaded ribbons are pointwise 90% credible intervals.
  </p>

  <div class="kink-age-controls">
    <label for="kink-age-item">Kink item</label>
    <div class="kink-age-picker" data-role="item-picker">
      <button
        id="kink-age-item"
        class="kink-age-picker-button"
        data-role="item-button"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-controls="kink-age-item-menu"
        disabled
      >
        <span data-role="item-button-label">Loading items…</span>
        <span class="kink-age-picker-caret" aria-hidden="true">&#9662;</span>
      </button>
      <div
        id="kink-age-item-menu"
        class="kink-age-picker-menu"
        data-role="item-menu"
        role="listbox"
        aria-label="Kink item"
        hidden
      ></div>
    </div>
  </div>

  <section class="kink-age-chart-card" aria-labelledby="kink-age-chart-title">
    <div class="kink-age-chart-heading">
      <div>
        <h2 id="kink-age-chart-title" data-role="chart-title">Loading age effects…</h2>
        <p>Item effect, controlling for general kinkiness</p>
      </div>
      <div class="kink-age-legend" data-role="legend" aria-label="Gender groups"></div>
    </div>

    <div class="kink-age-plot" data-role="plot"></div>
    <p class="kink-age-status" data-role="status" aria-live="polite">Loading age-effect estimates…</p>
    <p class="kink-age-footnote">
      Hover over, tap, or use the arrow keys on the chart to inspect exact values. Ages are shown only when more than 30 respondents in that group answered the item within a centered five-year window.
    </p>
    <p class="sr-only" data-role="hover-readout" aria-live="polite"></p>
  </section>

  <section class="kink-age-chart-card kink-contrast-card" aria-labelledby="kink-contrast-title">
    <div class="kink-age-chart-heading">
      <div>
        <h2 id="kink-contrast-title">Gender-group contrasts across kink items</h2>
        <p>Each point represents one kink item; uncertainty is not shown.</p>
      </div>
    </div>

    <div class="kink-contrast-item-control">
      <label for="kink-contrast-item">Highlight a kink item</label>
      <div class="kink-age-picker" data-role="contrast-item-picker">
        <button
          id="kink-contrast-item"
          class="kink-age-picker-button"
          data-role="contrast-item-button"
          type="button"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-controls="kink-contrast-item-menu"
          disabled
        >
          <span data-role="contrast-item-button-label">Loading items…</span>
          <span class="kink-age-picker-caret" aria-hidden="true">&#9662;</span>
        </button>
        <div
          id="kink-contrast-item-menu"
          class="kink-age-picker-menu"
          data-role="contrast-item-menu"
          role="listbox"
          aria-label="Kink item to highlight"
          hidden
        ></div>
      </div>
    </div>

    <div class="kink-contrast-views" data-role="contrast-views" role="group" aria-label="Choose contrasts to compare">
      <button type="button" data-view="assigned-cis" aria-pressed="true">Assigned sex × cis/trans</button>
      <button type="button" data-view="assigned-gender" aria-pressed="false">Assigned sex × gender identity</button>
      <button type="button" data-view="cis-gender" aria-pressed="false">Cis/trans × gender identity</button>
    </div>

    <details class="kink-contrast-method">
      <summary>How are these contrasts calculated?</summary>
      <ul>
        <li><strong>Assigned sex:</strong> the average for cis men and trans women minus the average for cis women and trans men.</li>
        <li><strong>Cis vs. trans:</strong> the average for cis respondents minus the average for trans respondents.</li>
        <li><strong>Gender identity:</strong> the average for men minus the average for women.</li>
      </ul>
      <p>The values are latent-response standard deviations calculated from posterior-mean item-specific group effects. Uncertainty is not displayed.</p>
    </details>

    <div class="kink-contrast-plot" data-role="contrast-plot"></div>
    <p class="kink-age-status" data-role="contrast-status" aria-live="polite">Loading contrast estimates…</p>
    <p class="kink-age-footnote">
      The axes use the same symmetric scale in all three views. Hover over another point to inspect it, or tap one to select it.
    </p>
    <p class="sr-only" data-role="contrast-readout" aria-live="polite"></p>
  </section>
</div>

<script src="{{ '/assets/js/kink-age-effects.js' | relative_url }}"></script>
