---
layout: post
title: "A Revealed-Preference Ranking of U.S. States"
date: 2026-10-06
permalink: /state-rankings/
categories:
---

<link rel="stylesheet" href="{{ '/assets/css/state-rankings.css' | relative_url }}?v=22">

<div class="sr-app" data-state-rankings
     data-baseline="{{ '/assets/data/state-rankings/baseline.json' | relative_url }}"
     data-geometry="{{ '/assets/data/state-rankings/state-geometry.json' | relative_url }}?v=3"
     data-effects="{{ '/assets/data/state-rankings/effects.json' | relative_url }}?v=2"
     data-worker="{{ '/assets/js/state-rankings-worker.js' | relative_url }}?v=2">
  <p class="sr-intro">Which state is the best to live in? All the other rankings will give you answers based on arbitrarily weighting various factors. I don’t do that. I base these rankings on migration data, that is, revealed preferences. As such, these rankings tell you which states people <em>actually</em> like, based on how they vote with their feet, rather than which states I <em>think</em> people will like.</p>

  <noscript><p class="sr-notice">The maps and subgroup controls require JavaScript.</p></noscript>

  <form class="sr-controls" data-role="controls" aria-label="Choose a population">
    <div class="sr-controls-heading">
      <div>
        <h2>Choose a population</h2>
      </div>
      <button type="reset" class="sr-reset">Reset filters</button>
    </div>
    <div class="sr-control-grid">
      <label>Years
        <select name="year">
          <option value="pooled">2022–2024 combined</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </label>
      <div class="sr-age-control">
        <span>Age range</span>
        <div>
          <label><span class="sr-sr-only">Minimum age</span><input name="ageMin" type="number" min="1" max="99" value="18" inputmode="numeric"></label>
          <span aria-hidden="true">to</span>
          <label><span class="sr-sr-only">Maximum age</span><input name="ageMax" type="number" min="1" max="99" value="65" inputmode="numeric"></label>
        </div>
      </div>
      <label>Sex recorded in survey
        <select name="sex">
          <option value="0">All</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
        </select>
      </label>
      <label>Race and ethnicity
        <select name="race">
          <option value="0">All</option>
          <option value="1">Hispanic, any race</option>
          <option value="2">Non-Hispanic White</option>
          <option value="3">Non-Hispanic Black</option>
          <option value="4">Non-Hispanic American Indian / Alaska Native</option>
          <option value="5">Non-Hispanic Asian / Pacific Islander</option>
          <option value="6">Non-Hispanic other / multiple races</option>
        </select>
      </label>
      <label>Education, ages 25+
        <select name="education">
          <option value="0">All education levels</option>
          <option value="1">Less than high school</option>
          <option value="2">High school</option>
          <option value="3">Some college / associate degree</option>
          <option value="4">Bachelor's degree or higher</option>
        </select>
      </label>
      <label>Nativity
        <select name="nativity">
          <option value="-1">All</option>
          <option value="0">U.S.-born</option>
          <option value="1">Foreign-born</option>
        </select>
      </label>
    </div>
    <p class="sr-filter-note">Education selections include only adults aged 25 or older. Children’s moves generally reflect household choices.</p>
  </form>

  <p class="sr-status" data-role="status" aria-live="polite">Loading migration data…</p>

  <section class="sr-card sr-main-card" aria-labelledby="sr-desirability-title">
    <div class="sr-card-heading">
      <div>
        <p class="sr-eyebrow">The main result</p>
        <h2 id="sr-desirability-title">Revealed desirability</h2>
        <p>Scores show each state's revealed desirability relative to the average state: 2× means twice as desirable, and 0.5× means half as desirable.</p>
      </div>
      <div class="sr-sample" data-role="sample-count"></div>
    </div>
    <div class="sr-main-grid">
      <div class="sr-main-map">
        <div class="sr-map-wrap">
          <svg class="sr-map sr-desirability-map" data-role="desirability-map" viewBox="0 0 920 520" role="img" aria-label="Map of state revealed desirability"></svg>
          <div class="sr-tooltip" data-role="tooltip" hidden></div>
        </div>
        <div class="sr-legend" data-role="legend"></div>
        <div class="sr-highlights" data-role="highlights" aria-live="polite" hidden></div>
      </div>
      <aside class="sr-ranking" aria-labelledby="sr-ranking-title">
        <h3 id="sr-ranking-title">All state scores</h3>
        <p>Click a state to connect the ranking to both maps.</p>
        <div class="sr-ranking-list" data-role="ranking"></div>
      </aside>
    </div>
  </section>

  <section class="sr-card" aria-labelledby="sr-affinity-title">
    <div class="sr-card-heading">
      <div>
        <p class="sr-eyebrow">The companion view</p>
        <h2 id="sr-affinity-title">Migration affinity</h2>
        <p>Pair affinity measures how strongly two states exchange movers after accounting for origin population and destination desirability.</p>
      </div>
      <label class="sr-focus-control">Focus on a state
        <select data-role="focus-state"><option value="">Strongest pairs overall</option></select>
      </label>
    </div>
    <div class="sr-main-grid sr-affinity-grid">
      <div class="sr-main-map">
        <div class="sr-map-wrap">
          <svg class="sr-map sr-affinity-map" data-role="affinity-map" viewBox="0 0 920 520" role="img" aria-label="Map of state-to-state migration affinity"></svg>
          <div class="sr-tooltip" data-role="network-tooltip" hidden></div>
        </div>
        <div class="sr-affinity-legend" data-role="affinity-legend" hidden></div>
      </div>
      <aside class="sr-ranking sr-affinity-ranking" aria-labelledby="sr-affinity-ranking-title">
        <h3 id="sr-affinity-ranking-title" data-role="affinity-ranking-title">Strongest pairs</h3>
        <p data-role="affinity-ranking-note">Top 50 estimated pairs</p>
        <ol class="sr-ranking-list sr-affinity-list" data-role="connections" aria-label="Migration affinity ranking"></ol>
      </aside>
    </div>
  </section>

