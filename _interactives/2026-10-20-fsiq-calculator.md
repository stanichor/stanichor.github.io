---
layout: post
title: "Open Psychometrics FSIQ Calculator"
date: 2026-10-20
permalink: /fsiq-calculator/
categories:
---

Open Psychometrics has a [Full Scale IQ Test](https://openpsychometrics.org/tests/FSIQ/) you can take. Unfortunately, the Full Scale IQ score it calculates from the subscales is a bit wonky (e.g., you can score above average on every subscale yet get a below-average FSIQ). Fortunately, there's been a [real™ study](https://doi.org/10.31234/osf.io/7csvm) in which participants took both the Open Psychometrics test and a real IQ test (WASI-II), and the data are openly available, so we can use the Open Psychometrics scores to obtain hopefully better estimates of our IQs.

(The calculator doesn't use your Full-Scale IQ for its predictions, but I'm making you enter it anyways, because it's fun to make people follow arbitrary and petty rules.)

<link rel="stylesheet" href="{{ '/assets/css/fsiq-calculator.css' | relative_url }}">

<div class="fsiq-calculator" data-fsiq-calculator>
  <form class="fsiq-form" data-role="form">
    <div class="fsiq-fields">
      <label class="fsiq-field fsiq-field-overall" for="fsiq-overall">
        <span>Full Scale IQ</span>
        <input id="fsiq-overall" name="overall" type="number" min="50" max="150" step="1" inputmode="numeric" required>
      </label>
      <label class="fsiq-field fsiq-field-memory" for="fsiq-memory">
        <span>Memory IQ</span>
        <input id="fsiq-memory" name="memory" type="number" min="50" max="150" step="1" inputmode="numeric" required>
      </label>
      <label class="fsiq-field fsiq-field-verbal" for="fsiq-verbal">
        <span>Verbal IQ</span>
        <input id="fsiq-verbal" name="verbal" type="number" min="50" max="150" step="1" inputmode="numeric" required>
      </label>
      <label class="fsiq-field fsiq-field-spatial" for="fsiq-spatial">
        <span>Spatial IQ</span>
        <input id="fsiq-spatial" name="spatial" type="number" min="50" max="150" step="1" inputmode="numeric" required>
      </label>
    </div>
    <button type="submit">Calculate</button>
  </form>

  <div class="fsiq-result" data-role="result" aria-live="polite" hidden>
    <p class="fsiq-result-label">Estimated WASI-II Full Scale IQ</p>
    <p class="fsiq-result-value" data-role="estimate"></p>
    <p class="fsiq-result-note">Estimate (90% prediction interval)</p>
    <p class="fsiq-range-note" data-role="range-note" hidden></p>
  </div>

</div>

<script src="{{ '/assets/js/fsiq-calculator.js' | relative_url }}"></script>
