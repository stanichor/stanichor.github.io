---
layout: post
title: "LiveBench Mostly Measures One General Ability"
date: 2026-10-03
permalink: /livebench-factors/
categories: 
section: other
related:
  - /benchmark-dif/
  - /benchmark-flags/
  - /factor-analyses/
---

[LiveBench](https://livebench.ai/#/) is an LLM benchmark with tasks grouped into categories. I'll analyze its April 7, 2025 public release, which included 18 tasks across six categories. Item-level data were available for seven tasks across three categories: Coding (LCB Generation and Coding Completion), Language (Connections, Plot Unscrambling, and Typos), and Instruction Following (Paraphrase and Story Generation). Unfortunately, I can't analyze the other tasks because LiveBench didn't release their item-level data, which is essential for this kind of analysis.

Here's what each task involves:

<style>
  .display-note {
    margin: 0.35rem 0 0.9rem !important;
    color: #667085;
    font-size: 0.82em;
    line-height: 1.45;
  }
  .task-description { margin: 0 !important; border-top: 1px solid #d0d7de; }
  .task-description:last-of-type {
    border-bottom: 1px solid #d0d7de;
    margin-bottom: 1.5rem !important;
  }
  .task-description summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 0.25rem;
    cursor: pointer;
    list-style: none;
  }
  .task-description summary::-webkit-details-marker { display: none; }
  .task-description summary h3 { margin: 0 !important; font-size: 1.25em; }
  .task-description summary::after {
    content: "+";
    margin-left: 1rem;
    color: #57606a;
    font-size: 1.35rem;
    font-weight: 400;
    line-height: 1;
  }
  .task-description[open] summary::after { content: "-"; }
  .task-description > :not(summary) { margin-right: 1rem; margin-left: 1rem; }
  .task-description > :last-child { margin-bottom: 1.5rem; }
</style>

<details class="task-description" markdown="1">
<summary><h3 id="lcb-generation">LCB Generation (Category: Coding)</h3></summary>

The model receives a programming problem (typically from LiveCodeBench) and must write a complete solution which is then run against test cases. The model receives a score of `1` if it passes and `0` if it fails; there is no partial credit.

</details>

<details class="task-description" markdown="1">
<summary><h3 id="coding-completion">Coding Completion (Category: Coding)</h3></summary>

The model receives a programming problem and a fragment of a correct solution, which it must complete. Scoring is the same as for LCB Generation.

</details>

<details class="task-description" markdown="1">
<summary><h3 id="connections">Connections (Category: Language)</h3></summary>

The Connections task works much like the NYT game of the same name. The model receives a shuffled list of words and must sort them into groups of four, with each group sharing a theme. For example:

- `bass, cod, salmon, trout` → fish
- `apple, banana, pear, peach` → fruit

LiveBench uses 8 words (2 groups), 12 words (3 groups), or 16 words (4 groups). The score is the fraction of complete groups identified correctly.

</details>

<details class="task-description" markdown="1">
<summary><h3 id="plot-unscrambling">Plot Unscrambling (Category: Language)</h3></summary>

The model receives the sentences of a recent movie synopsis in random order and must reconstruct the original narrative. The evaluator fuzzy-matches the response to the original sentences, allowing minor transcription changes, then measures the edit distance between the proposed and correct orders:

$$
\text{score} = 1 - \frac{d}{n}
$$

where $d$ is the ordering distance and $n$ is the number of sentences.

</details>

<details class="task-description" markdown="1">
<summary><h3 id="typos">Typos (Category: Language)</h3></summary>

The model receives text (usually based on a recent arXiv abstract) with synthetic spelling errors inserted. It must correct the misspellings while leaving everything else unchanged. That means it shouldn't rewrite the text, change punctuation, change US spelling to UK spelling or vice versa, or add stylistic "improvements". The scorer gives `1` if the ground-truth text appears anywhere in the output and `0` otherwise. Thus, despite the instruction, extra surrounding text does not necessarily cause a failure.

</details>

<details class="task-description" markdown="1">
<summary><h3 id="paraphrase">Paraphrase (Category: Instruction Following)</h3></summary>

The model receives the beginning of a recent Guardian article and is asked to paraphrase it while following several mechanically verifiable instructions. For example:

> Paraphrase this article.
> Include a title. Use the words "course," "media," and "sun." Write exactly three paragraphs. Begin the first paragraph with "hand."

LiveBench scores compliance with the explicit instructions, not the quality of the paraphrase. In fact, it doesn't care about the actual paraphrase at all; models can receive full credit without ever attempting to paraphrase the article. It averages two components:

- Prompt-level accuracy: `1` only if every instruction was followed; otherwise `0`.
- Instruction-level accuracy: the fraction of individual instructions followed.

</details>

<details class="task-description" markdown="1">
<summary><h3 id="story-generation">Story Generation (Category: Instruction Following)</h3></summary>

The model receives a recent news article and is asked to generate a story based on it while following mechanically verifiable instructions. LiveBench uses the same two-component scoring method as Paraphrase.

</details>

The seven tasks report different kinds of item scores. Here is how LiveBench's published scores relate to the responses I use in this analysis:

| Task | LiveBench's published item score | Response used in this analysis |
|---|---|---|
| LCB Generation | Pass/fail: 0 or 1 | Binary, unchanged |
| Coding Completion | Pass/fail: 0 or 1 | Binary, unchanged |
| Connections | Fraction of complete four-word groups identified correctly; an item has two, three, or four groups | Ordered partial credit, unchanged |
| Typos | Exact-match pass/fail: 0 or 1 | Binary, unchanged |
| Plot Unscrambling | One minus ordering edit distance divided by the number of sentences; bounded between 0 and 1 | Count-adjusted logit of the score, treated as continuous |
| Paraphrase | Average of all-instructions-correct accuracy and the fraction of individual instructions followed | Instruction-level fraction only, modeled as ordered partial credit |
| Story Generation | Same two-component score as Paraphrase | Instruction-level fraction only, modeled as ordered partial credit |


I don't like how Paraphrase and Story Generation are currently graded. Their published scores average instruction-level accuracy with an all-or-nothing prompt-level component, so missing just one instruction costs more than half the grade. I therefore use instruction-level accuracy alone.

For Plot Unscrambling, I logit-transform the score using this count-adjusted formula:

$$
\text{transformed score} = \log\left(\frac{n - D + \frac{1}{2}}{D + \frac{1}{2}}\right)
$$

where $D$ is the edit distance and $n$ is the number of sentences.

## Determining the Number of Factors

Naturally, I used parallel analysis to determine the number of factors. It yielded 19, which is a lot (see the [plot](#classical-parallel-analysis)).

However, some item pairs have no models in common, and others have only a few, making their correlations unavailable or imprecise. So I modeled the correlation matrix Bayesianly and repeated parallel analysis across posterior draws to see how much the recommended factor count varies. Each of the first 12 factors exceeds the chance threshold in at least 95% of posterior draws, and the 90% interval for the number retained is 12–13.

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/livebench-factor-analysis/bayesian_mixed_correlation_parallel_analysis.png" width="1000">
    </figure>
</div>

Even 12–13 factors is a lot for seven tasks. I would have expected something closer to seven, so let's look at the tasks individually to see where the extra dimensions might be coming from.

<p class="display-note">Select a task to see its Bayesian parallel analysis. The badge counts leading factors above the chance threshold in at least 95% of posterior draws.</p>

<style>
  .task-parallel-analysis { margin: 0 !important; border-top: 1px solid #d0d7de; }
  .task-parallel-analysis:last-of-type {
    border-bottom: 1px solid #d0d7de;
    margin-bottom: 1.5rem !important;
  }
  .task-parallel-analysis summary {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.25rem;
    cursor: pointer;
    list-style: none;
  }
  .task-parallel-analysis summary::-webkit-details-marker { display: none; }
  .task-parallel-analysis summary .task-name { font-weight: 600; }
  .task-parallel-analysis summary .factor-count {
    padding: 0.1rem 0.55rem;
    border-radius: 1rem;
    background: #eef2f6;
    color: #465568;
    font-size: 0.78em;
    white-space: nowrap;
  }
  .task-parallel-analysis summary::after {
    content: "+";
    margin-left: auto;
    color: #57606a;
    font-size: 1.35rem;
    line-height: 1;
  }
  .task-parallel-analysis[open] summary::after { content: "−"; }
  .task-parallel-analysis figure { margin: 0.25rem 0.25rem 1.25rem; }
  .task-parallel-analysis img { display: block; width: 100%; height: auto; }
</style>

<details class="task-parallel-analysis" name="task-parallel-analysis">
<summary><span class="task-name">LCB Generation</span><span class="factor-count">2 factors</span></summary>
<figure><img src="/assets/images/livebench-factor-analysis/task-parallel-analysis/LCB_generation/bayesian_mixed_correlation_parallel_analysis.png" alt="Bayesian parallel analysis for LCB Generation" loading="lazy"></figure>
</details>

<details class="task-parallel-analysis" name="task-parallel-analysis">
<summary><span class="task-name">Coding Completion</span><span class="factor-count">2 factors</span></summary>
<figure><img src="/assets/images/livebench-factor-analysis/task-parallel-analysis/coding_completion/bayesian_mixed_correlation_parallel_analysis.png" alt="Bayesian parallel analysis for Coding Completion" loading="lazy"></figure>
</details>

<details class="task-parallel-analysis" name="task-parallel-analysis">
<summary><span class="task-name">Connections</span><span class="factor-count">3 factors</span></summary>
<figure><img src="/assets/images/livebench-factor-analysis/task-parallel-analysis/connections/bayesian_mixed_correlation_parallel_analysis.png" alt="Bayesian parallel analysis for Connections" loading="lazy"></figure>
</details>

<details class="task-parallel-analysis" name="task-parallel-analysis">
<summary><span class="task-name">Plot Unscrambling</span><span class="factor-count">2 factors</span></summary>
<figure><img src="/assets/images/livebench-factor-analysis/task-parallel-analysis/plot_unscrambling/bayesian_mixed_correlation_parallel_analysis.png" alt="Bayesian parallel analysis for Plot Unscrambling" loading="lazy"></figure>
</details>

<details class="task-parallel-analysis" name="task-parallel-analysis">
<summary><span class="task-name">Typos</span><span class="factor-count">7 factors</span></summary>
<figure><img src="/assets/images/livebench-factor-analysis/task-parallel-analysis/typos/bayesian_mixed_correlation_parallel_analysis.png" alt="Bayesian parallel analysis for Typos" loading="lazy"></figure>
</details>

<details class="task-parallel-analysis" name="task-parallel-analysis">
<summary><span class="task-name">Paraphrase</span><span class="factor-count">2 factors</span></summary>
<figure><img src="/assets/images/livebench-factor-analysis/task-parallel-analysis/paraphrase/bayesian_mixed_correlation_parallel_analysis.png" alt="Bayesian parallel analysis for Paraphrase" loading="lazy"></figure>
</details>

<details class="task-parallel-analysis" name="task-parallel-analysis">
<summary><span class="task-name">Story Generation</span><span class="factor-count">2 factors</span></summary>
<figure><img src="/assets/images/livebench-factor-analysis/task-parallel-analysis/story_generation/bayesian_mixed_correlation_parallel_analysis.png" alt="Bayesian parallel analysis for Story Generation" loading="lazy"></figure>
</details>

Although the Bayesian parallel analyses support more than one factor for every task, the first dimension dominates in six of them. The ratio of the first two (posterior-median) eigenvalues ranges from 3.1 to 10.6 for those tasks, compared with just 1.5 for Typos. The within-task item-correlation matrices offer another way to see this:

<p class="display-note">Items are ordered by median task-factor loading. Grey means unavailable, not zero. Scroll to compare tasks; select a matrix for full size.</p>

<style>
  .task-matrix-gallery {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
    padding: 0.25rem 0.25rem 1rem;
    margin: 0.75rem 0 1.5rem;
  }
  .task-matrix-gallery .task-matrix-card {
    flex: 0 0 min(78vw, 24rem);
    scroll-snap-align: start;
    margin: 0 !important;
    border: 1px solid #d0d7de;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #fff;
  }
  .task-matrix-card a { display: block; }
  .task-matrix-card img { display: block; width: 100%; height: auto; }
  .task-matrix-card figcaption {
    padding: 0.6rem 0.8rem;
    border-top: 1px solid #d0d7de;
    font-weight: 600;
  }
</style>

<div class="task-matrix-gallery" role="region" aria-label="Task item-correlation matrices; scroll horizontally" tabindex="0">
  <figure class="task-matrix-card">
    <a href="/assets/images/livebench-factor-analysis/task-correlation-matrices/typos/item_correlation_matrix.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/task-correlation-matrices/typos/item_correlation_matrix.png" alt="Typos item-correlation matrix, ordered by task loading" loading="lazy"></a>
    <figcaption>Typos</figcaption>
  </figure>
  <figure class="task-matrix-card">
    <a href="/assets/images/livebench-factor-analysis/task-correlation-matrices/LCB_generation/item_correlation_matrix.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/task-correlation-matrices/LCB_generation/item_correlation_matrix.png" alt="LCB Generation item-correlation matrix, ordered by task loading" loading="lazy"></a>
    <figcaption>LCB Generation</figcaption>
  </figure>
  <figure class="task-matrix-card">
    <a href="/assets/images/livebench-factor-analysis/task-correlation-matrices/coding_completion/item_correlation_matrix.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/task-correlation-matrices/coding_completion/item_correlation_matrix.png" alt="Coding Completion item-correlation matrix, ordered by task loading" loading="lazy"></a>
    <figcaption>Coding Completion</figcaption>
  </figure>
  <figure class="task-matrix-card">
    <a href="/assets/images/livebench-factor-analysis/task-correlation-matrices/connections/item_correlation_matrix.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/task-correlation-matrices/connections/item_correlation_matrix.png" alt="Connections item-correlation matrix, ordered by task loading" loading="lazy"></a>
    <figcaption>Connections</figcaption>
  </figure>
  <figure class="task-matrix-card">
    <a href="/assets/images/livebench-factor-analysis/task-correlation-matrices/plot_unscrambling/item_correlation_matrix.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/task-correlation-matrices/plot_unscrambling/item_correlation_matrix.png" alt="Plot Unscrambling item-correlation matrix, ordered by task loading" loading="lazy"></a>
    <figcaption>Plot Unscrambling</figcaption>
  </figure>
  <figure class="task-matrix-card">
    <a href="/assets/images/livebench-factor-analysis/task-correlation-matrices/paraphrase/item_correlation_matrix.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/task-correlation-matrices/paraphrase/item_correlation_matrix.png" alt="Paraphrase item-correlation matrix, ordered by task loading" loading="lazy"></a>
    <figcaption>Paraphrase</figcaption>
  </figure>
  <figure class="task-matrix-card">
    <a href="/assets/images/livebench-factor-analysis/task-correlation-matrices/story_generation/item_correlation_matrix.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/task-correlation-matrices/story_generation/item_correlation_matrix.png" alt="Story Generation item-correlation matrix, ordered by task loading" loading="lazy"></a>
    <figcaption>Story Generation</figcaption>
  </figure>
</div>

Most of the matrices suggest a clear positive manifold. Typos is the exception: it still looks quite ugly after the items are sorted by loading. That makes me want to check whether the Typos items themselves are sound. Auditing every item would take too long, but CTT/IRT measures can flag suspicious ones for us to focus on...

## Item Flags

In [my post about flagging suspicious questions in AI benchmarks](/benchmark-flags/), I discussed flags based on item discrimination and distractor behavior. None of the items here is multiple choice, so there are no distractors to examine. That leaves item discrimination, which I measure using the corrected item–task score correlation: the correlation between an item and its task score calculated *without* that item.

<p class="display-note">Red: below 0 · Yellow: 0–0.2 · Green: above 0.2 · Grey: undefined. Choose a task, then select its histogram for full size.</p>

<style>
  .item-flag-viewer { margin: 0.75rem 0 1.25rem; }
  .item-flag-viewer input[type="radio"] {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
  .item-flag-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.65rem;
  }
  .item-flag-options label {
    padding: 0.3rem 0.65rem;
    border: 1px solid #d0d7de;
    border-radius: 1rem;
    cursor: pointer;
    font-size: 0.85em;
    line-height: 1.2;
  }
  .item-flag-viewer input[type="radio"]:focus-visible ~ .item-flag-options {
    outline: 2px solid #2563eb;
    outline-offset: 3px;
  }
  #item-flag-typos:checked ~ .item-flag-options label[for="item-flag-typos"],
  #item-flag-lcb:checked ~ .item-flag-options label[for="item-flag-lcb"],
  #item-flag-coding:checked ~ .item-flag-options label[for="item-flag-coding"],
  #item-flag-connections:checked ~ .item-flag-options label[for="item-flag-connections"],
  #item-flag-plot:checked ~ .item-flag-options label[for="item-flag-plot"],
  #item-flag-paraphrase:checked ~ .item-flag-options label[for="item-flag-paraphrase"],
  #item-flag-story:checked ~ .item-flag-options label[for="item-flag-story"] {
    background: #28384d;
    border-color: #28384d;
    color: #fff;
  }
  .item-flag-panels figure {
    display: none;
    margin: 0 !important;
    border: 1px solid #d0d7de;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #fff;
  }
  #item-flag-typos:checked ~ .item-flag-panels #item-flag-panel-typos,
  #item-flag-lcb:checked ~ .item-flag-panels #item-flag-panel-lcb,
  #item-flag-coding:checked ~ .item-flag-panels #item-flag-panel-coding,
  #item-flag-connections:checked ~ .item-flag-panels #item-flag-panel-connections,
  #item-flag-plot:checked ~ .item-flag-panels #item-flag-panel-plot,
  #item-flag-paraphrase:checked ~ .item-flag-panels #item-flag-panel-paraphrase,
  #item-flag-story:checked ~ .item-flag-panels #item-flag-panel-story {
    display: block;
  }
  .item-flag-panels a { display: block; }
  .item-flag-panels img { display: block; width: 100%; max-height: 26rem; object-fit: contain; }
  .item-flag-table { overflow-x: auto; margin: 0.75rem 0 1.5rem; }
  .item-flag-table table { width: 100%; border-collapse: collapse; font-size: 0.85em; }
  .item-flag-table th, .item-flag-table td {
    padding: 0.3rem 0.5rem;
    border: 1px solid #d0d7de;
    white-space: nowrap;
  }
  .item-flag-table td { text-align: right; }
  .item-flag-table tbody th { text-align: left; font-weight: 500; }
  .item-flag-table .item-flag-total { font-weight: 700; background: #f6f8fa; }
  .item-flag-table .flag-dot {
    display: inline-block;
    width: 0.7em;
    height: 0.7em;
    margin-right: 0.3em;
    border-radius: 50%;
  }
  .item-flag-table .flag-red { background: #e52421; }
  .item-flag-table .flag-yellow { background: #f0b900; }
  .item-flag-table .flag-green { background: #16a34a; }
  .item-flag-table .flag-grey { background: #94a3b8; }
</style>

<div class="item-flag-viewer" role="group" aria-label="Item correlation histograms by task">
  <input type="radio" name="item-flag-task" id="item-flag-typos" checked>
  <input type="radio" name="item-flag-task" id="item-flag-lcb">
  <input type="radio" name="item-flag-task" id="item-flag-coding">
  <input type="radio" name="item-flag-task" id="item-flag-connections">
  <input type="radio" name="item-flag-task" id="item-flag-plot">
  <input type="radio" name="item-flag-task" id="item-flag-paraphrase">
  <input type="radio" name="item-flag-task" id="item-flag-story">
  <div class="item-flag-options">
    <label for="item-flag-typos">Typos</label>
    <label for="item-flag-lcb">LCB Generation</label>
    <label for="item-flag-coding">Coding Completion</label>
    <label for="item-flag-connections">Connections</label>
    <label for="item-flag-plot">Plot Unscrambling</label>
    <label for="item-flag-paraphrase">Paraphrase</label>
    <label for="item-flag-story">Story Generation</label>
  </div>
  <div class="item-flag-panels">
    <figure id="item-flag-panel-typos"><a href="/assets/images/livebench-factor-analysis/item-task-correlations/typos.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-task-correlations/typos.png" alt="Histogram of corrected item–task correlations for Typos" loading="lazy"></a></figure>
    <figure id="item-flag-panel-lcb"><a href="/assets/images/livebench-factor-analysis/item-task-correlations/LCB_generation.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-task-correlations/LCB_generation.png" alt="Histogram of corrected item–task correlations for LCB Generation" loading="lazy"></a></figure>
    <figure id="item-flag-panel-coding"><a href="/assets/images/livebench-factor-analysis/item-task-correlations/coding_completion.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-task-correlations/coding_completion.png" alt="Histogram of corrected item–task correlations for Coding Completion" loading="lazy"></a></figure>
    <figure id="item-flag-panel-connections"><a href="/assets/images/livebench-factor-analysis/item-task-correlations/connections.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-task-correlations/connections.png" alt="Histogram of corrected item–task correlations for Connections" loading="lazy"></a></figure>
    <figure id="item-flag-panel-plot"><a href="/assets/images/livebench-factor-analysis/item-task-correlations/plot_unscrambling.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-task-correlations/plot_unscrambling.png" alt="Histogram of corrected item–task correlations for Plot Unscrambling" loading="lazy"></a></figure>
    <figure id="item-flag-panel-paraphrase"><a href="/assets/images/livebench-factor-analysis/item-task-correlations/paraphrase.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-task-correlations/paraphrase.png" alt="Histogram of corrected item–task correlations for Paraphrase" loading="lazy"></a></figure>
    <figure id="item-flag-panel-story"><a href="/assets/images/livebench-factor-analysis/item-task-correlations/story_generation.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-task-correlations/story_generation.png" alt="Histogram of corrected item–task correlations for Story Generation" loading="lazy"></a></figure>
  </div>
</div>

<p class="display-note">All 494 items are counted. Percentages use each task's total, including undefined correlations, and are rounded to whole numbers; rows may not sum to 100%.</p>

<div class="item-flag-table" role="region" aria-label="Item correlation flag counts by task" tabindex="0">
  <table>
    <thead><tr><th scope="col">Task</th><th scope="col">Items</th><th scope="col"><span class="flag-dot flag-red"></span>Red (&lt; 0)</th><th scope="col"><span class="flag-dot flag-yellow"></span>Yellow (0–0.2)</th><th scope="col"><span class="flag-dot flag-green"></span>Green (&gt; 0.2)</th><th scope="col"><span class="flag-dot flag-grey"></span>Undefined</th></tr></thead>
    <tbody>
      <tr><th scope="row">Typos</th><td>100</td><td>3 (3%)</td><td>15 (15%)</td><td>80 (80%)</td><td>2 (2%)</td></tr>
      <tr><th scope="row">LCB Generation</th><td>78</td><td>0 (0%)</td><td>1 (1%)</td><td>72 (92%)</td><td>5 (6%)</td></tr>
      <tr><th scope="row">Coding Completion</th><td>50</td><td>0 (0%)</td><td>2 (4%)</td><td>48 (96%)</td><td>0 (0%)</td></tr>
      <tr><th scope="row">Connections</th><td>100</td><td>0 (0%)</td><td>2 (2%)</td><td>98 (98%)</td><td>0 (0%)</td></tr>
      <tr><th scope="row">Plot Unscrambling</th><td>90</td><td>0 (0%)</td><td>0 (0%)</td><td>90 (100%)</td><td>0 (0%)</td></tr>
      <tr><th scope="row">Paraphrase</th><td>50</td><td>0 (0%)</td><td>3 (6%)</td><td>47 (94%)</td><td>0 (0%)</td></tr>
      <tr><th scope="row">Story Generation</th><td>26</td><td>1 (4%)</td><td>3 (12%)</td><td>22 (85%)</td><td>0 (0%)</td></tr>
      <tr class="item-flag-total"><th scope="row">All tasks</th><td>494</td><td>4 (1%)</td><td>26 (5%)</td><td>457 (93%)</td><td>7 (1%)</td></tr>
    </tbody>
  </table>
</div>

The flags uncovered two Typos items with valid alternative answers, three LCB Generation items with grading problems, and three Story Generation items with prompt or checker problems. The [item-by-item audit](#flagged-item-audit) gives the archived-answer counts and rescoring checks. I could inspect only a subset of items and models, so other problems may remain.

## Factor Structure

Time to look at the factor structure. I'll exclude the items I found problems with: `832610e9` and `0becbf34` from Typos; "Wrong Answer," "Takahashi Quest," and "Bad Juice" from LCB Generation; and `0d828b10`, `6c5eb0ac`, and `230fffb5` from Story Generation. Other problematic items may remain because I couldn't inspect them. As noted above, every task except Typos is strongly unidimensional. A separate factor analysis of Typos produced factors that were hard to interpret, so for simplicity I'll model each task, including Typos, with a single factor.

<figure>
  <img src="/assets/images/livebench-factor-analysis/correlated_tasks_factor_structure.svg" alt="Seven task factors each load onto their own item responses, and a heptagram-like network connects every pair of task factors with one of 21 freely estimated correlations." loading="lazy">
</figure>

The item loadings in the correlated-task model look like this:

<figure>
  <a href="/assets/images/livebench-factor-analysis/correlated_tasks_item_loadings.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/correlated_tasks_item_loadings.png" alt="Item loading distributions by task in the correlated-task model; points show posterior medians and vertical bars show 90% intervals, with zero-crossing intervals distinguished from positive intervals." loading="lazy"></a>
</figure>

Fourteen items have 90% loading intervals that include zero. That doesn't mean they're flawed, but it does make them worth a closer look. I've put my notes in a collapsible section so they don't interrupt the main discussion.

<style>
  .loading-audit { margin: 1rem 0 1.5rem; border-top: 1px solid #d0d7de; border-bottom: 1px solid #d0d7de; }
  .loading-audit summary { display: flex; align-items: center; padding: 0.65rem 0.25rem; cursor: pointer; list-style: none; font-weight: 600; }
  .loading-audit summary::-webkit-details-marker { display: none; }
  .loading-audit summary::after { content: "+"; margin-left: auto; color: #57606a; font-size: 1.25rem; font-weight: 400; line-height: 1; }
  .loading-audit[open] summary::after { content: "−"; }
  .loading-audit > :not(summary) { margin-right: 1rem; margin-left: 1rem; }
  .loading-audit > :last-child { margin-bottom: 1rem; }
</style>

<details class="loading-audit" markdown="1">
<summary>Items whose 90% loading intervals include zero (14)</summary>

**Typos**

- For the item with ID prefix `d889972c`, the corrupted `vectorfiel-based` is keyed as `vector field-based`, but some models correct it to `vector-field-based`, which seems like a valid alternative. Of the 77 model answers I could check, 51 were marked wrong; 3 of those otherwise match the key exactly and differ only in hyphenation. Since the prompt asks models to preserve stylistic choices, I'd call this ambiguous rather than a definite scoring error.
- For the item with ID prefix `2b05709f`, `anbdhten` is keyed as `and the`, matching the original abstract. But `and then` is also a plausible correction in context. Of the 77 model answers I could check, 62 were marked wrong; 28 of those otherwise match the key exactly and differ only in using `and then`.
- For `c705c2cb`, I found no key or scoring problem among the 77 archived answers I could check.
- For the other eight Typos items, the public data provides neither prompts and keys nor archived answers, so I could not audit them.

**Paraphrase**

- The sole Paraphrase item has a coherent prompt and key, but no archived answers, so I cannot determine whether any scores were wrong.

**Story Generation**

- For both the items, the archived scores agree with the prompt.

</details>

The task-factor correlations look like this:

<figure>
  <a href="/assets/images/livebench-factor-analysis/correlated_tasks_factor_correlations.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/correlated_tasks_factor_correlations.png" alt="Posterior correlations among the seven task factors; each cell shows the median correlation and its 90% interval on a vivid red-to-green scale." loading="lazy"></a>
</figure>

There's a clear positive manifold, and parallel analysis of the *task-factor correlation matrix* supports a single factor. This would imply a hierarchical model in which a higher-order factor explains the correlation among tasks. However, since LiveBench groups tasks into categories, we might instead add Coding, Language, and Instruction Following domain factors. Those domains could correlate freely or load on an even higher-order factor.

<figure>
  <a href="/assets/images/livebench-factor-analysis/higher_order_model_structures.svg" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/higher_order_model_structures.svg" alt="Three proposed factor structures: one general factor above all seven tasks; three freely correlated domain factors above their respective tasks; and one grand factor above the three domains, which in turn explain their respective tasks." loading="lazy"></a>
</figure>

Unfortunately, each of these models fits worse than the correlated-task model (see the [initial comparison](#initial-model-comparison)).

The domain estimates help explain why. In the correlated-domains model, the domain correlations are quite high:

<figure>
  <a href="/assets/images/livebench-factor-analysis/domain_correlations.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/domain_correlations.png" alt="Posterior correlations among the Coding, Language, and Instruction Following domains, with medians and 90% intervals." loading="lazy"></a>
</figure>

Even so, they can't account for some of the task-factor correlations, as we'll see below. In the grand-factor model, all three domain loadings are *very* close to 1; the lowest loading is *0.9993*. That leaves little domain-specific variance, so modeling the categories doesn't seem to add much.

That brings us back to the hierarchical model. It also fits worse than the correlated-task model, but I find it more plausible a priori. The positive manifold is what I'd expect from LLMs, and parallel analysis of the task-factor correlations supports one common factor. Its poorer fit suggests that the general factor alone misses some relationships between tasks. We can allow for those relationships by adding correlated residuals, so that selected task factors can correlate more than the general factor predicts.

To see which links might be worth including, I fit an exploratory hierarchical model with positive-only shrinkage priors on all 21 task-residual correlations:

<figure>
  <a href="/assets/images/livebench-factor-analysis/exploratory_residual_correlation_matrix.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/exploratory_residual_correlation_matrix.png" alt="Positive-only shrinkage fit: residual correlations among all seven task factors, with posterior medians and 90% intervals." loading="lazy"></a>
</figure>

The largest estimated residual correlations are Plot Unscrambling–Typos (+.52), LCB Generation–Coding Completion (+.29), and Connections–Story Generation (+.27). But Coding Completion's loading on the general factor is almost one in this exploratory fit, leaving virtually no task-specific variance. Its +.29 residual correlation therefore adds only about +.002 to the implied correlation between the two tasks. I'll include Plot–Typos and Connections–Story, but not LCB–Coding. Because the exploratory prior rules out negative residual correlations, an interval above zero is not, by itself, a reason to include a link.

In the final hierarchical model, only those two residual correlations are estimated, with priors that allow either sign. All other residual correlations are fixed at zero. The posterior estimates are:

| Task pair | Median residual correlation | 90% interval |
|---|---:|---:|
| Plot Unscrambling–Typos | +.57 | [+.52, +.61] |
| Connections–Story Generation | +.35 | [+.19, +.48] |

<figure>
  <a href="/assets/images/livebench-factor-analysis/hierarchical_selected_residuals.svg" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/hierarchical_selected_residuals.svg" alt="One general factor loads on seven task factors; dashed arcs show the only two additional task-residual correlations, Connections–Story Generation and Plot Unscrambling–Typos." loading="lazy"></a>
</figure>

Comparing the new model with the previous ones:

<figure>
  <a href="/assets/images/livebench-factor-analysis/waic_elpd_vs_correlated_tasks.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/waic_elpd_vs_correlated_tasks.png" alt="WAIC expected log predictive density differences from correlated task factors, including the hierarchy with Plot–Typos and Connections–Story residual links; bars show one paired pointwise standard error." loading="lazy"></a>
</figure>

The two residual correlations improve the hierarchical model's fit.

The loadings of the seven tasks on the general factor in this fit are:

| Task factor | Median loading | 90% interval |
|---|---:|---:|
| LCB Generation | .91 | [.90, .92] |
| Coding Completion | 1.00[^coding-loading-rounding] | [1.00, 1.00] |
| Connections | .82 | [.80, .83] |
| Plot Unscrambling | .70 | [.69, .71] |
| Typos | .79 | [.77, .81] |
| Paraphrase | .77 | [.74, .80] |
| Story Generation | .86 | [.82, .89] |

We can also ask how much of each task's total-score variance is attributable to the general factor, its task-specific factor, or item-specific variation. This decomposition is for an equal-weighted sum of *underlying* item responses, not the observed mixed-format LiveBench score:

<figure>
  <a href="/assets/images/livebench-factor-analysis/task_variance_decomposition.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/task_variance_decomposition.png" alt="Stacked bars for each task showing the posterior mean percentages of latent total-score variance attributable to the general factor, task-specific factor, and item-specific variation." loading="lazy"></a>
</figure>

### Correlations with the ECI

This compares Epoch's ECI with posterior-mean factor scores from the selected hierarchical fit.[^eci-one-version-match] The general factor correlates strongly with ECI. The task factors do too, though much of that correlation appears to come from their shared general component. Once that component is removed, only the Plot Unscrambling and Paraphrase residuals have 90% intervals entirely above zero.

<figure>
  <a href="/assets/images/livebench-factor-analysis/eci_task_factor_correlations.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/eci_task_factor_correlations.png" alt="Pearson correlations with ECI for the general factor and, for each of seven tasks, the full task factor and its task-specific residual, with 90% bootstrap intervals and matched-model counts." loading="lazy"></a>
</figure>

<p class="display-note">Blue: full task factor · Orange: task residual after removing the general factor · General factor at left. Bars show 90% bootstrap intervals; counts include direct task responses only.</p>

## Takeaways

Once again, benchmark item flags proved useful for finding problems. The task factors display a positive manifold, as expected. What's more notable is the lack of clear domain factors beyond the general factor. Human cognitive ability is well modeled by g, but not perfectly: someone may be better at spatial tasks, and someone else better at verbal tasks, than their levels of g would predict. They could have the same g, yet if you needed to navigate an unfamiliar city or write an essay, you might have a clear choice between them.

That distinction is much less apparent for the AI models and tasks tested here. LiveBench divides its tasks into categories, but I find little evidence that these categories capture distinct abilities. It doesn't seem especially useful to say "use Model A for Coding and Model B for Language" when performance across those domains is so closely tied to general performance. Individual tasks can still differ: Plot Unscrambling and Typos, for example, are more closely related than the general factor alone predicts. But LCB Generation and Coding Completion do not show much extra association, despite both involving coding. The distinctions worth paying attention to seem to lie with particular tasks, not the broad category labels.

## Appendix

### Classical Parallel Analysis

<div style="text-align: center;">
    <figure>
        <img src="/assets/images/livebench-factor-analysis/classical_mixed_correlation_parallel_analysis.png" width="1000">
    </figure>
</div>

### Flagged-item audit

Looking at the flagged items, along with items that have constant scores across models:

**Typos**

- For the item with ID prefix `832610e9`, the scoring key says "algebraical" should be changed to "algebraic". However, "algebraical" is a valid word listed in the [Oxford English Dictionary](https://www.oed.com/dictionary/algebraical_adj?tl=true). Of the 77 archived model answers I can check, 45 were scored wrong, and 19 of those retained "algebraical". Among these models, crediting those otherwise-valid answers raises the item–Typos correlation from +.07 to +.52.
- For the item with ID prefix `0becbf34`, "behavour" can be corrected to either the US "behavior" or the UK "behaviour", but only the US spelling was accepted. Of the 77 archived answers I can check, 74 were scored wrong, and 3 of those used the UK spelling. Among these models, crediting those answers raises the item–Typos correlation from +.19 to +.35.
- The other six Typos items I was able to check showed no issues.
- I can't audit 12 flagged Typos items. The public release has their scores but neither their prompts and keys nor archived answers.

**LCB Generation**

- The "[Wrong Answer](https://atcoder.jp/contests/abc343/tasks/abc343_a?lang=en)" item is simple: given $A$ and $B$, the program should print any digit from 0 to 9 except $A+B$. For the input `2 5`, both `0` and `2` are valid, but the stored test expects one specific output, such as `2`. A valid program that prints `0` therefore fails. Despite the item's simplicity, all 159 judged models received zero. Among the 76 with archived answers, 34 have at least one well-formatted program that prints a digit other than the sum. The current item–task correlation is undefined; crediting these 34 apparently valid archived programs results in a correlation of +.56.
- "[Takahashi Quest](https://atcoder.jp/contests/abc333/tasks/abc333_e?lang=en)" has another fixed-output grading issue. All 178 judged models scored zero, making the current item–task correlation undefined. Among models with archived answers, crediting the 34 apparently valid programs results in a correlation of  +.24.
- "[Bad Juice](https://atcoder.jp/contests/abc337/tasks/abc337_e?lang=en)" is an interactive problem, but it was not evaluated with an interactive judge. A correct program first prints how it will distribute the bottles among the minimum number of friends, reads the judge's reply about which friends became sick, and then prints the spoiled bottle. LiveBench instead supplies one static input string, `3 1\n`, and expects one fixed output transcript. It does not provide a reply tailored to the program's printed groups. All 159 judged models scored zero. Under my provisional re-scoring of the archived answers, the item–task correlation becomes +.31, but I still cannot determine how many programs would pass a real interactive judge.
- The other three LCB Generation items I was able to check showed no issues.

**Coding Completion**

- The two flagged items had correct answer keys and scoring.

**Connections**

- The two flagged items had correct answer keys and scoring.

**Plot Unscrambling** (No flagged items)

**Paraphrase**

- The three flagged items had correct answer keys and scoring.

**Story Generation**

- For the items with ID prefixes `0d828b10` and `6c5eb0ac`, the prompt is somewhat contradictory. Models were given a news story and told to "Please generate a story based on the sentences provided. Answer with one of the following options: ('My answer is yes.', 'My answer is no.', 'My answer is maybe.')". A typical prompt instead adds instructions such as "Entire output should be wrapped in JSON format. You can use markdown ticks such as \`\`\`.", which modify the story's format or content. Nonetheless, 91/97 models received full credit for `0d828b10`, and 93/97 received full credit for `6c5eb0ac`. This concerns me: among 77 archived answers per item, 34 and 31, respectively, consisted solely of a permitted phrase. Many models passed the mechanical check, but their scores did not reflect the story-writing request.
- For the item with ID prefix `230fffb5`, models were instructed to generate a story with fewer than 241 words and a `P.P.S` postscript at the end. The checker counted `\w+` tokens, which can split hyphenated expressions and `P.P.S` into multiple "words" even when whitespace-based counting would count each as one. Of the 77 models with archived answers, 32 did not receive full credit, and 11 of those were affected by this word-count issue. The postscript check had a separate problem: three models put `P.P.S` at the *beginning* of their answers but still received credit for that instruction; two received full item credit. Among models with archived answers, counting words by whitespace and requiring `P.P.S` at the end raises the item–task correlation from +.08 to +.29.
- The other flagged item had no scoring issue.

I can inspect archived answers for only a subset of items and models, so I cannot determine the full scope of these problems. Nonetheless, I've tried my best doing what I can do.

### Initial Model Comparison

<figure>
  <a href="/assets/images/livebench-factor-analysis/waic_elpd_vs_correlated_tasks_without_residual_links.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/waic_elpd_vs_correlated_tasks_without_residual_links.png" alt="WAIC expected log predictive density differences from the correlated-task reference for the single higher-order factor, correlated domains, and grand-factor-over-domains models, with bars showing one paired standard error." loading="lazy"></a>
</figure>

### Loadings vs Difficulties

These plots place each item's task-factor loading against its estimated difficulty in the selected hierarchical fit.

<p class="display-note">Choose a task, then select its plot for full size and 90% intervals. Difficulty uses a task-specific response scale, so compare horizontal positions only within a task.</p>

<style>
  .item-difficulty-viewer { margin: 0.75rem 0 1.25rem; }
  .item-difficulty-viewer input[type="radio"] {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
  .item-difficulty-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.65rem;
  }
  .item-difficulty-options label {
    padding: 0.3rem 0.65rem;
    border: 1px solid #d0d7de;
    border-radius: 1rem;
    cursor: pointer;
    font-size: 0.85em;
    line-height: 1.2;
  }
  .item-difficulty-viewer input[type="radio"]:focus-visible ~ .item-difficulty-options {
    outline: 2px solid #2563eb;
    outline-offset: 3px;
  }
  #item-difficulty-lcb:checked ~ .item-difficulty-options label[for="item-difficulty-lcb"],
  #item-difficulty-coding:checked ~ .item-difficulty-options label[for="item-difficulty-coding"],
  #item-difficulty-connections:checked ~ .item-difficulty-options label[for="item-difficulty-connections"],
  #item-difficulty-plot:checked ~ .item-difficulty-options label[for="item-difficulty-plot"],
  #item-difficulty-typos:checked ~ .item-difficulty-options label[for="item-difficulty-typos"],
  #item-difficulty-paraphrase:checked ~ .item-difficulty-options label[for="item-difficulty-paraphrase"],
  #item-difficulty-story:checked ~ .item-difficulty-options label[for="item-difficulty-story"] {
    background: #28384d;
    border-color: #28384d;
    color: #fff;
  }
  .item-difficulty-panels figure {
    display: none;
    margin: 0 !important;
    border: 1px solid #d0d7de;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #fff;
  }
  #item-difficulty-lcb:checked ~ .item-difficulty-panels #item-difficulty-panel-lcb,
  #item-difficulty-coding:checked ~ .item-difficulty-panels #item-difficulty-panel-coding,
  #item-difficulty-connections:checked ~ .item-difficulty-panels #item-difficulty-panel-connections,
  #item-difficulty-plot:checked ~ .item-difficulty-panels #item-difficulty-panel-plot,
  #item-difficulty-typos:checked ~ .item-difficulty-panels #item-difficulty-panel-typos,
  #item-difficulty-paraphrase:checked ~ .item-difficulty-panels #item-difficulty-panel-paraphrase,
  #item-difficulty-story:checked ~ .item-difficulty-panels #item-difficulty-panel-story {
    display: block;
  }
  .item-difficulty-panels a { display: block; }
  .item-difficulty-panels img { display: block; width: 100%; max-height: 26rem; object-fit: contain; }
</style>

<div class="item-difficulty-viewer" role="group" aria-label="Item loadings versus difficulty by task">
  <input type="radio" name="item-difficulty-task" id="item-difficulty-lcb" checked>
  <input type="radio" name="item-difficulty-task" id="item-difficulty-coding">
  <input type="radio" name="item-difficulty-task" id="item-difficulty-connections">
  <input type="radio" name="item-difficulty-task" id="item-difficulty-plot">
  <input type="radio" name="item-difficulty-task" id="item-difficulty-typos">
  <input type="radio" name="item-difficulty-task" id="item-difficulty-paraphrase">
  <input type="radio" name="item-difficulty-task" id="item-difficulty-story">
  <div class="item-difficulty-options">
    <label for="item-difficulty-lcb">LCB Generation</label>
    <label for="item-difficulty-coding">Coding Completion</label>
    <label for="item-difficulty-connections">Connections</label>
    <label for="item-difficulty-plot">Plot Unscrambling</label>
    <label for="item-difficulty-typos">Typos</label>
    <label for="item-difficulty-paraphrase">Paraphrase</label>
    <label for="item-difficulty-story">Story Generation</label>
  </div>
  <div class="item-difficulty-panels">
    <figure id="item-difficulty-panel-lcb"><a href="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/LCB_generation.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/LCB_generation.png" alt="LCB Generation item loadings versus difficulty" loading="lazy"></a></figure>
    <figure id="item-difficulty-panel-coding"><a href="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/coding_completion.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/coding_completion.png" alt="Coding Completion item loadings versus difficulty" loading="lazy"></a></figure>
    <figure id="item-difficulty-panel-connections"><a href="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/connections.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/connections.png" alt="Connections item loadings versus difficulty" loading="lazy"></a></figure>
    <figure id="item-difficulty-panel-plot"><a href="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/plot_unscrambling.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/plot_unscrambling.png" alt="Plot Unscrambling item loadings versus difficulty" loading="lazy"></a></figure>
    <figure id="item-difficulty-panel-typos"><a href="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/typos.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/typos.png" alt="Typos item loadings versus difficulty" loading="lazy"></a></figure>
    <figure id="item-difficulty-panel-paraphrase"><a href="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/paraphrase.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/paraphrase.png" alt="Paraphrase item loadings versus difficulty" loading="lazy"></a></figure>
    <figure id="item-difficulty-panel-story"><a href="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/story_generation.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/item-loadings-by-difficulty/story_generation.png" alt="Story Generation item loadings versus difficulty" loading="lazy"></a></figure>
  </div>
</div>

### Task Information Curves

The seven task-factor information curves are overlaid on the same axes, so their heights are directly comparable.

<p class="display-note">Select a task or its curve to highlight it. Hover, focus, or tap a model marker for its name, median task score, 90% interval, and information at that score. The full-size plots also show individual item curves.</p>

<style>
  .task-information-interactive {
    margin: 0.8rem 0 0.65rem;
    border: 1px solid #d0d7de;
    border-radius: 0.55rem;
    background: #fff;
    overflow: hidden;
  }
  .task-information-viewport { overflow-x: auto; }
  .task-information-viewport > a { display: block; }
  .task-information-viewport img { display: block; width: 100%; height: auto; }
  .task-information-svg { display: block; min-width: 730px; width: 100%; height: auto; }
  .task-information-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0.7rem;
    border-bottom: 1px solid #d0d7de;
    background: #f6f8fa;
  }
  .task-information-task-button {
    border: 1px solid #cbd5e1;
    border-left: 4px solid var(--task-color);
    border-radius: 0.35rem;
    background: #fff;
    color: #334155;
    cursor: pointer;
    font: inherit;
    font-size: 0.82em;
    line-height: 1.25;
    padding: 0.34rem 0.5rem;
  }
  .task-information-task-button:hover,
  .task-information-task-button:focus-visible { border-color: var(--task-color); }
  .task-information-task-button[aria-pressed="true"] {
    border-color: var(--task-color);
    background: #eff6ff;
    color: #172554;
    font-weight: 700;
    box-shadow: inset 0 0 0 1px var(--task-color);
  }
  .task-information-grid { stroke: #e9edf3; stroke-width: 1; }
  .task-information-grid-zero { stroke: #cbd5e1; stroke-width: 1; }
  .task-information-fill { opacity: 0.08; }
  .task-information-curve { fill: none; stroke-width: 2; opacity: 0.38; }
  .task-information-curve.is-active { stroke-width: 4; opacity: 1; }
  .task-information-curve-hit { fill: none; stroke: transparent; stroke-width: 13; cursor: pointer; }
  .task-information-curve-hit:focus-visible { stroke: #1e293b; stroke-width: 1; stroke-dasharray: 3 3; }
  .task-information-axis-label, .task-information-axis-title { fill: #475569; font-size: 12px; }
  .task-information-strip-label { fill: #475569; font-size: 12px; font-weight: 600; }
  .task-information-strip-baseline { stroke: #cbd5e1; stroke-width: 1; }
  .task-information-interval { stroke: #1e3a8a; stroke-width: 2.5; opacity: 0.42; }
  .task-information-tick { stroke: #1e3a8a; stroke-width: 2.5; }
  .task-information-marker { cursor: pointer; }
  .task-information-hitbox { fill: transparent; stroke: transparent; stroke-width: 2; }
  .task-information-marker:hover .task-information-tick,
  .task-information-marker:focus .task-information-tick,
  .task-information-marker.is-selected .task-information-tick { stroke: #d97706; stroke-width: 4; }
  .task-information-marker:focus-visible .task-information-hitbox { stroke: #d97706; }
  .task-information-selected-guide { stroke: #d97706; stroke-width: 1.6; stroke-dasharray: 3 3; }
  .task-information-selected-point { fill: #d97706; stroke: #fff; stroke-width: 1.5; }
  .task-information-detail {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.2rem 0.6rem;
    min-height: 2.8rem;
    padding: 0.55rem 0.8rem;
    border-top: 1px solid #d0d7de;
    background: #f6f8fa;
    color: #24292f;
    font-size: 0.88em;
    line-height: 1.4;
  }
  .task-information-detail strong { color: #1d4ed8; }
  .task-information-model-id { color: #64748b; font-size: 0.82em; }
  .task-information-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem 0.9rem;
    margin: 0 0 1.5rem;
    font-size: 0.9em;
  }
  .task-information-links a { text-decoration: underline; text-underline-offset: 2px; }
</style>

<div class="task-information-interactive" data-livebench-task-information data-src="/assets/jsons/livebench_task_information.json">
  <div class="task-information-viewport"><a href="/assets/images/livebench-factor-analysis/task-information-curves/overview.png" target="_blank" rel="noopener"><img src="/assets/images/livebench-factor-analysis/task-information-curves/overview.png" alt="Seven overlaid task-factor information curves on shared score and information axes" loading="lazy"></a></div>
  <div class="task-information-detail" aria-live="polite">Loading interactive model markers…</div>
</div>
<script src="/assets/js/livebench-task-information.js" defer></script>
<nav class="task-information-links" aria-label="Full-size task information plots">
  <a href="/assets/images/livebench-factor-analysis/task-information-curves/LCB_generation.png" target="_blank" rel="noopener">LCB Generation</a>
  <a href="/assets/images/livebench-factor-analysis/task-information-curves/coding_completion.png" target="_blank" rel="noopener">Coding Completion</a>
  <a href="/assets/images/livebench-factor-analysis/task-information-curves/connections.png" target="_blank" rel="noopener">Connections</a>
  <a href="/assets/images/livebench-factor-analysis/task-information-curves/plot_unscrambling.png" target="_blank" rel="noopener">Plot Unscrambling</a>
  <a href="/assets/images/livebench-factor-analysis/task-information-curves/typos.png" target="_blank" rel="noopener">Typos</a>
  <a href="/assets/images/livebench-factor-analysis/task-information-curves/paraphrase.png" target="_blank" rel="noopener">Paraphrase</a>
  <a href="/assets/images/livebench-factor-analysis/task-information-curves/story_generation.png" target="_blank" rel="noopener">Story Generation</a>
</nav>

[^coding-loading-rounding]: All values in the task-loading table are rounded to two decimal places. Coding Completion's displayed 1.00 values are slightly below 1 before rounding.

[^eci-one-version-match]: For this figure, I include ECI models with exactly one distinct model version in their benchmark records and ECI scores dated no later than April 7, 2025. I match version names to LiveBench after ignoring case and punctuation, but not version numbers or words. If several LiveBench runs match the same ECI model, I use the one with the most item responses. This leaves 38 ECI models before task-specific response requirements.