</div>

<details class="sr-methodology" markdown="1">
<summary><h2>How these rankings work</h2></summary>

There are lots of rankings of the best states, cities, and countries to live in. Unfortunately, they’re all trash. They’re *indices*: someone picks a bunch of low-level statistics (e.g., life expectancy, carbon emissions, child dental visits, foreign-born population, museums per capita, patent creation rate) and combines them into a score. Both the statistics and their weights are chosen arbitrarily. Why does education count for 15.79% and the economy for 12.88% in the [U.S. News Best States ranking](https://www.usnews.com/news/best-states/articles/methodology)? Why do GDP size, GDP growth, and GDP per person all feed into the same Economics score in [Oxford Economics’ Global Cities Index](https://www.oxfordeconomics.com/global-cities-index-about-the-index/)? Do I even care about university quality, or trust how it’s measured? Face it: location rankings, at least the way they’re currently implemented, are all terrible.

So, we turn to a concept from economics that has never failed us before: *revealed preferences*. Instead of deciding how much each statistic should matter, why not look at where people actually move? Someone moving from location A to location B is evidence that, between A and B, they prefer B, whatever their reasons may be. We don’t need an explicit weight for crime rates or the economy. If crime rates matter, people will move toward low-crime areas. If the economy matters, people will move toward places with good economies. If the weather matters, people will move toward places with good weather. We don’t need to explicitly weight them, or even define them. We can just look at where people move, and places where people end up migrating to are, by definition, good places to live.

Raw migration counts are misleading, though. If A has ten times B’s population, equal *per-person* moving rates in both directions produce ten times as many moves from A to B as from B to A. We need to account for the number of people who could move from each origin. We also need to allow some pairs of states to exchange unusually many movers regardless of which one is more attractive.

For our selected period (2022–2024), I use this Poisson working model for survey-weighted flows from the [American Community Survey](https://usa.ipums.org/usa/):

$$
F_{ij}\sim\operatorname{Poisson}(N_i A_{ij}S_j),
\qquad A_{ij}=A_{ji},
\qquad \sum_j\log S_j=0.
$$

Here, $F_{ij}$ is the estimated flow from prior state $i$ to current state $j$. $N_i$ is the estimated population in the origin state, so a larger state has more potential movers. $A_{ij}$ captures how strongly states $i$ and $j$ are connected, regardless of direction. $S_j$ captures state $j$’s pull as a destination, which we use as a measure of the state's overall desirability. The final constraint sets the geometric mean of the $S$ values to 1, giving them a common reference point.

I estimate two things with this model:

1. **Revealed desirability:** Compare the two directions of migration within each state pair, adjusting for origin population. Conditioning on a pair’s total two-way flow makes the shared affinity values ($A_{ij}$ and $A_{ji}$) cancel out, leaving information about the relative $S$ values.
2. **Migration affinity:** Given those $S$ estimates, use each pair’s total two-way flow to estimate its symmetric $A_{ij}$.

It is also possible to view the results for a filtered population, for example, people with college degrees aged 25–30. For a subgroup $g$, I extend the model to

$$
F_{ijg}\sim\operatorname{Poisson}(N_{ig}M_gA_{ij}R_{ijg}S_{jg}).
$$

$N_{ig}$ is the subgroup population in origin $i$, and $S_{jg}$ is destination $j$’s pull for that group. $M_g$ accounts for the group moving interstate more or less often *overall*. $R_{ijg}=R_{jig}$ allows a particular state pair to be more or less connected for that group than it is in the all-person network. I center the $R$ values around 1 and shrink them strongly toward 1; sparse subgroup desirability scores receive gentler shrinkage toward the all-person scores.

Each demographic effect is fitted separately. When you combine filters, the effects are added on the log scale, so the result is an approximation for that combination rather than a direct fit to everyone in the intersection. Maybe when this site is no longer static and I don’t have to worry about combinatorial explosion, you’ll be able to get the exact fits.

The selected-state inflow/outflow ratio divides weighted arrivals by weighted departures. Unlike $S$, it does not adjust for population size or pair affinity. Filtered ratios are stabilized toward the all-person ratio; combined filters approximate the intersection by adding marginal effects.

</details>

<script src="{{ '/assets/js/state-rankings.js' | relative_url }}?v=15" defer></script>
